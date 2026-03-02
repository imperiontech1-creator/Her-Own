import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/cart-drawer";
import { CartPageContent } from "@/components/cart-page-content";
import { Footer } from "@/components/footer";

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-32">
        <CartPageContent />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
