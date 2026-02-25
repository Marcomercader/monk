"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LandscapeBackground from "@/components/LandscapeBackground";
import MonkAvatar from "@/components/MonkAvatar";
import GoalPanel from "@/components/GoalPanel";
import OshoPanel from "@/components/OshoPanel";
import ThemeToggle from "@/components/ThemeToggle";
import { getDailyQuote } from "@/data/quotes";

export default function Home() {
  const [oshoOpen, setOshoOpen] = useState(false);
  const quote = getDailyQuote();

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-[#0d1e36]">
      {/* ── MOUNTAIN LANDSCAPE ── */}
      <LandscapeBackground />

      {/* ── TOP BAR ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-20">
        {/* Brand */}
        <span className="text-lg font-light tracking-[0.3em] text-white/60 lowercase select-none">
          monk
        </span>

        {/* Right: theme + Osho */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.18)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOshoOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 hover:text-white text-sm transition-all cursor-pointer backdrop-blur-sm"
          >
            <span>☯</span>
            <span className="hidden sm:inline font-light tracking-wide">Osho</span>
          </motion.button>
        </div>
      </div>

      {/* ── LEFT FLOATING PANEL ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10 hidden md:block"
      >
        <GoalPanel />
      </motion.div>

      {/* ── CENTER AVATAR ── */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <MonkAvatar />
      </div>

      {/* ── BOTTOM QUOTE ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-0 left-0 right-0 z-10 px-8 pb-8 text-center"
      >
        {/* gradient fade so quote sits legibly over the dark foreground */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none rounded-none" />
        <div className="relative">
          <p className="text-xl sm:text-2xl md:text-3xl font-light italic text-white/80 leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="mt-3 text-sm text-white/45 tracking-widest font-light">
            — {quote.author}
          </p>
        </div>
      </motion.div>

      {/* ── MOBILE: bottom Goals button ── */}
      <div className="md:hidden absolute bottom-32 left-4 z-10">
        <motion.a
          href="/goals"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-sm backdrop-blur-sm"
        >
          🎯 Goals
        </motion.a>
      </div>

      {/* ── OSHO DRAWER ── */}
      <OshoPanel isOpen={oshoOpen} onClose={() => setOshoOpen(false)} />
    </div>
  );
}
