import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { ProductsIndexContent } from "@/components/products-index-content";

export default function ProductsIndexPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-32">
        <ProductsIndexContent />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
