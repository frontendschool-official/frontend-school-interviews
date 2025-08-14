import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { apiClient } from '@/lib/api-client';

// Fallback toast implementation in case react-hot-toast is not available
let toast: any;
try {
  const toastModule = require('react-hot-toast');
  toast = toastModule.toast;
} catch (error) {
  // Fallback implementation
  toast = {
    success: (message: string) => console.log('Success:', message),
    error: (message: string) => console.error('Error:', message),
  };
}

export interface SubscriptionStatus {
  isPremium: boolean;
  subscriptionStatus: 'free' | 'premium' | 'expired' | 'lifetime';
  subscriptionExpiresAt?: string;
  planId?: string;
  daysRemaining: number;
  subscription?: any;
}

export interface SubscriptionData {
  planId: string;
  paymentId: string;
  amount: number;
}

interface CacheEntry {
  data: SubscriptionStatus;
  timestamp: number;
  expiresAt: number;
}

export const useSubscription = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Cache for subscription status (5 minutes)
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const RETRY_DELAY = 30000; // 30 seconds

  // Get cache key for user
  const getCacheKey = useCallback(
    (userId: string) => `subscription_${userId}`,
    []
  );

  // Check if cache is valid
  const isCacheValid = useCallback((cacheKey: string): boolean => {
    const cached = cacheRef.current.get(cacheKey);
    if (!cached) return false;

    return Date.now() < cached.expiresAt;
  }, []);

  // Get cached data
  const getCachedData = useCallback(
    (cacheKey: string): SubscriptionStatus | null => {
      const cached = cacheRef.current.get(cacheKey);
      return cached?.data || null;
    },
    []
  );

  // Set cache data
  const setCachedData = useCallback(
    (cacheKey: string, data: SubscriptionStatus) => {
      const now = Date.now();
      cacheRef.current.set(cacheKey, {
        data,
        timestamp: now,
        expiresAt: now + CACHE_DURATION,
      });
    },
    []
  );

  // Clear cache
  const clearCache = useCallback((cacheKey?: string) => {
    if (cacheKey) {
      cacheRef.current.delete(cacheKey);
    } else {
      cacheRef.current.clear();
    }
  }, []);

  // Fetch subscription status from API with retry logic
  const fetchSubscriptionStatus = useCallback(
    async (retryCount = 0): Promise<void> => {
      if (!user) {
        setSubscriptionStatus(null);
        return;
      }

      const cacheKey = getCacheKey(user.uid);

      // Check cache first
      if (isCacheValid(cacheKey)) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          setSubscriptionStatus(cachedData);
          setError(null);
          return;
        }
      }

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.getSubscriptionStatus();

        if (response.error) {
          throw new Error(
            response.error || 'Failed to fetch subscription status'
          );
        }

        const data = response.data as SubscriptionStatus;

        // Validate response data
        if (!data || typeof data.isPremium !== 'boolean') {
          throw new Error('Invalid subscription data received');
        }

        // Cache the data
        setCachedData(cacheKey, data);
        setSubscriptionStatus(data);
        setLastFetchTime(Date.now());
      } catch (err) {
        console.error('Error fetching subscription status:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch subscription status';
        setError(errorMessage);

        // Retry logic (max 3 retries)
        if (retryCount < 3) {
          setTimeout(
            () => {
              fetchSubscriptionStatus(retryCount + 1);
            },
            RETRY_DELAY * (retryCount + 1)
          );
        } else {
          toast.error(
            'Failed to load subscription status. Please refresh the page.'
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [user, getCacheKey, isCacheValid, getCachedData, setCachedData]
  );

  // Activate subscription after payment
  const activateSubscription = useCallback(
    async (data: SubscriptionData): Promise<any> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.activateSubscription(data);

        if (response.error) {
          throw new Error(response.error || 'Failed to activate subscription');
        }

        // Clear cache to force refresh
        clearCache(getCacheKey(user.uid));

        // Refresh user profile to get updated subscription status
        await refreshProfile();

        // Fetch updated subscription status
        await fetchSubscriptionStatus();

        toast.success('Subscription activated successfully!');
        return response.data;
      } catch (err) {
        console.error('Error activating subscription:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to activate subscription';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, clearCache, getCacheKey, refreshProfile, fetchSubscriptionStatus]
  );

  // Check if user has premium access
  const hasPremiumAccess = useCallback((): boolean => {
    if (!subscriptionStatus) return false;
    return (
      subscriptionStatus.isPremium &&
      subscriptionStatus.subscriptionStatus !== 'expired'
    );
  }, [subscriptionStatus]);

  // Check if user has lifetime access
  const hasLifetimeAccess = useCallback((): boolean => {
    if (!subscriptionStatus) return false;
    return subscriptionStatus.subscriptionStatus === 'lifetime';
  }, [subscriptionStatus]);

  // Check if subscription is expired
  const isExpired = useCallback((): boolean => {
    if (!subscriptionStatus) return false;
    return subscriptionStatus.subscriptionStatus === 'expired';
  }, [subscriptionStatus]);

  // Check if subscription is expiring soon (within 7 days)
  const isExpiringSoon = useCallback((): boolean => {
    if (!subscriptionStatus || hasLifetimeAccess()) return false;
    return (
      subscriptionStatus.daysRemaining <= 7 &&
      subscriptionStatus.daysRemaining > 0
    );
  }, [subscriptionStatus, hasLifetimeAccess]);

  // Get subscription expiry date
  const getExpiryDate = useCallback((): Date | null => {
    if (!subscriptionStatus?.subscriptionExpiresAt) return null;
    return new Date(subscriptionStatus.subscriptionExpiresAt);
  }, [subscriptionStatus]);

  // Format days remaining
  const formatDaysRemaining = useCallback((): string => {
    if (!subscriptionStatus) return '';

    if (subscriptionStatus.subscriptionStatus === 'lifetime') {
      return 'Lifetime Access';
    }

    if (subscriptionStatus.daysRemaining <= 0) {
      return 'Expired';
    }

    if (subscriptionStatus.daysRemaining === 1) {
      return '1 day remaining';
    }

    if (subscriptionStatus.daysRemaining <= 7) {
      return `${subscriptionStatus.daysRemaining} days remaining (expiring soon)`;
    }

    return `${subscriptionStatus.daysRemaining} days remaining`;
  }, [subscriptionStatus]);

  // Get subscription status color
  const getStatusColor = useCallback((): string => {
    if (!subscriptionStatus) return 'text-gray-500';

    switch (subscriptionStatus.subscriptionStatus) {
      case 'lifetime':
        return 'text-purple-600';
      case 'premium':
        return isExpiringSoon() ? 'text-orange-600' : 'text-green-600';
      case 'expired':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  }, [subscriptionStatus, isExpiringSoon]);

  // Get subscription plan name
  const getPlanName = useCallback((): string => {
    if (!subscriptionStatus) return 'Free';

    switch (subscriptionStatus.subscriptionStatus) {
      case 'lifetime':
        return 'Lifetime';
      case 'premium':
        return 'Premium';
      case 'expired':
        return 'Expired';
      default:
        return 'Free';
    }
  }, [subscriptionStatus]);

  // Initialize subscription status
  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    } else {
      setSubscriptionStatus(null);
      setError(null);
    }
  }, [user, fetchSubscriptionStatus]);

  // Auto-refresh subscription status every 5 minutes
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const timeSinceLastFetch = Date.now() - lastFetchTime;
      if (timeSinceLastFetch >= CACHE_DURATION) {
        fetchSubscriptionStatus();
      }
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, [user, lastFetchTime, fetchSubscriptionStatus, CACHE_DURATION]);

  // Clear cache when user changes
  useEffect(() => {
    return () => {
      if (user) {
        clearCache(getCacheKey(user.uid));
      }
    };
  }, [user, clearCache, getCacheKey]);

  return {
    // State
    subscriptionStatus,
    loading,
    error,

    // Access checks
    hasPremiumAccess,
    hasLifetimeAccess,
    isExpired,
    isExpiringSoon,

    // Data getters
    getExpiryDate,
    formatDaysRemaining,
    getStatusColor,
    getPlanName,

    // Actions
    activateSubscription,
    refreshStatus: fetchSubscriptionStatus,
    clearCache: () => clearCache(),
  };
};
