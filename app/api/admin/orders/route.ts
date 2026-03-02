import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { sendResendEmail } from "@/lib/resend";

const ADMIN_EMAIL = process.env.HER_OWN_ADMIN_EMAIL;

function isAdmin(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const cookieEmail = req.cookies.get("her_own_admin_email")?.value;
  return !!ADMIN_EMAIL && (cookieEmail === ADMIN_EMAIL || authHeader === `Bearer ${ADMIN_EMAIL}`);
}

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 500;
const SORT_FIELDS = ["created_at", "total_cents", "status", "email"] as const;
const STATUS_VALUES = ["pending", "paid", "shipped", "delivered", "refunded"] as const;

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10)));
    const status = searchParams.get("status")?.toLowerCase();
    const search = searchParams.get("search")?.trim();
    const sortBy = searchParams.get("sort") ?? "created_at";
    const sortOrder = searchParams.get("order") === "asc" ? "asc" : "desc";
    const dateFrom = searchParams.get("dateFrom")?.trim();
    const dateTo = searchParams.get("dateTo")?.trim();

    const orderBy = SORT_FIELDS.includes(sortBy as (typeof SORT_FIELDS)[number]) ? sortBy : "created_at";
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from("orders")
      .select("*", { count: "exact" });

    if (status && STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])) {
      query = query.eq("status", status);
    }
    if (dateFrom) {
      const d = new Date(dateFrom);
      if (!Number.isNaN(d.getTime())) query = query.gte("created_at", d.toISOString());
    }
    if (dateTo) {
      const d = new Date(dateTo);
      if (!Number.isNaN(d.getTime())) query = query.lte("created_at", d.toISOString());
    }
    if (search && search.length >= 2) {
      const term = search.replace(/'/g, "''").replace(/\\/g, "\\\\");
      query = query.or(`email.ilike.%${term}%,id.ilike.%${term}%,stripe_session_id.ilike.%${term}%`);
    }

    const { data, error, count } = await query
      .order(orderBy, { ascending: sortOrder === "asc" })
      .range(from, to);

    if (error) {
      logger.error("admin:orders", "List orders failed", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const orders = (data ?? []) as Record<string, unknown>[];
    const total = count ?? orders.length;

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(Math.max(0, total) / limit) || 1 },
    });
  } catch (err) {
    logger.error("admin:orders", "List orders failed", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  let body: { orderId?: string; status?: string; tracking_number?: string; tracking_carrier?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { orderId, status, tracking_number, tracking_carrier } = body ?? {};
  if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status && STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])) {
    updates.status = status;
  } else if (status) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  if (tracking_number !== undefined) updates.tracking_number = tracking_number;
  if (tracking_carrier !== undefined) updates.tracking_carrier = tracking_carrier;
  try {
    const { error } = await supabaseAdmin.from("orders").update(updates).eq("id", orderId.trim());
    if (error) {
      logger.error("admin:orders", "Update order failed", { orderId, error: error.message });
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
    if (status === "shipped") {
      const { data: row } = await supabaseAdmin.from("orders").select("email, tracking_number, tracking_carrier").eq("id", orderId.trim()).single();
      const email = (row as { email?: string } | null)?.email;
      if (email && email.trim()) {
        const tracking = [tracking_carrier, tracking_number].filter(Boolean).join(" ");
        const html = `<p>Your order has been shipped.</p>${tracking ? `<p>Tracking: ${tracking}</p>` : ""}<p>Thank you for your order.</p>`;
        sendResendEmail(email.trim(), "Your order has shipped – Her Own", html).catch(() => {});
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error("admin:orders", "Update order failed", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
