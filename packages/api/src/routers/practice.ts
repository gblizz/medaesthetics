import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  ownerProcedure,
  practiceProcedure,
} from "../trpc";

export const practiceRouter = createTRPCRouter({
  get: practiceProcedure.query(async ({ ctx }) => {
    const practice = await ctx.db.practice.findUnique({
      where: { id: ctx.practiceId! },
      include: {
        locations: true,
        loyaltySettings: true,
      },
    });
    if (!practice) throw new TRPCError({ code: "NOT_FOUND" });
    return practice;
  }),

  update: ownerProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        website: z.string().url().optional().or(z.literal("")),
        addressLine1: z.string().optional(),
        addressLine2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        timezone: z.string().optional(),
        primaryColor: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.practice.update({
        where: { id: ctx.practiceId! },
        data: input,
      });
    }),

  getSubscription: practiceProcedure.query(async ({ ctx }) => {
    const practice = await ctx.db.practice.findUnique({
      where: { id: ctx.practiceId! },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        trialEndsAt: true,
        subscriptionEndsAt: true,
        stripeCustomerId: true,
      },
    });
    if (!practice) throw new TRPCError({ code: "NOT_FOUND" });
    return practice;
  }),
});
