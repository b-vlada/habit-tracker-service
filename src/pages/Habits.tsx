import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, BarChart3, Trash2, X, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const Habits = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({ id: null, title: '', description: '', days: [] });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const data = await api.getHabits();
    setHabits(data);
  };

  const openModal = (habit: any = null) => {
    setFormData({
      id: habit?.id || null,
      title: habit?.title || '',
      description: habit?.description || '',
      days: habit?.days || []
    });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, ...data } = formData;
    
    if (id) {
      const updated = await api.updateHabit(id, data);
      setHabits(habits.map(h => h.id === updated.id ? updated : h));
    } else {
      const newHabit = await api.createHabit({ ...data, streak: 0 });
      setHabits([...habits, newHabit]);
    }
    setModalOpen(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить?')) return;
    await api.deleteHabit(id);
    setHabits(habits.filter(h => h.id !== id));
  };

  const toggleDay = (day: string) => {
    setFormData({
      ...formData,
      days: formData.days.includes(day)
        ? formData.days.filter((d: string) => d !== day)
        : [...formData.days, day]
    });
  };

  const filtered = habits.filter(h => h.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Привычки</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-[#8E9B6D] text-white rounded-xl hover:bg-[#8E9B6D]/90">
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
        {filtered.length ? filtered.map((h) => (
          <div key={h.id} className="bg-[#F5F5EB] p-5 rounded-xl border-2 border-[#8E9B6D] flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{h.title}</h3>
              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {h.days.length === 7 ? 'Ежедневно' : h.days.join(', ')}
                </span>
                <span className="flex items-center gap-1">🔥 {h.streak}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openModal(h)} className="p-2 bg-[#8E9B6D] text-white rounded-lg hover:bg-[#8E9B6D]/90">
                <Edit2 size={16} />
              </button>
              <button onClick={() => navigate('/stats')} className="p-2 bg-[#8E9B6D] text-white rounded-lg hover:bg-[#8E9B6D]/90">
                <BarChart3 size={16} />
              </button>
              <button onClick={() => remove(h.id)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 text-gray-500 bg-[#F5F5EB] rounded-xl border-2 border-dashed border-[#8E9B6D]">
            Нет привычек. Создай первую!
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={save} className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{formData.id ? 'Изменить' : 'Новая привычка'}</h2>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <input
              required
              placeholder="Название"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#8E9B6D]"
            />

            <textarea
              placeholder="Описание"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#8E9B6D] min-h-[80px]"
            />

            <div>
              <label className="block text-sm font-medium mb-2">Дни:</label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      formData.days.includes(d) ? 'bg-[#8E9B6D] text-white' : 'bg-gray-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-[#8E9B6D] text-white rounded-xl font-bold hover:bg-[#8E9B6D]/90">
              Сохранить
            </button>
          </form>
        </div>
      )}
    </div>
  );
};