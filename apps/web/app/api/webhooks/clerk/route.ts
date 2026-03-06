import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@repo/db/client";

type ClerkUserCreatedEvent = {
  type: "user.created";
  data: {
    id: string;
    email_addresses: { email_address: string; id: string }[];
    first_name: string | null;
    last_name: string | null;
    unsafe_metadata: {
      role?: string;
      practiceId?: string;
      inviteToken?: string;
    };
  };
};

type ClerkWebhookEvent = ClerkUserCreatedEvent;

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: ClerkWebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;
    const email = email_addresses[0]?.email_address ?? "";
    const { role, practiceId } = unsafe_metadata;

    if (role && practiceId) {
      // Staff/provider invited to a practice
      if (["PROVIDER", "PRACTICE_OWNER"].includes(role)) {
        await db.provider.create({
          data: {
            clerkUserId: id,
            practiceId,
            firstName: first_name ?? "",
            lastName: last_name ?? "",
            email,
            role: role as any,
          },
        });
      } else if (role === "FRONT_DESK") {
        await db.staffMember.create({
          data: {
            clerkUserId: id,
            practiceId,
            firstName: first_name ?? "",
            lastName: last_name ?? "",
            email,
            role: "FRONT_DESK",
          },
        });
      }
    } else {
      // New client registering via patient portal
      // We just create a minimal client record — the portal asks for the rest during onboarding
      // Requires knowing which practice they belong to (via invite link with practiceSlug)
    }
  }

  return NextResponse.json({ received: true });
}
