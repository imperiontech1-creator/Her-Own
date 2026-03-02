"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export function PrioritizePleasureBanner() {
  const [imgError, setImgError] = useState(false);
  return (
    <section className="border-t border-rose-gold/20 bg-blush/20 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            href="/products"
            className="block overflow-hidden rounded-2xl border border-white/40 bg-white/20 shadow-lg backdrop-blur-sm transition hover:shadow-xl"
          >
            <div className="relative aspect-[3/4] w-full min-h-[320px] sm:aspect-[2/1] sm:min-h-[280px]">
              {!imgError ? (
                <Image
                  src="/images/prioritize-pleasure.png"
                  alt="Prioritize your pleasure — Celebrate your health with science-backed wellness. Discover Her Own."
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                  priority={false}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blush/40 to-rose-gold/20" aria-hidden />
              )}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-6 sm:p-10">
                <p className="text-sm font-medium uppercase tracking-widest text-white/90 sm:text-base">
                  Science-backed wellness
                </p>
                <h2 className="mt-1 font-heading text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                  Prioritize your pleasure
                </h2>
                <span className="mt-4 inline-flex h-11 items-center rounded-lg bg-rose-gold px-6 font-medium text-white">
                  Discover Her Own
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
