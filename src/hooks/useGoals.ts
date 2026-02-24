"use client";

import { useLocalStorage } from "./useLocalStorage";
import { Goal, DayRating } from "@/types";

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>("monk_goals_v2", []);
  const [ratings, setRatings] = useLocalStorage<DayRating[]>("monk_ratings", []);

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
      const existing = prev.find(
        (r) => r.goalId === goalId && r.date === date
      );
      // Clicking same star again clears rating
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

  const getRatingsForGoal = (goalId: string): DayRating[] => {
    return ratings.filter((r) => r.goalId === goalId);
  };

  return {
    goals,
    ratings,
    addGoal,
    removeGoal,
    setRating,
    getRatingForDate,
    getRatingsForGoal,
  };
}
