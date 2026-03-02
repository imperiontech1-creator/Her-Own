"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, Users } from "lucide-react";

const stats = [
  { value: "78%", label: "satisfaction" },
  { value: "Free", label: "discreet shipping over $50" },
  { value: "10K+", label: "women" },
];

function haptic() {
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-8 md:pb-24 md:pt-16">
      <div className="mx-auto max-w-4xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-block rounded-full border border-rose-gold/50 bg-rose-gold/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-rose-gold"
        >
          Rose Gold
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-2 mt-3 text-sm font-medium uppercase tracking-widest text-rose-gold"
        >
          #1 Women&apos;s Choice
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-4xl font-bold tracking-tight text-text md:text-5xl lg:text-6xl"
        >
          Her Rose Therapy — $29
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-4 max-w-xl text-lg text-text/80"
        >
          78% satisfaction, discreet shipping, free over $50. Clinically trusted for wellness and comfort.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.span
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
            className="inline-block"
          >
            <Link href="/products/her-rose-therapy">
              <Button
                size="lg"
                className="gap-2 bg-rose-gold text-white hover:bg-rose-gold/90"
                onClick={haptic}
              >
                Claim Yours
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.span>
          <Link href="/products">
            <Button variant="outline" size="lg" onClick={haptic}>
              View Both
            </Button>
          </Link>
          <Link href="/quiz" className="text-sm text-rose-gold hover:underline">
            Find your match →
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-8"
        >
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              {i === 0 && <Shield className="h-5 w-5 text-rose-gold" />}
              {i === 1 && <Truck className="h-5 w-5 text-rose-gold" />}
              {i === 2 && <Users className="h-5 w-5 text-rose-gold" />}
              <span className="font-semibold text-text">{s.value}</span>
              <span className="text-text/70">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
