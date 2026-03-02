"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "I finally feel in control of my pleasure. The quality is unmatched.",
    author: "A.T.",
  },
  {
    quote: "Discreet shipping, premium feel, and it actually works.",
    author: "M.R.",
  },
  {
    quote: "This changed how I understand my body.",
    author: "K.L.",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-rose-gold/20 bg-white/50 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-10 text-center font-heading text-2xl font-bold text-text">
          Real Experiences
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-white/40 bg-white/60 p-6 backdrop-blur-sm"
            >
              <div className="flex gap-1 text-rose-gold">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm font-medium italic text-text/90">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-2 text-xs text-text/60">– {t.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
