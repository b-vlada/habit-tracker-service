import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, ChevronRight, X } from 'lucide-react';
import { Habit } from '../types';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  userName: string;
}

const HabitBlockIcon = ({ color = '#8E9B6D' }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="4" fill={color} />
    <path d="M8 9H16M8 12H16M8 15H14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const GoalBlockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#B3907A" strokeWidth="2" />
    <circle cx="12" cy="12" r="5" stroke="#B3907A" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" fill="#B3907A" />
  </svg>
);

const TotalHabitsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" />
    <path d="M8 9H16M8 12H16M8 15H14" stroke="#B3907A" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const FireIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" fill="currentColor" />
  </svg>
);

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" />
    <path d="M7 12L10 15L17 9" stroke="#B3907A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const Home = ({ userName }: HomeProps) => {
  const navigate = useNavigate();
  const { habits, goals, toggleHabit, addHabit } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    days: [] as string[],
  });

  const activeHabits = habits.filter(h => h.status === 'active');
  const completedToday = habits.filter(h => h.isCompletedToday).length;
  const activeGoals = goals.slice(0, 3);
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  const getProgress = (goal: typeof goals[0]) => {
    if (!goal.target || goal.target === 0) return 0;
    return Math.round((goal.current / goal.target) * 100);
  };

  const openModal = () => {
    setFormData({
      title: '',
      description: '',
      days: [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      streak: 0,
      isCompletedToday: false,
      completedDate: null,
      status: 'active',
      days: formData.days.length > 0 ? formData.days : daysOfWeek,
    };
    
    addHabit(newHabit);
    closeModal();
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-neutral-dark mb-6">
        Привет, {userName}!
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6 lg:mb-8">
        <div className="bg-[#B3907A] p-4 lg:p-6 rounded-xl lg:rounded-card text-white flex items-center gap-3 lg:gap-4">
          <div className="text-white flex items-start pt-0.5 lg:pt-1">
            <TotalHabitsIcon />
          </div>
          <div>
            <p className="text-xs lg:text-sm opacity-90 mb-1">Всего привычек</p>
            <p className="text-xl lg:text-2xl font-bold">{activeHabits.length}</p>
          </div>
        </div>

        <div className="bg-[#B3907A] p-4 lg:p-6 rounded-xl lg:rounded-card text-white flex items-center gap-3 lg:gap-4">
          <div className="text-white flex items-start pt-0.5 lg:pt-1">
            <FireIcon />
          </div>
          <div>
            <p className="text-xs lg:text-sm opacity-90 mb-1">Стрик</p>
            <p className="text-xl lg:text-2xl font-bold">{maxStreak} дней</p>
          </div>
        </div>

        <div className="bg-[#B3907A] p-4 lg:p-6 rounded-xl lg:rounded-card text-white flex items-center gap-3 lg:gap-4 col-span-2 lg:col-span-1">
          <div className="text-white flex items-start pt-0.5 lg:pt-1">
            <CheckIcon />
          </div>
          <div>
            <p className="text-xs lg:text-sm opacity-90 mb-1">Сегодня выполнено</p>
            <p className="text-xl lg:text-2xl font-bold">{completedToday}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#F5F5EB] p-4 lg:p-6 rounded-xl lg:rounded-card mb-6 lg:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg lg:text-xl font-bold text-neutral-dark flex items-center gap-2">
            <HabitBlockIcon color="#8E9B6D" />
            Привычки на сегодня
          </h2>
          <button 
            onClick={openModal}
            className="flex items-center gap-2 px-4 lg:px-6 py-2 bg-[#8E9B6D] text-white rounded-lg hover:bg-[#8E9B6D]/90 transition-colors text-sm lg:text-base"
          >
            <Plus size={18} />
            Добавить
          </button>
        </div>

        {activeHabits.length === 0 ? (
          <p className="text-neutral-gray text-center py-4">
            Нет активных привычек. Добавь первую!
          </p>
        ) : (
          <div className="space-y-3">
            {activeHabits.map(habit => (
              <label 
                key={habit.id}
                className="flex items-center gap-3 p-4 bg-white rounded-lg cursor-pointer hover:shadow-md transition-all min-h-[60px]"
              >
                <input
                  type="checkbox"
                  checked={habit.isCompletedToday}
                  onChange={() => toggleHabit(habit.id)}
                  className="w-6 h-6 accent-[#8E9B6D] rounded cursor-pointer border-2 border-gray-300"
                />
                <span className={`font-medium text-lg text-neutral-dark ${habit.isCompletedToday ? 'line-through text-neutral-gray' : ''}`}>
                  {habit.title}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg lg:text-xl font-bold text-neutral-dark flex items-center gap-2">
            <GoalBlockIcon />
            Активные цели
          </h2>
          <button 
            onClick={() => navigate('/goals')}
            className="flex items-center gap-1 px-4 lg:px-6 py-2 bg-[#B3907A] text-white rounded-lg hover:bg-[#B3907A]/90 transition-colors text-sm"
          >
            Показать все
            <ChevronRight size={16} />
          </button>
        </div>

        {activeGoals.length === 0 ? (
          <p className="text-neutral-gray text-center py-8">
            Нет активных целей. Создай первую!
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
            {activeGoals.map(goal => (
              <div key={goal.id} className="bg-white p-4 lg:p-5 rounded-xl lg:rounded-card border-[3px] border-[#B3907A]">
                <h3 className="font-bold text-neutral-dark mb-3">{goal.title}</h3>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-[#B3907A] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${getProgress(goal)}%` }}
                  />
                </div>
                <p className="text-sm text-[#B3907A] font-medium text-right">
                  {getProgress(goal)}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50 p-0 lg:p-4">
          <div className="bg-white rounded-t-2xl lg:rounded-card w-full lg:max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-6 border-b border-[#8E9B6D]/20">
              <h2 className="text-xl font-bold text-neutral-dark">
                Добавить привычку
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-[#8E9B6D]/10 rounded-btn transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  Название привычки
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Например: Бег утром"
                  className="w-full px-4 py-2 border border-[#8E9B6D]/30 rounded-btn focus:outline-none focus:ring-2 focus:ring-[#8E9B6D]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Бегать 30 минут в парке для здоровья и энергии"
                  className="w-full px-4 py-2 border border-[#8E9B6D]/30 rounded-btn focus:outline-none focus:ring-2 focus:ring-[#8E9B6D]/50 min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Выберите дни:
                </label>
                <div className="flex gap-2 flex-wrap">
                  {daysOfWeek.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`w-10 h-10 rounded-btn font-medium transition-colors ${
                        formData.days.includes(day)
                          ? 'bg-[#8E9B6D] text-white'
                          : 'bg-gray-200 text-neutral-gray hover:bg-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#8E9B6D] text-white rounded-btn hover:bg-[#8E9B6D]/90 font-medium"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-[#B3907A] text-white rounded-btn hover:bg-[#B3907A]/90 font-medium"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};