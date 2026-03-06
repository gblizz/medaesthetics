import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, practiceProcedure, clinicalProcedure } from "../trpc";

export const appointmentsRouter = createTRPCRouter({
  list: practiceProcedure
    .input(
      z.object({
        providerId: z.string().optional(),
        clientId: z.string().optional(),
        startDate: z.date(),
        endDate: z.date(),
        status: z
          .enum([
            "SCHEDULED",
            "CONFIRMED",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELLED",
            "NO_SHOW",
          ])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.appointment.findMany({
        where: {
          practiceId: ctx.practiceId!,
          ...(input.providerId ? { providerId: input.providerId } : {}),
          ...(input.clientId ? { clientId: input.clientId } : {}),
          ...(input.status ? { status: input.status } : {}),
          startsAt: { gte: input.startDate },
          endsAt: { lte: input.endDate },
        },
        include: {
          client: { select: { id: true, firstName: true, lastName: true, phone: true } },
          provider: { select: { id: true, firstName: true, lastName: true, title: true } },
          service: true,
        },
        orderBy: { startsAt: "asc" },
      });
    }),

  getById: practiceProcedure
    .input(z.object({ appointmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const appt = await ctx.db.appointment.findFirst({
        where: { id: input.appointmentId, practiceId: ctx.practiceId! },
        include: {
          client: true,
          provider: true,
          service: true,
          treatmentRecord: true,
          location: true,
        },
      });
      if (!appt) throw new TRPCError({ code: "NOT_FOUND" });
      return appt;
    }),

  create: practiceProcedure
    .input(
      z.object({
        clientId: z.string(),
        providerId: z.string(),
        serviceId: z.string(),
        locationId: z.string().optional(),
        startsAt: z.date(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Fetch service to compute endsAt
      const service = await ctx.db.service.findFirst({
        where: { id: input.serviceId, practiceId: ctx.practiceId! },
      });
      if (!service) throw new TRPCError({ code: "NOT_FOUND", message: "Service not found" });

      const endsAt = new Date(
        input.startsAt.getTime() + service.durationMins * 60 * 1000
      );

      // Check provider availability (no overlapping appointments)
      const conflict = await ctx.db.appointment.findFirst({
        where: {
          providerId: input.providerId,
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
          OR: [
            { startsAt: { lt: endsAt }, endsAt: { gt: input.startsAt } },
          ],
        },
      });
      if (conflict) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Provider has a conflicting appointment at this time",
        });
      }

      return ctx.db.appointment.create({
        data: {
          practiceId: ctx.practiceId!,
          clientId: input.clientId,
          providerId: input.providerId,
          serviceId: input.serviceId,
          locationId: input.locationId,
          startsAt: input.startsAt,
          endsAt,
          notes: input.notes,
          status: "SCHEDULED",
        },
        include: {
          client: { select: { id: true, firstName: true, lastName: true } },
          provider: { select: { id: true, firstName: true, lastName: true } },
          service: true,
        },
      });
    }),

  updateStatus: practiceProcedure
    .input(
      z.object({
        appointmentId: z.string(),
        status: z.enum([
          "SCHEDULED",
          "CONFIRMED",
          "IN_PROGRESS",
          "COMPLETED",
          "CANCELLED",
          "NO_SHOW",
        ]),
        cancelReason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const appt = await ctx.db.appointment.findFirst({
        where: { id: input.appointmentId, practiceId: ctx.practiceId! },
      });
      if (!appt) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.appointment.update({
        where: { id: input.appointmentId },
        data: {
          status: input.status,
          cancelReason: input.cancelReason,
          ...(input.status === "CONFIRMED" ? { confirmedAt: new Date() } : {}),
        },
      });
    }),

  getProviderAvailability: practiceProcedure
    .input(
      z.object({
        providerId: z.string(),
        date: z.date(),
        serviceDurationMins: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const dayOfWeek = input.date.getDay();
      const availability = await ctx.db.providerAvailability.findMany({
        where: {
          providerId: input.providerId,
          dayOfWeek,
          isActive: true,
        },
      });

      const startOfDay = new Date(input.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(input.date);
      endOfDay.setHours(23, 59, 59, 999);

      const existingAppointments = await ctx.db.appointment.findMany({
        where: {
          providerId: input.providerId,
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
          startsAt: { gte: startOfDay, lte: endOfDay },
        },
        select: { startsAt: true, endsAt: true },
      });

      return { availability, existingAppointments };
    }),
});
