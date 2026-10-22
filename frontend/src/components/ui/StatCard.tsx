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
  trend
}) => {
  return (
    <div className="metric-card">
      <div className="metric-card-label">
        <span>{title}</span>
        <Icon size={16} color="#0f766e" />
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
        <div className="metric-card-value">{value}</div>
        {trend && (
          <span className={`status-pill ${trend.positive ? 'status-pill-success' : 'status-pill-danger'}`}>
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="metric-card-subtext">{subtitle}</div>
      )}
    </div>
  );
};
