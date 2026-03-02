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
    const safeItems = Array.isArray(items) ? items.slice(0, 50) : [];
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const success = successUrl || `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel = cancelUrl || `${origin}/cart`;

    const multiplier = Math.max(0.01, Math.min(10, parseFloat(process.env.HER_OWN_PRICE_MULTIPLIER || "1") || 1));
    const lineItems: { price_data: { currency: string; product_data: { name: string; description?: string }; unit_amount: number }; quantity: number }[] = [];
    let totalCostCents = 0;

    for (const item of safeItems) {
      const product = getProductById(item.productId);
      if (!product || item.quantity < 1) continue;
      const unitAmount = Math.round(product.price * multiplier * 100);
      totalCostCents += Math.round((product.cost ?? 0) * 100) * item.quantity;
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.tagline,
          },
          unit_amount: unitAmount,
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

    const totalCents = lineItems.reduce((sum, li) => sum + (li.price_data.unit_amount * li.quantity), 0);
    const minMarginCents = Math.ceil(totalCostCents * 1.05);
    if (totalCents < totalCostCents || totalCents < minMarginCents) {
      logger.warn("checkout", "Margin check failed", { totalCents, totalCostCents, minMarginCents });
      return NextResponse.json(
        { error: "Pricing configuration error. Please try again later." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: success,
      cancel_url: cancel,
      customer_email: email || undefined,
      shipping_address_collection: { allowed_countries: ["US"] },
      payment_intent_data: {
        statement_descriptor: DISCREET_DESCRIPTOR.substring(0, 22),
        metadata: { source: "her-own" },
      },
      metadata: {
        source: "her-own",
        items_json: JSON.stringify(safeItems.map((i) => ({ productId: i.productId, quantity: i.quantity }))),
      },
    });

    if (!session?.url) {
      logger.error("checkout", "Stripe session missing url", { sessionId: session?.id });
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    logger.error("checkout", "Failed to create checkout session", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
