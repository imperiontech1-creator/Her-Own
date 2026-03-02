import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";

const ADMIN_EMAIL = process.env.HER_OWN_ADMIN_EMAIL;

function isAdmin(req: NextRequest): boolean {
  const cookieEmail = req.cookies.get("her_own_admin_email")?.value;
  const authHeader = req.headers.get("authorization");
  return !!ADMIN_EMAIL && (cookieEmail === ADMIN_EMAIL || authHeader === `Bearer ${ADMIN_EMAIL}`);
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ totalSalesCents: 0, todaySalesCents: 0, orderCount: 0 });
  }
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayIso = todayStart.toISOString();

    const { data: allRows } = await supabaseAdmin
      .from("orders")
      .select("total_cents, status, created_at")
      .in("status", ["paid", "shipped", "delivered"]);

    const rows = (allRows ?? []) as { total_cents?: number; status?: string; created_at?: string }[];
    let totalSalesCents = 0;
    let todaySalesCents = 0;
    for (const r of rows) {
      const cents = typeof r.total_cents === "number" ? r.total_cents : 0;
      totalSalesCents += cents;
      if (r.created_at && r.created_at >= todayIso) todaySalesCents += cents;
    }

    const { count } = await supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .in("status", ["paid", "shipped", "delivered"]);

    return NextResponse.json({
      totalSalesCents,
      todaySalesCents,
      orderCount: count ?? rows.length,
    });
  } catch (err) {
    logger.error("admin:stats", "Stats failed", err);
    return NextResponse.json({ totalSalesCents: 0, todaySalesCents: 0, orderCount: 0 });
  }
}
