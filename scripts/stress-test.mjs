#!/usr/bin/env node
/**
 * Stress test API routes. Run with server up: npm run dev (or start), then npm run stress-test.
 * Override port: BASE_URL=http://localhost:3002 npm run stress-test
 */
const BASE = process.env.BASE_URL || "http://localhost:3000";
let passed = 0;
let failed = 0;

function ok(name, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}${detail ? ` (${detail})` : ""}`);
    return true;
  }
  failed++;
  console.log(`  ✗ ${name}${detail ? ` - ${detail}` : ""}`);
  return false;
}

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { "Content-Type": "application/json", ...opts.headers } });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  return { res, data };
}

async function preflight() {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(BASE, { signal: controller.signal });
    clearTimeout(t);
    if (res.status !== 200 && res.status !== 503) {
      console.log("\nHer Own · Stress test\n");
      console.log("The server at " + BASE + " returned " + res.status + " (expected 200 or 503).");
      console.log("Start the app (npm run dev), note the port in the output, then run:");
      console.log("  BASE_URL=http://localhost:<port> npm run stress-test\n");
      process.exit(1);
    }
    return true;
  } catch (err) {
    console.log("\nHer Own · Stress test\n");
    const msg = err?.code === "ECONNREFUSED" || err?.code === "ENOTFOUND" || err?.name === "AbortError"
      ? "The server at " + BASE + " is not reachable."
      : "Could not reach " + BASE + ".";
    console.log(msg);
    console.log("Start the app (npm run dev), note the port in the output, then run:");
    console.log("  BASE_URL=http://localhost:<port> npm run stress-test\n");
    process.exit(1);
  }
}

async function run() {
  await preflight();
  console.log("\nStress test · " + BASE + "\n");

  // 1. Admin login – invalid JSON → 400
  const r1 = await fetch(`${BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "not json",
  });
  ok("Admin login invalid JSON → 400", r1.status === 400, `got ${r1.status}`);

  // 2. Admin login – wrong email → 401
  const { res: r2 } = await fetchJson(`${BASE}/api/admin/login`, {
    method: "POST",
    body: JSON.stringify({ email: "wrong@example.com" }),
  });
  ok("Admin login wrong email → 401", r2.status === 401, `got ${r2.status}`);

  // 3. Admin orders GET – no auth → 401
  const { res: r3 } = await fetchJson(`${BASE}/api/admin/orders`);
  ok("Admin orders GET no auth → 401", r3.status === 401, `got ${r3.status}`);

  // 4. Admin orders GET – weird params (should not 500)
  const { res: r4, data: d4 } = await fetchJson(`${BASE}/api/admin/orders?page=-1&limit=0&sort=invalid`);
  ok("Admin orders GET bad params no 500", r4.status === 401, "no auth so 401; would be 200 with auth");
  ok("Admin orders GET bad params safe", r4.status < 500, `got ${r4.status}`);

  // 5. Admin orders PATCH – no auth → 401 (we don't send cookie; route returns 401 before body)
  const r5 = await fetch(`${BASE}/api/admin/orders`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: "not json",
  });
  ok("Admin orders PATCH no auth → 401", r5.status === 401, `got ${r5.status}`);

  // 6. Admin orders PATCH – no auth → 401 (body never parsed); or with auth missing orderId → 400
  const { res: r6 } = await fetchJson(`${BASE}/api/admin/orders`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
  ok("Admin orders PATCH no auth or bad body → 401 or 400", r6.status === 401 || r6.status === 400, `got ${r6.status}`);

  // 7. Checkout – invalid JSON → 400 (or 503 if Stripe not configured)
  const r7 = await fetch(`${BASE}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "not json",
  });
  ok("Checkout invalid JSON → 400 or 503", r7.status === 400 || r7.status === 503, `got ${r7.status}`);

  // 8. Checkout – no valid items → 400 (after rate limit and stripe check)
  const { res: r8 } = await fetchJson(`${BASE}/api/checkout`, {
    method: "POST",
    body: JSON.stringify({ items: [] }),
  });
  ok("Checkout empty items → 400 or 503", r8.status === 400 || r8.status === 503, `got ${r8.status}`);

  // 9. Notify-supplier – invalid JSON → 400
  const r9 = await fetch(`${BASE}/api/notify-supplier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "not json",
  });
  ok("Notify-supplier invalid JSON → 400 or 401", r9.status === 400 || r9.status === 401, `got ${r9.status}`);

  // 10. Notify-supplier – missing to/order → 400 (or 401 if HER_OWN_NOTIFY_SECRET set)
  const { res: r10 } = await fetchJson(`${BASE}/api/notify-supplier`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  ok("Notify-supplier missing to/order → 400 or 401", r10.status === 400 || r10.status === 401, `got ${r10.status}`);

  // 11. Rate limit – admin login 6 times (same client) → at least one 429
  let login429 = 0;
  for (let i = 0; i < 6; i++) {
    const r = await fetch(`${BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": "127.0.0.1" },
      body: JSON.stringify({ email: "test@test.com" }),
    });
    if (r.status === 429) login429++;
  }
  ok("Rate limit admin login (6 req) → at least one 429", login429 >= 1, `got ${login429} x 429`);

  // 12. Rate limit – checkout 22 times → at least one 429
  let checkout429 = 0;
  const checkoutBody = JSON.stringify({ items: [{ productId: "prod_1", quantity: 1 }] });
  for (let i = 0; i < 22; i++) {
    const r = await fetch(`${BASE}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": "127.0.0.2" },
      body: checkoutBody,
    });
    if (r.status === 429) checkout429++;
  }
  ok("Rate limit checkout (22 req) → at least one 429", checkout429 >= 1, `got ${checkout429} x 429`);

  // 13. Public pages – 200 or 503 (maintenance)
  const r13a = await fetch(`${BASE}/`);
  ok("GET / → 200 or 503", r13a.status === 200 || r13a.status === 503, `got ${r13a.status}`);
  const r13b = await fetch(`${BASE}/products`);
  ok("GET /products → 200", r13b.status === 200, `got ${r13b.status}`);
  const r13c = await fetch(`${BASE}/cart`);
  ok("GET /cart → 200", r13c.status === 200, `got ${r13c.status}`);

  // 14. Tracking API – missing sessionId → 400; or DB not configured → 503
  const { res: r14a } = await fetchJson(`${BASE}/api/tracking`);
  ok("GET /api/tracking no sessionId → 400 or 503", r14a.status === 400 || r14a.status === 503, `got ${r14a.status}`);
  // 15. Tracking API – unknown session → 200 with order:null or 503 (no 500)
  const { res: r14b } = await fetchJson(`${BASE}/api/tracking?sessionId=fake-session-123`);
  ok("GET /api/tracking unknown session no 500", r14b.status < 500, `got ${r14b.status}`);

  console.log("\n---");
  console.log(`Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
