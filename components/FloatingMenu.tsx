import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Zap, Briefcase, Phone, FileText } from 'lucide-react';

const MENU_ITEMS = [
  { path: '/', icon: <Home size={22} />, label: 'Trang chủ' },
  { path: '/about', icon: <User size={22} />, label: 'Giới thiệu' },
  { path: '/services', icon: <Zap size={22} />, label: 'Dịch vụ' },
  { path: '/projects', icon: <Briefcase size={22} />, label: 'Dự án' },
  { path: '/blog', icon: <FileText size={22} />, label: 'Blog' },
  { path: '/contact', icon: <Phone size={22} />, label: 'Liên hệ' },
];

export const FloatingMenu: React.FC = () => {
  return (
    <div className="fixed bottom-5 left-0 right-0 z-[9999] flex justify-center md:hidden pointer-events-none animate-slide-up">
      <div className="bg-[#6f3aff]/20 backdrop-blur-xl rounded-full px-3 py-2 flex items-center gap-1.5 border border-[#9d7aff]/30 shadow-[0_0_25px_rgba(111,58,255,0.35)] pointer-events-auto">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group relative p-2.5 md:p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-tr from-primary to-secondary text-white shadow-[0_0_20px_rgba(111,58,255,0.6)] scale-110'
                  : 'text-textMuted hover:bg-white/10 hover:text-white hover:scale-110'
              }`
            }
          >
            {item.icon}
            
            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#111115]/90 backdrop-blur-md border border-white/10 rounded-lg text-[11px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
              {item.label}
              {/* Tooltip Arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111115]/90 border-r border-b border-white/10 transform rotate-45"></div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
