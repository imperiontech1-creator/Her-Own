"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { getProductBySlug } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDollars } from "@/lib/utils";

export function StarterBundleSection() {
  const bundle = getProductBySlug("starter-bundle");
  const addItem = useCartStore((s) => s.addItem);

  if (!bundle) return null;

  return (
    <section className="border-t border-rose-gold/20 bg-blush/20 px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-2 text-center font-heading text-2xl font-bold text-text">
          Starter Bundle
        </h2>
        <p className="mb-8 text-center text-sm text-text/70">Save 10%</p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden border-rose-gold/30">
            <CardContent className="p-6">
              <p className="font-heading text-lg font-semibold text-text">
                {bundle.name}
              </p>
              <p className="mt-1 text-sm text-text/80">{bundle.tagline}</p>
              <p className="mt-3 text-text/70">{bundle.description}</p>
              <p className="mt-4 text-xl font-semibold text-rose-gold">
                Bundle Price: {formatDollars(bundle.price)}
              </p>
              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={() =>
                  addItem({
                    productId: bundle.id,
                    slug: bundle.slug,
                    name: bundle.name,
                    price: bundle.price,
                    image: bundle.image,
                  })
                }
              >
                Add Bundle to Bag
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
