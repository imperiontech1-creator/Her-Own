import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.HER_OWN_ADMIN_EMAIL;

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };
  if (!ADMIN_EMAIL || email?.trim() !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("her_own_admin_email", email!.trim(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
