import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const ADMIN_EMAIL = process.env.HER_OWN_ADMIN_EMAIL;
const LOGIN_LIMIT_PER_MINUTE = 5;

export async function POST(req: NextRequest) {
  if (!checkRateLimit(req, LOGIN_LIMIT_PER_MINUTE)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }
  let body: { email?: string };
  try {
    body = (await req.json()) as { email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!ADMIN_EMAIL || !email || email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("her_own_admin_email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
