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
    <article className={`tabler-card ${className}`}>
      {(title || action) && (
        <div className="tabler-card-header">
          <div>
            {title && <h3 className="tabler-card-title">{title}</h3>}
            {subtitle && <p className="page-description">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="tabler-card-body">{children}</div>
    </article>
  );
};
