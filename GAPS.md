# Gaps and recommendations

Known gaps and optional improvements. Nothing here blocks running the app with Doppler.

## Addressed in this repo

- **.gitignore** – Added so `.env`, `.env*.local`, `.next`, `node_modules` are never committed. All secrets from Doppler only.
- **Webhook idempotency** – Stripe webhook checks for existing order by `stripe_session_id` before insert; duplicate events are skipped and logged as info.
- **Admin logout** – `POST /api/admin/logout` clears the admin cookie (e.g. on shared devices).

## Optional / future

- **Rate limiting** – No rate limit on `/api/admin/login` or `/api/checkout`. Consider Vercel KV or Upstash for production to limit brute force and abuse.
- **Admin auth** – Uses cookie + optional Bearer (admin email). For stronger auth, add proper sessions or a provider (e.g. NextAuth) and keep Doppler for secrets.
- **Customer “order shipped” email** – Spec said “Admin marks shipped → customer notified”. Currently we only update status; no email is sent to the customer. Add Resend/SendGrid and send when status becomes `shipped`.
- **Supplier email** – `/api/notify-supplier` only logs; add `RESEND_API_KEY` (or similar) in Doppler and implement sending.
- **Product images** – Placeholders only. Add real assets under `public/products/` or use a CDN and set `image` in `lib/products.ts`.
- **Supabase error messages** – API sometimes returns Supabase `error.message` in 500 responses. For stricter info hiding in production, return a generic “Database error” and keep the real message in server logs only.
- **Next.js CVE** – README notes upgrading Next when a patched 15.x is available.

## Not gaps

- **Tracking by session ID** – Anyone with the Stripe session ID can view that order’s status; session IDs are unguessable, which is acceptable for “track your order”.
- **Doppler** – All runtime secrets are loaded from Doppler; no secrets in repo or in logs (logger redacts).
