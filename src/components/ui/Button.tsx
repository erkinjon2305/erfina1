import React from 'react';
import { cn } from '../../utils/helpers';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-[#B8860B] to-[#F9D71C] text-slate-900 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-500/10',
    secondary: 'bg-slate-800 text-white hover:bg-slate-700 border border-white/5',
    outline: 'border border-white/10 bg-transparent hover:bg-white/5 text-slate-300',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-white',
    danger: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20',
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs font-black uppercase tracking-widest',
    md: 'h-12 px-6 text-sm font-black uppercase tracking-widest',
    lg: 'h-14 px-8 text-base font-black uppercase tracking-widest',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};
