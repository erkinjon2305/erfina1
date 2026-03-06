import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Tags, 
  BarChart3, 
  FileText, 
  User,
  LogOut
} from 'lucide-react';
import { cn } from '../../utils/helpers';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import React from 'react';
import { Logo } from '../ui/Logo';

const menuItems = [
  { icon: LayoutDashboard, label: 'Bosh sahifa', path: '/' },
  { icon: ArrowUpRight, label: 'Daromad', path: '/daromad' },
  { icon: ArrowDownLeft, label: 'Xarajatlar', path: '/xarajatlar' },
  { icon: FileText, label: 'Tarix', path: '/tarix' },
  { icon: Tags, label: 'Kategoriyalar', path: '/kategoriyalar' },
  { icon: BarChart3, label: 'Analitika', path: '/analitika' },
  { icon: User, label: 'Profil', path: '/sozlamalar' },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, userData, logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen bg-[#0F172A] text-white fixed left-0 top-0 z-40 border-r border-white/5">
      <div className="p-10">
        {/* Logo removed as per user request */}
      </div>

      <nav className="flex-1 px-6 space-y-3 mt-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden',
                isActive 
                  ? 'bg-gradient-to-r from-[#B8860B] to-[#F9D71C] text-slate-900 shadow-2xl shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className={cn('w-5 h-5 transition-transform group-hover:scale-110', isActive ? 'text-slate-900' : 'text-slate-500')} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute right-0 w-1.5 h-6 bg-slate-900 rounded-l-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-white/10 overflow-hidden flex items-center justify-center text-primary font-black">
            {userData?.photoURL ? (
              <img src={userData.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              (userData?.displayName || user?.displayName || 'U').charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{userData?.displayName || user?.displayName || 'Foydalanuvchi'}</p>
            <p className="text-[10px] font-medium text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={() => confirm('Tizimdan chiqmoqchimisiz?') && logout()}
          className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-black text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Chiqish
        </button>
      </div>
    </aside>
  );
};
