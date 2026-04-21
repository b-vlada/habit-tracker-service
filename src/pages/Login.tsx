import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5EB] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-neutral-dark mb-2">С возвращением!</h1>
        <p className="text-center text-neutral-gray mb-8">Войдите в свой аккаунт</p>
        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 border border-[#8E9B6D]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E9B6D]/50 text-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Пароль</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" className="w-full px-4 py-3 pr-12 border border-[#8E9B6D]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E9B6D]/50 text-lg" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-[#8E9B6D] text-white rounded-xl font-medium hover:bg-[#8E9B6D]/90 transition-colors disabled:opacity-50">{loading ? 'Вход...' : 'Войти'}</button>
        </form>
        <p className="mt-6 text-center text-neutral-gray">Нет аккаунта? <Link to="/signup" className="text-[#8E9B6D] font-medium hover:underline">Зарегистрироваться</Link></p>
        <p className="mt-2 text-center text-neutral-gray"><Link to="/forgot-password" className="text-[#8E9B6D] font-medium hover:underline">Забыли пароль?</Link></p>
      </div>
    </div>
  );
};