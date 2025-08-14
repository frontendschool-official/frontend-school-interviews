import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    'onChange' | 'size'
  > {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: string) => void;
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

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      variant = 'default',
      size = 'md',
      className = '',
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={selectId}
            className='block font-semibold text-text text-sm mb-2'
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          onChange={handleChange}
          className={`
            w-full rounded-xl bg-bodyBg text-text cursor-pointer transition-all duration-300 
            focus:outline-none
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value='' disabled>
              {placeholder}
            </option>
          )}

          {options?.map(option => (
            <option
              key={option?.value}
              value={option?.value}
              disabled={option?.disabled}
            >
              {option?.label}
            </option>
          ))}
        </select>

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

Select.displayName = 'Select';

export default Select;
