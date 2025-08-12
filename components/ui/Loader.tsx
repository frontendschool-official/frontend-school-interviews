import React from 'react';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text = 'Loading...',
  className = '',
  variant = 'spinner',
  fullScreen = false,
}) => {
  const renderSpinner = () => (
    <div
      className={`animate-spin rounded-full border-4 border-primary border-t-transparent ${sizeClasses[size]}`}
    />
  );

  const renderDots = () => (
    <div className='flex space-x-1'>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`bg-primary rounded-full animate-bounce ${sizeClasses[size].replace('h-', 'h-').replace('w-', 'w-')}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={`bg-primary rounded-full animate-pulse ${sizeClasses[size]}`}
    />
  );

  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div
      className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : ''} ${className}`}
    >
      <div className='text-center'>
        {renderVariant()}
        {text && (
          <p className={`text-text/80 mt-4 font-medium ${textSizes[size]}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );

  return content;
};

export default Loader;
