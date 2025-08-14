import React from 'react';
import { getDifficultyBadgeColor, getButtonClasses } from '@/lib/utils';

interface DifficultyBadgeProps {
  difficulty: string;
  children: React.ReactNode;
}

interface TechnologyTagProps {
  children: React.ReactNode;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  children,
}) => {
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border ${getDifficultyBadgeColor(difficulty)} shadow-sm`}
    >
      {children}
    </span>
  );
};

export const TechnologyTag: React.FC<TechnologyTagProps> = ({ children }) => {
  return (
    <span className='px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium'>
      {children}
    </span>
  );
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  return (
    <button
      className={`${getButtonClasses(variant, size)} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
