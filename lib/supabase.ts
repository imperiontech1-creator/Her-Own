import { createClient } from "@supabase/supabase-js";
import { logger } from "./logger";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anon) {
  logger.warn("supabase", "Supabase URL or anon key missing; anon client disabled.");
}
if (!url || !serviceRole) {
  logger.warn("supabase", "Supabase URL or service role missing; admin client disabled.");
}

export const supabaseAnon = url && anon ? createClient(url, anon) : null;

export const supabaseAdmin =
  url && serviceRole ? createClient(url, serviceRole, { auth: { persistSession: false } }) : null;

export type OrderRow = {
  id: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  email: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "refunded";
  items: { productId: string; quantity: number; price: number; name: string }[];
  total_cents: number;
  created_at: string;
  updated_at: string;
  tracking_number: string | null;
  tracking_carrier: string | null;
  discreet_descriptor: string | null;
};
