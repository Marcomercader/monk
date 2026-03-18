"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LandscapeBackground from "@/components/LandscapeBackground";
import MonkAvatar from "@/components/MonkAvatar";
import OshoPanel from "@/components/OshoPanel";


// How far the monk lifts above the ground bar per stage (negative = up)
const STAGE_LIFT: Record<1|2|3|4|5, number> = {
  1: 12,    // standing on ground — small push down to close gap in SVG viewBox
  2: 0,     // sitting on ground
  3: -40,   // slight hover
  4: -200,  // halfway up
  5: -400,  // center of screen
};

export default function Home() {
  const [oshoOpen, setOshoOpen] = useState(false);
  const [score, setScore] = useState(3);

  useEffect(() => {
    const saved = localStorage.getItem("monk_score");
    if (saved) setScore(parseInt(saved));

    const handler = (e: Event) => {
      setScore((e as CustomEvent).detail.score);
    };
    window.addEventListener("monk_score_change", handler);
    return () => window.removeEventListener("monk_score_change", handler);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-white cursor-pointer" onClick={() => setOshoOpen(true)}>
      {/* ── MOUNTAIN LANDSCAPE ── */}
      <LandscapeBackground />

      {/* ── TOP BAR ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-20">
        <span className="text-lg font-light tracking-[0.3em] text-black/35 lowercase select-none">
          monk
        </span>
      </div>

      {/* ── MONK — position rises with score ── */}
      <motion.div
        className="absolute left-0 right-0 flex justify-center items-end z-10 pointer-events-none"
        style={{ bottom: "calc(100vh / 13)" }}
        animate={{ y: STAGE_LIFT[score as 1|2|3|4|5] ?? 0 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      >
        <MonkAvatar score={score} />
      </motion.div>

      {/* ── GROUND ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black" style={{ height: "calc(100vh / 13)" }} />

{/* ── OSHO DRAWER ── */}
      <OshoPanel isOpen={oshoOpen} onClose={() => setOshoOpen(false)} />
    </div>
  );
}
