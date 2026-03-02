"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { formatDollars } from "@/lib/utils";
import { PRODUCTS } from "@/lib/products";

function ProductThumb({ name }: { name: string }) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blush/50 to-rose-gold/20 text-lg font-semibold text-rose-gold/80">
      {name.charAt(0)}
    </div>
  );
}

const FREE_SHIPPING_THRESHOLD = 69;

function CartDrawerContent() {
  const { items, closeCart, updateQuantity, removeItem, totalCents, totalItems } =
    useCartStore();
  const totalDollars = totalCents() / 100;
  const needsMore = Math.max(0, FREE_SHIPPING_THRESHOLD - totalDollars);

  const upsells = PRODUCTS.filter(
    (p) => !items.some((i) => i.productId === p.id)
  ).slice(0, 3);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-rose-gold/20 p-4">
        <h2 className="text-lg font-semibold text-text">Your bag</h2>
        <button
          onClick={closeCart}
          className="rounded-lg p-2 hover:bg-blush/50"
          aria-label="Close cart"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <p className="py-8 text-center text-text/70">Your bag is empty.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => {
              const product = PRODUCTS.find((p) => p.id === item.productId);
              return (
                <li
                  key={item.productId}
                  className="flex gap-3 rounded-xl border border-white/40 bg-white/40 p-3 backdrop-blur-sm"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-blush/30">
                    <ProductThumb name={item.name} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text truncate">{item.name}</p>
                    <p className="text-sm text-rose-gold">
                      {formatDollars(item.price)} × {item.quantity}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="rounded p-1 hover:bg-blush/50"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="rounded p-1 hover:bg-blush/50"
                      >
                        <Plus className="h-3.5 w-3.5" />
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
        )}

        {items.length > 0 && (
          <div className="mt-4 rounded-xl border border-rose-gold/20 bg-blush/20 p-4">
            {needsMore > 0 ? (
              <p className="text-sm text-text/80">
                Add {formatDollars(needsMore)} more for{" "}
                <strong>free discreet shipping</strong>.
              </p>
            ) : (
              <p className="text-sm font-medium text-rose-gold">
                You get free discreet shipping.
              </p>
            )}
          </div>
        )}

        {upsells.length > 0 && items.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-text/80">
              You might also like
            </p>
            <ul className="space-y-2">
              {upsells.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.slug}`}
                    onClick={closeCart}
                    className="flex gap-3 rounded-lg border border-white/40 bg-white/30 p-2 backdrop-blur-sm hover:bg-blush/30"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-blush/30">
                      <ProductThumb name={p.name} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{p.shortName}</p>
                      <p className="text-xs text-rose-gold">
                        {formatDollars(p.price)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {items.length > 0 && (
        <div className="border-t border-rose-gold/20 p-4 safe-bottom">
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-text/80">Subtotal</span>
            <span className="font-medium">{formatDollars(totalDollars)}</span>
          </div>
          <Link href="/checkout" onClick={closeCart}>
            <Button className="w-full" size="lg">
              Checkout
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md rounded-l-2xl border-l border-white/40 bg-white/80 shadow-2xl backdrop-blur-xl"
          >
            <CartDrawerContent />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
