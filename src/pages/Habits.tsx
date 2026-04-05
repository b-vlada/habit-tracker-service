import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Search, Edit2, BarChart3, Trash2, Play, Pause, X, Calendar } from 'lucide-react';
import { Habit } from '../types';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const FlameIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" fill="#B3907A" />
  </svg>
);

export const Habits = () => {
  const navigate = useNavigate();
  const { habits, addHabit, deleteHabit, toggleHabitStatus, updateHabit } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    days: [] as string[],
  });

  const filteredHabits = habits.filter(h =>
    h.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (habit?: Habit) => {
    if (habit) {
      setEditingHabit(habit);
      setFormData({
        title: habit.title,
        description: habit.description,
        days: habit.days,
      });
    } else {
      setEditingHabit(null);
      setFormData({
        title: '',
        description: '',
        days: [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingHabit) {
      const updatedHabit: Habit = {
        ...editingHabit,
        title: formData.title,
        description: formData.description,
        days: formData.days.length > 0 ? formData.days : daysOfWeek,
      };
      updateHabit(updatedHabit);
    } else {
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
    }
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

  const handleDelete = (id: string) => {
    if (window.confirm('Удалить эту привычку?')) {
      deleteHabit(id);
    }
  };

  const handleToggleStatus = (id: string) => {
    toggleHabitStatus(id);
  };

  const getDaysText = (days: string[]) => {
    if (days.length === 7) return 'Каждый день';
    return days.join(', ');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-neutral-dark">Мои привычки</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#8E9B6D] text-white rounded-xl hover:bg-[#8E9B6D]/90 transition-colors"
        >
          <Plus size={20} />
          Добавить
        </button>
      </div>

      <div className="mb-4 lg:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray" size={20} />
          <input
            type="text"
            placeholder="Поиск привычки..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-[#8E9B6D]/30 rounded-xl lg:rounded-btn focus:outline-none focus:ring-2 focus:ring-[#8E9B6D]/50 bg-white/80"
          />
        </div>
      </div>

      <div className="space-y-3 lg:space-y-4">
        {filteredHabits.length === 0 ? (
          <div className="text-center py-12 bg-[#F5F5EB] rounded-xl lg:rounded-card border border-[#8E9B6D] border-dashed">
            <p className="text-neutral-gray mb-4">Привычек пока нет</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8E9B6D] text-white rounded-xl hover:bg-[#8E9B6D]/90"
            >
              <Plus size={20} />
              Создать первую привычку
            </button>
          </div>
        ) : (
          filteredHabits.map(habit => (
            <div
              key={habit.id}
              className="bg-[#F5F5EB] p-4 lg:p-5 rounded-xl lg:rounded-card border-[3px] border-[#8E9B6D]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-dark mb-2">{habit.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-sm text-neutral-gray">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={16} className="text-[#8E9B6D]" />
                      {getDaysText(habit.days)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FlameIcon />
                      {habit.streak} дней
                    </span>
                  </div>
                </div>
                <span className={`px-2 lg:px-3 py-1 rounded-lg lg:rounded-btn text-xs lg:text-sm font-bold flex items-center gap-1.5 ${
                  habit.status === 'active'
                    ? 'bg-[#8E9B6D]/20 text-[#8E9B6D]'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {habit.status === 'active' ? <span className="text-[#8E9B6D]">⚡</span> : <span className="text-gray-500">⏸</span>}
                  {habit.status === 'active' ? 'Активно' : 'На паузе'}
                </span>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {habit.status === 'active' ? (
                  <button
                    onClick={() => handleToggleStatus(habit.id)}
                    className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Pause size={16} />
                    <span className="hidden lg:inline">На паузу</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleStatus(habit.id)}
                    className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-[#8E9B6D] text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Play size={16} />
                    <span className="hidden lg:inline">Возобновить</span>
                  </button>
                )}
                
                <button
                  onClick={() => openModal(habit)}
                  className="p-2 bg-[#8E9B6D] text-white rounded-lg hover:bg-[#8E9B6D]/90 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => navigate('/stats')}
                  className="p-2 bg-[#8E9B6D] text-white rounded-lg hover:bg-[#8E9B6D]/90 transition-colors"
                >
                  <BarChart3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(habit.id)}
                  className="p-2 bg-[#940501] text-white rounded-lg hover:bg-[#940501]/90 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50 p-0 lg:p-4">
          <div className="bg-white rounded-t-2xl lg:rounded-card w-full lg:max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-6 border-b border-[#8E9B6D]/20">
              <h2 className="text-xl font-bold text-neutral-dark">
                {editingHabit ? 'Редактировать привычку' : 'Добавить привычку'}
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