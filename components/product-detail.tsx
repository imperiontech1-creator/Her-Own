"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDollars } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { Shield } from "lucide-react";

export function ProductDetail({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-square overflow-hidden rounded-2xl border border-white/40 bg-blush/20 backdrop-blur-sm"
            >
              {!imgError && product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blush/40 to-rose-gold/20 text-6xl font-semibold text-rose-gold/70">
                  {product.shortName.charAt(0)}
                </div>
              )}
              {product.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-rose-gold px-3 py-1 text-sm font-medium text-white">
                  {product.badge}
                </span>
              )}
            </motion.div>

            <div className="flex flex-col">
              <p className="text-sm font-medium uppercase tracking-wide text-rose-gold">
                {product.category}
              </p>
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-2 font-heading text-3xl font-bold text-text md:text-4xl"
              >
                {product.name}
              </motion.h1>
              <p className="mt-2 text-xl font-semibold text-rose-gold">
                {formatDollars(product.price)}
              </p>
              {product.bestFor && (
                <p className="mt-2 text-sm text-text/70">Best for: {product.bestFor}</p>
              )}
              <p className="mt-4 text-text/80">{product.description}</p>
              <Card className="mt-6 border-rose-gold/20 bg-blush/10">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-text/90">
                    {product.clinicalCopy}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-rose-gold">
                    <Shield className="h-4 w-4" />
                    <span>Clinically proven</span>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 flex flex-col gap-3">
                <Button
                  size="lg"
                  className="sticky bottom-20 z-30 w-full md:bottom-6 md:mt-auto"
                  onClick={() =>
                    addItem({
                      productId: product.id,
                      slug: product.slug,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    })
                  }
                >
                  Claim Yours
                </Button>
                <p className="text-center text-xs text-text/60">
                  Free discreet shipping on orders $69+
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
