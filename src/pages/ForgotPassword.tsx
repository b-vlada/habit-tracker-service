import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.resetPassword(email, newPassword);
      setMessage('Пароль успешно изменён!');
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Ошибка восстановления');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5EB] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-gray-500 hover:text-[#8E9B6D] mb-6 transition-colors">
          <ArrowLeft size={20} /> Назад ко входу
        </button>
        <h1 className="text-2xl font-bold text-center text-neutral-dark mb-2">{step === 1 ? 'Восстановление пароля' : 'Готово!'}</h1>
        <p className="text-center text-neutral-gray mb-8">{step === 1 ? 'Введите email и новый пароль' : 'Теперь войдите с новым паролем'}</p>
        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">{message}</div>}
        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 border border-[#8E9B6D]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E9B6D]/50 text-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">Новый пароль</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" className="w-full px-4 py-3 pr-12 border border-[#8E9B6D]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E9B6D]/50 text-lg" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-[#8E9B6D] text-white rounded-xl font-medium hover:bg-[#8E9B6D]/90 transition-colors disabled:opacity-50">{loading ? 'Сохранение...' : 'Сменить пароль'}</button>
          </form>
        )}
        {step === 2 && (
          <Link to="/login" className="block w-full py-3 text-center bg-[#8E9B6D] text-white rounded-xl font-medium hover:bg-[#8E9B6D]/90 transition-colors">Войти в аккаунт</Link>
        )}
      </div>
    </div>
  );
};