"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const OPTIONS = [
  { value: "beginner", label: "Beginner — first time or want something gentle", slug: "her-rose-therapy" },
  { value: "experienced", label: "Experienced — want a backup or travel option", slug: "her-pulse-essential" },
];

export function QuizContent() {
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const choice = OPTIONS.find((o) => o.value === selected);
  const productUrl = choice ? `/products/${choice.slug}` : "/products";

  const handleSelect = (value: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
    setSelected(value);
    setDone(true);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 font-heading text-2xl font-bold text-text"
      >
        Find your match
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8 text-text/80"
      >
        One quick question — we&apos;ll recommend the best fit.
      </motion.p>

      {!done ? (
        <>
          <p className="mb-4 font-medium text-text">Which describes you?</p>
          <div className="space-y-3">
            {OPTIONS.map((opt) => (
              <motion.div
                key={opt.value}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card
                  className={`cursor-pointer border-2 transition-colors ${
                    selected === opt.value ? "border-rose-gold bg-blush/20" : "border-white/40 hover:border-rose-gold/50"
                  }`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <CardContent className="p-4">{opt.label}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-rose-gold/20 bg-blush/10 p-6"
        >
          <p className="font-semibold text-text">We recommend:</p>
          <p className="mt-1 text-text/80">
            {choice?.value === "beginner"
              ? "Her Rose Therapy — #1 women's choice, perfect for beginners."
              : "Her Pulse Essential — great backup or travel option."}
          </p>
          <Link href={productUrl} className="mt-6 block">
            <Button className="w-full bg-rose-gold text-white hover:bg-rose-gold/90">
              Claim Yours
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
