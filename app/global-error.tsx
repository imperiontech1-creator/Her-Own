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
      <body style={{ fontFamily: "system-ui", padding: "2rem", textAlign: "center", background: "#F8E1E9", color: "#333", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ fontSize: "1.5rem" }}>Her Own – Something went wrong</h1>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>We’ve logged it. Please try again or see our Policy page for contact information.</p>
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            type="button"
            onClick={reset}
            style={{
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
          <a
            href="/policy"
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              color: "#333",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              textDecoration: "none",
            }}
          >
            Policy & contact
          </a>
        </div>
      </body>
    </html>
  );
}
