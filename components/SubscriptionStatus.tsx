import React from 'react';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';
import { FiStar, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface SubscriptionStatusProps {
  showUpgradeButton?: boolean;
  className?: string;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  showUpgradeButton = true,
  className = '',
}) => {
  const {
    subscriptionStatus,
    hasPremiumAccess,
    isExpired,
    getExpiryDate,
    formatDaysRemaining,
    loading,
  } = useSubscription();

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!subscriptionStatus) {
    return null;
  }

  const getStatusColor = () => {
    if (subscriptionStatus.subscriptionStatus === 'lifetime') {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
    if (hasPremiumAccess()) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
    if (isExpired()) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getStatusIcon = () => {
    if (subscriptionStatus.subscriptionStatus === 'lifetime') {
      return <FiStar className='w-4 h-4' />;
    }
    if (hasPremiumAccess()) {
      return <FiCheckCircle className='w-4 h-4' />;
    }
    if (isExpired()) {
      return <FiAlertCircle className='w-4 h-4' />;
    }
    return <FiClock className='w-4 h-4' />;
  };

  const getStatusText = () => {
    switch (subscriptionStatus.subscriptionStatus) {
      case 'lifetime':
        return 'Lifetime Premium';
      case 'premium':
        return 'Premium Active';
      case 'expired':
        return 'Subscription Expired';
      default:
        return 'Free Plan';
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}
    >
      <div className='flex items-center justify-between mb-3'>
        <h3 className='font-semibold text-gray-900 dark:text-white flex items-center'>
          <FiStar className='w-4 h-4 mr-2 text-amber-500' />
          Subscription Status
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor()}`}
        >
          {getStatusIcon()}
          <span className='ml-1'>{getStatusText()}</span>
        </span>
      </div>

      {subscriptionStatus.subscriptionStatus !== 'free' && (
        <div className='space-y-2 mb-4'>
          {subscriptionStatus.planId && (
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>Plan:</span>
              <span className='font-medium text-gray-900 dark:text-white capitalize'>
                {subscriptionStatus.planId}
              </span>
            </div>
          )}

          <div className='flex justify-between text-sm'>
            <span className='text-gray-600 dark:text-gray-400'>Duration:</span>
            <span className='font-medium text-gray-900 dark:text-white'>
              {formatDaysRemaining()}
            </span>
          </div>

          {getExpiryDate() &&
            subscriptionStatus.subscriptionStatus !== 'lifetime' && (
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600 dark:text-gray-400'>
                  Expires:
                </span>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {getExpiryDate()?.toLocaleDateString()}
                </span>
              </div>
            )}
        </div>
      )}

      {!hasPremiumAccess() && showUpgradeButton && (
        <Link
          href='/premium'
          className='w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl'
        >
          <FiStar className='w-4 h-4 mr-2' />
          Upgrade to Premium
        </Link>
      )}

      {isExpired() && showUpgradeButton && (
        <div className='mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'>
          <p className='text-sm text-red-700 dark:text-red-300 mb-2'>
            Your subscription has expired. Renew to continue enjoying premium
            features.
          </p>
          <Link
            href='/premium'
            className='inline-flex items-center justify-center px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition-colors duration-200'
          >
            Renew Subscription
          </Link>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
