import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Card({ header, footer, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-bodyBg border border-border rounded-xl shadow-card overflow-hidden ${className}`}
      {...props}
    >
      {header && <div className="px-4 py-3 border-b border-border bg-secondary/60">{header}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className="px-4 py-3 border-t border-border bg-secondary/60">{footer}</div>}
    </div>
  );
}

