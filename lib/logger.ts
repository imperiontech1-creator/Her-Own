/**
 * Structured logger. All output is grep-able.
 * SECURITY: Never logs secret values. Redacts known secret keys and never serializes full error objects.
 * Secrets are loaded from Doppler only; never log process.env values.
 */

const PREFIX = "[Her Own]";

const REDACT_KEYS = new Set([
  "password", "token", "secret", "key", "authorization", "cookie", "api_key", "apikey",
  "stripe_secret", "service_role", "webhook_secret", "private_key", "access_token", "refresh_token",
  "to", "email", "customer_email",
]);

function redact(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(redact);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const lower = k.toLowerCase();
    const isSecret = [...REDACT_KEYS].some((s) => lower.includes(s));
    out[k] = isSecret ? "[redacted]" : redact(v);
  }
  return out;
}

function safePayload(err: unknown): unknown {
  if (err instanceof Error) {
    return { name: err.name, message: err.message };
  }
  return "[redacted]";
}

function formatMessage(level: string, context: string, message: string, data?: unknown): string {
  const parts = [PREFIX, level, context, message];
  if (data !== undefined) {
    const safe = typeof data === "object" && data !== null ? redact(data) : data;
    parts.push(typeof safe === "object" ? JSON.stringify(safe) : String(safe));
  }
  return parts.join(" ");
}

export const logger = {
  error(context: string, message: string, err?: unknown): void {
    const payload = safePayload(err);
    console.error(formatMessage("ERROR", context, message, payload));
    if (err instanceof Error && err.stack) {
      console.error(PREFIX, "ERROR", context, "stack", err.stack.split("\n").slice(0, 5).join(" "));
    }
  },
  warn(context: string, message: string, data?: unknown): void {
    console.warn(formatMessage("WARN", context, message, data !== undefined ? redact(data) : undefined));
  },
  info(context: string, message: string, data?: unknown): void {
    console.info(formatMessage("INFO", context, message, data !== undefined ? redact(data) : undefined));
  },
};
