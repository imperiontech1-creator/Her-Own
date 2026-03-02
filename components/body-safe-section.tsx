"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function BodySafeSection() {
  const [imgError, setImgError] = useState(false);
  return (
    <section className="border-t border-rose-gold/20 bg-blush/20 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl border border-white/40 bg-white/30 shadow-lg backdrop-blur-md"
        >
          <div className="grid min-h-[280px] grid-cols-1 items-center gap-0 md:grid-cols-2">
            <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[320px]">
              {!imgError ? (
                <Image
                  src="/images/seamless-body-safe.png"
                  alt="Seamless body-safe design — zero crevices for total hygiene"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={false}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blush/40 to-rose-gold/20" aria-hidden />
              )}
            </div>
            <div className="flex flex-col justify-center px-6 py-10 md:px-10">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-text md:text-3xl">
                Seamless body-safe design
              </h2>
              <p className="mt-3 text-text/80">
                Zero crevices for total hygiene. A fluid, clinical design for your purest sensations.
              </p>
              <Link href="/products" className="mt-6 inline-block">
                <Button variant="outline" className="border-rose-gold/40 text-rose-gold hover:bg-rose-gold/10">
                  Explore products
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
