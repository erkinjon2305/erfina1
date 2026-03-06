import React from 'react';
import { cn } from '../../utils/helpers';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-sm font-bold text-slate-400 ml-1 uppercase tracking-widest">{label}</label>}
      <input
        className={cn(
          'flex h-12 w-full rounded-2xl border border-white/5 bg-slate-900/50 px-4 py-2 text-sm text-white placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20 focus-visible:border-amber-500/50 transition-all disabled:cursor-not-allowed disabled:opacity-50 shadow-inner',
          error && 'border-red-500/50 focus-visible:ring-red-500/20 focus-visible:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1 ml-1 font-medium">{error}</p>}
    </div>
  );
};
