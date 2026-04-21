import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { Home } from './pages/Home';
import { Habits } from './pages/Habits';
import { Goals } from './pages/Goals';
import { Statistics } from './pages/Statistics';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#F5F5EB] flex items-center justify-center"><div className="text-neutral-gray text-xl">Загрузка...</div></div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5EB]">
      <Sidebar />
      <main className="flex-1 px-4 pt-6 pb-56 lg:pb-8 lg:ml-64 lg:pt-8 w-full max-w-5xl mx-auto overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home userName={user.name || user.email?.split('@')[0] || 'User'} />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/stats" element={<Statistics />} />
        </Routes>
        <div className="h-32 lg:hidden"></div>
      </main>
      <BottomNav />
    </div>
  );
}

export default App;