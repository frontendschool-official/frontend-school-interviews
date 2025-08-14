import React, { useState } from 'react';
import { NextPage } from 'next';
import { useAuth } from '@/hooks/useAuth';
import {
  FiCheck,
  FiStar,
  FiZap,
  FiShield,
  FiUsers,
  FiClock,
} from 'react-icons/fi';
import { apiClient } from '@/lib/api-client';
import {
  initializePayment,
  verifyPayment,
  savePaymentToFirebase,
} from '@/services/payment/razorpay';
import { useSubscription } from '@/hooks/useSubscription';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 999,
    originalPrice: 1499,
    period: 'month',
    features: [
      'Unlimited practice problems',
      'AI-powered feedback',
      'Mock interviews',
      'Progress tracking',
      'Priority support',
      'Advanced analytics',
    ],
    popular: false,
    savings: '33% off',
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    price: 7999,
    originalPrice: 17988,
    period: 'year',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Exclusive content',
      'Early access to features',
      '1-on-1 consultation',
      'Resume review',
    ],
    popular: true,
    savings: '55% off',
  },
  {
    id: 'lifetime',
    name: 'Lifetime Access',
    price: 19999,
    originalPrice: 59997,
    period: 'lifetime',
    features: [
      'Everything in Yearly',
      'Lifetime updates',
      'Premium community access',
      'Personal mentor',
      'Job placement assistance',
      'Certificate of completion',
    ],
    popular: false,
    savings: '67% off',
  },
];

