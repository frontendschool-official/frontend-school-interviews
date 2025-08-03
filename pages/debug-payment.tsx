import React, { useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { createOrder, initializePayment, verifyPayment, savePaymentToFirebase } from '../services/razorpay';
import { PaymentDetails } from '../types/cart';

const DebugContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const DebugTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 2rem;
`;

const DebugCard = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const DebugButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.accent};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LogContainer = styled.div`
  background: #1a1a1a;
  color: #00ff00;
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 1rem;
`;

const DebugPaymentPage: NextPage = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
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
        items: [{
          id: 'test-item',
          title: 'Test Item',
          description: 'Test description',
          price: 100,
          type: 'premium_plan',
          quantity: 1,
        }],
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
      const paymentDetails: PaymentDetails = {
        amount: 100,
        currency: 'INR',
        orderId: `test_order_${Date.now()}`,
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '1234567890',
        items: [{
          id: 'test-item',
          title: 'Test Item',
          description: 'Test description',
          price: 100,
          type: 'premium_plan',
          quantity: 1,
        }],
      };

      addLog('Step 1: Creating order...');
      const order = await createOrder(paymentDetails);
      addLog(`Order created: ${order.id}`);

      addLog('Step 2: Initializing payment...');
      await initializePayment(
        order,
        paymentDetails,
        async (response: any) => {
          addLog(`Payment response received: ${JSON.stringify(response, null, 2)}`);
          
          try {
            addLog('Step 3: Verifying payment...');
            const verification = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            addLog(`Payment verification: ${JSON.stringify(verification, null, 2)}`);

            if (verification.success) {
              addLog('Step 4: Saving to Firebase...');
              await savePaymentToFirebase('test-user-id', {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: 100,
                currency: 'INR',
                status: 'completed',
                items: paymentDetails.items,
              });
              addLog('Payment saved to Firebase successfully!');
            }
          } catch (error) {
            addLog(`Error in payment verification: ${error}`);
          }
        },
        (error: any) => {
          addLog(`Payment failed: ${error}`);
        }
      );
    } catch (error) {
      addLog(`Error in payment flow: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkEnvironment = () => {
    addLog('Checking environment variables...');
    addLog(`NEXT_PUBLIC_RAZORPAY_KEY_ID: ${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 'Set' : 'Not Set'}`);
    addLog(`NEXT_PUBLIC_FIREBASE_API_KEY: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Not Set'}`);
    addLog(`NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Not Set'}`);
  };

  return (
    <Layout>
      <DebugContainer>
        <DebugTitle>Payment Debug Page</DebugTitle>
        
        <DebugCard>
          <h2>Environment Check</h2>
          <DebugButton onClick={checkEnvironment}>
            Check Environment Variables
          </DebugButton>
        </DebugCard>

        <DebugCard>
          <h2>API Tests</h2>
          <DebugButton onClick={testCreateOrder} disabled={isLoading}>
            Test Create Order API
          </DebugButton>
          <DebugButton onClick={testPaymentFlow} disabled={isLoading}>
            Test Complete Payment Flow
          </DebugButton>
        </DebugCard>

        <DebugCard>
          <h2>Debug Logs</h2>
          <DebugButton onClick={clearLogs}>
            Clear Logs
          </DebugButton>
          <LogContainer>
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </LogContainer>
        </DebugCard>
      </DebugContainer>
    </Layout>
  );
};

export default DebugPaymentPage; 