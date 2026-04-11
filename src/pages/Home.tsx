import { useState, useEffect } from 'react';
import { Plus, ChevronRight, X, ListChecks, Flame, Target, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const Home = ({ userName }: { userName: string }) => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', days: [] as string[] });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [h, g] = await Promise.all([api.getHabits(), api.getGoals()]);
      setHabits(h);
      setGoals(g);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const handleToggleHabit = async (id: string) => {
    try {
      const updated = await api.toggleHabit(id);
      setHabits(prev => prev.map(h => h.id === id ? updated : h));
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    if (!confirm('Удалить эту привычку?')) return;
    try {
      await api.deleteHabit(id);
      setHabits(prev => prev.filter(h => h.id !== id));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newHabit = await api.createHabit({ ...formData, streak: 0, status: 'active' });
      setHabits(prev => [...prev, newHabit]);
      setModalOpen(false);
      setFormData({ title: '', description: '', days: [] });
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const activeHabits = habits.filter(h => h.status !== 'paused');
  const completedToday = habits.filter(h => h.isCompletedToday).length;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  const getProgress = (goal: any) => {
    if (!goal.target || goal.target === 0) return 0;
    return Math.round((goal.current / goal.target) * 100);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#2C2C2C]">Привет, {userName}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#8E9B6D] p-5 rounded-xl text-white flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-white/20 rounded-lg"><ListChecks size={24} /></div>
          <div><p className="text-sm opacity-80">Всего привычек</p><p className="text-2xl font-bold">{activeHabits.length}</p></div>
        </div>
        <div className="bg-[#B3907A] p-5 rounded-xl text-white flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-white/20 rounded-lg"><Flame size={24} /></div>
          <div><p className="text-sm opacity-80">Стрик</p><p className="text-2xl font-bold">{maxStreak} дней</p></div>
        </div>
        <div className="bg-[#8E9B6D] p-5 rounded-xl text-white flex items-center gap-4 shadow-sm md:col-span-1">
          <div className="p-3 bg-white/20 rounded-lg"><Target size={24} /></div>
          <div><p className="text-sm opacity-80">Выполнено сегодня</p><p className="text-2xl font-bold">{completedToday}</p></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#2C2C2C]">Привычки на сегодня</h2>
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#8E9B6D] text-white rounded-lg hover:bg-[#8E9B6D]/90 transition-colors">
            <Plus size={18} /> Добавить
          </button>
        </div>

        {activeHabits.length > 0 ? (
          <div className="space-y-3">
            {activeHabits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-4 p-4 bg-[#F5F5EB] rounded-lg group hover:bg-[#F5F5EB]/90 transition-colors">
                <input
                  type="checkbox"
                  checked={habit.isCompletedToday}
                  onChange={() => handleToggleHabit(habit.id)}
                  className="w-6 h-6 accent-[#8E9B6D] rounded cursor-pointer"
                />
                <span className={`flex-1 text-lg font-medium transition-all ${habit.isCompletedToday ? 'line-through text-gray-400' : 'text-[#2C2C2C]'}`}>
                  {habit.title}
                </span>
                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Удалить привычку"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            Нет активных привычек. Добавьте первую!
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#2C2C2C]">Активные цели</h2>
          <button onClick={() => navigate('/goals')} className="flex items-center gap-1 text-[#B3907A] font-medium hover:underline">
            Показать все <ChevronRight size={16} />
          </button>
        </div>

        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold mb-3 text-[#2C2C2C]">{goal.title}</h3>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                  <div className="bg-[#B3907A] h-2.5 rounded-full transition-all" style={{ width: `${getProgress(goal)}%` }} />
                </div>
                <p className="text-sm text-[#B3907A] font-medium text-right">{getProgress(goal)}%</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            Нет активных целей. Создайте первую!
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddHabit} className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#2C2C2C]">Новая привычка</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            <input
              type="text"
              required
              placeholder="Название привычки"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#8E9B6D] bg-gray-50"
            />

            <textarea
              placeholder="Описание"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#8E9B6D] min-h-[80px] bg-gray-50"
            />

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">Дни:</label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      days: formData.days.includes(day) ? formData.days.filter((d) => d !== day) : [...formData.days, day]
                    })}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      formData.days.includes(day) ? 'bg-[#8E9B6D] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#8E9B6D] text-white rounded-xl font-bold hover:bg-[#8E9B6D]/90 transition-colors shadow-md mt-4"
            >
              Создать привычку
            </button>
          </form>
        </div>
      )}
    </div>
  );
};