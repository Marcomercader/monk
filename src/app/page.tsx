"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LandscapeBackground from "@/components/LandscapeBackground";
import MonkAvatar from "@/components/MonkAvatar";
import GoalPanel from "@/components/GoalPanel";
import OshoPanel from "@/components/OshoPanel";
import ThemeToggle from "@/components/ThemeToggle";
import { getDailyQuote } from "@/data/quotes";

function RightCard({
  icon, label, sub, onClick,
}: {
  icon: string; label: string; sub: string; onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.16)" }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/8 border border-white/12 backdrop-blur-lg shadow-xl text-left cursor-pointer transition-all"
    >
      <span className="text-3xl leading-none flex-shrink-0">{icon}</span>
      <div>
        <p className="text-sm font-medium text-white/90 tracking-wide">{label}</p>
        <p className="text-xs text-white/40 mt-0.5">{sub}</p>
      </div>
    </motion.button>
  );
}

export default function Home() {
  const [oshoOpen, setOshoOpen] = useState(false);
  const [learningsOpen, setLearningsOpen] = useState(false);
  const quote = getDailyQuote();

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-[#0d1e36]">
      {/* ── MOUNTAIN LANDSCAPE ── */}
      <LandscapeBackground />

      {/* ── TOP BAR ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-20">
        <span className="text-lg font-light tracking-[0.3em] text-white/55 lowercase select-none">
          monk
        </span>
        <ThemeToggle />
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

      {/* ── RIGHT PANEL: Osho + Learnings ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col gap-4 w-52"
      >
        <RightCard
          icon="☯"
          label="Osho"
          sub="Chat with the master"
          onClick={() => setOshoOpen(true)}
        />
        <RightCard
          icon="📚"
          label="Learnings"
          sub="Recommended readings"
          onClick={() => setLearningsOpen(true)}
        />
      </motion.div>

      {/* ── BOTTOM QUOTE ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-0 left-0 right-0 z-10 px-8 pb-8 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        <div className="relative">
          <p className="text-xl sm:text-2xl md:text-3xl font-light italic text-white/80 leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="mt-3 text-sm text-white/45 tracking-widest font-light">
            — {quote.author}
          </p>
        </div>
      </motion.div>

      {/* ── MOBILE: bottom pill buttons ── */}
      <div className="md:hidden absolute bottom-32 right-4 z-10 flex flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setOshoOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-sm backdrop-blur-sm cursor-pointer"
        >
          ☯ Osho
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setLearningsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-sm backdrop-blur-sm cursor-pointer"
        >
          📚 Learnings
        </motion.button>
      </div>

      {/* ── OSHO DRAWER ── */}
      <OshoPanel isOpen={oshoOpen} onClose={() => setOshoOpen(false)} />

      {/* ── LEARNINGS DRAWER (placeholder) ── */}
      {learningsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLearningsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-monk-surface border-l border-monk-border shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-monk-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-monk-warm/30 flex items-center justify-center text-lg">
                  📚
                </div>
                <div>
                  <p className="text-sm font-semibold text-monk-text">Learnings</p>
                  <p className="text-xs text-monk-muted">Recommended readings</p>
                </div>
              </div>
              <button
                onClick={() => setLearningsOpen(false)}
                className="p-2 rounded-full text-monk-muted hover:text-monk-text hover:bg-monk-bg transition-all cursor-pointer text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
              <span className="text-5xl opacity-30">📖</span>
              <p className="text-sm text-monk-muted leading-relaxed">
                Personalised reading recommendations are coming soon.
              </p>
              <p className="text-xs text-monk-muted opacity-50">
                Books, essays, and teachings curated to your practice.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </div>
  );
}
