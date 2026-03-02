"use client";

import { Shield, Truck, Lock } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "10K+ Women",
    text: "Trust Her Own for discreet, body-safe wellness.",
  },
  {
    icon: Truck,
    title: "Discreet Shipping Certified",
    text: "Plain packaging. No labels. Free shipping on orders over $50.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    text: "Your data is protected. Your privacy is respected.",
  },
];

export function TrustBadges() {
  return (
    <section className="border-t border-rose-gold/20 bg-blush/20 px-4 py-12" id="why">
      <h2 className="mb-8 text-center font-heading text-2xl font-bold text-text">
        Why Choose Her Own
      </h2>
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-8">
        {badges.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex max-w-[200px] items-start gap-3 rounded-xl border border-white/40 bg-white/40 p-4 backdrop-blur-sm"
          >
            <div className="rounded-lg bg-rose-gold/20 p-2">
              <Icon className="h-5 w-5 text-rose-gold" />
            </div>
            <div>
              <p className="font-semibold text-text">{title}</p>
              <p className="mt-0.5 text-sm text-text/70">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
