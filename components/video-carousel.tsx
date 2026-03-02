"use client";

import { motion } from "framer-motion";

/** TikTok-style video carousel — placeholder for supplier video. */
export function VideoCarousel() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 font-heading text-2xl font-bold text-text text-center">
          See Her Rose Therapy
        </h2>
        <div className="flex gap-4 overflow-x-auto scroll-smooth py-2 scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative h-72 w-64 shrink-0 overflow-hidden rounded-xl border border-rose-gold/20 bg-blush/20 flex items-center justify-center"
            >
              <span className="text-sm text-text/60">Supplier video placeholder {i}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
