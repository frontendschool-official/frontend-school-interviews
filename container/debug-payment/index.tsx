import React, { useState } from 'react';
import { NextPage } from 'next';
import Layout from '@/components/Layout';
import {
  createOrder,
  verifyPayment,
  savePaymentToFirebase,
} from '@/services/payment/razorpay';
import { PaymentDetails } from '@/types/cart';

const DebugPaymentContainer: NextPage = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testCreateOrder = async () => {
    setIsLoading(true);
    addLog('Testing create order...');

    try {
      const paymentDetails: PaymentDetails = {
        amount: 100,
        currency: 'INR',
        orderId: `test_order_${Date.now()}`,
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '1234567890',
        items: [
          {
            id: 'test-item',
            title: 'Test Item',
            description: 'Test description',
            price: 100,
            type: 'premium_plan',
            quantity: 1,
          },
        ],
      };

      addLog(`Payment details: ${JSON.stringify(paymentDetails, null, 2)}`);

      const order = await createOrder(paymentDetails);
      addLog(`Order created successfully: ${JSON.stringify(order, null, 2)}`);
    } catch (error) {
      addLog(`Error creating order: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testPaymentFlow = async () => {
    setIsLoading(true);
    addLog('Testing complete payment flow...');

    try {
      // Step 1: Create order
      const paymentDetails: PaymentDetails = {
        amount: 100,
        currency: 'INR',
        orderId: `test_order_${Date.now()}`,
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '1234567890',
        items: [
          {
            id: 'test-item',
            title: 'Test Item',
            description: 'Test description',
            price: 100,
            type: 'premium_plan',
            quantity: 1,
          },
        ],
      };

      addLog('Step 1: Creating order...');
      const order = await createOrder(paymentDetails);
      addLog(`Order created: ${order.id}`);

      // Step 2: Initialize payment
      addLog('Step 2: Initializing payment...');
      // Note: initializePayment requires callbacks, so we'll skip this step in debug mode
      addLog('Payment initialization skipped (requires user interaction)');

      // Step 3: Simulate payment verification (in real scenario, this would be called by Razorpay webhook)
      addLog('Step 3: Simulating payment verification...');
      const verificationResult = await verifyPayment(
        order.id,
        'test_payment_id',
        'test_signature'
      );
      addLog(
        `Payment verification result: ${JSON.stringify(verificationResult, null, 2)}`
      );

      // Step 4: Save payment to Firebase
      addLog('Step 4: Saving payment to Firebase...');
      const savedPayment = await savePaymentToFirebase('test_user_id', {
        orderId: order.id,
        paymentId: 'test_payment_id',
        amount: 100,
        currency: 'INR',
        status: 'success',
        items: paymentDetails.items,
      });
      addLog(
        `Payment saved to Firebase: ${JSON.stringify(savedPayment, null, 2)}`
      );

      addLog('✅ Complete payment flow test successful!');
    } catch (error) {
      addLog(`❌ Error in payment flow: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkEnvironment = () => {
    addLog('Checking environment variables...');

    const requiredVars = [
      'NEXT_PUBLIC_RAZORPAY_KEY_ID',
      'RAZORPAY_KEY_SECRET',
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'FIREBASE_AUTH_DOMAIN',
      'FIREBASE_PROJECT_ID',
    ];

    requiredVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        addLog(
          `✅ ${varName}: ${varName.includes('SECRET') ? '***' : value.substring(0, 10)}...`
        );
      } else {
        addLog(`❌ ${varName}: Not set`);
      }
    });
  };

  return (
    <Layout>
      <div className='max-w-4xl mx-auto p-8'>
        <h1 className='text-3xl font-bold text-text mb-8'>
          Payment Debug Tools
        </h1>

        <div className='bg-secondary border border-border rounded-2xl p-8 mb-8'>
          <h3 className='text-text mb-4 text-xl font-semibold'>
            Test Functions
          </h3>
          <button
            onClick={testCreateOrder}
            disabled={isLoading}
            className='bg-primary text-bodyBg border-none px-8 py-4 rounded-xl font-semibold cursor-pointer transition-all duration-300 m-2 hover:bg-accent hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Test Create Order
          </button>
          <button
            onClick={testPaymentFlow}
            disabled={isLoading}
            className='bg-primary text-bodyBg border-none px-8 py-4 rounded-xl font-semibold cursor-pointer transition-all duration-300 m-2 hover:bg-accent hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Test Complete Payment Flow
          </button>
          <button
            onClick={checkEnvironment}
            disabled={isLoading}
            className='bg-primary text-bodyBg border-none px-8 py-4 rounded-xl font-semibold cursor-pointer transition-all duration-300 m-2 hover:bg-accent hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Check Environment Variables
          </button>
          <button
            onClick={clearLogs}
            disabled={isLoading}
            className='bg-primary text-bodyBg border-none px-8 py-4 rounded-xl font-semibold cursor-pointer transition-all duration-300 m-2 hover:bg-accent hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Clear Logs
          </button>
        </div>

        <div className='bg-secondary border border-border rounded-2xl p-8 mb-8'>
          <h3 className='text-text mb-4 text-xl font-semibold'>Debug Logs</h3>
          <div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-80 overflow-y-auto mt-4'>
            {logs.length === 0 ? (
              <div>No logs yet. Run a test to see results.</div>
            ) : (
              logs.map((log, index) => <div key={index}>{log}</div>)
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DebugPaymentContainer;
