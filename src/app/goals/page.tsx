"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";
import ThemeToggle from "@/components/ThemeToggle";
import { Goal, GoalCategory } from "@/types";

const CATEGORY_LABELS: Record<GoalCategory, string> = {
  main: "One Main Goal",
  physical: "Physical",
  mental: "Mental",
  financial: "Financial",
  spiritual: "Spiritual",
  social: "Social",
  academics: "Academics",
  bad_habit: "Bad Habits",
  uncategorized: "Other",
};

const CATEGORY_COLORS: Record<GoalCategory, string> = {
  main: "#F0C870",
  physical: "#7EC8A0",
  mental: "#88B0E8",
  financial: "#7EC8A0",
  spiritual: "#C0A0E8",
  social: "#F09880",
  academics: "#88B0E8",
  bad_habit: "#E88888",
  uncategorized: "#9E9E9E",
};

const SECTIONS: Array<{ category: GoalCategory; max: number; note?: string }> = [
  { category: "main", max: 1 },
  { category: "physical", max: 4 },
  { category: "mental", max: 4 },
  { category: "financial", max: 4 },
  { category: "spiritual", max: 4 },
  { category: "social", max: 4 },
  { category: "academics", max: 4 },
  { category: "bad_habit", max: 4, note: "Monk tracks your progress on these" },
];

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
  size?: number;
}

function DotRating({ rating, onRate, color, size = 18 }: DotRatingProps) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n}
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.15 }}
          onClick={() => onRate(n)}
          aria-label={`Rate ${n}`}
          className="cursor-pointer"
        >
          <svg width={size} height={size} viewBox="0 0 20 20">
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

interface GoalRowProps {
  goal: Goal;
  color: string;
  selectedDate: string;
  getRatingForDate: (goalId: string, date: string) => number | null;
  setRating: (goalId: string, date: string, rating: number) => void;
  renameGoal: (goalId: string, name: string) => void;
  removeGoal: (goalId: string) => void;
  isMain?: boolean;
}

