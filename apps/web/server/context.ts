import { auth, currentUser } from "@repo/auth";
import { db } from "@repo/db/client";
import type { TRPCContext } from "@repo/api";
import type { UserRole } from "@repo/auth";

export async function createTRPCContext(opts: {
  headers: Headers;
}): Promise<TRPCContext> {
  const { userId } = await auth();
  const ipAddress =
    opts.headers.get("x-forwarded-for") ??
    opts.headers.get("x-real-ip") ??
    null;
  const userAgent = opts.headers.get("user-agent") ?? null;

  if (!userId) {
    return {
      db,
      clerkUserId: null,
      practiceId: null,
      role: null,
      ipAddress,
      userAgent,
    };
  }

  // Look up the user's practice and role from DB
  const provider = await db.provider.findUnique({
    where: { clerkUserId: userId },
    select: { practiceId: true, role: true },
  });

  const staffMember = !provider
    ? await db.staffMember.findUnique({
        where: { clerkUserId: userId },
        select: { practiceId: true, role: true },
      })
    : null;

  const record = provider ?? staffMember;

  return {
    db,
    clerkUserId: userId,
    practiceId: record?.practiceId ?? null,
    role: (record?.role as UserRole | null) ?? null,
    ipAddress,
    userAgent,
  };
}
