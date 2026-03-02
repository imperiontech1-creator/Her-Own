import { NextRequest, NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }
  if (!supabaseAnon) {
    logger.warn("tracking", "Database not configured");
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const { data, error } = await supabaseAnon
    .from("orders")
    .select("id, email, status, total_cents, tracking_number, tracking_carrier, created_at")
    .eq("stripe_session_id", sessionId)
    .single();
  if (error || !data) {
    return NextResponse.json({ order: null, error: "Order not found" });
  }
  return NextResponse.json({ order: data });
}
