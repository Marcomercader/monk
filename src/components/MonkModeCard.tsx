"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";

function getDaysOnApp(): number {
  const key = "monk_first_visit";
  const stored = localStorage.getItem(key);
  const today = new Date().toISOString().split("T")[0];
  if (!stored) {
    localStorage.setItem(key, today);
    return 1;
  }
  const start = new Date(stored);
  const now = new Date(today);
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

export default function MonkModeCard() {
  const { goals, getLongTermProgress } = useGoals();
  const [days, setDays] = useState(1);

  useEffect(() => {
    setDays(getDaysOnApp());
  }, []);

  const score =
    goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + getLongTermProgress(g.id), 0) / goals.length)
      : 0;

  const barColor =
    score >= 70 ? "#7a8e7c" : score >= 40 ? "#c4a882" : "#b07070";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-monk-surface border border-monk-border rounded-2xl shadow-sm px-5 py-4 w-48 flex flex-col gap-3"
    >
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-monk-muted uppercase">
          Monk Mode
        </p>
        <p className="text-2xl font-light text-monk-text mt-0.5">
          Day <span className="font-semibold">{days}</span>
        </p>
      </div>

      {/* Score */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-monk-muted">Overall</span>
          <span className="text-xs font-semibold text-monk-text">{score}/100</span>
        </div>
        <div className="h-1.5 rounded-full bg-monk-border overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: barColor }}
          />
        </div>
      </div>

    </motion.div>
  );
}
