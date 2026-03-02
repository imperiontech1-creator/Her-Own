"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDollars } from "@/lib/utils";

function ProductImage({ product }: { product: Product }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-blush/30">
      <div
        className="h-full w-full bg-gradient-to-br from-blush/50 to-rose-gold/20 flex items-center justify-center text-2xl font-semibold text-rose-gold/80"
        aria-hidden
      >
        {product.shortName.charAt(0)}
      </div>
      {product.badge && (
        <span className="absolute right-2 top-2 rounded-full bg-rose-gold px-2 py-0.5 text-xs font-medium text-white">
          {product.badge}
        </span>
      )}
    </div>
  );
}

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden transition hover:shadow-xl">
        <Link href={`/products/${product.slug}`}>
          <CardContent className="p-0">
            <ProductImage product={product} />
            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-rose-gold">
                {product.category}
              </p>
              <h3 className="mt-1 font-heading font-semibold text-text">{product.name}</h3>
              <p className="mt-0.5 line-clamp-2 text-sm text-text/70">
                {product.tagline}
              </p>
              {product.bestFor && (
                <p className="mt-1 text-xs text-text/60">Best for: {product.bestFor}</p>
              )}
              <p className="mt-2 font-semibold text-rose-gold">
                {formatDollars(product.price)}
              </p>
            </div>
          </CardContent>
        </Link>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              addItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
              });
            }}
          >
            Add to Bag
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