const PremiumPage: NextPage = () => {
  const { user } = useAuth();
  const { hasPremiumAccess, activateSubscription } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (plan: (typeof plans)[0]) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    // Check if user already has premium access
    if (hasPremiumAccess()) {
      alert('You already have premium access!');
      return;
    }

    setLoading(plan.id);
    try {
      // Create order
      const orderResponse = await apiClient.createOrder({
        amount: plan.price, // Send amount in rupees
        currency: 'INR',
        customerName: user.displayName || 'Unknown',
        customerEmail: user.email || '',
        customerPhone: user.phoneNumber || '',
        items: [
          {
            id: plan.id,
            title: plan.name,
            description: plan.features.join(', '),
            price: plan.price,
            type: 'premium_plan' as const,
            duration: plan.period,
            features: plan.features,
            quantity: 1,
          },
        ],
      });

      if (orderResponse.error) {
        throw new Error(orderResponse.error);
      }

      // The API returns {success: true, order: {...}}
      const responseData = orderResponse.data as any;
      console.log('📋 Full API response:', orderResponse);
      console.log('📋 Response data:', responseData);

      const order = responseData?.order || responseData;
      console.log('📋 Extracted order:', order);

      // Validate order structure
      if (!order || !order.id || !order.amount) {
        console.error('❌ Invalid order structure:', order);
        console.error('📋 Full response:', orderResponse);
        throw new Error('Invalid order received from payment gateway');
      }

      console.log('✅ Order validation passed');

      // Initialize payment
      const paymentDetails = {
        amount: plan.price, // Send amount in rupees
        currency: 'INR',
        customerName: user.displayName || 'Unknown',
        customerEmail: user.email || '',
        customerPhone: user.phoneNumber || '',
        items: [
          {
            id: plan.id,
            title: plan.name,
            description: plan.features.join(', '),
            price: plan.price,
            type: 'premium_plan' as const,
            duration: plan.period,
            features: plan.features,
            quantity: 1,
          },
        ],
      };

      await initializePayment(
        order,
        paymentDetails,
        async (response: any) => {
          console.log('🎉 Payment successful:', response);
          console.log('👤 Current user:', user);
          console.log('🔐 User authenticated:', !!user);

          if (!user) {
            console.error('❌ No user found in payment success callback');
            alert('Authentication error. Please try again.');
            return;
          }

          try {
            // Get the user's ID token for API calls
            const idToken = await user.getIdToken();
            console.log('🔑 ID token obtained:', idToken ? 'Yes' : 'No');
            console.log('🔍 Step 1: Verifying payment...');
            // Verify payment
            const verificationResult = await verifyPayment(
              order.id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            console.log('📋 Verification result:', verificationResult);

            if (!verificationResult.success) {
              throw new Error('Payment verification failed');
            }

            console.log('✅ Payment verification successful');

            console.log('💾 Step 2: Saving payment to Firebase...');
            // Save payment to Firebase
            await savePaymentToFirebase({
              orderId: order.id,
              paymentId: response.razorpay_payment_id,
              amount: plan.price,
              currency: 'INR',
              status: 'success',
              items: paymentDetails.items,
            });

            console.log('✅ Payment saved to Firebase');

            console.log('🔓 Step 3: Activating subscription...');
            // Activate subscription
            await activateSubscription({
              planId: plan.id,
              paymentId: response.razorpay_payment_id,
              amount: plan.price,
            });

            console.log('✅ Subscription activated successfully');

            // Redirect to success page
            console.log('🔄 Redirecting to success page...');
            window.location.href = '/payment-success';
          } catch (error) {
            console.error('❌ Error processing payment success:', error);
            console.error('❌ Error details:', {
              message: error instanceof Error ? error.message : 'Unknown error',
              stack: error instanceof Error ? error.stack : 'No stack trace',
              name: error instanceof Error ? error.name : 'Unknown',
            });
            alert(
              'Payment successful but there was an error activating your subscription. Please contact support.'
            );
          } finally {
            setLoading(null);
          }
        },
        (error: any) => {
          console.error('Payment failed:', error);
          setLoading(null);
        }
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className='min-h-screen bg-bodyBg'>
      <div className='max-w-6xl mx-auto py-6 sm:py-8 px-4'>
        {/* Header */}
        <div className='text-center mb-8 sm:mb-12'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-text mb-4'>
            Upgrade to Premium
          </h1>
          <p className='text-base sm:text-lg text-text/80 leading-relaxed max-w-3xl mx-auto px-4'>
            Unlock unlimited access to all problems, AI-powered feedback, mock
            interviews, and advanced analytics to accelerate your interview
            preparation.
          </p>
        </div>

        {/* Plans Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12'>
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`relative p-6 sm:p-8 border-2 rounded-2xl transition-all duration-300 ${
                plan.popular
                  ? 'border-primary bg-primary/5 scale-105'
                  : 'border-border bg-secondary hover:border-primary/50'
              } hover:scale-105 hover:shadow-xl`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className='absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 sm:px-4 py-1 rounded-full text-xs font-semibold uppercase'>
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className='text-center mb-4 sm:mb-6'>
                <h3 className='text-lg sm:text-xl md:text-2xl font-semibold text-text mb-2'>
                  {plan.name}
                </h3>
                <div className='flex items-center justify-center gap-2 mb-2'>
                  <span className='text-2xl sm:text-3xl font-bold text-primary'>
                    ₹{plan.price.toLocaleString()}
                  </span>
                  <span className='text-text/60 line-through text-sm sm:text-base'>
                    ₹{plan.originalPrice.toLocaleString()}
                  </span>
                </div>
                <div className='text-xs sm:text-sm text-text/70 mb-3 sm:mb-4'>
                  per {plan.period}
                </div>
                <div className='inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium'>
                  <FiStar className='w-3 h-3 sm:w-4 sm:h-4' />
                  {plan.savings}
                </div>
              </div>

              {/* Features */}
              <ul className='space-y-2 sm:space-y-3 mb-6 sm:mb-8'>
                {plan.features.map((feature, index) => (
                  <li key={index} className='flex items-center gap-2 sm:gap-3'>
                    <FiCheck className='w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0' />
                    <span className='text-sm sm:text-base text-text'>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handlePurchase(plan)}
                disabled={loading === plan.id}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-accent'
                    : 'bg-secondary text-text border border-border hover:border-primary hover:bg-primary/10'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin'></div>
                    Processing...
                  </div>
                ) : (
                  `Get ${plan.name}`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className='bg-secondary border border-border rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12'>
          <h2 className='text-xl sm:text-2xl font-bold text-text text-center mb-6 sm:mb-8'>
            What's Included in Premium
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
            <div className='text-center'>
              <div className='w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                <FiZap className='w-6 h-6 sm:w-8 sm:h-8 text-primary' />
              </div>
              <h3 className='text-base sm:text-lg font-semibold text-text mb-2'>
                Unlimited Problems
              </h3>
              <p className='text-sm sm:text-base text-text/70'>
                Access to all DSA, machine coding, system design, and theory
                problems
              </p>
            </div>

            <div className='text-center'>
              <div className='w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                <FiShield className='w-6 h-6 sm:w-8 sm:h-8 text-primary' />
              </div>
              <h3 className='text-base sm:text-lg font-semibold text-text mb-2'>
                AI Feedback
              </h3>
              <p className='text-sm sm:text-base text-text/70'>
                Get detailed, personalized feedback on your solutions
              </p>
            </div>

            <div className='text-center'>
              <div className='w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                <FiUsers className='w-6 h-6 sm:w-8 sm:h-8 text-primary' />
              </div>
              <h3 className='text-base sm:text-lg font-semibold text-text mb-2'>
                Mock Interviews
              </h3>
              <p className='text-sm sm:text-base text-text/70'>
                Practice with realistic interview simulations
              </p>
            </div>

            <div className='text-center'>
              <div className='w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                <FiClock className='w-6 h-6 sm:w-8 sm:h-8 text-primary' />
              </div>
              <h3 className='text-base sm:text-lg font-semibold text-text mb-2'>
                Progress Tracking
              </h3>
              <p className='text-sm sm:text-base text-text/70'>
                Monitor your improvement with detailed analytics
              </p>
            </div>

            <div className='text-center'>
              <div className='w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                <FiStar className='w-6 h-6 sm:w-8 sm:h-8 text-primary' />
              </div>
              <h3 className='text-base sm:text-lg font-semibold text-text mb-2'>
                Priority Support
              </h3>
              <p className='text-sm sm:text-base text-text/70'>
                Get help when you need it with priority support
              </p>
            </div>

            <div className='text-center'>
              <div className='w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                <FiCheck className='w-6 h-6 sm:w-8 sm:h-8 text-primary' />
              </div>
              <h3 className='text-base sm:text-lg font-semibold text-text mb-2'>
                Advanced Features
              </h3>
              <p className='text-sm sm:text-base text-text/70'>
                Access to exclusive content and advanced tools
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className='text-center'>
          <h2 className='text-xl sm:text-2xl font-bold text-text mb-4'>
            Frequently Asked Questions
          </h2>
          <p className='text-sm sm:text-base text-text/70 mb-6 sm:mb-8'>
            Have questions? We're here to help.
          </p>
          <button className='px-4 sm:px-6 py-2 sm:py-3 border border-border rounded-lg text-text hover:bg-secondary transition-colors text-sm sm:text-base'>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
