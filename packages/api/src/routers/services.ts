import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, practiceProcedure, ownerProcedure } from "../trpc";

export const servicesRouter = createTRPCRouter({
  list: practiceProcedure.query(async ({ ctx }) => {
    return ctx.db.service.findMany({
      where: { practiceId: ctx.practiceId!, isActive: true },
      orderBy: { name: "asc" },
    });
  }),

  create: ownerProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        durationMins: z.number().int().min(5).default(60),
        price: z.number().int().min(0).default(0),
        depositAmount: z.number().int().min(0).optional(),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.service.create({
        data: { ...input, practiceId: ctx.practiceId! },
      });
    }),

  update: ownerProcedure
    .input(
      z.object({
        serviceId: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        durationMins: z.number().int().min(5).optional(),
        price: z.number().int().min(0).optional(),
        depositAmount: z.number().int().min(0).optional().nullable(),
        color: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { serviceId, ...data } = input;
      const service = await ctx.db.service.findFirst({
        where: { id: serviceId, practiceId: ctx.practiceId! },
      });
      if (!service) throw new TRPCError({ code: "NOT_FOUND" });
      return ctx.db.service.update({ where: { id: serviceId }, data });
    }),
});
