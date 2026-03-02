import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/cart-drawer";
import { CheckoutForm } from "@/components/checkout-form";
import { Footer } from "@/components/footer";

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24">
        <CheckoutForm />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
