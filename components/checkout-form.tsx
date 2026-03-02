"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDollars } from "@/lib/utils";

const HONEYPOT_NAME = "website_url";

export function CheckoutForm() {
  const router = useRouter();
  const { items, totalCents, clearCart } = useCartStore();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cart`,
          email: email || undefined,
        }),
      });
      let data: { error?: string; url?: string; sessionId?: string };
      try {
        data = await res.json();
      } catch {
        setError("Something went wrong. Try again.");
        return;
      }
      if (!res.ok) throw new Error(data?.error || "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.sessionId) {
        router.push(`/checkout/success?session_id=${data.sessionId}`);
        return;
      }
      throw new Error("No redirect URL");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-text/80">Loading...</p>
      </div>
    );
  }

  const total = totalCents() / 100;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-text">Checkout</h1>
      <p className="mt-1 text-sm text-text/70">
        You’ll complete payment securely on the next step. Your statement will show “Her Own Wellness Item”.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-xl border border-white/40 bg-white/50 p-4 backdrop-blur-sm">
          <h2 className="font-semibold text-text">Order summary</h2>
          <ul className="mt-2 space-y-1 text-sm text-text/80">
            {items.map((i) => (
              <li key={i.productId}>
                {i.name} × {i.quantity} — {formatDollars(i.price * i.quantity)}
              </li>
            ))}
          </ul>
          <p className="mt-3 font-semibold text-text">
            Total — {formatDollars(total)}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (for order updates)</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="hidden" aria-hidden>
          <Label htmlFor={HONEYPOT_NAME}>Leave blank</Label>
          <Input
            id={HONEYPOT_NAME}
            name={HONEYPOT_NAME}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Redirecting..." : "Continue to payment"}
        </Button>
      </form>
    </div>
  );
}