function GoalRow({
  goal,
  color,
  selectedDate,
  getRatingForDate,
  setRating,
  renameGoal,
  removeGoal,
  isMain = false,
}: GoalRowProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(goal.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const confirmEdit = () => {
    if (editName.trim()) renameGoal(goal.id, editName);
    setEditing(false);
  };

  const rating = getRatingForDate(goal.id, selectedDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -8, height: 0 }}
      transition={{ duration: 0.18 }}
      className={`rounded-xl border bg-monk-surface overflow-hidden ${
        isMain
          ? "border-[#F0C870]/50 shadow-sm"
          : "border-monk-border"
      }`}
    >
      <div className={`flex flex-col gap-2 px-4 ${isMain ? "py-4" : "py-3"}`}>
        {/* Name row */}
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full flex-shrink-0 ${isMain ? "w-3 h-3" : "w-2 h-2"}`}
            style={{ background: color }}
          />
          {editing ? (
            <form
              className="flex-1 flex gap-2"
              onSubmit={(e) => { e.preventDefault(); confirmEdit(); }}
            >
              <input
                ref={inputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={80}
                className="flex-1 bg-monk-bg text-monk-text text-sm px-2 py-0.5 rounded-lg border border-monk-accent focus:outline-none"
              />
              <button type="submit" className="text-monk-accent text-sm cursor-pointer">✓</button>
              <button type="button" onClick={() => setEditing(false)} className="text-monk-muted text-sm cursor-pointer">✕</button>
            </form>
          ) : (
            <span className={`flex-1 text-monk-text ${isMain ? "text-base font-medium" : "text-sm"}`}>
              {goal.name}
            </span>
          )}
          {!editing && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setEditName(goal.name); setEditing(true); }}
                className="text-monk-muted hover:text-monk-text transition-colors cursor-pointer text-base p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Edit goal"
              >
                ✎
              </button>
              <button
                onClick={() => removeGoal(goal.id)}
                className="text-monk-muted hover:text-red-400 text-xl leading-none transition-colors cursor-pointer p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Remove goal"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Rating */}
        <DotRating
          rating={rating}
          onRate={(r) => setRating(goal.id, selectedDate, r)}
          color={color}
          size={isMain ? 20 : 16}
        />

        {/* Progress bar */}
        <div className="h-0.5 bg-monk-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: rating ? `${(rating / 5) * 100}%` : "0%", background: color }}
          />
        </div>
      </div>
    </motion.div>
  );
}

interface CategorySectionProps {
  category: GoalCategory;
  max: number;
  note?: string;
  goals: Goal[];
  selectedDate: string;
  getRatingForDate: (goalId: string, date: string) => number | null;
  setRating: (goalId: string, date: string, rating: number) => void;
  addGoal: (name: string, category: GoalCategory) => void;
  renameGoal: (goalId: string, name: string) => void;
  removeGoal: (goalId: string) => void;
}

function CategorySection({
  category,
  max,
  note,
  goals,
  selectedDate,
  getRatingForDate,
  setRating,
  addGoal,
  renameGoal,
  removeGoal,
}: CategorySectionProps) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const addInputRef = useRef<HTMLInputElement>(null);
  const color = CATEGORY_COLORS[category];
  const label = CATEGORY_LABELS[category];
  const isMain = category === "main";
  const atCapacity = goals.length >= max;

  useEffect(() => {
    if (adding) addInputRef.current?.focus();
  }, [adding]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && !atCapacity) {
      addGoal(newName, category);
      setNewName("");
      setAdding(false);
    }
  };

  return (
    <section
      className={`rounded-2xl border p-4 flex flex-col gap-3 ${
        isMain
          ? "border-[#F0C870]/40 bg-[#F0C870]/5"
          : "border-monk-border bg-monk-surface/40"
      }`}
    >
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full flex-shrink-0 ${isMain ? "w-3 h-3" : "w-2 h-2"}`}
            style={{ background: color }}
          />
          <h2
            className={`font-medium tracking-wide ${
              isMain
                ? "text-base text-[#F0C870]"
                : "text-xs uppercase tracking-widest text-monk-muted"
            }`}
          >
            {label}
          </h2>
          {!isMain && (
            <span className="text-[10px] text-monk-muted opacity-50">
              {goals.length}/{max}
            </span>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setAdding((v) => !v)}
          disabled={atCapacity}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer min-h-[36px] ${
            atCapacity
              ? "border-monk-border text-monk-muted opacity-30 cursor-not-allowed"
              : isMain
              ? "border-[#F0C870]/50 text-[#F0C870] hover:bg-[#F0C870]/10"
              : "border-monk-border text-monk-muted hover:text-monk-text hover:border-monk-accent"
          }`}
          title={atCapacity ? `Max ${max} reached` : "Add goal"}
        >
          {adding ? "Cancel" : isMain && goals.length === 0 ? "Set goal" : "+ Add"}
        </motion.button>
      </div>

      {/* Note (for bad habits) */}
      {note && (
        <p className="text-[11px] text-monk-muted italic opacity-70">{note}</p>
      )}

      {/* Add form */}
      <AnimatePresence initial={false}>
        {adding && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onSubmit={handleAdd}
            className="flex gap-2 overflow-hidden"
          >
            <input
              ref={addInputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={isMain ? "Your single most important goal…" : "Add a goal…"}
              maxLength={80}
              className={`flex-1 bg-monk-bg text-monk-text placeholder-monk-muted text-sm px-3 py-2.5 rounded-xl border focus:outline-none transition-colors min-h-[44px] ${
                isMain ? "border-[#F0C870]/40 focus:border-[#F0C870]" : "border-monk-border focus:border-monk-accent"
              }`}
            />
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="submit"
              disabled={!newName.trim()}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 transition-opacity cursor-pointer min-h-[44px] ${
                isMain
                  ? "bg-[#F0C870] text-monk-bg"
                  : "bg-monk-accent text-white"
              }`}
            >
              +
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Goals list */}
      <AnimatePresence initial={false}>
        {goals.length === 0 && !adding && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-monk-muted opacity-50 italic py-1"
          >
            {isMain ? "No main goal set yet" : "None yet"}
          </motion.p>
        )}
        {goals.map((goal) => (
          <GoalRow
            key={goal.id}
            goal={goal}
            color={color}
            selectedDate={selectedDate}
            getRatingForDate={getRatingForDate}
            setRating={setRating}
            renameGoal={renameGoal}
            removeGoal={removeGoal}
            isMain={isMain}
          />
        ))}
      </AnimatePresence>
    </section>
  );
}

