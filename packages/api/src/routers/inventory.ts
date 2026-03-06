import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, practiceProcedure, ownerProcedure } from "../trpc";

export const inventoryRouter = createTRPCRouter({
  list: practiceProcedure
    .input(
      z.object({
        search: z.string().optional(),
        lowStockOnly: z.boolean().default(false),
        expiringWithinDays: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      const expiryThreshold = input.expiringWithinDays
        ? new Date(now.getTime() + input.expiringWithinDays * 24 * 60 * 60 * 1000)
        : undefined;

      return ctx.db.inventoryItem.findMany({
        where: {
          practiceId: ctx.practiceId!,
          ...(input.search
            ? { name: { contains: input.search, mode: "insensitive" } }
            : {}),
          ...(expiryThreshold
            ? { expiresAt: { lte: expiryThreshold } }
            : {}),
        },
        orderBy: { name: "asc" },
      });
    }),

  create: ownerProcedure
    .input(
      z.object({
        name: z.string().min(1),
        category: z.string().optional(),
        sku: z.string().optional(),
        unit: z.string().optional(),
        currentStock: z.number().default(0),
        lowStockThreshold: z.number().optional(),
        costPerUnit: z.number().int().optional(),
        expiresAt: z.date().optional(),
        supplier: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.inventoryItem.create({
        data: { ...input, practiceId: ctx.practiceId! },
      });
    }),

  updateStock: practiceProcedure
    .input(
      z.object({
        itemId: z.string(),
        adjustment: z.number(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.inventoryItem.findFirst({
        where: { id: input.itemId, practiceId: ctx.practiceId! },
      });
      if (!item) throw new TRPCError({ code: "NOT_FOUND" });

      const newStock = item.currentStock + input.adjustment;
      if (newStock < 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Stock cannot go below zero",
        });
      }

      return ctx.db.inventoryItem.update({
        where: { id: input.itemId },
        data: { currentStock: newStock },
      });
    }),

  getLowStockAlerts: practiceProcedure.query(async ({ ctx }) => {
    const items = await ctx.db.inventoryItem.findMany({
      where: { practiceId: ctx.practiceId! },
    });
    return items.filter(
      (item) =>
        item.lowStockThreshold !== null &&
        item.currentStock <= item.lowStockThreshold
    );
  }),

  getExpiryAlerts: practiceProcedure
    .input(z.object({ withinDays: z.number().default(30) }))
    .query(async ({ ctx, input }) => {
      const threshold = new Date(
        Date.now() + input.withinDays * 24 * 60 * 60 * 1000
      );
      return ctx.db.inventoryItem.findMany({
        where: {
          practiceId: ctx.practiceId!,
          expiresAt: { lte: threshold, gte: new Date() },
        },
        orderBy: { expiresAt: "asc" },
      });
    }),
});
