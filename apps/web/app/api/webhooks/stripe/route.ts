import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@repo/db/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const practice = await db.practice.findUnique({
        where: { stripeCustomerId: customerId },
      });
      if (!practice) break;

      const status = mapStripeStatus(subscription.status);
      await db.practice.update({
        where: { id: practice.id },
        data: {
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: status,
          subscriptionEndsAt: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null,
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const practice = await db.practice.findUnique({
        where: { stripeCustomerId: customerId },
      });
      if (practice) {
        await db.practice.update({
          where: { id: practice.id },
          data: { subscriptionStatus: "CANCELLED" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

function mapStripeStatus(
  status: Stripe.Subscription.Status
): "ACTIVE" | "PAST_DUE" | "CANCELLED" | "TRIALING" {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
      return "CANCELLED";
    case "trialing":
      return "TRIALING";
    default:
      return "ACTIVE";
  }
}
