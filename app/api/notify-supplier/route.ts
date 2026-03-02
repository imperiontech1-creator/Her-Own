import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { sendResendEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  let body: {
    to?: string;
    order?: {
      sessionId: string;
      email: string;
      items: unknown[];
      totalCents: number;
      discreetDescriptor: string;
      shippingAddress?: { name?: string; line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } | null;
      origin?: string;
    };
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  try {
    const { to, order } = body ?? {};
    if (!to || !order) {
      return NextResponse.json({ error: "Missing to or order" }, { status: 400 });
    }
    const subject = "New order – Her Own";
    const total = typeof order.totalCents === "number" ? `$${(order.totalCents / 100).toFixed(2)}` : "";
    const itemsList = Array.isArray(order.items)
      ? (order.items as { quantity?: number; name?: string }[]).map((i) => `${i.quantity ?? 1} × ${i.name ?? "Item"}`).join(", ")
      : "";
    const origin = order.origin || "";
    const retailerLink = origin && order.sessionId ? `${origin}/retailer/order/${order.sessionId}` : "";
    const addr = order.shippingAddress;
    const shipToBlock =
      addr && (addr.name || addr.line1 || addr.city)
        ? `<p><strong>Ship to:</strong><br/>${[addr.name, addr.line1, addr.line2, [addr.city, addr.state, addr.postal_code].filter(Boolean).join(", "), addr.country].filter(Boolean).join("<br/>")}</p>`
        : "";
    const html = `<p>New order received.</p><p>Session: ${String(order.sessionId || "")}</p><p>Email: ${String(order.email || "")}</p><p>Total: ${total}</p><p>Items: ${itemsList}</p>${shipToBlock}${retailerLink ? `<p><a href="${retailerLink}">View order (retailer link)</a></p>` : ""}`;
    const sent = await sendResendEmail(to, subject, html);
    if (!sent) logger.info("notify-supplier", "Supplier order (email not sent; set RESEND_API_KEY and RESEND_FROM to send)", { to, sessionId: order?.sessionId });
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error("notify-supplier", "Bad request", err);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
