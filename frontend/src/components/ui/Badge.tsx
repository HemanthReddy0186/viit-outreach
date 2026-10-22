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
  | 'rose'
  | 'teal';

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
  let pillClass = 'status-pill-neutral';

  if (variant === 'success' || variant === 'emerald') pillClass = 'status-pill-success';
  if (variant === 'danger' || variant === 'rose') pillClass = 'status-pill-danger';
  if (variant === 'warning' || variant === 'amber') pillClass = 'status-pill-warning';
  if (variant === 'info' || variant === 'indigo' || variant === 'purple' || variant === 'teal') pillClass = 'status-pill-teal';

  return (
    <span className={`status-pill ${pillClass} ${className}`}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />}
      {children}
    </span>
  );
};
