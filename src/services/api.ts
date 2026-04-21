const API_URL = 'http://localhost:5000';

const getCurrentUserId = (): string | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user).id : null;
};

export const api = {
  register: async (data: { email: string; password: string; name: string }) => {
    try {
      const existing = await fetch(`${API_URL}/users?email=${data.email}`);
      const users = await existing.json();
      if (users.length > 0) throw new Error('Пользователь с таким email уже зарегистрирован');
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Ошибка сети');
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/users?email=${email}`);
      const users = await response.json();
      if (users.length === 0) throw new Error('Пользователь не найден. Зарегистрируйтесь.');
      if (users[0].password !== password) throw new Error('Неверный пароль');
      return users[0];
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) throw new Error('Сервер недоступен');
        throw error;
      }
      throw new Error('Ошибка входа');
    }
  },

  resetPassword: async (email: string, newPassword: string) => {
    try {
      const response = await fetch(`${API_URL}/users?email=${email}`);
      const users = await response.json();
      if (users.length === 0) throw new Error('Пользователь не найден');
      const user = users[0];
      const updated = { ...user, password: newPassword };
      const saveRes = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      return saveRes.json();
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Ошибка восстановления пароля');
    }
  },

  getHabits: async () => {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_URL}/habits?userId=${userId}`);
    return response.json();
  },

  createHabit: async (data: any) => {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_URL}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId })
    });
    return response.json();
  },

  updateHabit: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/habits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  toggleHabit: async (id: string) => {
    const getRes = await fetch(`${API_URL}/habits/${id}`);
    const habit = await getRes.json();
    const updated = {
      ...habit,
      isCompletedToday: !habit.isCompletedToday,
      streak: habit.isCompletedToday ? Math.max(0, habit.streak - 1) : habit.streak + 1,
      completedDate: !habit.isCompletedToday ? new Date().toISOString() : null
    };
    const saveRes = await fetch(`${API_URL}/habits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    return saveRes.json();
  },

  deleteHabit: async (id: string) => {
    const response = await fetch(`${API_URL}/habits/${id}`, { method: 'DELETE' });
    return response.json();
  },

  getGoals: async () => {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_URL}/goals?userId=${userId}`);
    return response.json();
  },

  createGoal: async (data: any) => {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId })
    });
    return response.json();
  },

  updateGoal: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  deleteGoal: async (id: string) => {
    const response = await fetch(`${API_URL}/goals/${id}`, { method: 'DELETE' });
    return response.json();
  }
};