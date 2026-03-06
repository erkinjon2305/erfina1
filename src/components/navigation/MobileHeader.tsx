import React from 'react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';

import { LogOut } from 'lucide-react';

export const MobileHeader = () => {
  const { userData, user, logout } = useAuth();

  return (
    <header className="lg:hidden sticky top-0 left-0 right-0 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 z-40 flex justify-between items-center">
      <div className="flex-1">
        {/* Logo removed as per user request */}
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => confirm('Tizimdan chiqmoqchimisiz?') && logout()}
          className="p-2 text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B8860B] to-[#F9D71C] overflow-hidden flex items-center justify-center text-slate-900 font-black text-xs">
          {userData?.photoURL ? (
            <img src={userData.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            (userData?.displayName || user?.displayName || 'U').charAt(0).toUpperCase()
          )}
        </div>
      </div>
    </header>
  );
};
