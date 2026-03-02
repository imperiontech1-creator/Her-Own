import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.HER_OWN_ADMIN_EMAIL;

function isAdmin(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const cookieEmail = req.cookies.get("her_own_admin_email")?.value;
  return !!ADMIN_EMAIL && (cookieEmail === ADMIN_EMAIL || authHeader === `Bearer ${ADMIN_EMAIL}`);
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const resendConfigured = !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
  return NextResponse.json({ resendConfigured });
}
