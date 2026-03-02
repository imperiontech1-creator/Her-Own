import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/cart-drawer";
import { FreeShipBar } from "@/components/free-ship-bar";
import { Hero } from "@/components/hero";
import { TrustBadges } from "@/components/trust-badges";
import { BodySafeSection } from "@/components/body-safe-section";
import { VideoCarousel } from "@/components/video-carousel";
import { GlassCarousel } from "@/components/glass-carousel";
import { ExternalRetailerProducts } from "@/components/ExternalRetailerProducts";
import { StarterBundleSection } from "@/components/starter-bundle-section";
import { PrioritizePleasureBanner } from "@/components/prioritize-pleasure-banner";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <FreeShipBar />
        <Hero />
        <TrustBadges />
        <VideoCarousel />
        <BodySafeSection />
        <GlassCarousel />
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 font-heading text-2xl font-bold text-text">
              Retailer matches
            </h2>
            <ExternalRetailerProducts />
          </div>
        </section>
        <StarterBundleSection />
        <PrioritizePleasureBanner />
        <Testimonials />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
