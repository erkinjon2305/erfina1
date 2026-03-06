import React from 'react';
import { cn } from '../../utils/helpers';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title, subtitle }) => {
  return (
    <div className={cn('bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-xl overflow-hidden', className)}>
      {title && (
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
      )}
      <div className="p-6 text-slate-300">{children}</div>
    </div>
  );
};
