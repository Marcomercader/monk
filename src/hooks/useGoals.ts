"use client";

import { useLocalStorage } from "./useLocalStorage";
import { Goal, DayRating, DayNote } from "@/types";

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>("monk_goals_v2", []);
  const [ratings, setRatings] = useLocalStorage<DayRating[]>("monk_ratings", []);
  const [notes, setNotes] = useLocalStorage<DayNote[]>("monk_notes", []);

  const addGoal = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const goal: Goal = {
      id: crypto.randomUUID(),
      name: trimmed,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, goal]);
  };

  const removeGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setRatings((prev) => prev.filter((r) => r.goalId !== id));
  };

  const setRating = (goalId: string, date: string, rating: number) => {
    setRatings((prev) => {
      const existing = prev.find((r) => r.goalId === goalId && r.date === date);
      if (existing && existing.rating === rating) {
        return prev.filter((r) => !(r.goalId === goalId && r.date === date));
      }
      if (existing) {
        return prev.map((r) =>
          r.goalId === goalId && r.date === date ? { ...r, rating } : r
        );
      }
      return [...prev, { goalId, date, rating }];
    });
  };

  const getRatingForDate = (goalId: string, date: string): number | null => {
    const found = ratings.find((r) => r.goalId === goalId && r.date === date);
    return found ? found.rating : null;
  };

  const getRatingsForGoal = (goalId: string): DayRating[] =>
    ratings.filter((r) => r.goalId === goalId);

  /** Long-term progress: average daily rating mapped to 0–100% */
  const getLongTermProgress = (goalId: string): number => {
    const goalRatings = ratings.filter((r) => r.goalId === goalId);
    if (goalRatings.length === 0) return 0;
    const avg =
      goalRatings.reduce((sum, r) => sum + r.rating, 0) / goalRatings.length;
    return Math.round((avg / 5) * 100);
  };

  const setNote = (date: string, note: string) => {
    setNotes((prev) => {
      const existing = prev.find((n) => n.date === date);
      if (existing) {
        if (!note.trim()) return prev.filter((n) => n.date !== date);
        return prev.map((n) => (n.date === date ? { ...n, note } : n));
      }
      if (!note.trim()) return prev;
      return [...prev, { date, note }];
    });
  };

  const getNoteForDate = (date: string): string =>
    notes.find((n) => n.date === date)?.note ?? "";

  return {
    goals,
    ratings,
    notes,
    addGoal,
    removeGoal,
    setRating,
    getRatingForDate,
    getRatingsForGoal,
    getLongTermProgress,
    setNote,
    getNoteForDate,
  };
}
