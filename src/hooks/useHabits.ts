"use client";

import { useLocalStorage } from "./useLocalStorage";
import { Habit } from "@/types";

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useHabits() {
  const today = formatDateKey(new Date());
  const completionKey = `monk_completions_${today}`;

  const [habits, setHabits] = useLocalStorage<Habit[]>("monk_habits", []);
  const [completions, setCompletions] = useLocalStorage<string[]>(
    completionKey,
    []
  );

  const addHabit = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const habit: Habit = {
      id: crypto.randomUUID(),
      name: trimmed,
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, habit]);
  };

  const removeHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setCompletions((prev) => prev.filter((c) => c !== id));
  };

  const toggleCompletion = (habitId: string) => {
    setCompletions((prev) =>
      prev.includes(habitId)
        ? prev.filter((id) => id !== habitId)
        : [...prev, habitId]
    );
  };

  const isCompleted = (habitId: string) => completions.includes(habitId);

  const getCompletionsForDate = (date: string): string[] => {
    try {
      const key = `monk_completions_${date}`;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  };

  const completionRate =
    habits.length > 0
      ? Math.round((completions.length / habits.length) * 100)
      : 0;

  return {
    habits,
    completions,
    addHabit,
    removeHabit,
    toggleCompletion,
    isCompleted,
    getCompletionsForDate,
    completionRate,
    today,
  };
}
