import React from 'react';
import Loader from './Loader';
import {
  CardSkeleton,
  ProblemCardSkeleton,
  GridSkeleton,
  StatsGridSkeleton,
  HeaderSkeleton,
} from './Skeleton';

export interface LoadingStateProps {
  loading: boolean;
  children: React.ReactNode;
  type?: 'spinner' | 'skeleton' | 'grid' | 'stats' | 'cards' | 'header';
  skeletonProps?: {
    items?: number;
    columns?: number;
    className?: string;
  };
  loaderProps?: {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    variant?: 'spinner' | 'dots' | 'pulse';
    fullScreen?: boolean;
  };
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  children,
  type = 'spinner',
  skeletonProps = {},
  loaderProps = {},
  className = '',
}) => {
  if (!loading) {
    return <>{children}</>;
  }

  const renderLoadingContent = () => {
    switch (type) {
      case 'skeleton':
        return <CardSkeleton className={className} />;
      case 'grid':
        return (
          <GridSkeleton
            items={skeletonProps.items || 6}
            columns={skeletonProps.columns || 3}
            className={skeletonProps.className || className}
          />
        );
      case 'stats':
        return <StatsGridSkeleton className={className} />;
      case 'cards':
        return (
          <GridSkeleton
            items={skeletonProps.items || 6}
            columns={skeletonProps.columns || 3}
            itemComponent={ProblemCardSkeleton}
            className={skeletonProps.className || className}
          />
        );
      case 'header':
        return <HeaderSkeleton className={className} />;
      default:
        return (
          <Loader
            size={loaderProps.size || 'md'}
            text={loaderProps.text || 'Loading...'}
            variant={loaderProps.variant || 'spinner'}
            fullScreen={loaderProps.fullScreen || false}
            className={className}
          />
        );
    }
  };

  return renderLoadingContent();
};

// Specific loading state components for common use cases
export const PageLoadingState: React.FC<{ text?: string }> = ({
  text = 'Loading page...',
}) => <Loader size='lg' text={text} fullScreen />;

export const CardLoadingState: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 6, className = '' }) => (
  <GridSkeleton items={count} columns={3} className={className} />
);

export const ProblemCardLoadingState: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 6, className = '' }) => (
  <GridSkeleton
    items={count}
    columns={3}
    itemComponent={ProblemCardSkeleton}
    className={className}
  />
);

export const DashboardLoadingState: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div className={className}>
    <HeaderSkeleton />
    <StatsGridSkeleton />
    <GridSkeleton items={4} columns={2} />
  </div>
);

export default LoadingState;
