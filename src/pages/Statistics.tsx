import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Check, X, Flame, TrendingUp } from 'lucide-react';

interface Habit {
  id: string;
  title: string;
  isCompletedToday: boolean;
  streak: number;
  completedDate: string | null;
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
}

const HabitBlockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="4" fill="#8E9B6D" />
    <path d="M8 9H16M8 12H16M8 15H14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const Statistics = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [habitsData, goalsData] = await Promise.all([api.getHabits(), api.getGoals()]);
        setHabits(habitsData);
        setGoals(goalsData);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalCompleted = habits.filter(h => h.isCompletedToday).length;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak), 0) : 0;
  const successRate = habits.length > 0 ? Math.round((totalCompleted / habits.length) * 100) : 0;

  const getWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const days = [];
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      const dateStr = currentDate.toDateString();
      const completedOnThisDay = habits.some(h => h.completedDate === dateStr);
      const isToday = i === (dayOfWeek === 0 ? 6 : dayOfWeek - 1);

      days.push({
        day: dayNames[i],
        status: completedOnThisDay ? 'completed' : isToday ? 'today' : 'missed'
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#8E9B6D]';
      case 'today': return 'bg-[#B3907A]';
      case 'missed': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getProgress = (goal: Goal) => {
    if (!goal.target || goal.target === 0) return 0;
    return Math.round((goal.current / goal.target) * 100);
  };

  if (loading) {
    return <div className="text-center py-12">Загрузка статистики...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-neutral-dark">Статистика</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        <div className="bg-[#F5F5EB] p-4 lg:p-6 rounded-xl border border-[#8E9B6D]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 bg-[#8E9B6D]/20 rounded-lg">
              <Check className="text-[#8E9B6D]" size={20} />
            </div>
            <div>
              <p className="text-xs text-neutral-gray mb-1">Выполнено</p>
              <p className="text-xl lg:text-2xl font-bold text-neutral-dark">{totalCompleted}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#F5F5EB] p-4 lg:p-6 rounded-xl border border-[#B3907A]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 bg-[#B3907A]/20 rounded-lg">
              <X className="text-[#B3907A]" size={20} />
            </div>
            <div>
              <p className="text-xs text-neutral-gray mb-1">Пропущено</p>
              <p className="text-xl lg:text-2xl font-bold text-neutral-dark">{habits.length - totalCompleted}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#F5F5EB] p-4 lg:p-6 rounded-xl border border-[#B3907A]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 bg-[#B3907A]/20 rounded-lg">
              <Flame className="text-[#B3907A]" size={20} />
            </div>
            <div>
              <p className="text-xs text-neutral-gray mb-1">Стрик</p>
              <p className="text-xl lg:text-2xl font-bold text-neutral-dark">{maxStreak} дней</p>
            </div>
          </div>
        </div>

        <div className="bg-[#F5F5EB] p-4 lg:p-6 rounded-xl border border-[#8E9B6D]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-3 bg-[#8E9B6D]/20 rounded-lg">
              <TrendingUp className="text-[#8E9B6D]" size={20} />
            </div>
            <div>
              <p className="text-xs text-neutral-gray mb-1">Успех</p>
              <p className="text-xl lg:text-2xl font-bold text-neutral-dark">{successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F5F5EB] p-4 lg:p-6 rounded-xl mb-6 lg:mb-8 border border-[#8E9B6D]/10">
        <h2 className="text-lg lg:text-xl font-bold text-neutral-dark mb-6 flex items-center gap-2">
          <HabitBlockIcon />
          График выполнения привычек
        </h2>
        
        <div className="flex gap-2 lg:gap-3 mb-6 overflow-x-auto pb-2">
          {weekDays.map(({ day, status }) => (
            <div key={day} className="flex flex-col items-center gap-2 min-w-[60px]">
              <div className={`${getStatusColor(status)} w-12 h-12 lg:w-14 lg:h-14 rounded-lg flex items-center justify-center text-white font-medium`}>
                {day}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 lg:gap-8 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-[#8E9B6D]" />
            <span className="text-xs lg:text-sm text-neutral-gray">Выполнено</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-[#B3907A]" />
            <span className="text-xs lg:text-sm text-neutral-gray">Сегодня</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-gray-300" />
            <span className="text-xs lg:text-sm text-neutral-gray">Пропущено</span>
          </div>
        </div>
      </div>

      <div className="bg-[#F5F5EB] p-4 lg:p-6 rounded-xl border border-[#B3907A]/10">
        <h2 className="text-lg lg:text-xl font-bold text-neutral-dark mb-6">Прогресс по целям</h2>
        
        <div className="space-y-4">
          {goals.map(goal => (
            <div key={goal.id}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-neutral-dark text-sm lg:text-base">{goal.title}</span>
                <span className="text-[#B3907A] font-medium text-sm">{getProgress(goal)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3">
                <div 
                  className="bg-[#B3907A] h-2 lg:h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getProgress(goal)}%` }}
                />
              </div>
            </div>
          ))}
          
          {goals.length === 0 && (
            <p className="text-center text-neutral-gray py-4">
              Целей пока нет
            </p>
          )}
        </div>
      </div>
    </div>
  );
};