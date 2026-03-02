"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "her_own_age_verified";

export function AgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setVerified(stored === "true");
    } catch {
      setVerified(false);
    }
  }, []);

  const confirm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
      setVerified(true);
    } catch {
      setVerified(true);
    }
  };

  if (verified === null) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-sm">
        <div className="h-12 w-48 animate-skeleton rounded-lg bg-blush/40" />
      </div>
    );
  }

  if (verified) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/98 p-4 backdrop-blur-md">
      <div className="max-w-md rounded-2xl border border-rose-gold/20 bg-white/80 p-8 text-center shadow-xl backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-text">Welcome to Her Own</h2>
        <p className="mt-2 text-text/80">
          You must be 21 or older to enter this site. By entering, you confirm that you are of legal age.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button size="lg" className="w-full" onClick={confirm}>
            I am 21 or older
          </Button>
          <a
            href="https://www.google.com"
            className="text-sm text-text/60 hover:text-rose-gold"
          >
            I am not 21 yet
          </a>
        </div>
      </div>
    </div>
  );
}
