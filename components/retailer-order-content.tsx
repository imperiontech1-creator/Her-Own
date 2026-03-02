"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

type ShippingAddress = {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

type OrderItem = { productId?: string; quantity?: number; price?: number; name?: string };

type Order = {
  id: string;
  email: string;
  status: string;
  total_cents: number;
  tracking_number: string | null;
  tracking_carrier: string | null;
  created_at: string;
  shipping_address?: ShippingAddress | null;
  items?: OrderItem[];
};

export function RetailerOrderContent({ sessionId }: { sessionId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/tracking?sessionId=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setOrder(data.order ?? null);
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen px-4 py-16">
          <div className="mx-auto max-w-lg animate-pulse space-y-4 rounded-xl border border-white/40 bg-white/40 p-6">
            <div className="h-6 w-1/2 rounded bg-blush/40" />
            <div className="h-4 w-3/4 rounded bg-blush/30" />
            <div className="h-4 w-1/2 rounded bg-blush/30" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen px-4 py-16">
          <div className="mx-auto max-w-lg text-center">
            <p className="text-text/80">{error || "Order not found."}</p>
            <p className="mt-2 text-sm text-text/60">This link may be invalid or the order may have been removed.</p>
            <Link href="/" className="mt-6 inline-block">
              <Button>Back to home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const addr = order.shipping_address;
  const shipToLine =
    addr && (addr.name || addr.line1 || addr.city)
      ? [addr.name, addr.line1, addr.line2, [addr.city, addr.state, addr.postal_code].filter(Boolean).join(", "), addr.country].filter(Boolean).join(" · ")
      : null;
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 py-8 pb-24">
        <div className="mx-auto max-w-lg">
          <h1 className="text-2xl font-bold text-text">Retailer order</h1>
          <p className="mt-1 text-sm text-text/70">Order placed {new Date(order.created_at).toLocaleDateString()}</p>

          <div className="mt-6 rounded-xl border border-white/40 bg-white/50 p-6 backdrop-blur-sm space-y-4">
            <p className="text-sm font-medium text-text">Status: {order.status}</p>
            <p className="text-sm text-text/80">Email: {order.email}</p>
            <p className="text-sm text-text/80">Total: ${(order.total_cents / 100).toFixed(2)}</p>
            {items.length > 0 && (
              <div>
                <p className="text-sm font-medium text-text mb-2">Line items</p>
                <ul className="list-disc list-inside text-sm text-text/80 space-y-1">
                  {items.map((i, idx) => (
                    <li key={idx}>{`${i.quantity ?? 1} × ${i.name ?? "Item"}`}</li>
                  ))}
                </ul>
              </div>
            )}
            {shipToLine && (
              <div>
                <p className="text-sm font-medium text-text">Ship to</p>
                <p className="text-sm text-text/80 mt-1">{shipToLine}</p>
              </div>
            )}
            {order.tracking_number && (
              <p className="text-sm text-text/80">
                Tracking: {order.tracking_carrier} — {order.tracking_number}
              </p>
            )}
          </div>

          <Link href="/" className="mt-8 block">
            <Button variant="outline" className="w-full">
              Back to home
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
