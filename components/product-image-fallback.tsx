"use client";

import type { Product } from "@/lib/products";

/** Rose icon: soft petal silhouette for Her Rose Therapy fallback when no image. */
function RoseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <circle cx="32" cy="34" r="10" fill="currentColor" opacity="0.2" />
      <ellipse cx="32" cy="28" rx="10" ry="12" fill="currentColor" opacity="0.35" />
      <ellipse cx="26" cy="24" rx="6" ry="8" fill="currentColor" opacity="0.4" transform="rotate(-20 26 24)" />
      <ellipse cx="38" cy="24" rx="6" ry="8" fill="currentColor" opacity="0.4" transform="rotate(20 38 24)" />
      <ellipse cx="32" cy="20" rx="7" ry="9" fill="currentColor" opacity="0.5" />
      <circle cx="32" cy="18" r="4" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

/** Pulse icon: simple wave for Her Pulse Essential fallback. */
function PulseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <path d="M12 32 L24 20 L32 32 L40 44 L52 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <circle cx="32" cy="32" r="12" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export function ProductImageFallback({ product, size = "detail" }: { product: Product; size?: "card" | "detail" }) {
  const isRose = product.slug === "her-rose-therapy";
  const initial = product.shortName.charAt(0);
  const iconSize = size === "detail" ? "w-24 h-24" : "w-12 h-12";
  const textSize = size === "detail" ? "text-5xl md:text-6xl" : "text-2xl";

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center ${isRose ? "animate-rose-shine bg-gradient-to-br from-[#f8e1e9] via-[#e8c4d0] to-[#d4a574]" : "bg-gradient-to-br from-blush/50 via-[#e8d4dc] to-rose-gold/30"}`}
      aria-hidden
    >
      {isRose ? (
        <>
          <RoseIcon className={`${iconSize} text-rose-gold/90 drop-shadow-sm`} />
          <span className={`mt-1 font-heading font-semibold tracking-tight text-rose-gold/90 ${textSize}`}>{initial}</span>
        </>
      ) : (
        <>
          <PulseIcon className={`${iconSize} text-rose-gold/70`} />
          <span className={`mt-1 font-heading font-semibold text-rose-gold/80 ${textSize}`}>{initial}</span>
        </>
      )}
    </div>
  );
}
