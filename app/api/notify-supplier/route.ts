import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { sendResendEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  let body: { to?: string; order?: { sessionId: string; email: string; items: unknown[]; totalCents: number; discreetDescriptor: string } };
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
    const itemsList = Array.isArray(order.items) ? order.items.map((i: unknown) => String(i)).join(", ") : "";
    const html = `<p>New order received.</p><p>Session: ${String(order.sessionId || "")}</p><p>Email: ${String(order.email || "")}</p><p>Total: ${total}</p><p>Items: ${itemsList}</p>`;
    const sent = await sendResendEmail(to, subject, html);
    if (!sent) logger.info("notify-supplier", "Supplier order (email not sent; set RESEND_API_KEY and RESEND_FROM to send)", { to, sessionId: order?.sessionId });
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error("notify-supplier", "Bad request", err);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
