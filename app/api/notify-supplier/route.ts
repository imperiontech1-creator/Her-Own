import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const { to, order } = (await req.json()) as {
      to: string;
      order: { sessionId: string; email: string; items: unknown[]; totalCents: number; discreetDescriptor: string };
    };
    if (!to || !order) {
      return NextResponse.json({ error: "Missing to or order" }, { status: 400 });
    }
    // In production, integrate with Resend/SendGrid/etc. to email supplier.
    logger.info("notify-supplier", "Supplier order (email not sent; add RESEND_API_KEY to send)", { to, sessionId: order?.sessionId });
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error("notify-supplier", "Bad request", err);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
