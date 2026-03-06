import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, practiceProcedure, ownerProcedure } from "../trpc";
import { AUDIT_ACTIONS } from "@repo/config/constants";

export const billingRouter = createTRPCRouter({
  listInvoices: practiceProcedure
    .input(
      z.object({
        clientId: z.string().optional(),
        status: z
          .enum(["DRAFT", "SENT", "PAID", "PARTIALLY_PAID", "OVERDUE", "CANCELLED"])
          .optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { clientId, status, cursor, limit } = input;
      const invoices = await ctx.db.invoice.findMany({
        where: {
          practiceId: ctx.practiceId!,
          ...(clientId ? { clientId } : {}),
          ...(status ? { status } : {}),
        },
        include: {
          client: { select: { id: true, firstName: true, lastName: true } },
          items: true,
          payments: true,
        },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: string | undefined;
      if (invoices.length > limit) nextCursor = invoices.pop()!.id;
      return { invoices, nextCursor };
    }),

  createInvoice: practiceProcedure
    .input(
      z.object({
        clientId: z.string(),
        items: z.array(
          z.object({
            description: z.string(),
            quantity: z.number().int().min(1),
            unitPrice: z.number().int().min(0),
            appointmentId: z.string().optional(),
          })
        ),
        discountCodeId: z.string().optional(),
        taxAmount: z.number().int().min(0).default(0),
        notes: z.string().optional(),
        dueDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify client belongs to practice
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, practiceId: ctx.practiceId! },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      // Compute totals
      const subtotal = input.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );

      let discountAmount = 0;
      if (input.discountCodeId) {
        const code = await ctx.db.discountCode.findFirst({
          where: { id: input.discountCodeId, practiceId: ctx.practiceId!, isActive: true },
        });
        if (code) {
          if (code.discountPercent) {
            discountAmount = Math.floor((subtotal * code.discountPercent) / 100);
          } else if (code.discountAmount) {
            discountAmount = code.discountAmount;
          }
        }
      }

      const total = Math.max(0, subtotal - discountAmount + input.taxAmount);

      // Generate invoice number
      const count = await ctx.db.invoice.count({
        where: { practiceId: ctx.practiceId! },
      });
      const invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`;

      const invoice = await ctx.db.invoice.create({
        data: {
          practiceId: ctx.practiceId!,
          clientId: input.clientId,
          invoiceNumber,
          subtotal,
          discountAmount,
          taxAmount: input.taxAmount,
          total,
          dueDate: input.dueDate,
          notes: input.notes,
          discountCodeId: input.discountCodeId,
          items: {
            create: input.items.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.quantity * item.unitPrice,
              appointmentId: item.appointmentId,
            })),
          },
        },
        include: { items: true },
      });

      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId!,
          actorId: ctx.clerkUserId!,
          actorRole: ctx.role ?? undefined,
          action: AUDIT_ACTIONS.CREATE_INVOICE,
          resourceType: "Invoice",
          resourceId: invoice.id,
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
        },
      });

      return invoice;
    }),

  recordPayment: practiceProcedure
    .input(
      z.object({
        invoiceId: z.string(),
        amount: z.number().int().min(1),
        method: z.enum(["STRIPE_CARD", "CASH", "CHECK", "LOYALTY_POINTS", "PACKAGE_CREDIT"]),
        notes: z.string().optional(),
        stripeChargeId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invoice = await ctx.db.invoice.findFirst({
        where: { id: input.invoiceId, practiceId: ctx.practiceId! },
      });
      if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });

      const payment = await ctx.db.payment.create({
        data: {
          invoiceId: input.invoiceId,
          amount: input.amount,
          method: input.method,
          notes: input.notes,
          stripeChargeId: input.stripeChargeId,
        },
      });

      const newAmountPaid = invoice.amountPaid + input.amount;
      const newStatus =
        newAmountPaid >= invoice.total
          ? "PAID"
          : newAmountPaid > 0
          ? "PARTIALLY_PAID"
          : invoice.status;

      await ctx.db.invoice.update({
        where: { id: input.invoiceId },
        data: { amountPaid: newAmountPaid, status: newStatus },
      });

      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId!,
          actorId: ctx.clerkUserId!,
          actorRole: ctx.role ?? undefined,
          action: AUDIT_ACTIONS.PROCESS_PAYMENT,
          resourceType: "Payment",
          resourceId: payment.id,
          metadata: { invoiceId: input.invoiceId, amount: input.amount },
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
        },
      });

      return payment;
    }),

  getRevenueReport: ownerProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const payments = await ctx.db.payment.findMany({
        where: {
          invoice: { practiceId: ctx.practiceId! },
          paidAt: { gte: input.startDate, lte: input.endDate },
        },
        include: {
          invoice: {
            include: {
              client: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
      });

      const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
      const byMethod = payments.reduce(
        (acc, p) => {
          acc[p.method] = (acc[p.method] ?? 0) + p.amount;
          return acc;
        },
        {} as Record<string, number>
      );

      return { totalRevenue, byMethod, payments };
    }),
});
