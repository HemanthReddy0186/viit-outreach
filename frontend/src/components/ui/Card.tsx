import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action
}) => {
  return (
    <div className={`glass-card rounded-2xl p-5 border border-slate-800/80 ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-slate-800/60">
          <div>
            {title && (
              <h3 className="font-heading font-semibold text-slate-100 text-base tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
