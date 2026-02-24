export interface Habit {
  id: string;
  name: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  createdAt: string;
}

export interface DayRating {
  goalId: string;
  date: string;
  rating: number;
}
