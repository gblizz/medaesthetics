import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, practiceProcedure, ownerProcedure, publicProcedure } from "../trpc";
import { AUDIT_ACTIONS } from "@repo/config/constants";

const formFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum([
    "TEXT",
    "TEXTAREA",
    "SELECT",
    "CHECKBOX",
    "RADIO",
    "DATE",
    "PHONE",
    "EMAIL",
    "SIGNATURE",
  ]),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  placeholder: z.string().optional(),
});

export const formsRouter = createTRPCRouter({
  // ── Intake Form Templates ──────────────────────────────────────
  listIntakeTemplates: practiceProcedure.query(async ({ ctx }) => {
    return ctx.db.intakeFormTemplate.findMany({
      where: { practiceId: ctx.practiceId!, isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  createIntakeTemplate: ownerProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        fields: z.array(formFieldSchema),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.intakeFormTemplate.create({
        data: { ...input, practiceId: ctx.practiceId! },
      });
    }),

  // ── Consent Form Templates ─────────────────────────────────────
  listConsentTemplates: practiceProcedure.query(async ({ ctx }) => {
    return ctx.db.consentFormTemplate.findMany({
      where: { practiceId: ctx.practiceId!, isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  createConsentTemplate: ownerProcedure
    .input(
      z.object({
        name: z.string().min(1),
        body: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.consentFormTemplate.create({
        data: { ...input, practiceId: ctx.practiceId! },
      });
    }),

  updateConsentTemplate: ownerProcedure
    .input(
      z.object({
        templateId: z.string(),
        name: z.string().optional(),
        body: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { templateId, ...data } = input;
      return ctx.db.consentFormTemplate.update({
        where: { id: templateId },
        data: { ...data, version: { increment: 1 } },
      });
    }),

  // ── Submissions ────────────────────────────────────────────────
  submitIntakeForm: practiceProcedure
    .input(
      z.object({
        templateId: z.string(),
        clientId: z.string(),
        appointmentId: z.string().optional(),
        responses: z.record(z.unknown()),
        ipAddress: z.string().optional(),
        deviceInfo: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.intakeFormTemplate.findFirst({
        where: { id: input.templateId, practiceId: ctx.practiceId! },
      });
      if (!template) throw new TRPCError({ code: "NOT_FOUND" });

      const submission = await ctx.db.intakeFormSubmission.create({
        data: {
          practiceId: ctx.practiceId!,
          templateId: input.templateId,
          clientId: input.clientId,
          appointmentId: input.appointmentId,
          responses: input.responses,
          ipAddress: input.ipAddress,
          deviceInfo: input.deviceInfo,
        },
      });

      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId!,
          actorId: ctx.clerkUserId!,
          actorRole: ctx.role ?? undefined,
          action: AUDIT_ACTIONS.CREATE_INTAKE_FORM,
          resourceType: "IntakeFormSubmission",
          resourceId: submission.id,
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
        },
      });

      return submission;
    }),

  submitConsentForm: practiceProcedure
    .input(
      z.object({
        templateId: z.string(),
        clientId: z.string(),
        appointmentId: z.string().optional(),
        signatureData: z.string().min(1),
        ipAddress: z.string().optional(),
        deviceInfo: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.consentFormTemplate.findFirst({
        where: { id: input.templateId, practiceId: ctx.practiceId! },
      });
      if (!template) throw new TRPCError({ code: "NOT_FOUND" });

      const submission = await ctx.db.consentFormSubmission.create({
        data: {
          practiceId: ctx.practiceId!,
          templateId: input.templateId,
          clientId: input.clientId,
          appointmentId: input.appointmentId,
          signatureData: input.signatureData,
          ipAddress: input.ipAddress,
          deviceInfo: input.deviceInfo,
        },
      });

      await ctx.db.auditLog.create({
        data: {
          practiceId: ctx.practiceId!,
          actorId: ctx.clerkUserId!,
          actorRole: ctx.role ?? undefined,
          action: AUDIT_ACTIONS.CREATE_CONSENT_FORM,
          resourceType: "ConsentFormSubmission",
          resourceId: submission.id,
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
        },
      });

      return submission;
    }),

  getClientForms: practiceProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [intake, consent] = await Promise.all([
        ctx.db.intakeFormSubmission.findMany({
          where: { clientId: input.clientId, practiceId: ctx.practiceId! },
          include: { template: { select: { name: true } } },
          orderBy: { signedAt: "desc" },
        }),
        ctx.db.consentFormSubmission.findMany({
          where: { clientId: input.clientId, practiceId: ctx.practiceId! },
          include: { template: { select: { name: true } } },
          orderBy: { signedAt: "desc" },
        }),
      ]);
      return { intake, consent };
    }),
});
