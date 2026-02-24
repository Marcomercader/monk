"use client";

import { motion } from "framer-motion";
import { getDailyQuote } from "@/data/quotes";

export default function QuoteOfDay() {
  const quote = getDailyQuote();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="border-t border-monk-border bg-monk-surface px-6 py-4"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <p className="text-sm text-monk-muted italic leading-relaxed">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="text-xs text-monk-warm whitespace-nowrap sm:ml-6 sm:text-right">
          — {quote.author}
        </p>
      </div>
    </motion.footer>
  );
}
