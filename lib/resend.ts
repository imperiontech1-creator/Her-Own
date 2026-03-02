import { logger } from "./logger";

const RESEND_API = "https://api.resend.com/emails";

/**
 * Send one email via Resend. No-op if RESEND_API_KEY or RESEND_FROM missing.
 * Returns true if sent, false otherwise (missing config or API error).
 */
export async function sendResendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from || !to?.trim()) {
    if (!apiKey || !from) logger.warn("resend", "RESEND_API_KEY or RESEND_FROM missing; email not sent", { to: to ? "[set]" : "" });
    return false;
  }
  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from.trim(),
        to: [to.trim()],
        subject: subject.trim(),
        html: html,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      logger.error("resend", "Send failed", { status: res.status, body: errText });
      return false;
    }
    return true;
  } catch (err) {
    logger.error("resend", "Send failed", err);
    return false;
  }
}
