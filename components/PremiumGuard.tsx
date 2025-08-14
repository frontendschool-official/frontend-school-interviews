import React from 'react';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';
import { FiLock, FiStar, FiZap } from 'react-icons/fi';

interface PremiumGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  feature?: string;
}

export const PremiumGuard: React.FC<PremiumGuardProps> = ({
  children,
  fallback,
  showUpgradePrompt = true,
  feature = 'this feature',
}) => {
  const { hasPremiumAccess, loading } = useSubscription();

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (hasPremiumAccess()) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <div className='bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center'>
      <div className='flex flex-col items-center space-y-4'>
        <div className='w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center'>
          <FiLock className='w-8 h-8 text-white' />
        </div>

        <div className='space-y-2'>
          <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
            Premium Feature
          </h3>
          <p className='text-gray-600 dark:text-gray-300 max-w-md'>
            {feature} is available exclusively for premium users. Upgrade to
            unlock unlimited access to all features.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-3'>
          <Link
            href='/premium'
            className='inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            <FiStar className='w-5 h-5 mr-2' />
            Upgrade to Premium
          </Link>

          <button
            onClick={() => window.history.back()}
            className='inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200'
          >
            Go Back
          </button>
        </div>

        <div className='mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
          <h4 className='font-semibold text-gray-900 dark:text-white mb-2 flex items-center'>
            <FiZap className='w-4 h-4 mr-2 text-amber-500' />
            What's included in Premium?
          </h4>
          <ul className='text-sm text-gray-600 dark:text-gray-300 space-y-1'>
            <li>• Unlimited practice problems</li>
            <li>• AI-powered feedback</li>
            <li>• Mock interviews</li>
            <li>• Advanced analytics</li>
            <li>• Priority support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PremiumGuard;
