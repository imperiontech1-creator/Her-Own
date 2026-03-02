"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { formatDollars } from "@/lib/utils";
import { PRODUCTS } from "@/lib/products";
import { Minus, Plus } from "lucide-react";

const FREE_SHIPPING = 69;

function ProductThumb({ name }: { name: string }) {
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blush/50 to-rose-gold/20 text-lg font-semibold text-rose-gold/80">
      {name.charAt(0)}
    </div>
  );
}

export function CartPageContent() {
  const { items, updateQuantity, removeItem, totalCents } = useCartStore();
  const total = totalCents() / 100;
  const needsMore = Math.max(0, FREE_SHIPPING - total);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-text">Your bag is empty</h1>
        <p className="mt-2 text-text/70">Add something you love.</p>
        <Link href="/#products" className="mt-6 inline-block">
          <Button>Shop products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-text">Your bag</h1>
      <ul className="mt-6 space-y-4">
        {items.map((item) => {
          const product = PRODUCTS.find((p) => p.id === item.productId);
          return (
            <li
              key={item.productId}
              className="flex gap-4 rounded-xl border border-white/40 bg-white/50 p-4 backdrop-blur-sm"
            >
              <ProductThumb name={item.name} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-text">{item.name}</p>
                <p className="text-sm text-rose-gold">
                  {formatDollars(item.price)} × {item.quantity}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="rounded p-1 hover:bg-blush/50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="rounded p-1 hover:bg-blush/50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="ml-2 text-xs text-text/60 hover:text-rose-gold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 rounded-xl border border-rose-gold/20 bg-blush/20 p-4">
        {needsMore > 0 ? (
          <p className="text-sm text-text/80">
            Add {formatDollars(needsMore)} more for free discreet shipping.
          </p>
        ) : (
          <p className="text-sm font-medium text-rose-gold">
            You get free discreet shipping.
          </p>
        )}
      </div>
      <div className="mt-6 flex justify-between text-lg font-semibold">
        <span>Subtotal</span>
        <span>{formatDollars(total)}</span>
      </div>
      <Link href="/checkout" className="mt-6 block">
        <Button size="lg" className="w-full">
          Checkout
        </Button>
      </Link>
    </div>
  );
}
