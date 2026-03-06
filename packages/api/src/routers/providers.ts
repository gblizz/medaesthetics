import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, practiceProcedure, ownerProcedure } from "../trpc";

export const providersRouter = createTRPCRouter({
  list: practiceProcedure.query(async ({ ctx }) => {
    return ctx.db.provider.findMany({
      where: { practiceId: ctx.practiceId!, isActive: true },
      orderBy: { lastName: "asc" },
      include: { availability: true },
    });
  }),

  getById: practiceProcedure
    .input(z.object({ providerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const provider = await ctx.db.provider.findFirst({
        where: { id: input.providerId, practiceId: ctx.practiceId! },
        include: {
          availability: true,
          credentials: true,
        },
      });
      if (!provider) throw new TRPCError({ code: "NOT_FOUND" });
      return provider;
    }),

  // Invite is handled by Clerk — this creates the DB record after Clerk webhook
  create: ownerProcedure
    .input(
      z.object({
        clerkUserId: z.string(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        role: z.enum(["PRACTICE_OWNER", "PROVIDER", "FRONT_DESK"]),
        title: z.string().optional(),
        npiNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.provider.create({
        data: { ...input, practiceId: ctx.practiceId! },
      });
    }),

  setAvailability: practiceProcedure
    .input(
      z.object({
        providerId: z.string(),
        availability: z.array(
          z.object({
            dayOfWeek: z.number().int().min(0).max(6),
            startTime: z.string().regex(/^\d{2}:\d{2}$/),
            endTime: z.string().regex(/^\d{2}:\d{2}$/),
            isActive: z.boolean().default(true),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const provider = await ctx.db.provider.findFirst({
        where: { id: input.providerId, practiceId: ctx.practiceId! },
      });
      if (!provider) throw new TRPCError({ code: "NOT_FOUND" });

      // Replace all availability
      await ctx.db.providerAvailability.deleteMany({
        where: { providerId: input.providerId },
      });
      await ctx.db.providerAvailability.createMany({
        data: input.availability.map((a) => ({
          ...a,
          providerId: input.providerId,
        })),
      });

      return ctx.db.providerAvailability.findMany({
        where: { providerId: input.providerId },
      });
    }),

  addCredential: ownerProcedure
    .input(
      z.object({
        providerId: z.string(),
        type: z.string().min(1),
        number: z.string().optional(),
        state: z.string().optional(),
        issuedAt: z.date().optional(),
        expiresAt: z.date().optional(),
        fileUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { providerId, ...data } = input;
      return ctx.db.providerCredential.create({
        data: { ...data, providerId, practiceId: ctx.practiceId! },
      });
    }),

  getExpiringCredentials: practiceProcedure
    .input(z.object({ withinDays: z.number().default(60) }))
    .query(async ({ ctx, input }) => {
      const threshold = new Date(
        Date.now() + input.withinDays * 24 * 60 * 60 * 1000
      );
      return ctx.db.providerCredential.findMany({
        where: {
          practiceId: ctx.practiceId!,
          expiresAt: { lte: threshold, gte: new Date() },
        },
        include: {
          provider: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { expiresAt: "asc" },
      });
    }),
});
