"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";
import ThemeToggle from "@/components/ThemeToggle";

const GOAL_COLORS = ["#7EC8A0", "#F0C870", "#88B0E8", "#F09880", "#C0A0E8"];

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function displayDate(key: string): string {
  return parseDate(key).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

interface DotRatingProps {
  rating: number | null;
  onRate: (n: number) => void;
  color: string;
}

function DotRating({ rating, onRate, color }: DotRatingProps) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n}
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.2 }}
          onClick={() => onRate(n)}
          aria-label={`Rate ${n}`}
          className="cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle
              cx="10" cy="10" r="7"
              fill={rating !== null && rating >= n ? color : "none"}
              stroke={color}
              strokeWidth="1.8"
            />
          </svg>
        </motion.button>
      ))}
      <span className="text-xs text-monk-muted ml-1 w-8">
        {rating !== null ? `${rating}/5` : "—"}
      </span>
    </div>
  );
}

export default function GoalsPage() {
  const {
    goals, ratings,
    addGoal, removeGoal,
    setRating, getRatingForDate,
    getLongTermProgress,
    setNote, getNoteForDate,
  } = useGoals();

  const todayKey = formatDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [noteText, setNoteText] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");

  // Sync note textarea when date changes
  useEffect(() => {
    setNoteText(getNoteForDate(selectedDate));
    setNoteSaved(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const isToday = selectedDate === todayKey;

  const shiftDate = (delta: number) => {
    const d = parseDate(selectedDate);
    d.setDate(d.getDate() + delta);
    // Don't go into the future
    if (formatDateKey(d) <= todayKey) {
      setSelectedDate(formatDateKey(d));
    }
  };

  const handleSaveNote = () => {
    setNote(selectedDate, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalName.trim()) {
      addGoal(newGoalName);
      setNewGoalName("");
    }
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

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-8 flex flex-col gap-8">

        {/* ── DATE NAVIGATION ── */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => shiftDate(-1)}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-monk-border text-monk-muted hover:text-monk-text hover:border-monk-accent transition-all cursor-pointer text-sm"
            >
              ‹
            </motion.button>
            <p className="text-sm font-medium text-monk-text">
              {displayDate(selectedDate)}
              {isToday && (
                <span className="ml-2 text-xs text-monk-accent font-normal">today</span>
              )}
            </p>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => shiftDate(1)}
              disabled={isToday}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-monk-border text-monk-muted hover:text-monk-text hover:border-monk-accent transition-all cursor-pointer text-sm disabled:opacity-30 disabled:cursor-default"
            >
              ›
            </motion.button>
          </div>
          <p className="text-xs text-monk-muted opacity-60">
            Navigate to any past date to review or update your ratings
          </p>
        </div>

        {/* ── RATE GOALS ── */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-monk-muted mb-4">
            Rate your progress
          </h2>

          {goals.length === 0 ? (
            <p className="text-sm text-monk-muted italic opacity-60 py-4 text-center">
              Add goals below to start tracking
            </p>
          ) : (
            <div className="space-y-3">
              {goals.map((goal, gi) => {
                const color = GOAL_COLORS[gi % GOAL_COLORS.length];
                const todayRating = getRatingForDate(goal.id, selectedDate);
                const longPct = getLongTermProgress(goal.id);
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.05 }}
                    className="flex flex-col gap-2 px-4 py-3.5 rounded-xl border border-monk-border bg-monk-surface"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className="text-sm text-monk-text truncate">{goal.name}</span>
                      </div>
                      <span className="text-xs text-monk-muted opacity-60 flex-shrink-0">
                        {longPct}% overall
                      </span>
                    </div>
                    <DotRating
                      rating={todayRating}
                      onRate={(r) => setRating(goal.id, selectedDate, r)}
                      color={color}
                    />
                    {/* Mini progress bar */}
                    <div className="h-1 bg-monk-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${longPct}%`, background: color }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── NOTES ── */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-monk-muted mb-3">
            Notes for this day
          </h2>
          <textarea
            value={noteText}
            onChange={(e) => { setNoteText(e.target.value); setNoteSaved(false); }}
            placeholder="How did this day go? What did you notice, feel, or learn…"
            rows={4}
            className="w-full bg-monk-surface text-monk-text placeholder-monk-muted text-sm px-4 py-3 rounded-xl border border-monk-border focus:outline-none focus:border-monk-accent transition-colors resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-2">
            <AnimatePresence>
              {noteSaved && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-monk-accent"
                >
                  Saved ✓
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveNote}
              disabled={!noteText.trim()}
              className="ml-auto px-4 py-1.5 bg-monk-accent text-white text-xs rounded-lg disabled:opacity-40 transition-opacity cursor-pointer"
            >
              Save note
            </motion.button>
          </div>
        </section>

        {/* ── MANAGE GOALS ── */}
        <section className="border-t border-monk-border pt-6">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-monk-muted mb-4">
            Manage goals
          </h2>

          <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="Add a new goal…"
              maxLength={60}
              className="flex-1 bg-monk-surface text-monk-text placeholder-monk-muted text-sm px-4 py-2.5 rounded-xl border border-monk-border focus:outline-none focus:border-monk-accent transition-colors"
            />
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="submit"
              disabled={!newGoalName.trim()}
              className="px-4 py-2.5 bg-monk-accent text-white rounded-xl text-sm font-medium disabled:opacity-40 transition-opacity cursor-pointer"
            >
              +
            </motion.button>
          </form>

          <div className="space-y-2">
            <AnimatePresence>
              {goals.map((goal, gi) => {
                const color = GOAL_COLORS[gi % GOAL_COLORS.length];
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-center gap-3 px-4 py-2.5 rounded-xl border border-monk-border bg-monk-surface hover:border-monk-accent/50 transition-all"
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="flex-1 text-sm text-monk-text">{goal.name}</span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => removeGoal(goal.id)}
                      className="opacity-0 group-hover:opacity-100 text-monk-muted hover:text-red-400 text-lg leading-none transition-all cursor-pointer"
                    >
                      ×
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
