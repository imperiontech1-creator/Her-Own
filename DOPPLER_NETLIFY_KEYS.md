# Doppler keys for Netlify

Single source of truth for what Netlify needs. Store these in Doppler (project **her-own**, config e.g. **prd** or **dev**); sync to Netlify via [Doppler → Netlify integration](https://docs.doppler.com/docs/netlify).

| Doppler key | Required | Used by |
|------------|----------|--------|
| `STRIPE_SECRET_KEY` | Yes | Checkout, webhook |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Yes | Client Stripe.js |
| `STRIPE_WEBHOOK_SECRET` | Yes | Webhook signature verification |
| `SUPABASE_URL` | Yes | Server Supabase client |
| `SUPABASE_ANON_KEY` | Yes | Server Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Admin/orders, webhook |
| `HER_OWN_ADMIN_EMAIL` | No | Admin login, optional supplier notify |

Optional (if used in app): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

No other env vars are needed for Netlify build or runtime.
