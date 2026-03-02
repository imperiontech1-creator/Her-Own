# Gaps and recommendations

Known gaps and optional improvements. Nothing here blocks running the app with Doppler.

## Addressed in this repo

- **.gitignore** – Added so `.env`, `.env*.local`, `.next`, `node_modules` are never committed. All secrets from Doppler only.
- **Webhook idempotency** – Stripe webhook checks for existing order by `stripe_session_id` before insert; duplicate events are skipped and logged as info.
- **Admin logout** – `POST /api/admin/logout` clears the admin cookie (e.g. on shared devices).
- **Supabase error messages** – Admin orders API returns generic "Database error" on 500; real error is logged only.
- **Admin orders robustness** – Orders list and mark-shipped use safe JSON parse and normalized order rows so malformed API responses never crash the UI; Retry on error; pagination and PATCH body validated; admin login and login page handle network/non-JSON errors and invalid body without throwing.
- **Rate limiting** – In-memory rate limit on `/api/admin/login` (5/min) and `/api/checkout` (20/min) by client IP. For multi-instance production, use Upstash or similar and replace `lib/rate-limit.ts`.
- **Admin auth** – Cookie + optional Bearer (admin email); sufficient for single-admin. For multi-admin or stronger guarantees, consider NextAuth (optional).
- **Customer “order shipped” email** – When admin marks an order shipped, a “Your order has shipped” email is sent to the customer via Resend if `RESEND_API_KEY` and `RESEND_FROM` are set in Doppler/Netlify.
- **Supplier email** – `/api/notify-supplier` sends an email to the configured recipient via Resend when `RESEND_API_KEY` and `RESEND_FROM` are set; otherwise logs only.
- **Product images** – Product card and detail use `product.image` with fallback to gradient+initial on load error. Add real assets under `public/products/` (see `ASSETS.md`); paths are in `lib/products.ts`.
- **Next.js CVE** – Upgraded to 15.2.9 for CVE-2025-55182; keep Next updated for future patches.
- **Stress test** – `npm run stress-test` (with server running) hits auth, rate limits, invalid JSON, and public pages; checkout and notify-supplier return 400 for invalid body.

## Optional / future

- **Upstash for rate limit** – Replace in-memory rate limit with Upstash Redis for multi-instance Netlify deploys.
- **NextAuth for admin** – Optional upgrade if you need multiple admins or stronger session handling.

## Not gaps

- **Tracking by session ID** – Anyone with the Stripe session ID can view that order’s status; session IDs are unguessable, which is acceptable for “track your order”.
- **Doppler** – All runtime secrets are loaded from Doppler; no secrets in repo or in logs (logger redacts).
