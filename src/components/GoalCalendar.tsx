"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendarGoals } from "@/hooks/useCalendarGoals";

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

interface GoalCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoalCalendar({ isOpen, onClose }: GoalCalendarProps) {
  const { addGoal, toggleGoal, removeGoal, getGoalsForDate, datesWithGoals } =
    useCalendarGoals();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [newGoalText, setNewGoalText] = useState("");

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else { setViewMonth((m) => m - 1); }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else { setViewMonth((m) => m + 1); }
    setSelectedDay(null);
  };

  const handleDayClick = (dateKey: string) => {
    setSelectedDay(selectedDay === dateKey ? null : dateKey);
    setNewGoalText("");
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDay && newGoalText.trim()) {
      addGoal(selectedDay, newGoalText);
      setNewGoalText("");
    }
  };

  const selectedGoals = selectedDay ? getGoalsForDate(selectedDay) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer — slides in from left */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-full max-w-sm z-50 bg-monk-surface border-r border-monk-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-monk-border flex-shrink-0">
              <div>
                <h2 className="text-base font-semibold text-monk-text">Calendar</h2>
                <p className="text-xs text-monk-muted mt-0.5">Set intentions by date</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-monk-muted hover:text-monk-text hover:bg-monk-bg transition-all cursor-pointer text-xl leading-none"
                aria-label="Close calendar"
              >
                ×
              </button>
            </div>

            {/* Calendar content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={prevMonth}
                  className="p-1 rounded text-monk-muted hover:text-monk-text transition-colors cursor-pointer text-lg leading-none"
                  aria-label="Previous month"
                >
                  ‹
                </button>
                <span className="text-sm font-medium text-monk-text">
                  {MONTHS[viewMonth]} {viewYear}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-1 rounded text-monk-muted hover:text-monk-text transition-colors cursor-pointer text-lg leading-none"
                  aria-label="Next month"
                >
                  ›
                </button>
              </div>

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d, i) => (
                  <div key={i} className="text-center text-xs text-monk-muted font-medium py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-y-1">
                {Array.from({ length: startOffset }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateKey = formatDateKey(viewYear, viewMonth, day);
                  const isToday = dateKey === todayKey;
                  const isSelected = dateKey === selectedDay;
                  const hasGoals = datesWithGoals.includes(dateKey);
                  return (
                    <motion.button
                      key={day}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleDayClick(dateKey)}
                      className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all cursor-pointer mx-0.5
                        ${isSelected ? "bg-monk-accent text-white" : ""}
                        ${isToday && !isSelected ? "bg-monk-surface text-monk-accent font-bold" : ""}
                        ${!isToday && !isSelected ? "text-monk-text hover:bg-monk-bg" : ""}
                      `}
                      aria-label={`${day} ${MONTHS[viewMonth]}`}
                    >
                      {day}
                      {hasGoals && (
                        <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-monk-warm"}`} />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Selected day goals */}
              <AnimatePresence>
                {selectedDay && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 pt-5 border-t border-monk-border">
                      <p className="text-xs text-monk-muted mb-3 font-medium">
                        {new Date(selectedDay + "T12:00:00").toLocaleDateString("en-US", {
                          weekday: "short", month: "short", day: "numeric",
                        })}
                      </p>

                      <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                        {selectedGoals.length === 0 && (
                          <p className="text-xs text-monk-muted italic opacity-60">
                            Nothing yet — add an intention
                          </p>
                        )}
                        {selectedGoals.map((goal) => (
                          <div key={goal.id} className="group flex items-start gap-2">
                            <button
                              onClick={() => toggleGoal(goal.id)}
                              className={`mt-0.5 w-3.5 h-3.5 rounded-full border flex-shrink-0 transition-all cursor-pointer ${
                                goal.done ? "bg-monk-accent border-monk-accent" : "border-monk-border"
                              }`}
                            />
                            <span className={`flex-1 text-xs leading-relaxed ${goal.done ? "line-through text-monk-muted opacity-60" : "text-monk-text"}`}>
                              {goal.text}
                            </span>
                            <button
                              onClick={() => removeGoal(goal.id)}
                              className="opacity-0 group-hover:opacity-100 text-monk-muted hover:text-red-400 text-base leading-none transition-all cursor-pointer"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleAddGoal} className="flex gap-1.5">
                        <input
                          type="text"
                          value={newGoalText}
                          onChange={(e) => setNewGoalText(e.target.value)}
                          placeholder="Set an intention…"
                          maxLength={100}
                          className="flex-1 bg-monk-bg text-monk-text placeholder-monk-muted text-xs px-2.5 py-1.5 rounded-lg border border-monk-border focus:outline-none focus:border-monk-accent transition-colors"
                        />
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          type="submit"
                          disabled={!newGoalText.trim()}
                          className="px-2.5 py-1.5 bg-monk-accent text-white rounded-lg text-xs disabled:opacity-40 transition-opacity cursor-pointer"
                        >
                          +
                        </motion.button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
