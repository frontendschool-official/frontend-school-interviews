import {
  PaymentDetails,
  RazorpayOrder,
  PaymentResponse,
} from '../../types/cart';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay script
export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.head.appendChild(script);
  });
};

// Create order on backend
export const createOrder = async (
  paymentDetails: PaymentDetails
): Promise<RazorpayOrder> => {
  try {
    console.log('Creating order with details:', paymentDetails);

    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentDetails),
    });

    console.log('Create order response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Create order error response:', errorText);

      let errorMessage = 'Failed to create order';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
        if (errorData.details) {
          console.error('Error details:', errorData.details);
        }
      } catch {
        console.error('Raw error response:', errorText);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Order created successfully:', data.order);
    return data.order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Initialize Razorpay payment
export const initializePayment = async (
  order: RazorpayOrder,
  paymentDetails: PaymentDetails,
  onSuccess: (response: any) => void,
  onFailure: (error: any) => void
): Promise<void> => {
  try {
    await loadRazorpayScript();

    // Validate required fields
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      throw new Error('Razorpay key ID not configured');
    }

    if (!order.id) {
      throw new Error('Order ID is required');
    }

    if (!order.amount || order.amount <= 0) {
      throw new Error('Invalid order amount');
    }

    // Format phone number for Razorpay (remove +91, spaces, dashes)
    const formatPhoneNumber = (phone: string): string => {
      if (!phone) return '';

      // Remove all non-digit characters
      let cleaned = phone.replace(/\D/g, '');

      // If it starts with 91 and is 12 digits, remove 91
      if (cleaned.startsWith('91') && cleaned.length === 12) {
        cleaned = cleaned.substring(2);
      }

      // If it's 10 digits, it's valid
      if (cleaned.length === 10) {
        return cleaned;
      }

      // If it's less than 10 digits, return empty (invalid)
      return '';
    };

    const formattedPhone = formatPhoneNumber(
      paymentDetails.customerPhone || ''
    );

    console.log('Initializing Razorpay with options:', {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      customerName: paymentDetails.customerName,
      customerEmail: paymentDetails.customerEmail,
      customerPhone: formattedPhone,
    });

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Frontend School Interviews',
      description: `Payment for ${paymentDetails.items.length} item(s)`,
      order_id: order.id,
      handler: onSuccess,
      prefill: {
        name: paymentDetails.customerName || '',
        email: paymentDetails.customerEmail || '',
        contact: formattedPhone,
      },
      notes: {
        address: 'Frontend School Interviews',
        customer_id: paymentDetails.customerEmail, // Use email as customer ID
        items: JSON.stringify(paymentDetails.items),
        original_phone: paymentDetails.customerPhone || '', // Keep original for reference
      },
      theme: {
        color: '#e5231c',
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal dismissed');
        },
        escape: false, // Prevent closing with escape key
        handleback: true, // Handle back button
      },
      // Additional options for better UX
      config: {
        display: {
          blocks: {
            banks: {
              name: 'Pay using UPI',
              instruments: [
                {
                  method: 'card',
                },
                {
                  method: 'netbanking',
                },
                {
                  method: 'wallet',
                },
                {
                  method: 'upi',
                },
              ],
            },
          },
          sequence: ['block.banks'],
          preferences: {
            show_default_blocks: false,
          },
        },
      },
      // Auto-fill customer details
      remember_customer: true,
      // Enable one-click payments for returning customers
      callback_url: `${window.location.origin}/payment-success`,
      cancel_url: `${window.location.origin}/premium`,
    };

    console.log('Razorpay options prepared:', options);
    console.log('Phone number formatting:', {
      original: paymentDetails.customerPhone,
      formatted: formattedPhone,
      isValid: formattedPhone.length === 10,
    });

    if (!window.Razorpay) {
      throw new Error('Razorpay script not loaded');
    }

    const razorpay = new window.Razorpay(options);
    console.log('Razorpay instance created, opening modal...');
    razorpay.open();
  } catch (error) {
    console.error('Error initializing payment:', error);
    onFailure(error);
  }
};

// Verify payment on backend
export const verifyPayment = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<PaymentResponse> => {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        paymentId,
        signature,
      }),
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Payment verification failed',
    };
  }
};

// Save payment to Firebase
export const savePaymentToFirebase = async (
  userId: string,
  paymentData: {
    orderId: string;
    paymentId: string;
    amount: number;
    currency: string;
    status: string;
    items: any[];
  }
) => {
  try {
    const response = await fetch('/api/save-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...paymentData,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving payment:', error);
    throw error;
  }
};
