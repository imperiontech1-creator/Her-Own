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
              You must be 21 years or older to purchase from Her Own. By placing an order, you confirm that you meet this requirement and that you are of legal age in your location.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-text">Returns</h2>
            <p className="mt-2 text-text/80">
              We want you to be completely satisfied. Unopened, unused items in original packaging may be returned within 30 days of delivery for a refund. Opened or used intimate wellness products cannot be returned for hygiene reasons. Defective items may be eligible for replacement within 60 days of delivery; clear photo or video documentation is required so we can review and confirm the issue.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-text">Shipping</h2>
            <p className="mt-2 text-text/80">
              We ship discreetly in plain packaging with no indication of contents. Orders ship via USPS First Class where available (typical delivery 2–5 business days). Free discreet shipping is offered on orders of $50 or more. Tracking is provided once your order ships, and you should inspect your order upon delivery. For damage claims, a clear unboxing video recorded within 24 hours of delivery helps us investigate and support a replacement. Due to state-level restrictions, we are currently unable to ship to Alabama (AL) or Mississippi (MS).
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-text">Payments & chargebacks</h2>
            <p className="mt-2 text-text/80">
              All payments are processed securely by our payment provider and may include standard industry processing fees. If you have a concern about a charge, contact us by email so we can review and assist. Unauthorized or repeated chargebacks, instead of working with us directly, may result in a permanent account ban and may be referred to collections in line with our processor&apos;s policies.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-text">Support & defects</h2>
            <p className="mt-2 text-text/80">
              For any questions, concerns, or support, email us at{" "}
              <a href="mailto:imperiontech1@gmail.com" className="text-rose-gold hover:underline">
                imperiontech1@gmail.com
              </a>
              . We aim to respond within 48 hours. If your item arrives defective, email clear photos or video within 48 hours of delivery so we can review. For damage that occurs in transit, an unboxing video recorded within 24 hours of delivery is strongly recommended. Approved replacements ship as soon as possible; in some cases a return of the original item may be required.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-text">Privacy</h2>
            <p className="mt-2 text-text/80">
              Your data is never sold or shared for marketing. We use your email only for order confirmation, shipping updates, and optional product updates. Payment is processed securely by Stripe; we do not store card numbers.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-text">Agreement to terms</h2>
            <p className="mt-2 text-text/80">
              By completing a purchase on Her Own, you confirm that you have read and agree to all policies on this page, including age requirement, returns, shipping, payments, chargebacks, and support.
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
