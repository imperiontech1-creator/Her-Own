import Stripe from "stripe";
import { logger } from "./logger";

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  logger.warn("stripe", "STRIPE_SECRET_KEY not set; Stripe server calls will fail.");
}

export const stripe = secret
  ? new Stripe(secret)
  : null;

export const DISCREET_DESCRIPTION = "Her Own Wellness Item";

export function formatDiscreetLineItem(name: string, sku: string): string {
  return `${DISCREET_DESCRIPTION} #${sku}`;
}
