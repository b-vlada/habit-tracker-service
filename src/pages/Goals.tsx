import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Search, Edit2, BarChart3, Trash2, X, Calendar, Hourglass } from 'lucide-react';
import { Goal } from '../types';
import { useNavigate } from 'react-router-dom';

export const Goals = () => {
  const navigate = useNavigate();
  const { goals, addGoal, deleteGoal, updateGoal } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    target: 0,
    current: 0,
    deadline: '',
  });

  const filteredGoals = goals.filter(g =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (goal?: Goal) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        title: goal.title,
        target: goal.target,
        current: goal.current,
        deadline: goal.deadline,
      });
    } else {
      setEditingGoal(null);
      setFormData({
        title: '',
        target: 0,
        current: 0,
        deadline: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGoal) {
      const updated: Goal = {
        ...editingGoal,
        title: formData.title,
        target: formData.target,
        current: formData.current,
        deadline: formData.deadline,
      };
      updateGoal(updated);
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: formData.title,
        target: formData.target,
        current: formData.current,
        deadline: formData.deadline,
      };
      addGoal(newGoal);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Удалить эту цель?')) {
      deleteGoal(id);
    }
  };

  const getProgress = (goal: Goal) => {
    if (!goal.target || goal.target === 0) return 0;
    return Math.round((goal.current / goal.target) * 100);
  };

  const getDaysLeft = (deadline: string) => {
    if (!deadline) return 0;
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) return 0;
    const days = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-neutral-dark">Мои цели</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#B3907A] text-white rounded-xl hover:bg-[#B3907A]/90 transition-colors"
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
            placeholder="Поиск цели..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-[#8E9B6D]/30 rounded-xl lg:rounded-btn focus:outline-none focus:ring-2 focus:ring-[#8E9B6D]/50 bg-white/80"
          />
        </div>
      </div>

      <div className="space-y-3 lg:space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12 bg-[#F5F5EB] rounded-xl lg:rounded-card border border-[#B3907A] border-dashed">
            <p className="text-neutral-gray mb-4">Целей пока нет</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#B3907A] text-white rounded-xl hover:bg-[#B3907A]/90"
            >
              <Plus size={20} />
              Создать первую цель
            </button>
          </div>
        ) : (
          filteredGoals.map(goal => (
            <div
              key={goal.id}
              className="bg-[#F5F5EB] p-4 lg:p-5 rounded-xl lg:rounded-card border-[3px] border-[#B3907A]"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-neutral-dark mb-2">{goal.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-sm text-neutral-gray mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} className="text-[#B3907A]" />
                      До {formatDate(goal.deadline) || 'не указан'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Hourglass size={16} className="text-[#B3907A]" />
                      {getDaysLeft(goal.deadline)} дней
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                  <div 
                    className="bg-[#B3907A] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${getProgress(goal)}%` }}
                  />
                </div>
                <p className="text-sm text-[#B3907A] font-medium text-right">{getProgress(goal)}%</p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => openModal(goal)}
                  className="p-2 bg-[#B3907A] text-white rounded-lg hover:bg-[#B3907A]/90 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => navigate('/stats')}
                  className="p-2 bg-[#8E9B6D] text-white rounded-lg hover:bg-[#8E9B6D]/90 transition-colors"
                >
                  <BarChart3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="p-2 bg-[#940501] text-white rounded-lg hover:bg-[#940501]/90 transition-colors"
                >
                  <Trash2 size={16} />
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
                {editingGoal ? 'Редактировать цель' : 'Добавить цель'}
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
                  Название цели
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Например: Прочитать 20 книг"
                  className="w-full px-4 py-2 border border-[#8E9B6D]/30 rounded-btn focus:outline-none focus:ring-2 focus:ring-[#8E9B6D]/50"
                  required
                />
              </div>

              {editingGoal && (
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">
                    Текущий результат (вручную)
                  </label>
                  <input
                    type="number"
                    value={formData.current || ''}
                    onChange={(e) => setFormData({ ...formData, current: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-[#8E9B6D]/30 rounded-btn focus:outline-none focus:ring-2 focus:ring-[#8E9B6D]/50"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  Целевое значение
                </label>
                <input
                  type="number"
                  value={formData.target || ''}
                  onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                  placeholder="Например: 20"
                  className="w-full px-4 py-2 border border-[#8E9B6D]/30 rounded-btn focus:outline-none focus:ring-2 focus:ring-[#8E9B6D]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  Дедлайн
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-[#8E9B6D]/30 rounded-btn focus:outline-none focus:ring-2 focus:ring-[#8E9B6D]/50"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#B3907A] text-white rounded-btn hover:bg-[#B3907A]/90 font-medium"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-[#8E9B6D] text-white rounded-btn hover:bg-[#8E9B6D]/90 font-medium"
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