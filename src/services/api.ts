const API_URL = 'http://localhost:5000';

const getCurrentUserId = (): string | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user).id : null;
};

export const api = {
  register: async (data: { email: string; password: string; name: string }) => {
    try {
      // Проверяем, существует ли уже пользователь с таким email
      const existingUsers = await fetch(`${API_URL}/users?email=${data.email}`);
      const users = await existingUsers.json();
      
      if (users.length > 0) {
        throw new Error('Пользователь с таким email уже зарегистрирован');
      }

      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ошибка сети. Проверьте, запущен ли сервер.');
    }
  },

  login: async (email: string, password: string) => {
    try {
      // Сначала ищем пользователя по email
      const response = await fetch(`${API_URL}/users?email=${email}`);
      const users = await response.json();
      
      if (users.length === 0) {
        throw new Error('Пользователь не найден. Пожалуйста, зарегистрируйтесь.');
      }
      
      const user = users[0];
      
      // Проверяем пароль
      if (user.password !== password) {
        throw new Error('Неверный пароль');
      }
      
      return user;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Не удалось подключиться к серверу. Проверьте, запущен ли backend.');
        }
        throw error;
      }
      throw new Error('Ошибка входа');
    }
  },

  getHabits: async () => {
    try {
      const userId = getCurrentUserId();
      const response = await fetch(`${API_URL}/habits?userId=${userId}`);
      return response.json();
    } catch (error) {
      throw new Error('Ошибка загрузки привычек');
    }
  },

  createHabit: async (data: any) => {
    try {
      const userId = getCurrentUserId();
      const response = await fetch(`${API_URL}/habits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId })
      });
      return response.json();
    } catch (error) {
      throw new Error('Ошибка создания привычки');
    }
  },

  updateHabit: async (id: string, data: any) => {
    try {
      const response = await fetch(`${API_URL}/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      throw new Error('Ошибка обновления привычки');
    }
  },

  toggleHabit: async (id: string) => {
    try {
      const getResponse = await fetch(`${API_URL}/habits/${id}`);
      const habit = await getResponse.json();
      
      const updated = {
        ...habit,
        isCompletedToday: !habit.isCompletedToday,
        streak: habit.isCompletedToday ? habit.streak - 1 : habit.streak + 1
      };
      
      const response = await fetch(`${API_URL}/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      return response.json();
    } catch (error) {
      throw new Error('Ошибка обновления статуса');
    }
  },

  deleteHabit: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/habits/${id}`, {
        method: 'DELETE'
      });
      return response.json();
    } catch (error) {
      throw new Error('Ошибка удаления привычки');
    }
  },

  getGoals: async () => {
    try {
      const userId = getCurrentUserId();
      const response = await fetch(`${API_URL}/goals?userId=${userId}`);
      return response.json();
    } catch (error) {
      throw new Error('Ошибка загрузки целей');
    }
  },

  createGoal: async (data: any) => {
    try {
      const userId = getCurrentUserId();
      const response = await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId })
      });
      return response.json();
    } catch (error) {
      throw new Error('Ошибка создания цели');
    }
  },

  updateGoal: async (id: string, data: any) => {
    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      throw new Error('Ошибка обновления цели');
    }
  },

  deleteGoal: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: 'DELETE'
      });
      return response.json();
    } catch (error) {
      throw new Error('Ошибка удаления цели');
    }
  },
};