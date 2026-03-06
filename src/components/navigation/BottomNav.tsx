import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  BarChart3,
  User,
  FileText
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/helpers';

const navItems = [
  { icon: LayoutDashboard, label: 'Asosiy', path: '/' },
  { icon: ArrowUpRight, label: 'Kirim', path: '/daromad' },
  { icon: ArrowDownLeft, label: 'Chiqim', path: '/xarajatlar' },
  { icon: FileText, label: 'Tarix', path: '/tarix' },
  { icon: User, label: 'Profil', path: '/sozlamalar' },
];

export const BottomNav = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/5 px-4 py-3 z-50 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all duration-300',
              isActive ? 'text-amber-400 scale-110' : 'text-slate-500'
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn('w-6 h-6', isActive ? 'fill-amber-400/10' : '')} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
