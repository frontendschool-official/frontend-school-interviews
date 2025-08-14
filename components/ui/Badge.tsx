import React from 'react';
import {
  getStatusBadgeColor,
  getDifficultyBadgeColor,
  getCategoryBadgeColor,
  getTypeDisplayName,
} from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'status' | 'difficulty' | 'category' | 'default';
  status?: string;
  difficulty?: string;
  category?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

const variantClasses = {
  default: 'bg-secondary text-text border border-border',
  status: 'text-white shadow-sm',
  difficulty: 'border font-semibold uppercase tracking-wider shadow-sm',
  category: 'border font-semibold uppercase tracking-wider shadow-sm',
};

export default function Badge({
  children,
  variant = 'default',
  status,
  difficulty,
  category,
  size = 'md',
  className = '',
}: BadgeProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'status':
        return `${getStatusBadgeColor(status)} ${variantClasses.status}`;
      case 'difficulty':
        return `${getDifficultyBadgeColor(difficulty || '')} ${variantClasses.difficulty}`;
      case 'category':
        return `${getCategoryBadgeColor(category || '')} ${variantClasses.category}`;
      default:
        return variantClasses.default;
    }
  };

  const getDisplayText = () => {
    if (variant === 'category' && category) {
      return getTypeDisplayName(category);
    }
    return children;
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors ${sizeClasses[size]} ${getVariantClasses()} ${className}`}
    >
      {getDisplayText()}
    </span>
  );
}

// Convenience components for common badge types
export const StatusBadge: React.FC<{
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ status, size = 'md', className = '' }) => (
  <Badge variant='status' status={status} size={size} className={className}>
    {status}
  </Badge>
);

export const DifficultyBadge: React.FC<{
  difficulty: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ difficulty, size = 'md', className = '' }) => (
  <Badge
    variant='difficulty'
    difficulty={difficulty}
    size={size}
    className={className}
  >
    {difficulty}
  </Badge>
);

export const CategoryBadge: React.FC<{
  category: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ category, size = 'md', className = '' }) => (
  <Badge
    variant='category'
    category={category}
    size={size}
    className={className}
  >
    {category}
  </Badge>
);
