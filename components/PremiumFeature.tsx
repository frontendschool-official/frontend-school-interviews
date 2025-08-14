import React from 'react';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';
import { FiLock, FiStar, FiZap } from 'react-icons/fi';

interface PremiumFeatureProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
  showUpgradeButton?: boolean;
  className?: string;
}

export const PremiumFeature: React.FC<PremiumFeatureProps> = ({
  children,
  feature,
  description,
  showUpgradeButton = true,
  className = '',
}) => {
  const { hasPremiumAccess, loading } = useSubscription();

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (hasPremiumAccess()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Blurred content */}
      <div className='blur-sm pointer-events-none'>{children}</div>

      {/* Premium overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-amber-50/90 to-orange-50/90 dark:from-amber-900/90 dark:to-orange-900/90 backdrop-blur-sm rounded-lg border border-amber-200 dark:border-amber-800 flex items-center justify-center'>
        <div className='text-center p-6'>
          <div className='w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3'>
            <FiLock className='w-6 h-6 text-white' />
          </div>

          <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
            Premium Feature
          </h3>

          <p className='text-sm text-gray-600 dark:text-gray-300 mb-4 max-w-xs'>
            {description ||
              `${feature} is available exclusively for premium users.`}
          </p>

          {showUpgradeButton && (
            <Link
              href='/premium'
              className='inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              <FiStar className='w-4 h-4 mr-1' />
              Upgrade
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumFeature;
