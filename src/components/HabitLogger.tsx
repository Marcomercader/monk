"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabits } from "@/hooks/useHabits";

export default function HabitLogger() {
  const { habits, addHabit, removeHabit, toggleCompletion, isCompleted } =
    useHabits();
  const [newHabit, setNewHabit] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      addHabit(newHabit);
      setNewHabit("");
    }
  };

  const handleRemove = (id: string) => {
    setRemoving(id);
    setTimeout(() => {
      removeHabit(id);
      setRemoving(null);
    }, 200);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      {/* Panel header */}
      <div className="mb-5">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-monk-muted mb-1">
          Daily Practice
        </h2>
        <p className="text-xs text-monk-muted opacity-70">{today}</p>
      </div>

      {/* Habit list */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        <AnimatePresence>
          {habits.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-monk-muted italic opacity-60 py-4 text-center"
            >
              Add your first practice below
            </motion.p>
          )}

          {habits.map((habit) => {
            const done = isCompleted(habit.id);
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{
                  opacity: removing === habit.id ? 0 : 1,
                  x: removing === habit.id ? -8 : 0,
                }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-monk-surface transition-colors"
              >
                {/* Checkbox */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => toggleCompletion(habit.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                    done
                      ? "border-monk-accent bg-monk-accent"
                      : "border-monk-border bg-transparent"
                  }`}
                  aria-label={`Toggle ${habit.name}`}
                >
                  {done && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      viewBox="0 0 12 12"
                      width="10"
                      height="10"
                    >
                      <path
                        d="M2 6 L5 9 L10 3"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </motion.svg>
                  )}
                </motion.button>

                {/* Habit name */}
                <span
                  className={`flex-1 text-sm transition-all ${
                    done
                      ? "line-through text-monk-muted opacity-60"
                      : "text-monk-text"
                  }`}
                >
                  {habit.name}
                </span>

                {/* Remove button — visible on hover */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => handleRemove(habit.id)}
                  className="opacity-0 group-hover:opacity-100 text-monk-muted hover:text-red-400 transition-all text-lg leading-none cursor-pointer"
                  aria-label={`Remove ${habit.name}`}
                >
                  ×
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add habit form */}
      <form onSubmit={handleAdd} className="mt-4 pt-4 border-t border-monk-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a practice…"
            maxLength={50}
            className="flex-1 bg-monk-surface text-monk-text placeholder-monk-muted text-sm px-3 py-2 rounded-lg border border-monk-border focus:outline-none focus:border-monk-accent transition-colors"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={!newHabit.trim()}
            className="px-3 py-2 bg-monk-accent text-white rounded-lg text-sm font-medium disabled:opacity-40 transition-opacity cursor-pointer"
          >
            +
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
