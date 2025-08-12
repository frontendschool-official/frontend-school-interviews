import React from 'react';

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animation?: 'pulse' | 'wave';
}

const roundedClasses = {
  none: '',
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = 'md',
  animation = 'pulse',
}) => {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height)
    style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`bg-border animate-${animation} ${roundedClasses[rounded]} ${className}`}
      style={style}
    />
  );
};

// Card Skeleton Components
export const CardSkeleton: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    className={`bg-secondary border border-border rounded-xl p-6 ${className}`}
  >
    <div className='flex items-start space-x-4'>
      <Skeleton width={48} height={48} rounded='xl' />
      <div className='flex-1 space-y-3'>
        <Skeleton width='60%' height={20} />
        <Skeleton width='40%' height={16} />
        <div className='flex space-x-2'>
          <Skeleton width={60} height={24} rounded='xl' />
          <Skeleton width={80} height={24} rounded='xl' />
        </div>
      </div>
    </div>
    <div className='mt-4 space-y-2'>
      <Skeleton width='100%' height={16} />
      <Skeleton width='80%' height={16} />
    </div>
  </div>
);

export const ProblemCardSkeleton: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    className={`bg-secondary border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${className}`}
  >
    <div className='flex items-start justify-between mb-4'>
      <div className='flex items-start space-x-4 flex-1'>
        <Skeleton width={48} height={48} rounded='xl' />
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-2'>
            <Skeleton width='70%' height={20} />
            <Skeleton width={60} height={20} rounded='xl' />
          </div>
          <div className='flex space-x-2 mb-3'>
            <Skeleton width={60} height={24} rounded='xl' />
            <Skeleton width={80} height={24} rounded='xl' />
          </div>
        </div>
      </div>
    </div>
    <div className='space-y-2 mb-4'>
      <Skeleton width='100%' height={16} />
      <Skeleton width='80%' height={16} />
    </div>
    <div className='flex justify-between items-center'>
      <div className='flex space-x-2'>
        <Skeleton width={60} height={24} rounded='xl' />
        <Skeleton width={80} height={24} rounded='xl' />
      </div>
      <Skeleton width={80} height={32} rounded='lg' />
    </div>
  </div>
);

export const DashboardCardSkeleton: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    className={`bg-secondary border border-border rounded-xl p-6 flex items-center gap-4 ${className}`}
  >
    <Skeleton width={48} height={48} rounded='xl' />
    <div className='flex-1 space-y-2'>
      <Skeleton width='40%' height={24} />
      <Skeleton width='60%' height={16} />
      <Skeleton width='30%' height={12} />
    </div>
  </div>
);

export const ListItemSkeleton: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div className={`flex items-center space-x-4 p-4 ${className}`}>
    <Skeleton width={40} height={40} rounded='lg' />
    <div className='flex-1 space-y-2'>
      <Skeleton width='60%' height={18} />
      <Skeleton width='40%' height={14} />
    </div>
    <Skeleton width={80} height={32} rounded='lg' />
  </div>
);

export const TableRowSkeleton: React.FC<{
  columns?: number;
  className?: string;
}> = ({ columns = 4, className = '' }) => (
  <div className={`flex items-center space-x-4 p-4 ${className}`}>
    {Array.from({ length: columns }).map((_, index) => (
      <Skeleton
        key={index}
        width={index === 0 ? 40 : '100%'}
        height={20}
        className='flex-1'
      />
    ))}
  </div>
);

export const HeaderSkeleton: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div className={`mb-6 ${className}`}>
    <div className='flex justify-between items-start mb-4 p-4 bg-secondary rounded-2xl border border-border'>
      <div className='flex-1'>
        <div className='flex items-center space-x-4 mb-4'>
          <Skeleton width={48} height={48} rounded='xl' />
          <Skeleton width={200} height={32} />
        </div>
        <Skeleton width='80%' height={20} />
      </div>
      <div className='flex space-x-4'>
        <Skeleton width={120} height={40} rounded='xl' />
        <Skeleton width={120} height={40} rounded='xl' />
      </div>
    </div>
  </div>
);

export const GridSkeleton: React.FC<{
  items?: number;
  columns?: number;
  className?: string;
  itemComponent?: React.ComponentType<{ className?: string }>;
}> = ({
  items = 6,
  columns = 3,
  className = '',
  itemComponent: ItemComponent = CardSkeleton,
}) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4 sm:gap-6 ${className}`}
  >
    {Array.from({ length: items }).map((_, index) => (
      <ItemComponent key={index} />
    ))}
  </div>
);

export const StatsGridSkeleton: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
  >
    {Array.from({ length: 4 }).map((_, index) => (
      <DashboardCardSkeleton key={index} />
    ))}
  </div>
);

export default Skeleton;
