import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, BarChart3, Trash2, X, Calendar, Hourglass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline?: string;
  status?: string;
  createdAt: string;
}

export const Goals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null as string | null, 
    title: '', 
    target: '', 
    current: '', 
    deadline: '' 
  });

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await api.getGoals();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (const goal of data) {
        if (goal.deadline && goal.status !== 'completed' && goal.status !== 'failed') {
          const deadlineDate = new Date(goal.deadline);
          if (deadlineDate < today) {
            await api.updateGoal(goal.id, { ...goal, status: 'failed' });
          }
        }
      }
      
      const updatedData = await api.getGoals();
      setGoals(updatedData);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const openModal = (goal: Goal | null = null) => {
    setFormData({
      id: goal?.id || null,
      title: goal?.title || '',
      target: String(goal?.target || ''),
      current: String(goal?.current || ''),
      deadline: goal?.deadline || ''
    });
    setModalOpen(true);
  };

  const progress = (goal: Goal) => {
    if (!goal.target || goal.target === 0) return 0;
    const pct = Math.round((goal.current / goal.target) * 100);
    return Math.min(pct, 100);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetNum = Number(formData.target);
    const currentNum = Number(formData.current);
    
    if (isNaN(targetNum) || isNaN(currentNum)) {
      alert('Введите корректные числа');
      return;
    }
    
    const goalData = {
      title: formData.title,
      target: targetNum,
      current: currentNum,
      deadline: formData.deadline,
      status: 'active' as const
    };
    
    try {
      if (formData.id) {
        const updated = await api.updateGoal(formData.id, goalData);
        setGoals(goals.map(g => g.id === updated.id ? updated : g));
      } else {
        const newGoal = await api.createGoal(goalData);
        setGoals(prev => [...prev, newGoal]);
      }
      setModalOpen(false);
      setFormData({ id: null, title: '', target: '', current: '', deadline: '' });
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении цели');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить?')) return;
    try {
      await api.deleteGoal(id);
      setGoals(goals.filter(g => g.id !== id));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  const daysLeft = (deadline: string | undefined) => {
    if (!deadline) return 0;
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  const filtered = goals.filter(g => g.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Мои цели</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-[#B3907A] text-white rounded-xl hover:bg-[#B3907A]/90">
          <Plus size={20} /> Добавить
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-[#8E9B6D]/30 rounded-xl focus:ring-2 focus:ring-[#8E9B6D]/50 outline-none"
        />
      </div>

      <div className="space-y-4">
        {filtered.length ? filtered.map((g) => (
          <div key={g.id} className="bg-[#F5F5EB] p-5 rounded-xl border-2 border-[#B3907A]">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg mb-2">{g.title}</h3>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-[#B3907A]" />
                    До {g.deadline || 'не указан'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hourglass size={14} className="text-[#B3907A]" />
                    {daysLeft(g.deadline)} дн.
                  </span>
                </div>
              </div>
              {g.status === 'failed' && (
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-medium">Просрочена</span>
              )}
              {g.status === 'completed' && (
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm font-medium">Выполнена</span>
              )}
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all ${g.status === 'failed' ? 'bg-red-400' : g.status === 'completed' ? 'bg-green-500' : 'bg-[#B3907A]'}`} 
                  style={{ width: `${progress(g)}%` }} 
                />
              </div>
              <p className="text-sm text-[#B3907A] font-medium text-right mt-1">
                {g.current} / {g.target} ({progress(g)}%)
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => openModal(g)} className="p-2 bg-[#B3907A] text-white rounded-lg hover:bg-[#B3907A]/90">
                <Edit2 size={16} />
              </button>
              <button onClick={() => navigate('/stats')} className="p-2 bg-[#8E9B6D] text-white rounded-lg hover:bg-[#8E9B6D]/90">
                <BarChart3 size={16} />
              </button>
              <button onClick={() => remove(g.id)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 text-gray-500 bg-[#F5F5EB] rounded-xl border-2 border-dashed border-[#B3907A]">
            Нет целей. Создай первую!
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={save} className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{formData.id ? 'Изменить' : 'Новая цель'}</h2>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <input
              required
              placeholder="Название цели"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#B3907A]"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                required
                placeholder="Цель (число)"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#B3907A]"
              />
              <input
                type="number"
                placeholder="Текущее"
                value={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#B3907A]"
              />
            </div>

            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#B3907A]"
            />

            <button type="submit" className="w-full py-3 bg-[#B3907A] text-white rounded-xl font-bold hover:bg-[#B3907A]/90">
              Сохранить
            </button>
          </form>
        </div>
      )}
    </div>
  );
};