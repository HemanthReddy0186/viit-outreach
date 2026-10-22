import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'indigo'
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      gradient: 'from-indigo-500/15 via-transparent to-transparent'
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      gradient: 'from-emerald-500/15 via-transparent to-transparent'
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      gradient: 'from-amber-500/15 via-transparent to-transparent'
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      gradient: 'from-rose-500/15 via-transparent to-transparent'
    },
    cyan: {
      bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      gradient: 'from-cyan-500/15 via-transparent to-transparent'
    }
  };

  const colors = colorMap[accentColor];

  return (
    <div className="glass-card glass-card-hover relative overflow-hidden rounded-2xl p-5 border border-slate-800/80">
      <div className={`absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-gradient-to-br ${colors.gradient} pointer-events-none blur-xl`} />
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${colors.bg}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-heading font-bold text-slate-100 tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-mono font-semibold ${
              trend.positive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
          {subtitle}
        </p>
      )}
    </div>
  );
};
