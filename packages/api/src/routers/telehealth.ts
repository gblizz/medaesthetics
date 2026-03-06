import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, clinicalProcedure, practiceProcedure } from "../trpc";

export const telehealthRouter = createTRPCRouter({
  createRoom: clinicalProcedure
    .input(z.object({ appointmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const appointment = await ctx.db.appointment.findFirst({
        where: { id: input.appointmentId, practiceId: ctx.practiceId! },
        include: {
          client: { select: { firstName: true, lastName: true } },
          provider: { select: { firstName: true, lastName: true } },
        },
      });
      if (!appointment) throw new TRPCError({ code: "NOT_FOUND" });

      // In production: call Daily.co API to create a room
      // POST https://api.daily.co/v1/rooms
      // Requires DAILY_API_KEY and signed BAA
      const mockRoomName = `medaesthetics-${input.appointmentId.slice(0, 8)}`;
      const mockRoomUrl = `https://your-practice.daily.co/${mockRoomName}`;

      const updated = await ctx.db.appointment.update({
        where: { id: input.appointmentId },
        data: {
          telehealthRoomUrl: mockRoomUrl,
          telehealthSessionId: mockRoomName,
        },
      });

      return {
        roomUrl: mockRoomUrl,
        roomName: mockRoomName,
        appointment: updated,
      };
    }),

  getRoomToken: practiceProcedure
    .input(
      z.object({
        appointmentId: z.string(),
        participantName: z.string(),
        isOwner: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const appointment = await ctx.db.appointment.findFirst({
        where: { id: input.appointmentId, practiceId: ctx.practiceId! },
      });
      if (!appointment) throw new TRPCError({ code: "NOT_FOUND" });
      if (!appointment.telehealthRoomUrl) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Telehealth room not yet created for this appointment",
        });
      }

      // In production: call Daily.co API to generate a meeting token
      // POST https://api.daily.co/v1/meeting-tokens
      return {
        token: "daily_co_meeting_token_placeholder",
        roomUrl: appointment.telehealthRoomUrl,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      };
    }),
});
