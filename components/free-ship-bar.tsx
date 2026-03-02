"use client";

import { Truck } from "lucide-react";
import { useCartStore } from "@/lib/store";

const FREE_SHIPPING_THRESHOLD = 50;

export function FreeShipBar() {
  const totalCents = useCartStore((s) => s.totalCents());
  const totalDollars = totalCents / 100;
  const needsMore = Math.max(0, FREE_SHIPPING_THRESHOLD - totalDollars);

  return (
    <div className="border-b border-rose-gold/20 bg-blush/30 px-4 py-2">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 text-sm text-text/90">
        <Truck className="h-4 w-4 text-rose-gold" />
        <span>
          {needsMore > 0
            ? `You're $${needsMore.toFixed(0)} away from free discreet shipping`
            : "You've unlocked free discreet shipping"}
        </span>
      </div>
    </div>
  );
}
