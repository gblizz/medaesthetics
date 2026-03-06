import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, practiceProcedure } from "../trpc";
import { AUDIT_ACTIONS } from "@repo/config/constants";

export const clientsRouter = createTRPCRouter({
  list: practiceProcedure
    .input(
      z.object({
        search: z.string().optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, cursor, limit } = input;
      const clients = await ctx.db.client.findMany({
        where: {
          practiceId: ctx.practiceId!,
          isActive: true,
          ...(search
            ? {
                OR: [
                  { firstName: { contains: search, mode: "insensitive" } },
                  { lastName: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                  { phone: { contains: search } },
                ],
              }
            : {}),
        },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          dateOfBirth: true,
          createdAt: true,
        },
      });

      let nextCursor: string | undefined;
      if (clients.length > limit) {
        nextCursor = clients.pop()!.id;
      }

      return { clients, nextCursor };
    }),

  getById: practiceProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, practiceId: ctx.practiceId! },
        include: {
          appointments: {
            orderBy: { startsAt: "desc" },
            take: 10,
            include: { service: true, provider: true },
          },
          loyaltyPoints: {
            orderBy: { createdAt: "desc" },
            take: 20,
          },
          packagePurchases: {
            include: { package: true },
          },
        },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      // HIPAA audit log
      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId!,
          actorId: ctx.clerkUserId!,
          actorRole: ctx.role ?? undefined,
          action: AUDIT_ACTIONS.READ_CLIENT,
          resourceType: "Client",
          resourceId: input.clientId,
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
        },
      });

      return client;
    }),

  create: practiceProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        dateOfBirth: z.date().optional(),
        gender: z.string().optional(),
        addressLine1: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        referralSource: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.client.findUnique({
        where: {
          practiceId_email: { practiceId: ctx.practiceId!, email: input.email },
        },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A client with this email already exists",
        });
      }

      const client = await ctx.db.client.create({
        data: { ...input, practiceId: ctx.practiceId! },
      });

      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId!,
          actorId: ctx.clerkUserId!,
          actorRole: ctx.role ?? undefined,
          action: AUDIT_ACTIONS.CREATE_CLIENT,
          resourceType: "Client",
          resourceId: client.id,
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
        },
      });

      return client;
    }),

  update: practiceProcedure
    .input(
      z.object({
        clientId: z.string(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        dateOfBirth: z.date().optional(),
        gender: z.string().optional(),
        addressLine1: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        referralSource: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { clientId, ...data } = input;
      const existing = await ctx.db.client.findFirst({
        where: { id: clientId, practiceId: ctx.practiceId! },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });

      const updated = await ctx.db.client.update({
        where: { id: clientId },
        data,
      });

      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId!,
          actorId: ctx.clerkUserId!,
          actorRole: ctx.role ?? undefined,
          action: AUDIT_ACTIONS.UPDATE_CLIENT,
          resourceType: "Client",
          resourceId: clientId,
          metadata: { updatedFields: Object.keys(data) },
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
        },
      });

      return updated;
    }),

  getLoyaltyBalance: practiceProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.loyaltyPointLog.aggregate({
        where: {
          clientId: input.clientId,
          practiceId: ctx.practiceId!,
        },
        _sum: { points: true },
      });
      return { balance: result._sum.points ?? 0 };
    }),
});
