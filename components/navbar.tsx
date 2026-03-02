"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = () => useCartStore.setState((s) => ({ isCartOpen: !s.isCartOpen }));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/40 bg-white/70 backdrop-blur-md safe-top">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center transition opacity-90 hover:opacity-100" aria-label="Her Own home">
          <Image src="/logo/wordmark-black.svg" alt="HER OWN" width={120} height={22} className="h-[22px] w-auto" priority />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/policy"
            className="text-sm text-text/80 hover:text-rose-gold hidden sm:inline"
          >
            Policy
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            className="relative"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-gold text-[10px] font-medium text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Button>
        </div>
      </nav>
    </header>
  );
}
