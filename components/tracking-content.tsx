"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Package, Truck, CheckCircle } from "lucide-react";

type ShippingAddress = {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

type Order = {
  id: string;
  email: string;
  status: string;
  total_cents: number;
  tracking_number: string | null;
  tracking_carrier: string | null;
  created_at: string;
  shipping_address?: ShippingAddress | null;
};

export function TrackingContent({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/tracking?sessionId=${encodeURIComponent(orderId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setOrder(data.order ?? null);
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderId]);

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
            <p className="mt-2 text-sm text-text/60">
              Use the link from your confirmation email, or enter your order ID.
            </p>
            <Link href="/" className="mt-6 inline-block">
              <Button>Back to home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const steps = [
    { key: "paid", label: "Order confirmed", icon: CheckCircle },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Package },
  ];
  const statusOrder = ["pending", "paid", "shipped", "delivered"];
  const currentIdx = statusOrder.indexOf(order.status);

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 py-8 pb-24">
        <div className="mx-auto max-w-lg">
          <h1 className="text-2xl font-bold text-text">Order status</h1>
          <p className="mt-1 text-sm text-text/70">
            Order placed {new Date(order.created_at).toLocaleDateString()}
          </p>

          <div className="mt-8 rounded-xl border border-white/40 bg-white/50 p-6 backdrop-blur-sm">
            <div className="flex justify-between gap-4">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const done = currentIdx >= statusOrder.indexOf(s.key);
                return (
                  <div key={s.key} className="flex flex-1 flex-col items-center">
                    <div
                      className={`rounded-full p-2 ${done ? "bg-rose-gold/20 text-rose-gold" : "bg-blush/30 text-text/50"}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className={`mt-2 text-xs font-medium ${done ? "text-text" : "text-text/60"}`}>
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-4 text-center text-sm font-medium text-text">
            Status: {order.status}
          </p>

          {order.shipping_address && (order.shipping_address.name || order.shipping_address.line1 || order.shipping_address.city) && (
            <div className="mt-6 rounded-xl border border-white/40 bg-white/40 p-4">
              <p className="text-sm font-medium text-text">Ship to</p>
              <p className="mt-1 text-text/80">
                {[order.shipping_address.name, order.shipping_address.line1, order.shipping_address.line2, [order.shipping_address.city, order.shipping_address.state, order.shipping_address.postal_code].filter(Boolean).join(", "), order.shipping_address.country].filter(Boolean).join(" · ")}
              </p>
            </div>
          )}

          {order.tracking_number && (
            <div className="mt-6 rounded-xl border border-rose-gold/20 bg-blush/20 p-4">
              <p className="text-sm font-medium text-text">Tracking</p>
              <p className="mt-1 text-text/80">
                {order.tracking_carrier} — {order.tracking_number}
              </p>
              <a
                href={`https://www.google.com/search?q=track+${order.tracking_carrier}+${order.tracking_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-rose-gold hover:underline"
              >
                Track package →
              </a>
            </div>
          )}

          <Link href="/" className="mt-8 block">
            <Button variant="outline" className="w-full">
              Continue shopping
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
