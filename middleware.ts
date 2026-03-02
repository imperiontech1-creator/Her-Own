import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAINTENANCE_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Her Own – We'll be back soon</title><style>body{font-family:system-ui,sans-serif;background:#F8E1E9;color:#333;min-height:100vh;display:flex;align-items:center;justify-content:center;margin:0;padding:1rem;text-align:center;}h1{font-size:1.5rem;}p{color:#666;}</style></head><body><div><h1>We'll be back soon</h1><p>Thanks for your patience. Check back shortly.</p></div></body></html>`;

export function middleware(req: NextRequest) {
  const offline = process.env.HER_OWN_SITE_OFFLINE === "1" || process.env.HER_OWN_MAINTENANCE === "1";
  if (!offline) return NextResponse.next();

  const path = req.nextUrl.pathname;
  if (path.startsWith("/api/webhooks/stripe")) return NextResponse.next();
  if (path.startsWith("/api/notify-supplier")) return NextResponse.next();
  if (path.startsWith("/api/tracking")) return NextResponse.next();
  if (path.startsWith("/tracking")) return NextResponse.next();
  if (path.startsWith("/retailer")) return NextResponse.next();
  if (path.startsWith("/admin")) return NextResponse.next();
  if (path === "/policy") return NextResponse.next();
  if (path.startsWith("/_next") || path === "/icon.svg" || path === "/manifest.json") return NextResponse.next();

  return new NextResponse(MAINTENANCE_HTML, {
    status: 503,
    headers: { "Content-Type": "text/html; charset=utf-8", "Retry-After": "300" },
  });
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
