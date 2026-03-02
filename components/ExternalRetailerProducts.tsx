"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const RETAILER_ITEMS = [
  {
    url: "https://shoplelieu.com/products/vibe",
    title: "Vibe",
    retailer: "Shop L'Elieu",
    category: "vibe",
    productId: "ext-shoplelieu-vibe",
    skuHint: "vibe",
  },
  {
    url: "https://www.bloomingdales.com/shop/product/maude-vibe-personal-massager?ID=4016669",
    title: "Maude Vibe Personal Massager",
    retailer: "Bloomingdale's",
    category: "vibe",
    productId: "ext-bloomingdales-maude-vibe",
    skuHint: "4016669",
  },
  {
    url: "https://www.walmart.com/ip/Dame-Products-Aer-Suction-Massager-Women-5-Intensity-Levels-5-Pattern-Modes-Soft-Seal-Suction-Pulses-Air-Release-Powerful-Strokes-Papaya-Color/1539122321",
    title: "Dame Aer Suction Massager",
    retailer: "Walmart",
    category: "vibe",
    productId: "ext-walmart-dame-aer",
    skuHint: "1539122321",
  },
  {
    url: "https://www.goodvibes.com/p/GV46218/1337763/aer-clitoral-stimulator-by-dame/periwinkle",
    title: "Aer Clitoral Stimulator by Dame",
    retailer: "Good Vibrations",
    category: "vibe",
    productId: "ext-goodvibes-dame-aer",
    skuHint: "GV46218",
  },
  {
    url: "https://www.goodvibes.com/p/GV19857/1210877/verge-vibrating-ring-by-we-vibe",
    title: "Verge Vibrating Ring by We-Vibe",
    retailer: "Good Vibrations",
    category: "ring",
    productId: "ext-goodvibes-verge",
    skuHint: "GV19857",
  },
  {
    url: "https://www.target.com/p/good-clean-love-bionude-ultra-sensitive-personal-lube-3oz/-/A-79140773",
    title: "Good Clean Love BioNude Ultra Sensitive Lube",
    retailer: "Target",
    category: "lube",
    productId: "ext-target-gcl-bionude",
    skuHint: "A-79140773",
  },
  {
    url: "https://www.walmart.com/ip/Good-Clean-Love-BioNude-Ultra-Sensitive-Personal-Lubricant-3-oz/415770219",
    title: "Good Clean Love BioNude Personal Lubricant",
    retailer: "Walmart",
    category: "lube",
    productId: "ext-walmart-gcl-bionude",
    skuHint: "415770219",
  },
];

export function ExternalRetailerProducts() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {RETAILER_ITEMS.map((item) => (
        <a
          key={item.productId}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          data-product-id={item.productId}
          data-retailer={item.retailer}
          data-category={item.category}
          data-source-url={item.url}
          data-sku-hint={item.skuHint}
          className="block transition hover:shadow-xl"
        >
          <Card className="overflow-hidden h-full">
            <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-blush/30">
              <div
                className={cn(
                  "flex h-full w-full items-center justify-center bg-gradient-to-br from-blush/50 to-rose-gold/20 text-2xl font-semibold text-rose-gold/80"
                )}
                aria-hidden
              >
                {item.title.charAt(0)}
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-rose-gold">
                {item.retailer}
              </p>
              <h3 className="mt-1 font-heading font-semibold text-text line-clamp-2">
                {item.title}
              </h3>
              <span className="mt-3 inline-block rounded-full bg-rose-gold/20 px-3 py-1 text-xs font-medium text-rose-gold">
                View at retailer
              </span>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
