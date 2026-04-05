export interface Habit {
  id: string;
  title: string;
  description: string;
  streak: number;
  isCompletedToday: boolean;
  completedDate: string | null;
  status: 'active' | 'paused';
  days: string[];
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  color?: string;
}

export interface UserStats {
  completed: number;
  missed: number;
  streak: number;
  successRate: number;
}

export interface AppState {
  habits: Habit[];
  goals: Goal[];
  toggleHabit: (id: string) => void;
  addHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  addGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (id: string, value: number) => void;
}