# Deploy Her Own to Netlify

**Repo:** [imperiontech1-creator/Her-Own](https://github.com/imperiontech1-creator/Her-Own)

## 1. Connect and deploy

1. Go to **[Netlify – Add new site](https://app.netlify.com/start)** (or **Add site** → **Import an existing project**).
2. Choose **GitHub** → authorize if prompted → select **imperiontech1-creator / Her-Own**.
3. Build settings (from `netlify.toml`):
   - **Build command:** `npm run build:ci`
   - **Publish directory:** leave default (Next.js is auto-detected).
4. Click **Deploy site**. Wait for the first build.

## 2. Environment variables

After the first deploy:

1. **Site settings** → **Environment variables** → **Add a variable** (or **Import from .env**).
2. Add these (same as in Doppler):

   | Variable | Notes |
   |----------|--------|
   | `STRIPE_SECRET_KEY` | Stripe secret key |
   | `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key |
   | `STRIPE_WEBHOOK_SECRET` | From Stripe after adding webhook (step 3) |
   | `SUPABASE_URL` | Supabase project URL |
   | `SUPABASE_ANON_KEY` | Supabase anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role |
   | `HER_OWN_ADMIN_EMAIL` | Optional – admin login email |

3. **Trigger a new deploy** (Deploys → **Trigger deploy** → **Deploy site**) so the build uses the new env.

## 3. Stripe webhook

1. Note your site URL: `https://<your-site-name>.netlify.app`.
2. **Stripe Dashboard** → [Developers → Webhooks](https://dashboard.stripe.com/webhooks) → **Add endpoint**.
3. **Endpoint URL:** `https://<your-site-name>.netlify.app/api/webhooks/stripe`
4. **Events:** `checkout.session.completed`.
5. Copy the **Signing secret** → in Netlify add or update `STRIPE_WEBHOOK_SECRET` → trigger a new deploy.

## 4. Quick check

- Open the live site → add to cart → checkout with test card `4242 4242 4242 4242`.
- Confirm order appears in Supabase and at `/admin` (log in with `HER_OWN_ADMIN_EMAIL`).

Done.
