import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import Stripe from "stripe";

const WEBHOOK_CONTEXT = "webhook:stripe";

export async function POST(req: NextRequest) {
  try {
    return await handleWebhook(req);
  } catch (err) {
    logger.error(WEBHOOK_CONTEXT, "Unhandled webhook error", err);
    return NextResponse.json({ error: "Internal webhook error" }, { status: 500 });
  }
}

async function handleWebhook(req: NextRequest): Promise<NextResponse> {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    return NextResponse.json({ error: "Missing webhook secret or signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error(WEBHOOK_CONTEXT, "Signature verification failed", err);
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;
    const email = (session.customer_email || session.customer_details?.email) as string | undefined;
    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

    if (!email) {
      return NextResponse.json({ received: true });
    }

    let items: { productId: string; quantity: number; price: number; name: string }[] = [];
    let totalCents = 0;
    const metaItems = session.metadata?.items_json;
    if (metaItems) {
      try {
        const parsed = JSON.parse(metaItems) as { productId: string; quantity: number }[];
        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
        const lines = lineItems.data;
        parsed.forEach((meta, idx) => {
          const line = lines[idx];
          const amount = line?.amount_subtotal ?? 0;
          totalCents += amount;
          items.push({
            productId: meta.productId,
            quantity: meta.quantity,
            price: amount / 100,
            name: line?.description ?? "Item",
          });
        });
      } catch {
        // fallback
        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
        for (const line of lineItems.data) {
          const qty = line.quantity ?? 1;
          const amount = line.amount_subtotal ?? 0;
          totalCents += amount;
          items.push({
            productId: "unknown",
            quantity: qty,
            price: amount / 100,
            name: line.description ?? "Item",
          });
        }
      }
    } else {
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
      for (const line of lineItems.data) {
        const qty = line.quantity ?? 1;
        const amount = line.amount_subtotal ?? 0;
        totalCents += amount;
        items.push({
          productId: "unknown",
          quantity: qty,
          price: amount / 100,
          name: line.description ?? "Item",
        });
      }
    }

    const discreetDescriptor = "Her Own Wellness Item #" + sessionId.slice(-8);

    if (supabaseAdmin) {
      const { data: existing } = await supabaseAdmin
        .from("orders")
        .select("id")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();
      if (existing) {
        logger.info(WEBHOOK_CONTEXT, "Duplicate webhook, order already exists");
      } else {
        const { error } = await supabaseAdmin.from("orders").insert({
          stripe_session_id: sessionId,
          stripe_payment_intent_id: paymentIntentId ?? null,
          email,
          status: "paid",
          items,
          total_cents: totalCents,
          discreet_descriptor: discreetDescriptor,
        });
        if (error) {
          logger.error(WEBHOOK_CONTEXT, "Supabase insert order failed", error);
        }
      }
    }

    const adminEmail = process.env.HER_OWN_ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await fetch(`${req.nextUrl.origin}/api/notify-supplier`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: adminEmail,
            order: { sessionId, email, items, totalCents, discreetDescriptor },
          }),
        });
      } catch (e) {
        logger.error(WEBHOOK_CONTEXT, "Notify supplier failed", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
