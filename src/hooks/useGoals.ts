"use client";

import { useLocalStorage } from "./useLocalStorage";
import { Goal } from "@/types";

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>("monk_goals", []);

  const addGoal = (date: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const goal: Goal = {
      id: crypto.randomUUID(),
      date,
      text: trimmed,
      done: false,
    };
    setGoals((prev) => [...prev, goal]);
  };

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  const removeGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const getGoalsForDate = (date: string) => goals.filter((g) => g.date === date);

  const datesWithGoals = Array.from(new Set(goals.map((g) => g.date)));

  return {
    goals,
    addGoal,
    toggleGoal,
    removeGoal,
    getGoalsForDate,
    datesWithGoals,
  };
}
