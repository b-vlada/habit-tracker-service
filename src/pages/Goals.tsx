import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, BarChart3, Trash2, X, Calendar, Hourglass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const Goals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({ id: null, title: '', target: 0, current: 0, deadline: '' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    const data = await api.getGoals();
    setGoals(data);
  };

  const openModal = (goal: any = null) => {
    setFormData({
      id: goal?.id || null,
      title: goal?.title || '',
      target: goal?.target || 0,
      current: goal?.current || 0,
      deadline: goal?.deadline || ''
    });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, ...data } = formData;
    
    if (id) {
      const updated = await api.updateGoal(id, data);
      setGoals(goals.map(g => g.id === updated.id ? updated : g));
    } else {
      const newGoal = await api.createGoal(data);
      setGoals([...goals, newGoal]);
    }
    setModalOpen(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить?')) return;
    await api.deleteGoal(id);
    setGoals(goals.filter(g => g.id !== id));
  };

  const progress = (goal: any) => goal.target ? Math.round((goal.current / goal.target) * 100) : 0;

  const daysLeft = (deadline: string) => {
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
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-[#B3907A] h-3 rounded-full transition-all" style={{ width: `${progress(g)}%` }} />
              </div>
              <p className="text-sm text-[#B3907A] font-medium text-right mt-1">{progress(g)}%</p>
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
                value={formData.target || ''}
                onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#B3907A]"
              />
              <input
                type="number"
                placeholder="Текущее"
                value={formData.current || ''}
                onChange={(e) => setFormData({ ...formData, current: Number(e.target.value) })}
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