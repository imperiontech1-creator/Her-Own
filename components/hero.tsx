"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, Users } from "lucide-react";

const stats = [
  { value: "10K+", label: "women empowered" },
  { value: "Free", label: "discreet shipping $69+" },
  { value: "Clinically", label: "proven" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-8 md:pb-24 md:pt-16">
      <div className="mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-sm font-medium uppercase tracking-widest text-rose-gold"
        >
          Premium intimate wellness for women
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-4xl font-bold tracking-tight text-text md:text-5xl lg:text-6xl"
        >
          Stronger pleasure. Deeper body awareness. Total control.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-4 max-w-xl text-lg text-text/80"
        >
          Clinically tested products designed to help you reconnect with your body — safely, privately, and confidently. Over 10,000 women already trust Her Own.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/products/her-pulse-therapy">
            <Button size="lg" className="gap-2">
              Shop Bestsellers
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
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
              {i === 0 && <Users className="h-5 w-5 text-rose-gold" />}
              {i === 1 && <Truck className="h-5 w-5 text-rose-gold" />}
              {i === 2 && <Shield className="h-5 w-5 text-rose-gold" />}
              <span className="font-semibold text-text">{s.value}</span>
              <span className="text-text/70">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
