import { logger } from "./logger";

const RESEND_API = "https://api.resend.com/emails";

/** Escape for safe interpolation into HTML (text and attribute). */
export function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Brand-aligned wrapper for email body (blush/white, minimal). Inline CSS for client compatibility. */
function wrapEmailBody(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>.e-b p{margin:0 0 12px 0;}.e-b p:last-child{margin-bottom:0}.e-b a{color:#b8860b;text-decoration:underline;}</style></head><body style="margin:0;padding:0;background:#f8e1e9;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#1a1a1a;font-size:16px;line-height:1.5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8e1e9;padding:24px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fafafa;border-radius:8px;padding:32px 24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
<tr><td>
<p style="margin:0 0 20px 0;font-size:12px;letter-spacing:0.05em;color:#1a1a1a;opacity:0.8;">Her Own</p>
<div class="e-b" style="margin:0;color:#1a1a1a;">${body}</div>
<p style="margin:24px 0 0 0;font-size:12px;color:#1a1a1a;opacity:0.7;">Her Own</p>
</td></tr></table>
</td></tr></table>
</body></html>`;
}

/**
 * Send one email via Resend. No-op if RESEND_API_KEY or RESEND_FROM missing.
 * Returns true if sent, false otherwise (missing config or API error).
 * Wraps html in brand template (blush bg, white card) when using plain body content.
 */
export async function sendResendEmail(to: string, subject: string, html: string, options?: { wrap?: boolean }): Promise<boolean> {
  const finalHtml = options?.wrap !== false ? wrapEmailBody(html) : html;
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
        html: finalHtml,
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
