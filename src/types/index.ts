export interface Habit {
  id: string;
  name: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  done: boolean;
}
