import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, clinicalProcedure } from "../trpc";
import { AUDIT_ACTIONS, S3_PRESIGNED_URL_EXPIRY_SECONDS } from "@repo/config/constants";

export const photosRouter = createTRPCRouter({
  // Returns a presigned URL for the client to upload directly to S3
  getUploadUrl: clinicalProcedure
    .input(
      z.object({
        clientId: z.string(),
        treatmentRecordId: z.string().optional(),
        photoType: z.enum(["BEFORE", "AFTER", "PROGRESS", "SIMULATION"]),
        angle: z.enum(["FRONT", "LEFT", "RIGHT", "TOP"]).optional(),
        contentType: z.string().default("image/jpeg"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify client belongs to practice
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, practiceId: ctx.practiceId! },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      const s3Key = `practices/${ctx.practiceId}/clients/${input.clientId}/photos/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const bucketName = process.env.S3_BUCKET_NAME ?? "medaesthetics-photos";

      // Create the DB record first so we have an ID
      const photo = await ctx.db.clientPhoto.create({
        data: {
          practiceId: ctx.practiceId!,
          clientId: input.clientId,
          treatmentRecordId: input.treatmentRecordId,
          s3Key,
          s3Bucket: bucketName,
          photoType: input.photoType,
          angle: input.angle,
        },
      });

      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId!,
          actorId: ctx.clerkUserId!,
          actorRole: ctx.role ?? undefined,
          action: AUDIT_ACTIONS.UPLOAD_PHOTO,
          resourceType: "ClientPhoto",
          resourceId: photo.id,
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
        },
      });

      // In production, generate a presigned URL via AWS SDK
      // Returning the s3Key for now; the web app resolves actual presigned URLs via a separate endpoint
      return {
        photoId: photo.id,
        s3Key,
        // uploadUrl would be generated here with AWS S3 presigned URL
        uploadUrl: `/api/photos/upload?key=${encodeURIComponent(s3Key)}`,
        expiresIn: S3_PRESIGNED_URL_EXPIRY_SECONDS,
      };
    }),

  getViewUrl: clinicalProcedure
    .input(z.object({ photoId: z.string() }))
    .query(async ({ ctx, input }) => {
      const photo = await ctx.db.clientPhoto.findFirst({
        where: { id: input.photoId, practiceId: ctx.practiceId! },
      });
      if (!photo) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId!,
          actorId: ctx.clerkUserId!,
          actorRole: ctx.role ?? undefined,
          action: AUDIT_ACTIONS.READ_PHOTO,
          resourceType: "ClientPhoto",
          resourceId: photo.id,
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
        },
      });

      return {
        photoId: photo.id,
        // In production: generate presigned GET URL from S3
        viewUrl: `/api/photos/view?key=${encodeURIComponent(photo.s3Key)}`,
        photoType: photo.photoType,
        angle: photo.angle,
        takenAt: photo.takenAt,
      };
    }),

  listForClient: clinicalProcedure
    .input(
      z.object({
        clientId: z.string(),
        photoType: z
          .enum(["BEFORE", "AFTER", "PROGRESS", "SIMULATION"])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.clientPhoto.findMany({
        where: {
          clientId: input.clientId,
          practiceId: ctx.practiceId!,
          ...(input.photoType ? { photoType: input.photoType } : {}),
        },
        orderBy: { takenAt: "desc" },
        select: {
          id: true,
          photoType: true,
          angle: true,
          takenAt: true,
          notes: true,
          treatmentRecordId: true,
        },
      });
    }),

  delete: clinicalProcedure
    .input(z.object({ photoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const photo = await ctx.db.clientPhoto.findFirst({
        where: { id: input.photoId, practiceId: ctx.practiceId! },
      });
      if (!photo) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.clientPhoto.delete({ where: { id: input.photoId } });
      // In production: schedule S3 object deletion

      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId!,
          actorId: ctx.clerkUserId!,
          actorRole: ctx.role ?? undefined,
          action: AUDIT_ACTIONS.DELETE_PHOTO,
          resourceType: "ClientPhoto",
          resourceId: input.photoId,
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
        },
      });

      return { success: true };
    }),
});
