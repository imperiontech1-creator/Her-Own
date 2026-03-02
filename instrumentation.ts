/**
 * Runs once when the Node server starts (dev and production).
 * Use for env validation and startup logs.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("./lib/env");
    validateEnv();
  }
}
