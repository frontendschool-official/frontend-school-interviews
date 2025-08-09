import React from 'react';

type TagVariant = 'default' | 'success' | 'warning' | 'error' | 'outline';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
}

const variants: Record<TagVariant, string> = {
  default: 'bg-secondary text-text border border-border',
  success: 'bg-primary/10 text-primary border border-primary/30',
  warning: 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-700/50',
  error: 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/20 dark:text-red-200 dark:border-red-700/50',
  outline: 'bg-transparent text-text border border-border',
};

export default function Tag({ variant = 'default', className = '', children, ...props }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

