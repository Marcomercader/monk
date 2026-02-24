"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";
import ThemeToggle from "@/components/ThemeToggle";

const GOAL_COLORS = ["#7A8E7C", "#C4A882", "#8B9DC7", "#C4916A", "#9E8AB4"];

export default function GoalsPage() {
  const { goals, addGoal, removeGoal } = useGoals();
  const [newName, setNewName] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addGoal(newName);
      setNewName("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-monk-bg text-monk-text">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-monk-border bg-monk-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-monk-muted hover:text-monk-text transition-colors text-sm cursor-pointer"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              monk
            </motion.button>
          </Link>
          <span className="text-monk-border">|</span>
          <h1 className="text-base font-light tracking-widest text-monk-text lowercase">goals</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center px-6 py-10 max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <p className="text-xs text-monk-muted uppercase tracking-widest mb-6 opacity-70">
            Your ongoing goals
          </p>

          {/* Goal list */}
          <div className="space-y-2.5 mb-8">
            <AnimatePresence>
              {goals.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-monk-muted italic opacity-60 py-6 text-center"
                >
                  No goals yet — add your first one below
                </motion.p>
              )}
              {goals.map((goal, gi) => {
                const color = GOAL_COLORS[gi % GOAL_COLORS.length];
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-center gap-3 px-4 py-3.5 rounded-xl border border-monk-border bg-monk-surface hover:border-monk-accent transition-all"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: color }}
                    />
                    <span className="flex-1 text-sm text-monk-text">{goal.name}</span>
                    <span className="text-xs text-monk-muted opacity-50 mr-1">
                      {new Date(goal.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => removeGoal(goal.id)}
                      className="opacity-0 group-hover:opacity-100 text-monk-muted hover:text-red-400 text-lg leading-none transition-all cursor-pointer"
                      aria-label="Remove goal"
                    >
                      ×
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Add goal form */}
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Add a new goal…"
              maxLength={60}
              className="flex-1 bg-monk-surface text-monk-text placeholder-monk-muted text-sm px-4 py-3 rounded-xl border border-monk-border focus:outline-none focus:border-monk-accent transition-colors"
            />
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="submit"
              disabled={!newName.trim()}
              className="px-5 py-3 bg-monk-accent text-white rounded-xl text-sm font-medium disabled:opacity-40 transition-opacity cursor-pointer"
            >
              +
            </motion.button>
          </form>

          {/* Link to rate */}
          {goals.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <Link href="/rate">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-sm text-monk-muted hover:text-monk-accent transition-colors cursor-pointer underline underline-offset-4"
                >
                  Rate how you did today →
                </motion.button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
