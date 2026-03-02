import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Policy & Returns | Her Own",
  description: "Age requirement, returns, and privacy policy for Her Own.",
};

export default function PolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 py-12 pb-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-text">Policy & returns</h1>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-text">Age requirement</h2>
            <p className="mt-2 text-text/80">
              You must be 21 years or older to purchase from Her Own. By placing an order, you confirm that you meet this requirement.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-text">Returns</h2>
            <p className="mt-2 text-text/80">
              We want you to be completely satisfied. Unopened, unused items in original packaging may be returned within 30 days of delivery for a refund. Contact us at the email provided in your order confirmation to start a return. Opened or used intimate wellness products cannot be returned for hygiene reasons.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-text">Shipping</h2>
            <p className="mt-2 text-text/80">
              We ship discreetly in plain packaging with no indication of contents. Free discreet shipping on orders of $69 or more. Tracking is provided once your order ships.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-text">Privacy</h2>
            <p className="mt-2 text-text/80">
              Your data is never sold or shared for marketing. We use your email only for order confirmation, shipping updates, and optional product updates. Payment is processed securely by Stripe; we do not store card numbers.
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
