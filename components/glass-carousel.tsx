"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CARD_WIDTH = 280;
const GAP = 16;

export function GlassCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(
      el.scrollLeft < el.scrollWidth - el.clientWidth - 1
    );
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -(CARD_WIDTH + GAP) : CARD_WIDTH + GAP,
      behavior: "smooth",
    });
  };

  const bestsellers = ["her-pulse-therapy", "her-rhythm-ring", "her-daily-essential"];
  const featured = PRODUCTS.filter((p) => bestsellers.includes(p.slug));

  return (
    <section className="relative px-4 py-12" id="products">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 font-heading text-2xl font-bold text-text">
          Our Bestselling Collection
        </h2>
        <div className="relative">
          {canScrollLeft && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full shadow-lg"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full shadow-lg"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth py-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featured.map((product, i) => (
              <div
                key={product.id}
                className="shrink-0"
                style={{ width: CARD_WIDTH }}
              >
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
