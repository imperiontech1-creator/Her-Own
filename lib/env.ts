/**
 * Validates required env once at module load. Logs warnings only — does not throw
 * so the app can still run (e.g. dev without Doppler). Use for understandable startup logs.
 */

import { logger } from "./logger";

const CONTEXT = "env";

let validated = false;

export function validateEnv(): void {
  if (validated) return;
  validated = true;

  const missing: string[] = [];
  const optional = ["STRIPE_WEBHOOK_SECRET", "HER_OWN_ADMIN_EMAIL", "RESEND_API_KEY", "RESEND_FROM"];

  if (!process.env.STRIPE_SECRET_KEY) missing.push("STRIPE_SECRET_KEY");
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) missing.push("NEXT_PUBLIC_STRIPE_PUBLIC_KEY");
  if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
  if (!process.env.SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push("SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");

  optional.forEach((key) => {
    if (!process.env[key]) {
      logger.warn(CONTEXT, `Optional env not set: ${key}`);
    }
  });

  if (missing.length > 0) {
    logger.warn(CONTEXT, "Missing env (some features will be disabled)", { missing });
  }
}
