"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

/**
 * Catches errors that escape the root layout. Must define its own <html>/<body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("GlobalError", error.message, {
      digest: error.digest,
      name: error.name,
    });
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem" }}>Something went wrong</h1>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>We’ve logged it. Please try again.</p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem 1rem",
            background: "#D4A574",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
