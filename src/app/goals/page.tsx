"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";
import ThemeToggle from "@/components/ThemeToggle";
import { GoalCategory } from "@/types";

const CATEGORY_CONFIG: Array<{
  key: GoalCategory;
  label: string;
  max: number;
  tracked?: boolean;
  placeholder?: string;
}> = [
  { key: "physical",  label: "Physical",   max: 4 },
  { key: "mental",    label: "Mental",     max: 4 },
  { key: "financial", label: "Financial",  max: 4 },
  { key: "spiritual", label: "Spiritual",  max: 4 },
  { key: "social",    label: "Social",     max: 4 },
  { key: "academics", label: "Academics",  max: 4 },
  {
    key: "bad_habit",
    label: "Bad Habits",
    max: 4,
    tracked: true,
    placeholder: "A habit you want to break…",
  },
];

export default function GoalsPage() {
  const { goals, addGoal, removeGoal } = useGoals();

  const [expanded, setExpanded] = useState<Set<GoalCategory>>(new Set());
  const [inputs, setInputs] = useState<Partial<Record<GoalCategory, string>>>({});
  const [mainInput, setMainInput] = useState("");

  const mainGoal = goals.find(g => g.category === "main");
  const getGoals = (cat: GoalCategory) => goals.filter(g => g.category === cat);

  const toggle = (cat: GoalCategory) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });

  const handleAddMain = (e: React.FormEvent) => {
    e.preventDefault();
    const text = mainInput.trim();
    if (!text || mainGoal) return;
    addGoal(text, "main");
    setMainInput("");
  };

  const handleAdd = (e: React.FormEvent, cat: GoalCategory, max: number) => {
    e.preventDefault();
    const text = (inputs[cat] ?? "").trim();
    if (!text || getGoals(cat).length >= max) return;
    addGoal(text, cat);
    setInputs(prev => ({ ...prev, [cat]: "" }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-monk-bg text-monk-text">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-monk-border bg-monk-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/">
            <motion.span
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-monk-muted hover:text-monk-text transition-colors text-sm cursor-pointer"
            >
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              monk
            </motion.span>
          </Link>
          <span className="text-monk-border text-xs">|</span>
          <h1 className="text-base font-light tracking-widest lowercase">goals</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-8 flex flex-col gap-6">

        {/* ── ONE MAIN GOAL ── */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-monk-muted mb-3">
            one main goal
          </h2>

          {mainGoal ? (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-monk-border bg-monk-surface"
            >
              <span className="text-base text-monk-text leading-snug">{mainGoal.name}</span>
              <button
                onClick={() => removeGoal(mainGoal.id)}
                className="text-monk-muted hover:text-red-400 text-xl leading-none transition-colors cursor-pointer ml-4 flex-shrink-0"
                aria-label="Remove main goal"
              >
                ×
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleAddMain} className="flex gap-2">
              <input
                value={mainInput}
                onChange={e => setMainInput(e.target.value)}
                placeholder="What is your north star right now?"
                maxLength={80}
                className="flex-1 bg-monk-surface text-monk-text placeholder-monk-muted px-4 py-3 rounded-xl border border-monk-border focus:outline-none focus:border-monk-accent transition-colors"
                style={{ fontSize: "16px" }}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!mainInput.trim()}
                className="px-4 py-3 bg-monk-accent text-white rounded-xl text-sm disabled:opacity-40 cursor-pointer"
              >
                set
              </motion.button>
            </form>
          )}
        </section>

        {/* ── CATEGORY SECTIONS ── */}
        <div className="flex flex-col">
          {CATEGORY_CONFIG.map(({ key, label, max, tracked, placeholder }, idx) => {
            const catGoals = getGoals(key);
            const isOpen   = expanded.has(key);
            const atMax    = catGoals.length >= max;
            const inputVal = inputs[key] ?? "";
            const isLast   = idx === CATEGORY_CONFIG.length - 1;

            return (
              <div key={key}>
                {/* Section header */}
                <button
                  onClick={() => toggle(key)}
                  className="w-full flex items-center justify-between py-3.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold tracking-widest uppercase text-monk-muted">
                      {label}
                    </span>
                    {tracked && (
                      <span
                        className="text-[9px] tracking-widest uppercase border rounded px-1.5 py-0.5"
                        style={{ color: "var(--monk-accent)", borderColor: "var(--monk-accent)", opacity: 0.7 }}
                      >
                        tracked
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-monk-muted opacity-50">
                      {catGoals.length}/{max}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-monk-muted text-base leading-none"
                    >
                      ›
                    </motion.span>
                  </div>
                </button>

                {/* Collapsible content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-2 pb-4">
                        <AnimatePresence>
                          {catGoals.map(goal => (
                            <motion.div
                              key={goal.id}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -6, height: 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-monk-border bg-monk-surface"
                            >
                              <span className="text-sm text-monk-text">{goal.name}</span>
                              <button
                                onClick={() => removeGoal(goal.id)}
                                className="text-monk-muted hover:text-red-400 text-xl leading-none transition-colors cursor-pointer ml-3 flex-shrink-0"
                                aria-label={`Remove ${goal.name}`}
                              >
                                ×
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {!atMax ? (
                          <form
                            onSubmit={e => handleAdd(e, key, max)}
                            className="flex gap-2"
                          >
                            <input
                              value={inputVal}
                              onChange={e =>
                                setInputs(prev => ({ ...prev, [key]: e.target.value }))
                              }
                              placeholder={placeholder ?? "Add a goal…"}
                              maxLength={60}
                              className="flex-1 bg-monk-surface text-monk-text placeholder-monk-muted px-3 py-2.5 rounded-xl border border-monk-border focus:outline-none focus:border-monk-accent transition-colors"
                              style={{ fontSize: "16px" }}
                            />
                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              type="submit"
                              disabled={!inputVal.trim()}
                              className="px-3 py-2.5 bg-monk-accent text-white rounded-xl text-sm disabled:opacity-40 cursor-pointer"
                            >
                              +
                            </motion.button>
                          </form>
                        ) : (
                          <p className="text-[11px] text-monk-muted opacity-50 px-1">
                            Max {max} reached
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isLast && (
                  <div className="border-b border-monk-border/40" />
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
