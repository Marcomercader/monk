"use client";

import { useLocalStorage } from "./useLocalStorage";
import { Goal, GoalCategory, GoalHabit, DayRating, HabitRating, DayNote } from "@/types";

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>("monk_goals_v2", []);
  const [ratings, setRatings] = useLocalStorage<DayRating[]>("monk_ratings", []);
  const [habitRatings, setHabitRatings] = useLocalStorage<HabitRating[]>("monk_habit_ratings", []);
  const [notes, setNotes] = useLocalStorage<DayNote[]>("monk_notes", []);

  // ── Goal CRUD ──────────────────────────────────────────────

  const addGoal = (name: string, category: GoalCategory = 'uncategorized') => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const goal: Goal = {
      id: crypto.randomUUID(),
      name: trimmed,
      createdAt: new Date().toISOString(),
      habits: [],
      category,
      active: true,
    };
    setGoals((prev) => [...prev, goal]);
  };

  const setCategoryForGoal = (goalId: string, category: GoalCategory) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, category } : g))
    );
  };

  const removeGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setRatings((prev) => prev.filter((r) => r.goalId !== id));
    setHabitRatings((prev) => prev.filter((r) => r.goalId !== id));
  };

  const renameGoal = (goalId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, name: trimmed } : g))
    );
  };

  // ── Habit CRUD (per goal) ──────────────────────────────────

  const addHabitToGoal = (goalId: string, habitName: string) => {
    const trimmed = habitName.trim();
    if (!trimmed) return;
    const habit: GoalHabit = { id: crypto.randomUUID(), name: trimmed };
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, habits: [...(g.habits ?? []), habit] }
          : g
      )
    );
  };

  const removeHabitFromGoal = (goalId: string, habitId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, habits: (g.habits ?? []).filter((h) => h.id !== habitId) }
          : g
      )
    );
    setHabitRatings((prev) =>
      prev.filter((r) => !(r.goalId === goalId && r.habitId === habitId))
    );
  };

  // ── Goal ratings ───────────────────────────────────────────

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

  /** Average of all DayRatings mapped to 0–100 */
  const getLongTermProgress = (goalId: string): number => {
    const goalRatings = ratings.filter((r) => r.goalId === goalId);
    if (goalRatings.length === 0) return 0;
    const avg =
      goalRatings.reduce((sum, r) => sum + r.rating, 0) / goalRatings.length;
    return Math.round((avg / 5) * 100);
  };

  // ── Habit ratings ──────────────────────────────────────────

  const setHabitRating = (
    goalId: string,
    habitId: string,
    date: string,
    rating: number
  ) => {
    setHabitRatings((prev) => {
      const existing = prev.find(
        (r) => r.goalId === goalId && r.habitId === habitId && r.date === date
      );
      let next: HabitRating[];
      if (existing && existing.rating === rating) {
        // toggle off
        next = prev.filter(
          (r) => !(r.goalId === goalId && r.habitId === habitId && r.date === date)
        );
      } else if (existing) {
        next = prev.map((r) =>
          r.goalId === goalId && r.habitId === habitId && r.date === date
            ? { ...r, rating }
            : r
        );
      } else {
        next = [...prev, { goalId, habitId, date, rating }];
      }

      // Auto-update the goal's overall DayRating to the average of habit ratings
      const dayHabitRatings = next.filter(
        (r) => r.goalId === goalId && r.date === date
      );
      if (dayHabitRatings.length > 0) {
        const avg =
          dayHabitRatings.reduce((s, r) => s + r.rating, 0) /
          dayHabitRatings.length;
        const rounded = Math.round(avg);
        setRatings((prevRatings) => {
          const ex = prevRatings.find(
            (r) => r.goalId === goalId && r.date === date
          );
          if (ex) {
            return prevRatings.map((r) =>
              r.goalId === goalId && r.date === date ? { ...r, rating: rounded } : r
            );
          }
          return [...prevRatings, { goalId, date, rating: rounded }];
        });
      }

      return next;
    });
  };

  const getHabitRatingForDate = (
    goalId: string,
    habitId: string,
    date: string
  ): number | null => {
    const found = habitRatings.find(
      (r) => r.goalId === goalId && r.habitId === habitId && r.date === date
    );
    return found ? found.rating : null;
  };

  const getHabitRatingsForDate = (goalId: string, date: string): HabitRating[] =>
    habitRatings.filter((r) => r.goalId === goalId && r.date === date);

  // ── Notes ──────────────────────────────────────────────────

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
    habitRatings,
    notes,
    addGoal,
    removeGoal,
    renameGoal,
    setCategoryForGoal,
    addHabitToGoal,
    removeHabitFromGoal,
    setRating,
    getRatingForDate,
    getRatingsForGoal,
    getLongTermProgress,
    setHabitRating,
    getHabitRatingForDate,
    getHabitRatingsForDate,
    setNote,
    getNoteForDate,
  };
}
