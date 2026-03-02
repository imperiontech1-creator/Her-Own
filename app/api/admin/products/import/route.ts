import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";

const ADMIN_EMAIL = process.env.HER_OWN_ADMIN_EMAIL;

function isAdmin(req: NextRequest): boolean {
  const cookieEmail = req.cookies.get("her_own_admin_email")?.value;
  const authHeader = req.headers.get("authorization");
  return !!ADMIN_EMAIL && (cookieEmail === ADMIN_EMAIL || authHeader === `Bearer ${ADMIN_EMAIL}`);
}

/** Parse CSV text: header row name,sku,wholesale_cents,retail_cents then data rows. */
function parseCsv(csv: string): { name: string; sku: string; wholesale_cents: number; retail_cents: number }[] {
  const lines = csv.trim().split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const rows: { name: string; sku: string; wholesale_cents: number; retail_cents: number }[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));
    const name = parts[0] || "";
    const sku = parts[1] || "";
    const wholesale = Math.round(parseFloat(parts[2] || "0") * 100) || 0;
    const retail = Math.round(parseFloat(parts[3] || "0") * 100) || 0;
    if (name) rows.push({ name, sku, wholesale_cents: wholesale, retail_cents: retail });
  }
  return rows;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  let csv = "";
  try {
    const body = await req.json();
    csv = typeof body?.csv === "string" ? body.csv : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!csv || csv.length > 500000) {
    return NextResponse.json({ error: "Missing or too large CSV" }, { status: 400 });
  }
  const rows = parseCsv(csv);
  if (rows.length === 0) {
    return NextResponse.json({ error: "No valid rows (expected header: name,sku,wholesale_cents,retail_cents)" }, { status: 400 });
  }
  try {
    const toInsert = rows.map((r) => ({
      name: r.name,
      sku: r.sku || null,
      wholesale_cents: r.wholesale_cents,
      retail_cents: r.retail_cents,
      stock_quantity: 0,
      hidden: false,
    }));
    const { data, error } = await supabaseAdmin.from("products").insert(toInsert).select("id");
    if (error) {
      logger.error("admin:products:import", "Insert failed", { error: error.message });
      return NextResponse.json({ error: "Import failed. Ensure products table exists (run supabase-migration-products-suppliers.sql)." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, count: data?.length ?? rows.length });
  } catch (err) {
    logger.error("admin:products:import", "Import error", err);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
