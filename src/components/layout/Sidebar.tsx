import { NavLink } from 'react-router-dom';
import { Target, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const HabitIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="4" fill={color} />
    <path d="M8 9H16M8 12H16M8 15H14" stroke={color === 'white' ? '#8E9B6D' : 'white'} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const navItems = [
  { path: '/', icon: 'home', label: 'Главная' },
  { path: '/habits', icon: 'habits', label: 'Привычки' },
  { path: '/goals', icon: 'goals', label: 'Цели' },
  { path: '/stats', icon: 'stats', label: 'Статистика' },
];

export const Sidebar = () => {
  const { user, logOut } = useAuth();
  const name = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <aside className="hidden lg:flex w-64 h-screen bg-[#F5F5EB] flex-col p-4 fixed left-0 top-0 border-r border-[#8E9B6D]/10">
      <h1 className="text-xl font-bold mb-8 px-4 text-[#2C2C2C]">HabitTracker</h1>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-[#8E9B6D]' : 'hover:bg-white/60'
              }`
            }
          >
            {({ isActive }) => {
              const iconColor = isActive ? 'white' : '#8E9B6D';
              const textColor = isActive ? 'text-white' : 'text-[#2C2C2C]';

              return (
                <>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${isActive ? 'bg-white' : 'bg-[#8E9B6D]'}`}>
                    {item.icon === 'habits' ? (
                      <HabitIcon color={isActive ? '#8E9B6D' : 'white'} />
                    ) : item.icon === 'home' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#8E9B6D' : 'white'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    ) : item.icon === 'goals' ? (
                      <Target size={20} color={isActive ? '#8E9B6D' : 'white'} />
                    ) : (
                      <BarChart3 size={20} color={isActive ? '#8E9B6D' : 'white'} />
                    )}
                  </div>
                  <span className={`font-medium ${textColor}`}>{item.label}</span>
                </>
              );
            }}
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-[#8E9B6D]/20 px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#B3907A] rounded-full flex items-center justify-center text-white font-bold shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-[#2C2C2C] truncate">{name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logOut}
          className="flex items-center gap-3 text-gray-500 hover:text-[#940501] transition-colors text-sm w-full py-2"
        >
          <LogOut size={18} />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
};