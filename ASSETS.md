# Static assets – prevent 404s

**Rule:** Any reference to the app icon or favicon must use the path that actually exists. Do not use `/icon`; the app serves the icon at **`/icon.svg`** only.

## Single source of truth

- **`lib/constants.ts`** defines `APP_ICON_PATH = "/icon.svg"` and `MANIFEST_PATH = "/manifest.json"`.
- Use these in layout and anywhere we link to the icon or manifest.

## Where icon/manifest are used

| File | What to use |
|------|-------------|
| `app/layout.tsx` | `APP_ICON_PATH`, `MANIFEST_PATH` from `@/lib/constants` |
| `public/manifest.json` | `"src": "/icon.svg"` (must be `/icon.svg`, not `/icon`) |
| `next.config.ts` | Redirect `favicon.ico` → `/icon.svg` (comment there explains why) |

## Checklist before adding new icon/favicon references

- [ ] Use `APP_ICON_PATH` from `lib/constants.ts`, or hardcode `/icon.svg` if constants aren’t available (e.g. in JSON).
- [ ] Never use `/icon` (no extension) — it 404s.
- [ ] After changing manifest or layout, run the app and confirm no 404s for `/icon`, `/icon.svg`, or `/favicon.ico` in the browser console.

## Files that must exist

- `app/icon.svg` – app icon (Next serves it at `/icon.svg`).
- `public/manifest.json` – PWA manifest; must reference `/icon.svg` in `icons[].src`.

## Homepage marketing images

- `public/images/seamless-body-safe.png` – Body-safe design section (BodySafeSection).
- `public/images/prioritize-pleasure.png` – Prioritize pleasure banner (PrioritizePleasureBanner).

Served at `/images/seamless-body-safe.png` and `/images/prioritize-pleasure.png`. Replace with final brand assets when ready.

## Product images

Product images live under **`public/products/`**. Paths are set in `lib/products.ts` (each product has an `image` field). The UI shows the image when it loads; if the file is missing or fails to load, it falls back to a gradient with the product initial. Add files with these names to show real product photos:

- `pulse.png`, `ring.png`, `lube.png`, `bundle.png`, `quiet.png`, `silk-ring.png`, `hydrate.png`, `bullet.png`, `wave.png`, `duo-ring.png`, `silk-touch.png`, `bullet-plus.png`, `bliss.png`, `snap-ring.png`, `aroma-free.png`, `bullet-touch.png`

Or use a CDN: set `image` in `lib/products.ts` to the full URL and add the domain to `next.config.ts` `images.remotePatterns`.

## Optional (currently not required)

- `public/favicon.ico` – not used; `/favicon.ico` redirects to `/icon.svg`.
- `public/icons/icon-192.png`, `icon-512.png` – optional PNGs for PWA; manifest currently uses the SVG.
