import React, { forwardRef } from 'react';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
  default:
    'border-2 border-border/50 focus:border-neutralDark focus:shadow-lg focus:shadow-neutral/20',
  filled:
    'border-2 border-transparent bg-secondary focus:border-neutralDark focus:shadow-lg focus:shadow-neutral/20',
  outlined:
    'border-2 border-border focus:border-primary focus:shadow-lg focus:shadow-primary/20',
};

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      size = 'md',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={inputId}
            className='block font-semibold text-text text-sm mb-2'
          >
            {label}
          </label>
        )}

        <div className='relative'>
          {leftIcon && (
            <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text/60'>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl bg-bodyBg text-text transition-all duration-300 
              focus:outline-none placeholder:text-text/60
              ${variantClasses[variant]}
              ${sizeClasses[size]}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error ? 'border-red-500 focus:border-red-500' : ''}
              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-text/60'>
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <div
            className={`mt-2 text-sm ${error ? 'text-red-500' : 'text-text/60'}`}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
