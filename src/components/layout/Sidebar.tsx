import { NavLink } from 'react-router-dom';
import { Home, Target, BarChart3, LogOut } from 'lucide-react';
import { useState } from 'react';

const HabitIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="4"
      fill={isActive ? '#FFFFFF' : '#8E9B6D'}
    />
    <path
      d="M8 9H16M8 12H16M8 15H14"
      stroke={isActive ? '#8E9B6D' : '#FFFFFF'}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const navItems = [
  { path: '/', icon: Home, label: 'Главная', isCustom: false },
  { path: '/habits', icon: HabitIcon, label: 'Привычки', isCustom: true },
  { path: '/goals', icon: Target, label: 'Цели', isCustom: false },
  { path: '/stats', icon: BarChart3, label: 'Статистика', isCustom: false },
];

export const Sidebar = () => {
  const [name] = useState(localStorage.getItem('userName') || 'Пользователь');

  const handleLogout = () => {
    localStorage.removeItem('userName');
    window.location.reload();
  };

  return (
    <aside className="hidden lg:flex w-64 h-screen bg-[#F5F5EB] flex-col p-4 fixed left-0 top-0 border-r border-[#8E9B6D]/10">
      <div className="mb-8 px-4 pt-2">
        <h1 className="text-xl font-bold text-[#2C2C2C]">HabitTracker</h1>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#8E9B6D]'
                  : 'hover:bg-white/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${
                  isActive ? 'bg-white' : 'bg-[#8E9B6D]'
                }`}>
                  {item.isCustom ? (
                    <item.icon isActive={isActive} />
                  ) : (
                    <item.icon size={20} color={isActive ? '#8E9B6D' : '#FFFFFF'} />
                  )}
                </div>
                
                <span className={`font-medium ${isActive ? 'text-white' : 'text-[#2C2C2C]'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-[#8E9B6D]/20 px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#B3907A] rounded-full flex items-center justify-center text-white font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-[#2C2C2C]">{name}</p>
            <p className="text-xs text-gray-500">Профиль</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-500 hover:text-[#940501] transition-colors text-sm w-full py-2"
        >
          <LogOut size={18} />
          <span>Сменить имя</span>
        </button>
      </div>
    </aside>
  );
};