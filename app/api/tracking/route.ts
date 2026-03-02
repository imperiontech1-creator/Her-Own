import { NextRequest, NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId")?.trim();
    if (!sessionId || sessionId.length > 200) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }
    if (!supabaseAnon) {
      logger.warn("tracking", "Database not configured");
      return NextResponse.json({ order: null, error: "Order not found" });
    }
    const { data, error } = await supabaseAnon
      .from("orders")
      .select("id, email, status, total_cents, tracking_number, tracking_carrier, created_at, updated_at, shipping_address, stripe_session_id, items")
      .eq("stripe_session_id", sessionId)
      .single();
    if (error || !data) {
      if (error) logger.error("tracking", "Order lookup failed", { sessionId: sessionId.slice(0, 12) + "...", error });
      return NextResponse.json({ order: null, error: "Order not found" });
    }
    return NextResponse.json({ order: data });
  } catch (err) {
    logger.error("tracking", "Order lookup error", err);
    return NextResponse.json({ order: null, error: "Order not found" });
  }
}
