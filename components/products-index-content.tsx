"use client";

import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export function ProductsIndexContent() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-6 font-heading text-2xl font-bold text-text">
        All Products
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}
