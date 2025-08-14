import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import Layout from '@/components/Layout';
import { FiCheckCircle, FiStar, FiZap, FiArrowRight } from 'react-icons/fi';

const PaymentSuccessPage: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { subscriptionStatus, hasPremiumAccess, formatDaysRemaining } =
    useSubscription();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push('/login');
      return;
    }

    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, router]);

  if (loading) {
    return (
      <Layout>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
            <h2 className='text-xl font-semibold text-text'>
              Activating your subscription...
            </h2>
            <p className='text-text/70 mt-2'>
              Please wait while we set up your premium access.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'>
        <div className='max-w-4xl mx-auto py-12 px-4'>
          {/* Success Header */}
          <div className='text-center mb-12'>
            <div className='w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6'>
              <FiCheckCircle className='w-10 h-10 text-white' />
            </div>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Payment Successful!
            </h1>
            <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Thank you for upgrading to Premium! Your subscription has been
              activated successfully.
            </p>
          </div>

          {/* Subscription Details */}
          {subscriptionStatus && (
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center'>
                Your Premium Subscription
              </h2>

              <div className='grid md:grid-cols-2 gap-8'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg'>
                    <span className='font-medium text-gray-700 dark:text-gray-300'>
                      Status
                    </span>
                    <span className='px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold'>
                      Active
                    </span>
                  </div>

                  <div className='flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                    <span className='font-medium text-gray-700 dark:text-gray-300'>
                      Plan
                    </span>
                    <span className='font-semibold text-gray-900 dark:text-white capitalize'>
                      {subscriptionStatus.planId}
                    </span>
                  </div>

                  <div className='flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
                    <span className='font-medium text-gray-700 dark:text-gray-300'>
                      Duration
                    </span>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      {formatDaysRemaining()}
                    </span>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h3 className='font-semibold text-gray-900 dark:text-white mb-3 flex items-center'>
                    <FiStar className='w-5 h-5 mr-2 text-amber-500' />
                    Premium Features Unlocked
                  </h3>
                  <ul className='space-y-2 text-gray-600 dark:text-gray-300'>
                    <li className='flex items-center'>
                      <FiCheckCircle className='w-4 h-4 text-green-500 mr-2' />
                      Unlimited practice problems
                    </li>
                    <li className='flex items-center'>
                      <FiCheckCircle className='w-4 h-4 text-green-500 mr-2' />
                      AI-powered feedback
                    </li>
                    <li className='flex items-center'>
                      <FiCheckCircle className='w-4 h-4 text-green-500 mr-2' />
                      Mock interviews
                    </li>
                    <li className='flex items-center'>
                      <FiCheckCircle className='w-4 h-4 text-green-500 mr-2' />
                      Advanced analytics
                    </li>
                    <li className='flex items-center'>
                      <FiCheckCircle className='w-4 h-4 text-green-500 mr-2' />
                      Priority support
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='text-center space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button
                onClick={() => router.push('/problems')}
                className='inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl'
              >
                <FiZap className='w-5 h-5 mr-2' />
                Start Practicing
                <FiArrowRight className='w-5 h-5 ml-2' />
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                className='inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200'
              >
                Go to Dashboard
              </button>
            </div>

            <p className='text-sm text-gray-500 dark:text-gray-400'>
              You'll receive a confirmation email shortly with your subscription
              details.
            </p>
          </div>

          {/* Support Section */}
          <div className='mt-12 text-center'>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700'>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                Need Help?
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-4'>
                Our support team is here to help you get the most out of your
                premium subscription.
              </p>
              <button className='text-primary hover:text-primary/80 font-medium'>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccessPage;
