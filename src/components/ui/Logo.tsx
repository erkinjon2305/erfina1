import React from 'react';
import { cn } from '../../utils/helpers';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  showText = true,
  orientation = 'vertical'
}) => {
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36',
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-lg',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-7xl',
  };

  const subtitleSizes = {
    xs: 'text-[6px]',
    sm: 'text-[8px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  };

  return (
    <div className={cn(
      'flex items-center gap-2', 
      orientation === 'vertical' ? 'flex-col text-center' : 'flex-row',
      className
    )}>
      {/* High-Fidelity SVG Reconstruction of the ErFina Logo */}
      <div className={cn('relative flex items-center justify-center shrink-0', iconSizes[size])}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#F9D71C" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
            <linearGradient id="greenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          
          {/* ER Monogram in Serif */}
          <text 
            x="50%" 
            y="65%" 
            textAnchor="middle" 
            fontFamily="Georgia, serif" 
            fontWeight="900" 
            fontSize="60" 
            fill="url(#goldGrad)"
          >
            ER
          </text>

          {/* Bar Chart inside the 'E' area */}
          <rect x="28" y="45" width="6" height="12" rx="1" fill="url(#greenGrad)" />
          <rect x="36" y="38" width="6" height="19" rx="1" fill="url(#greenGrad)" />
          <rect x="44" y="32" width="6" height="25" rx="1" fill="url(#greenGrad)" />

          {/* Arrow Swoosh - matching the PNG's curve */}
          <path 
            d="M15 65 C 25 75, 55 75, 85 25" 
            stroke="url(#goldGrad)" 
            strokeWidth="5" 
            fill="none" 
            strokeLinecap="round"
          />
          {/* Arrow Head */}
          <path 
            d="M78 28 L85 25 L85 32" 
            fill="url(#goldGrad)"
          />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col items-start">
          <div className="flex items-baseline font-serif font-black tracking-tight leading-none">
            <span className="text-[#B8860B]" style={{ fontSize: '1.1em' }}>
              <span className={textSizes[size]}>Er</span>
            </span>
            <span className="text-[#059669]" style={{ fontSize: '1.1em' }}>
              <span className={textSizes[size]}>Fina</span>
            </span>
          </div>
          <span className={cn(
            'font-bold text-slate-500/60 mt-0.5',
            subtitleSizes[size]
          )}>
            Moliyaviy yordamchingiz
          </span>
        </div>
      )}
    </div>
  );
};
