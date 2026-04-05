import { create } from 'zustand';
import { AppState, Habit, Goal } from '../types';

const loadHabitsFromStorage = (): Habit[] => {
  const stored = localStorage.getItem('habits');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toDateString();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  if (stored) {
    let parsed = JSON.parse(stored);
    
    return parsed.map((habit: Habit) => {
      if (habit.completedDate === todayStr) {
        return { ...habit, isCompletedToday: true };
      }

      if (habit.completedDate === yesterdayStr) {
        return { ...habit, isCompletedToday: false };
      }

      if (habit.streak > 0) {
        return { ...habit, isCompletedToday: false, streak: 0, completedDate: null };
      }

      return { ...habit, isCompletedToday: false };
    });
  }

  return [
    {
      id: '1',
      title: 'Бег утром',
      description: 'Бегать 30 минут',
      streak: 0,
      isCompletedToday: false,
      completedDate: null,
      status: 'active',
      days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    },
    {
      id: '2',
      title: 'Чтение 30 мин',
      description: 'Читать перед сном',
      streak: 0,
      isCompletedToday: false,
      completedDate: null,
      status: 'active',
      days: ['Пн', 'Ср', 'Пт'],
    },
    {
      id: '3',
      title: 'Медитация',
      description: '20 минут медитации',
      streak: 0,
      isCompletedToday: false,
      completedDate: null,
      status: 'paused',
      days: ['Пн', 'Ср', 'Пт'],
    },
  ];
};

const loadGoalsFromStorage = (): Goal[] => {
  const stored = localStorage.getItem('goals');
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    {
      id: '101',
      title: 'Заработать 1 млн руб',
      target: 1000000,
      current: 700000,
      deadline: '2026-06-01',
    },
    {
      id: '102',
      title: 'Прочитать 20 книг',
      target: 20,
      current: 10,
      deadline: '2026-06-05',
    },
    {
      id: '103',
      title: 'Выучить 500 слов',
      target: 500,
      current: 450,
      deadline: '2026-04-20',
    },
  ];
};

export const useStore = create<AppState>((set) => ({
  habits: loadHabitsFromStorage(),
  goals: loadGoalsFromStorage(),

  toggleHabit: (id) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toDateString();

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    set((state) => {
      const newHabits = state.habits.map((habit) => {
        if (habit.id === id) {
          const isCompleting = !habit.isCompletedToday;

          if (isCompleting) {
            return {
              ...habit,
              isCompletedToday: true,
              completedDate: todayStr,
              streak: habit.streak + 1,
            };
          } else {
            return {
              ...habit,
              isCompletedToday: false,
              completedDate: habit.streak > 1 ? yesterdayStr : null,
              streak: Math.max(0, habit.streak - 1),
            };
          }
        }
        return habit;
      });
      localStorage.setItem('habits', JSON.stringify(newHabits));
      return { habits: newHabits };
    });
  },

  addHabit: (habit) =>
    set((state) => {
      const newHabits = [...state.habits, habit];
      localStorage.setItem('habits', JSON.stringify(newHabits));
      return { habits: newHabits };
    }),

  updateHabit: (updatedHabit) =>
    set((state) => {
      const newHabits = state.habits.map((h) =>
        h.id === updatedHabit.id ? { ...h, ...updatedHabit } : h
      );
      localStorage.setItem('habits', JSON.stringify(newHabits));
      return { habits: newHabits };
    }),

  deleteHabit: (id) =>
    set((state) => {
      const newHabits = state.habits.filter((h) => h.id !== id);
      localStorage.setItem('habits', JSON.stringify(newHabits));
      return { habits: newHabits };
    }),

  toggleHabitStatus: (id) =>
    set((state) => {
      const newHabits = state.habits.map((habit) => {
        if (habit.id === id) {
          const newStatus = habit.status === 'active' ? 'paused' : 'active';
          return {
            ...habit,
            status: newStatus,
          };
        }
        return habit;
      });
      localStorage.setItem('habits', JSON.stringify(newHabits));
      return { habits: newHabits };
    }),

  addGoal: (goal) =>
    set((state) => {
      const newGoals = [...state.goals, goal];
      localStorage.setItem('goals', JSON.stringify(newGoals));
      return { goals: newGoals };
    }),

  updateGoal: (updatedGoal) =>
    set((state) => {
      const newGoals = state.goals.map((g) =>
        g.id === updatedGoal.id ? updatedGoal : g
      );
      localStorage.setItem('goals', JSON.stringify(newGoals));
      return { goals: newGoals };
    }),

  deleteGoal: (id) =>
    set((state) => {
      const newGoals = state.goals.filter((g) => g.id !== id);
      localStorage.setItem('goals', JSON.stringify(newGoals));
      return { goals: newGoals };
    }),

  updateGoalProgress: (id, value) =>
    set((state) => {
      const newGoals = state.goals.map((g) =>
        g.id === id ? { ...g, current: value } : g
      );
      localStorage.setItem('goals', JSON.stringify(newGoals));
      return { goals: newGoals };
    }),
}));