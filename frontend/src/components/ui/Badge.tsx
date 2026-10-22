import React from 'react';

export type BadgeVariant = 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info' 
  | 'neutral' 
  | 'indigo' 
  | 'purple'
  | 'amber'
  | 'emerald'
  | 'rose';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  dot = false
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; dotColor: string }> = {
    success: {
      bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      dotColor: 'bg-emerald-400'
    },
    emerald: {
      bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      dotColor: 'bg-emerald-400'
    },
    warning: {
      bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      dotColor: 'bg-amber-400'
    },
    amber: {
      bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      dotColor: 'bg-amber-400'
    },
    danger: {
      bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      dotColor: 'bg-rose-400'
    },
    rose: {
      bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      dotColor: 'bg-rose-400'
    },
    info: {
      bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      dotColor: 'bg-cyan-400'
    },
    indigo: {
      bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      dotColor: 'bg-indigo-400'
    },
    purple: {
      bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      dotColor: 'bg-purple-400'
    },
    neutral: {
      bg: 'bg-slate-800/60 text-slate-300 border-slate-700/60',
      dotColor: 'bg-slate-400'
    }
  };

  const style = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border font-mono tracking-tight ${style.bg} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${style.dotColor}`} />}
      {children}
    </span>
  );
};
