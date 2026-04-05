import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('userName', name.trim());
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5EB] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-neutral-dark mb-2">
          Добро пожаловать!
        </h1>
        <p className="text-center text-neutral-gray mb-8">
          Введите ваше имя для начала
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Ваше имя
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-[#8E9B6D]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E9B6D]/50 text-lg"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#8E9B6D] text-white rounded-xl font-medium hover:bg-[#8E9B6D]/90 transition-colors"
          >
            Начать
          </button>
        </form>
      </div>
    </div>
  );
};