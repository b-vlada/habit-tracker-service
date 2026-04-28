interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  days: string[];
  streak: number;
  isCompletedToday: boolean;
  completedDate: string | null;
  status: string;
  createdAt: string;
}

interface Goal {
  id: string;
  userId: string;
  title: string;
  target: number;
  current: number;
  deadline?: string;
  status?: string;
  createdAt: string;
}

const DB_KEY = 'habit_tracker_db';

const getDB = () => {
  const db = localStorage.getItem(DB_KEY);
  if (db) {
    return JSON.parse(db);
  }
  return {
    users: [] as User[],
    habits: [] as Habit[],
    goals: [] as Goal[]
  };
};

const saveDB = (db: any) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getCurrentUserId = (): string | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user).id : null;
};

export const api = {
  register: async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const db = getDB();
    
    const existingUser = db.users.find((u: User) => u.email === email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже зарегистрирован');
    }

    const newUser: User = {
      id: generateId(),
      email,
      password,
      name
    };

    db.users.push(newUser);
    saveDB(db);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  login: async (email: string, password: string) => {
    const db = getDB();
    const user = db.users.find((u: User) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Пользователь не найден. Зарегистрируйтесь.');
    }

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },

  resetPassword: async (email: string, newPassword: string) => {
    const db = getDB();
    const userIndex = db.users.findIndex((u: User) => u.email === email);

    if (userIndex === -1) {
      throw new Error('Пользователь не найден');
    }

    db.users[userIndex].password = newPassword;
    saveDB(db);

    const { password: _, ...userWithoutPassword } = db.users[userIndex];
    return userWithoutPassword;
  },

  getHabits: async () => {
    const userId = getCurrentUserId();
    const db = getDB();
    return db.habits.filter((h: Habit) => h.userId === userId);
  },

  createHabit: async (data: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'isCompletedToday' | 'completedDate'>) => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Пользователь не авторизован');

    const db = getDB();
    const newHabit: Habit = {
      id: generateId(),
      userId,
      createdAt: new Date().toISOString(),
      isCompletedToday: false,
      completedDate: null,
      ...data
    };

    db.habits.push(newHabit);
    saveDB(db);

    return newHabit;
  },

  updateHabit: async (id: string, data: Partial<Habit>) => {
    const db = getDB();
    const index = db.habits.findIndex((h: Habit) => h.id === id);

    if (index === -1) throw new Error('Привычка не найдена');

    db.habits[index] = { ...db.habits[index], ...data };
    saveDB(db);

    return db.habits[index];
  },

  toggleHabit: async (id: string) => {
    const db = getDB();
    const habit = db.habits.find((h: Habit) => h.id === id);

    if (!habit) throw new Error('Привычка не найдена');

    const today = new Date().toISOString().split('T')[0];
    const isCompleted = habit.isCompletedToday;

    habit.isCompletedToday = !isCompleted;
    habit.completedDate = !isCompleted ? today : null;
    habit.streak = !isCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1);

    saveDB(db);

    return habit;
  },

  deleteHabit: async (id: string) => {
    const db = getDB();
    const index = db.habits.findIndex((h: Habit) => h.id === id);

    if (index === -1) throw new Error('Привычка не найдена');

    db.habits.splice(index, 1);
    saveDB(db);

    return { success: true };
  },

  getGoals: async () => {
    const userId = getCurrentUserId();
    const db = getDB();
    return db.goals.filter((g: Goal) => g.userId === userId);
  },

  createGoal: async (data: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Пользователь не авторизован');

    const db = getDB();
    const newGoal: Goal = {
      id: generateId(),
      userId,
      createdAt: new Date().toISOString(),
      status: 'active',
      ...data
    };

    db.goals.push(newGoal);
    saveDB(db);

    return newGoal;
  },

  updateGoal: async (id: string, data: Partial<Goal>) => {
    const db = getDB();
    const index = db.goals.findIndex((g: Goal) => g.id === id);

    if (index === -1) throw new Error('Цель не найдена');

    db.goals[index] = { ...db.goals[index], ...data };
    saveDB(db);

    return db.goals[index];
  },

  deleteGoal: async (id: string) => {
    const db = getDB();
    const index = db.goals.findIndex((g: Goal) => g.id === id);

    if (index === -1) throw new Error('Цель не найдена');

    db.goals.splice(index, 1);
    saveDB(db);

    return { success: true };
  }
};