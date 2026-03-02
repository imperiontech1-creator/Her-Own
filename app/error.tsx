"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("ErrorBoundary", error.message, {
      digest: error.digest,
      name: error.name,
    });
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <p className="text-lg font-medium text-text">Something went wrong.</p>
      <p className="mt-2 text-sm text-text/70">We’ve logged it. Try again, or see our Policy page for contact information if this keeps happening.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <a href="/policy">Policy & contact</a>
        </Button>
      </div>
    </div>
  );
}
