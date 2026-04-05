import { NavLink } from 'react-router-dom';
import { Home, List, Target, BarChart3 } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Главная' },
  { path: '/habits', icon: List, label: 'Привычки' },
  { path: '/goals', icon: Target, label: 'Цели' },
  { path: '/stats', icon: BarChart3, label: 'Статистика' },
];

export const BottomNav = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#F5F5EB] px-4 pt-3 pb-6 z-50 border-t border-[#8E9B6D]/20">
      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-[#8E9B6D] text-white shadow-sm'
                  : 'bg-white text-[#2C2C2C] border border-[#8E9B6D]/20'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={24} className={`mb-1 ${isActive ? 'text-white' : 'text-[#8E9B6D]'}`} />
                <span className="text-xs text-center">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};