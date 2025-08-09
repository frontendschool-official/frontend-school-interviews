import React from 'react';

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

const getDifficultyBadgeColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "border-primary text-primary";
    case "medium":
      return "border-amber-500 text-amber-500";
    case "hard":
      return "border-red-500 text-red-500";
    default:
      return "border-neutral text-neutral";
  }
};

const getButtonClasses = (variant: 'primary' | 'secondary' | 'success' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:shadow-focus";
  
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-accent shadow-card hover:shadow-lg",
    secondary: "bg-secondary text-text border border-border hover:bg-secondary/80",
    success: "bg-primary text-white hover:bg-accent shadow-card hover:shadow-lg"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
};

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, children }) => {
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border ${getDifficultyBadgeColor(difficulty)} shadow-sm`}>
      {children}
    </span>
  );
};

export const TechnologyTag: React.FC<TechnologyTagProps> = ({ children }) => {
  return (
    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
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
  className = ''
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