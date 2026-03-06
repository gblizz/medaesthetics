import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@repo/db/client";
import type { UserRole } from "@repo/auth";

export interface TRPCContext {
  db: typeof db;
  clerkUserId: string | null;
  practiceId: string | null;
  role: UserRole | null;
  ipAddress: string | null;
  userAgent: string | null;
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;

const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      clerkUserId: ctx.clerkUserId,
    },
  });
});

const isPracticeAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (!ctx.practiceId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No practice context found",
    });
  }
  return next({
    ctx: {
      ...ctx,
      clerkUserId: ctx.clerkUserId,
      practiceId: ctx.practiceId,
      role: ctx.role,
    },
  });
});

const isClinicalStaff = t.middleware(({ ctx, next }) => {
  if (!ctx.clerkUserId || !ctx.practiceId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const clinicalRoles: UserRole[] = [
    "PLATFORM_ADMIN",
    "PRACTICE_OWNER",
    "PROVIDER",
  ];
  if (!ctx.role || !clinicalRoles.includes(ctx.role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Clinical access required",
    });
  }
  return next({ ctx });
});

const isPracticeOwner = t.middleware(({ ctx, next }) => {
  if (!ctx.clerkUserId || !ctx.practiceId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const adminRoles: UserRole[] = ["PLATFORM_ADMIN", "PRACTICE_OWNER"];
  if (!ctx.role || !adminRoles.includes(ctx.role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Practice owner access required",
    });
  }
  return next({ ctx });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);
export const practiceProcedure = t.procedure.use(isPracticeAuthenticated);
export const clinicalProcedure = t.procedure
  .use(isPracticeAuthenticated)
  .use(isClinicalStaff);
export const ownerProcedure = t.procedure
  .use(isPracticeAuthenticated)
  .use(isPracticeOwner);
