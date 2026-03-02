# Her Own – Where body answers to you

Production-ready Next.js 15.2 intimate wellness dropshipping store. Clean medical aesthetic + glassmorphism, Stripe Checkout, Supabase, PWA.

## Stack

- **Next.js 15.2** (App Router)
- **Stripe** (Checkout Sessions, webhooks)
- **Supabase** (orders)
- **Zustand** (cart, persisted)
- **Tailwind CSS** + **shadcn-style** UI + **Framer Motion**
- **TypeScript**

## Secrets (Doppler only)

**No secrets are stored or displayed in the repo.** All secrets are loaded from **Doppler** (project: `her-own`, config: `dev`). Run the app with Doppler so env vars are injected at runtime:

```bash
# Install Doppler CLI: https://docs.doppler.com/docs/install-cli
doppler login
doppler setup   # project: her-own, config: dev_personal (or dev)

# Dev
doppler run -- npm run dev

# Build
doppler run -- npm run build
```

Required secrets in Doppler:

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server only) |
| `HER_OWN_ADMIN_EMAIL` | Admin email (orders, supplier notify) |

Optional (Doppler or env):

| Variable | Description |
|----------|-------------|
| `HER_OWN_SITE_OFFLINE` or `HER_OWN_MAINTENANCE` | Set to `1` to show "We'll be back soon" and block checkout/shop; tracking, admin, webhook, retailer, policy still work. |
| `HER_OWN_PRICE_MULTIPLIER` | Checkout price multiplier (default `1.0`; e.g. `1.15` for 15% increase). |
| `RESEND_API_KEY` | Resend API key for order confirmation, shipped, and supplier emails. If missing, emails are skipped (see logs). |
| `RESEND_FROM` | Sender for Resend (e.g. `Her Own <orders@yourdomain.com>`). Required for any email. |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for links in emails (e.g. `https://your-site.com`). If missing, request origin is used. |
| `HER_OWN_NOTIFY_SECRET` | If set, `/api/notify-supplier` requires header `x-her-own-notify-secret` (webhook sends it). Stops unauthorized notify calls. |

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Supabase**
   - Create a project at [supabase.com](https://supabase.com).
   - In SQL Editor, run `supabase-schema.sql` to create the `orders` table. For existing projects, run `supabase-migration-shipping.sql` to add `shipping_address` and `supplier_notified_at`.
   - Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` to Doppler.

3. **Stripe**
   - Create products/prices or use dynamic `price_data` (already used in checkout).
   - Add `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` to Doppler.
   - Webhook: add endpoint `https://your-domain.com/api/webhooks/stripe`, events `checkout.session.completed`. Set `STRIPE_WEBHOOK_SECRET` in Doppler.

4. **Run**
   ```bash
   doppler run -- npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deploy to Netlify (public site)

The app runs on Netlify with the same code; **Doppler-first:** Store all secrets in Doppler; sync to Netlify via [Doppler → Netlify](https://docs.doppler.com/docs/netlify). Full steps: **NETLIFY_DEPLOY.md**. Keys: **DOPPLER_NETLIFY_KEYS.md**. Optional: `npm run netlify:env` → import `.env.netlify` in Netlify. No Doppler on the platform for build; sync env from Doppler.
1. **Push** the repo to GitHub/GitLab/Bitbucket and connect it in [Netlify](https://app.netlify.com) (Add new site → Import from Git).
2. **Build settings** (usually auto-detected):
   - Build command: `npm run build:ci`
   - Publish directory: leave as set by Next.js detection (or `.next` if you set it manually).
3. **Environment variables** (Site settings → Environment variables → Add variable / Import from .env):
   - Use the same variables as in the “Required secrets in Doppler” table above:  
     `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `HER_OWN_ADMIN_EMAIL` (optional). **For order confirmations and shipped emails**, add `RESEND_API_KEY` and `RESEND_FROM` (or sync from Doppler).
   - For Stripe webhooks, set the endpoint to `https://<your-netlify-site>/api/webhooks/stripe` and use the signing secret as `STRIPE_WEBHOOK_SECRET`.
4. **Deploy** (triggered by push or “Deploy site” in the Netlify UI).

The repo includes a `netlify.toml` that sets the build command to `build:ci` so the build does not require Doppler.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Hero, 10K+ counter, glass carousel, trust badges |
| `/products/[slug]` | Product detail, clinical copy, sticky “Claim Yours” |
| `/cart` | Cart + bundle upsells (glass) |
| `/checkout` | Email + honeypot → Stripe Checkout (discreet descriptor) |
| `/checkout/success` | Thank you + track order link |
| `/policy` | Age 21+, returns, shipping, privacy |
| `/admin` | Orders list, mark shipped, CSV export (auth via `HER_OWN_ADMIN_EMAIL`) |
| `/tracking/[orderId]` | Live status (orderId = Stripe session ID) |
| `/retailer/order/[sessionId]` | Retailer order view (no login; link in supplier email) |

## Flows

1. **Add to cart** → haptic (if supported) → glass cart drawer.
2. **Checkout** → Stripe Checkout → webhook creates order in Supabase, notifies supplier (log only unless you add Resend/SendGrid).
3. **Admin** marks shipped → customer can see status on `/tracking/[sessionId]`.

## Test card

Stripe test mode: `4242 4242 4242 4242`.

## PWA

`/manifest.json` and optional service worker (e.g. next-pwa) for installable app and offline cart (Zustand persists to localStorage).

## PWA and static assets

The app icon is at **`/icon.svg`** (from `app/icon.svg`). **Do not use `/icon`** — it 404s. See **`ASSETS.md`** for the full checklist and where icon/manifest paths are set so we don’t reintroduce 404s. Optional: add `public/icons/icon-192.png` and `icon-512.png` for PNG PWA icons; the manifest currently uses the SVG.

## Logging and fail-safes

- **Structured logs:** All server logs go through `lib/logger.ts` with prefix `[Her Own]` and a context (e.g. `checkout`, `webhook:stripe`, `admin:orders`). Grep for `[Her Own]` or `ERROR`/`WARN` to find issues.
- **Env validation:** On server startup, `instrumentation.ts` runs `validateEnv()` and logs warnings for missing or optional env (no throw, so the app still runs).
- **Error boundaries:** `app/error.tsx` and `app/global-error.tsx` catch React errors, log them via the logger, and show a “Try again” UI.
- **API routes:** Checkout and webhook use the logger and return stable JSON error shapes; the webhook has a top-level try/catch so unhandled errors return 500 and are logged (Stripe can retry).

## Security note

Next.js 15.2.3 has a known CVE; consider upgrading to the latest patched 15.x when available (`npm update next`).

## License

Proprietary.
