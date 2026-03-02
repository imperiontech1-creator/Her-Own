# Deploy Her Own to Netlify (Doppler-first)

**One source of truth: Doppler.** Netlify gets env vars from Doppler via the integration. No copy-paste.

**Repo:** [imperiontech1-creator/Her-Own](https://github.com/imperiontech1-creator/Her-Own)

---

## 1. Store everything in Doppler

In Doppler (project **her-own**), use one config for Netlify (e.g. **prd** or reuse **dev**). Ensure these keys exist:

| Key | Required | Notes |
|-----|----------|--------|
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Yes | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Yes* | Stripe webhook signing secret (*add after step 3) |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role (required for **admin Orders** page) |
| `HER_OWN_ADMIN_EMAIL` | No | Admin login email |
| `RESEND_API_KEY` | No | Resend API key for “order shipped” and supplier emails |
| `RESEND_FROM` | No* | Sender for Resend (e.g. `Her Own <orders@yourdomain.com>`); *required if using Resend |

The **admin Orders** page at `/admin` needs `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Netlify (or synced from Doppler), and the same Supabase project must have the **`orders`** table (from `supabase-schema.sql`). If either is missing, orders will show "Database error" or "Database not configured" with a Retry button.

Optional: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` if you use them in the app.

---

## 2. Connect Netlify to Git and deploy

1. **[Netlify – Add new site](https://app.netlify.com/start)** → **Import from Git** → **GitHub** → **imperiontech1-creator / Her-Own**.
2. Build: **Build command** `npm run build:ci` (from `netlify.toml`). Publish directory: leave default.
3. **Deploy site.** Wait for the first build. Note the site URL: `https://<your-site>.netlify.app`.

---

## 3. Connect Doppler → Netlify (sync env vars)

1. **Doppler:** [dashboard.doppler.com](https://dashboard.doppler.com) → project **her-own** → **Integrations** (sidebar).
2. Click **Netlify** → **Authorize** (log in to Netlify if prompted).
3. **Select Netlify site** and **Context** (e.g. **Production**).
4. **Select Doppler config** (e.g. **prd** or **dev**) to sync from.
5. Optionally import existing Netlify env vars into Doppler, then **Set Up Integration**.

Secrets sync continuously: change once in Doppler, Netlify gets it. No manual copy.

6. **Trigger a new deploy** in Netlify (Deploys → **Trigger deploy** → **Deploy site**) so the build picks up the synced vars.

---

## 4. Stripe webhook

1. **Stripe Dashboard** → [Developers → Webhooks](https://dashboard.stripe.com/webhooks) → **Add endpoint**.
2. **Endpoint URL:** `https://<your-site>.netlify.app/api/webhooks/stripe`
3. **Events:** `checkout.session.completed` → **Add endpoint**.
4. Copy the **Signing secret** → in **Doppler**, set or update `STRIPE_WEBHOOK_SECRET`. Doppler will sync it to Netlify.
5. In Netlify, **Trigger deploy** again so the new secret is used. (Or push a commit to trigger deploy.)

---

## 5. Quick check

- Open the live site → add to cart → checkout (test card `4242 4242 4242 4242`).
- Confirm order in Supabase and at **/admin** (log in with `HER_OWN_ADMIN_EMAIL`).

---

## One-shot from CLI (after you’re logged in)

From the repo root, in order:

```bash
npx netlify login          # once: open browser, authorize
npx netlify init            # once: create new site or link existing (choose “Create & configure”)
npm run netlify:ship        # export Doppler → .env.netlify, import to Netlify, build & deploy
```

Or step by step: `npm run netlify:env` → `npm run netlify:import` → `npm run netlify:deploy`.

---

## Optional: one-time export (no integration)

If you don’t use the Doppler ↔ Netlify integration, export from Doppler and import into Netlify:

```bash
npm run netlify:env
```

Then in Netlify: **Site settings** → **Environment variables** → **Import from .env** → upload or paste from `.env.netlify`. Do not commit `.env.netlify` (it’s in `.gitignore`).
