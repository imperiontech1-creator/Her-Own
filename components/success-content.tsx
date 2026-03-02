"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";

export function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    if (sessionId) clearCart();
  }, [sessionId, clearCart]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-text">Thank you</h1>
      <p className="mt-2 text-text/80">
        {sessionId
          ? "Your order is confirmed. We’ll email you a receipt and tracking when it ships. Your statement will show “Her Own Wellness Item”."
          : "Your order is confirmed. Check your email for your order confirmation and tracking link. Your statement will show “Her Own Wellness Item”."}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {sessionId && (
          <Link href={`/tracking/${encodeURIComponent(sessionId)}`}>
            <Button variant="outline">Track order</Button>
          </Link>
        )}
        <Link href="/">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}
