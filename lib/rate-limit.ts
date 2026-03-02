import { NextRequest } from "next/server";

const WINDOW_MS = 60_000;
const MAX_AGE_MS = 120_000;

const store = new Map<string, number[]>();

function getClientId(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const nf = req.headers.get("x-nf-client-connection-ip");
  if (nf) return nf;
  return "anonymous";
}

function prune(now: number): void {
  const cutoff = now - MAX_AGE_MS;
  for (const [key, times] of store.entries()) {
    const kept = times.filter((t) => t > cutoff);
    if (kept.length === 0) store.delete(key);
    else store.set(key, kept);
  }
}

/**
 * Returns true if the request is within limit, false if rate limited.
 * In-memory only; for multi-instance use Upstash or similar.
 */
export function checkRateLimit(req: NextRequest, limitPerMinute: number): boolean {
  const now = Date.now();
  prune(now);
  const key = getClientId(req);
  const times = store.get(key) ?? [];
  const inWindow = times.filter((t) => t > now - WINDOW_MS);
  if (inWindow.length >= limitPerMinute) return false;
  inWindow.push(now);
  store.set(key, inWindow);
  return true;
}