export default function GoalsPage() {
  const {
    goals, addGoal, removeGoal, renameGoal,
    setRating, getRatingForDate,
    setNote, getNoteForDate,
  } = useGoals();

  const todayKey = formatDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [noteText, setNoteText] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  const isToday = selectedDate === todayKey;

  useEffect(() => {
    setNoteText(getNoteForDate(selectedDate));
    setNoteSaved(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const shiftDate = (delta: number) => {
    const d = parseDate(selectedDate);
    d.setDate(d.getDate() + delta);
    if (formatDateKey(d) <= todayKey) setSelectedDate(formatDateKey(d));
  };

  const handleSaveNote = () => {
    setNote(selectedDate, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  // Migrate any goals without a category to 'uncategorized'
  const normalizedGoals = goals.map((g) => ({
    ...g,
    category: g.category ?? "uncategorized",
  }));

  const getGoalsForCategory = (category: GoalCategory) =>
    normalizedGoals.filter((g) => g.category === category);

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

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 flex flex-col gap-5">

        {/* ── DATE NAVIGATION ── */}
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => shiftDate(-1)}
            className="w-11 h-11 flex items-center justify-center rounded-full border border-monk-border text-monk-muted hover:text-monk-text hover:border-monk-accent transition-all cursor-pointer text-base flex-shrink-0"
          >
            ‹
          </motion.button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-monk-text truncate">
              {displayDate(selectedDate)}
              {isToday && (
                <span className="ml-2 text-xs text-monk-accent font-normal">today</span>
              )}
            </p>
            <p className="text-[10px] text-monk-muted opacity-50">
              Rate your progress for this day
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => shiftDate(1)}
            disabled={isToday}
            className="w-11 h-11 flex items-center justify-center rounded-full border border-monk-border text-monk-muted hover:text-monk-text hover:border-monk-accent transition-all cursor-pointer text-base flex-shrink-0 disabled:opacity-30 disabled:cursor-default"
          >
            ›
          </motion.button>
        </div>

        {/* ── GOAL SECTIONS ── */}
        {SECTIONS.map(({ category, max, note }) => (
          <CategorySection
            key={category}
            category={category}
            max={max}
            note={note}
            goals={getGoalsForCategory(category)}
            selectedDate={selectedDate}
            getRatingForDate={getRatingForDate}
            setRating={setRating}
            addGoal={addGoal}
            renameGoal={renameGoal}
            removeGoal={removeGoal}
          />
        ))}

        {/* ── NOTES ── */}
        <section className="border-t border-monk-border pt-5">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-monk-muted mb-3">
            Notes for this day
          </h2>
          <textarea
            value={noteText}
            onChange={(e) => { setNoteText(e.target.value); setNoteSaved(false); }}
            placeholder="How did this day go? What did you notice, feel, or learn…"
            rows={4}
            className="w-full bg-monk-surface text-monk-text placeholder-monk-muted text-base px-4 py-3 rounded-xl border border-monk-border focus:outline-none focus:border-monk-accent transition-colors resize-none leading-relaxed"
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

      </main>
    </div>
  );
}
