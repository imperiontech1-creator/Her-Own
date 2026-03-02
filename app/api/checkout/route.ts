import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getProductById } from "@/lib/products";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

const DISCREET_DESCRIPTOR = "HER OWN WELLNESS";
const CHECKOUT_LIMIT_PER_MINUTE = 20;

export async function POST(req: NextRequest) {
  if (!checkRateLimit(req, CHECKOUT_LIMIT_PER_MINUTE)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  let body: { items?: { productId: string; quantity: number }[]; successUrl?: string; cancelUrl?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  try {
    const { items, successUrl, cancelUrl, email } = body ?? {};
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const success = successUrl || `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel = cancelUrl || `${origin}/cart`;

    const lineItems: { price_data: { currency: string; product_data: { name: string; description?: string }; unit_amount: number }; quantity: number }[] = [];

    for (const item of items || []) {
      const product = getProductById(item.productId);
      if (!product || item.quantity < 1) continue;
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.tagline,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: "No valid items in cart" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: success,
      cancel_url: cancel,
      customer_email: email || undefined,
      payment_intent_data: {
        statement_descriptor: DISCREET_DESCRIPTOR.substring(0, 22),
        metadata: { source: "her-own" },
      },
      metadata: {
        source: "her-own",
        items_json: JSON.stringify((items || []).map((i) => ({ productId: i.productId, quantity: i.quantity }))),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    logger.error("checkout", "Failed to create checkout session", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
