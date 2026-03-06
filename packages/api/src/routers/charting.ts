import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, clinicalProcedure } from "../trpc";
import { AUDIT_ACTIONS } from "@repo/config/constants";

export const chartingRouter = createTRPCRouter({
  getRecord: clinicalProcedure
    .input(z.object({ appointmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const appointment = await ctx.db.appointment.findFirst({
        where: { id: input.appointmentId, practiceId: ctx.practiceId! },
      });
      if (!appointment) throw new TRPCError({ code: "NOT_FOUND" });

      const record = await ctx.db.treatmentRecord.findUnique({
        where: { appointmentId: input.appointmentId },
        include: {
          photos: true,
        },
      });

      if (record) {
        await ctx.db.auditLog.create({
          data: {
            practiceId: ctx.practiceId!,
            actorId: ctx.clerkUserId!,
            actorRole: ctx.role ?? undefined,
            action: AUDIT_ACTIONS.READ_TREATMENT_RECORD,
            resourceType: "TreatmentRecord",
            resourceId: record.id,
            ipAddress: ctx.ipAddress,
            userAgent: ctx.userAgent,
          },
        });
      }

      return record;
    }),

  upsertRecord: clinicalProcedure
    .input(
      z.object({
        appointmentId: z.string(),
        subjective: z.string().optional(),
        objective: z.string().optional(),
        assessment: z.string().optional(),
        plan: z.string().optional(),
        injectionMap: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const appointment = await ctx.db.appointment.findFirst({
        where: { id: input.appointmentId, practiceId: ctx.practiceId! },
      });
      if (!appointment) throw new TRPCError({ code: "NOT_FOUND" });

      const { appointmentId, ...data } = input;
      const existing = await ctx.db.treatmentRecord.findUnique({
        where: { appointmentId },
      });

      let record;
      if (existing) {
        record = await ctx.db.treatmentRecord.update({
          where: { appointmentId },
          data,
        });
        await ctx.db.auditLog.create({
          data: {
            practiceId: ctx.practiceId!,
            actorId: ctx.clerkUserId!,
            actorRole: ctx.role ?? undefined,
            action: AUDIT_ACTIONS.UPDATE_TREATMENT_RECORD,
            resourceType: "TreatmentRecord",
            resourceId: record.id,
            metadata: { updatedFields: Object.keys(data) },
            ipAddress: ctx.ipAddress,
            userAgent: ctx.userAgent,
          },
        });
      } else {
        record = await ctx.db.treatmentRecord.create({
          data: {
            practiceId: ctx.practiceId!,
            appointmentId,
            clientId: appointment.clientId,
            providerId: appointment.providerId,
            ...data,
          },
        });
        await ctx.db.auditLog.create({
          data: {
            practiceId: ctx.practiceId!,
            actorId: ctx.clerkUserId!,
            actorRole: ctx.role ?? undefined,
            action: AUDIT_ACTIONS.CREATE_TREATMENT_RECORD,
            resourceType: "TreatmentRecord",
            resourceId: record.id,
            ipAddress: ctx.ipAddress,
            userAgent: ctx.userAgent,
          },
        });
      }

      return record;
    }),

  signRecord: clinicalProcedure
    .input(
      z.object({
        treatmentRecordId: z.string(),
        providerName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.db.treatmentRecord.findFirst({
        where: {
          id: input.treatmentRecordId,
          practiceId: ctx.practiceId!,
          // Provider can only sign their own records
          ...(ctx.role === "PROVIDER"
            ? { providerId: await getProviderIdFromClerkId(ctx.db, ctx.clerkUserId!) }
            : {}),
        },
      });
      if (!record) throw new TRPCError({ code: "NOT_FOUND" });
      if (record.signedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Record is already signed",
        });
      }

      const signed = await ctx.db.treatmentRecord.update({
        where: { id: input.treatmentRecordId },
        data: {
          signedAt: new Date(),
          signedByName: input.providerName,
        },
      });

      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId!,
          actorId: ctx.clerkUserId!,
          actorRole: ctx.role ?? undefined,
          action: AUDIT_ACTIONS.SIGN_TREATMENT_RECORD,
          resourceType: "TreatmentRecord",
          resourceId: record.id,
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
        },
      });

      return signed;
    }),

  getClientTimeline: clinicalProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const records = await ctx.db.treatmentRecord.findMany({
        where: { practiceId: ctx.practiceId!, clientId: input.clientId },
        include: {
          appointment: {
            include: { service: true },
          },
          photos: {
            select: {
              id: true,
              photoType: true,
              s3Key: true,
              takenAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId!,
          actorId: ctx.clerkUserId!,
          actorRole: ctx.role ?? undefined,
          action: AUDIT_ACTIONS.READ_TREATMENT_RECORD,
          resourceType: "Client",
          resourceId: input.clientId,
          metadata: { action: "timeline_view" },
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
        },
      });

      return records;
    }),
});

async function getProviderIdFromClerkId(db: any, clerkUserId: string) {
  const provider = await db.provider.findUnique({
    where: { clerkUserId },
    select: { id: true },
  });
  return provider?.id ?? "unknown";
}
