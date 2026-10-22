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
      <div className="metric-card-top">
        <span className="metric-card-label">{title}</span>
        <div className="metric-icon-wrap">
          <Icon size={16} />
        </div>
      </div>

      <div style={{ margin: '0.4rem 0 0.2rem 0' }}>
        <div className="metric-card-value">{value}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        {subtitle && <span className="metric-card-subtext">{subtitle}</span>}
        {trend && (
          <span className={`status-pill ${trend.positive ? 'status-pill-success' : 'status-pill-danger'}`} style={{ fontSize: '0.7rem' }}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
