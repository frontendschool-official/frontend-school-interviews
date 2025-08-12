import React, { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white shadow-card hover:-translate-y-0.5 hover:shadow-lg focus:shadow-focus disabled:bg-primary/60',
  secondary:
    'bg-secondary text-text border border-border hover:bg-secondary/80 focus:shadow-focus disabled:opacity-60',
  ghost:
    'bg-transparent text-text hover:bg-secondary border border-transparent hover:border-border focus:shadow-focus disabled:opacity-60',
  icon: 'bg-secondary text-text border border-border hover:bg-secondary/80 focus:shadow-focus disabled:opacity-60 p-0',
  danger:
    'bg-red-500 text-white hover:bg-red-600 focus:shadow-focus disabled:bg-red-500/60',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isIconOnly = variant === 'icon';
    const base =
      'inline-flex items-center justify-center rounded-xl font-semibold transition-all select-none outline-none focus:outline-none';
    const iconSizing = isIconOnly ? 'h-10 w-10' : '';
    const gap = isIconOnly ? '' : 'gap-2';
    return (
      <button
        ref={ref}
        className={`${base} ${gap} ${variantClasses[variant]} ${isIconOnly ? iconSizing : sizeClasses[size]} ${className}`}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && (
          <span
            className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent'
            aria-hidden
          />
        )}
        {!isLoading && leftIcon}
        {!isIconOnly && <span>{children}</span>}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
