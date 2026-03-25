export interface Habit {
  id: string;
  name: string;
  createdAt: string;
}

export interface GoalHabit {
  id: string;
  name: string;
}

export type GoalCategory =
  | 'main'
  | 'physical'
  | 'mental'
  | 'financial'
  | 'spiritual'
  | 'social'
  | 'academics'
  | 'bad_habit';

export interface Goal {
  id: string;
  name: string;
  createdAt: string;
  habits: GoalHabit[];
  category: GoalCategory;
}

export interface DayRating {
  goalId: string;
  date: string;
  rating: number;
}

export interface HabitRating {
  goalId: string;
  habitId: string;
  date: string;
  rating: number;
}

export interface CalendarGoal {
  id: string;
  date: string;
  text: string;
  done: boolean;
}

export interface DayNote {
  date: string;
  note: string;
}
