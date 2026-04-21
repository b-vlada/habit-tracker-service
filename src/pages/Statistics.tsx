import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Calendar, X, Clock, Zap, Award } from 'lucide-react';
import { api } from '../services/api';

interface Habit {
  id: string;
  title: string;
  isCompletedToday: boolean;
  streak: number;
  completedDate: string | null;
  createdAt: string;
  status?: string;
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  createdAt: string;
  deadline?: string;
  status?: string;
}

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const Statistics = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [month, year]);

  const loadData = async () => {
    try {
      const [h, g] = await Promise.all([api.getHabits(), api.getGoals()]);
      
      const updatedGoals = await Promise.all(g.map(async (goal: Goal) => {
        if (goal.deadline && goal.status !== 'completed' && goal.status !== 'failed') {
          const deadlineDate = new Date(goal.deadline);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (deadlineDate < today) {
            const updated = { ...goal, status: 'failed' };
            await api.updateGoal(goal.id, updated);
            return updated;
          }
        }
        return goal;
      }));
      
      setHabits(h);
      setGoals(updatedGoals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isDateInMonth = (dateStr: string | null | undefined, m: number, y: number) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.getMonth() === m && d.getFullYear() === y;
  };

  const getWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const days: { day: string; status: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      const dateStr = currentDate.toDateString();
      const completedOnThisDay = habits.some(h => h.completedDate && new Date(h.completedDate).toDateString() === dateStr);
      const isToday = i === (dayOfWeek === 0 ? 6 : dayOfWeek - 1);

      days.push({
        day: WEEKDAYS[i],
        status: completedOnThisDay ? 'completed' : isToday ? 'today' : 'missed'
      });
    }
    return days;
  };

  const changeMonth = (delta: number) => {
    let nm = month + delta;
    let ny = year;
    if (nm > 11) { nm = 0; ny++; }
    if (nm < 0) { nm = 11; ny--; }
    setMonth(nm);
    setYear(ny);
  };

  const habitsInMonth = habits.filter(h => 
    isDateInMonth(h.createdAt, month, year) || 
    isDateInMonth(h.completedDate, month, year)
  );
  
  const goalsInMonth = goals.filter(g => 
    isDateInMonth(g.createdAt, month, year) || 
    isDateInMonth(g.deadline, month, year)
  );

  const completedHabits = habits.filter(h => 
    (h.status ?? 'active') !== 'paused' &&
    isDateInMonth(h.completedDate, month, year)
  ).length;
  
  const completedGoalsCount = goalsInMonth.filter(g => g.status === 'completed').length;
  
  const completedCount = completedHabits + completedGoalsCount;
  
  const totalTasks = habitsInMonth.length + goalsInMonth.length;
  
  const successRate = totalTasks > 0 
    ? Math.round((completedCount / Math.max(totalTasks, 1)) * 100) 
    : 0;
  
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak), 0) : 0;
  const activeHabitsCount = habits.filter(h => (h.status ?? 'active') !== 'paused').length;
  const completedGoals = goalsInMonth.filter(g => g.status === 'completed').length;

  const getProgress = (g: Goal) => {
    if (!g.target || g.target === 0) return 0;
    return Math.min(Math.round((g.current / g.target) * 100), 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#8E9B6D]';
      case 'today': return 'bg-[#B3907A]';
      case 'missed': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getMotivationalMessage = () => {
    if (totalTasks === 0) {
      return {
        title: '🌱 Новый месяц — новые возможности!',
        text: 'Начните с малого: поставьте первую цель или привычку. Мы верим в вас!',
        color: 'bg-gray-400'
      };
    }
    
    if (successRate >= 80) {
      return {
        title: '🎉 Потрясающий результат!',
        text: `Вы выполнили ${completedCount} из ${totalTasks} задач (привычек и целей). Ваша дисциплина впечатляет! Так держать!`,
        color: 'bg-[#8E9B6D]'
      };
    } else if (successRate >= 50) {
      return {
        title: '👍 Хороший прогресс!',
        text: `Вы на полпути к успеху: ${completedCount} выполненных задач из ${totalTasks}. Ещё немного усилий!`,
        color: 'bg-[#B3907A]'
      };
    } else if (successRate > 0) {
      return {
        title: '💪 Вы на правильном пути!',
        text: `Каждое выполненное дело — это шаг вперёд. Вы уже сделали ${completedCount} шагов из ${totalTasks}!`,
        color: 'bg-[#8E9B6D]'
      };
    } else {
      return {
        title: '⏰ Время действовать!',
        text: `У вас есть ${totalTasks} задач на этот месяц. Начните прямо сейчас!`,
        color: 'bg-gray-500'
      };
    }
  };

  const motivation = getMotivationalMessage();
  const weekDays = getWeekDays();
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (successRate / 100) * circumference;

  if (loading) return <div className="text-center py-12">Загрузка...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-dark">Статистика</h1>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-[#8E9B6D]/20 shadow-sm">
          <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium text-neutral-dark min-w-[120px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className={`${motivation.color} p-6 rounded-xl mb-6 text-white shadow-lg`}>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{successRate}%</span>
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-xl font-bold mb-2">{motivation.title}</h2>
            <p className="opacity-95">{motivation.text}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#8E9B6D] p-4 rounded-xl text-white flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg"><Check size={20} /></div>
          <div>
            <p className="text-xs opacity-90">Выполнено</p>
            <p className="text-xl font-bold">{completedCount}</p>
          </div>
        </div>
        <div className="bg-[#B3907A] p-4 rounded-xl text-white flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg"><Calendar size={20} /></div>
          <div>
            <p className="text-xs opacity-90">Активных</p>
            <p className="text-xl font-bold">{activeHabitsCount}</p>
          </div>
        </div>
        <div className="bg-[#8E9B6D] p-4 rounded-xl text-white flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg"><Zap size={20} /></div>
          <div>
            <p className="text-xs opacity-90">Рекорд стрика</p>
            <p className="text-xl font-bold">{maxStreak} дн.</p>
          </div>
        </div>
        <div className="bg-[#B3907A] p-4 rounded-xl text-white flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg"><Award size={20} /></div>
          <div>
            <p className="text-xs opacity-90">Достигнуто целей</p>
            <p className="text-xl font-bold">{completedGoals}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#F5F5EB] p-6 rounded-xl mb-6 border border-[#8E9B6D]/10">
        <h2 className="text-lg font-bold text-neutral-dark mb-6 flex items-center gap-2">
          <Clock size={20} className="text-[#8E9B6D]" />
          Текущая неделя
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

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-neutral-dark mb-4">
          Цели за {MONTHS[month]} {year}
        </h2>
        <div className="space-y-4">
          {goalsInMonth.map(g => {
            const goalProgress = getProgress(g);
            const isFailed = g.status === 'failed';
            
            return (
              <div key={g.id}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{g.title}</span>
                    {isFailed && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium flex items-center gap-1">
                        <X size={12} /> Просрочена
                      </span>
                    )}
                    {g.status === 'completed' && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full font-medium flex items-center gap-1">
                        <Check size={12} /> Выполнена
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isFailed && g.current > 0 && (
                      <span className="text-xs text-gray-500">
                        Было: {g.current}/{g.target}
                      </span>
                    )}
                    <span className={`font-bold text-sm ${isFailed ? 'text-red-600' : 'text-[#B3907A]'}`}>
                      {goalProgress}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all ${
                      isFailed ? 'bg-red-400' : 
                      g.status === 'completed' ? 'bg-green-500' : 'bg-[#B3907A]'
                    }`} 
                    style={{ width: `${goalProgress}%` }} 
                  />
                </div>
              </div>
            );
          })}
          {goalsInMonth.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              В {MONTHS[month]} {year} целей не было
            </p>
          )}
        </div>
      </div>
    </div>
  );
};