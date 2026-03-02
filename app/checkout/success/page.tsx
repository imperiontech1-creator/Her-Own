import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { SuccessContent } from "@/components/success-content";

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24">
        <Suspense fallback={<div className="mx-auto max-w-lg px-4 py-16 text-center text-text/70">Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
