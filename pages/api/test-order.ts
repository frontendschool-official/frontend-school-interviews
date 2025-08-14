import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🧪 Test order API called');
    console.log('📤 Request body:', req.body);

    // Check environment variables
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    console.log('🔑 Environment check:');
    console.log('  - Razorpay Key ID:', razorpayKeyId ? 'Set' : 'Not set');
    console.log(
      '  - Razorpay Key Secret:',
      razorpayKeySecret ? 'Set' : 'Not set'
    );

    if (!razorpayKeyId || !razorpayKeySecret) {
      return res.status(500).json({
        error: 'Razorpay credentials not configured',
        details: {
          keyId: !!razorpayKeyId,
          keySecret: !!razorpayKeySecret,
        },
      });
    }

    // Create a test order
    const testOrderData = {
      amount: 100, // 1 rupee in paise
      currency: 'INR',
      receipt: `test_receipt_${Date.now()}`,
      notes: {
        test: true,
        timestamp: new Date().toISOString(),
      },
    };

    console.log('📋 Test order data:', testOrderData);

    // Try to create order with Razorpay
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${razorpayKeyId}:${razorpayKeySecret}`
        ).toString('base64')}`,
      },
      body: JSON.stringify(testOrderData),
    });

    console.log('📥 Razorpay response status:', razorpayResponse.status);

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text();
      console.error('❌ Razorpay API error:', errorData);

      return res.status(razorpayResponse.status).json({
        error: 'Failed to create test order',
        details: errorData,
        status: razorpayResponse.status,
      });
    }

    const order = await razorpayResponse.json();
    console.log('✅ Test order created:', order);

    res.status(200).json({
      success: true,
      message: 'Test order created successfully',
      order: order,
      environment: {
        keyIdSet: !!razorpayKeyId,
        keySecretSet: !!razorpayKeySecret,
        keyIdPrefix: razorpayKeyId?.substring(0, 4),
      },
    });
  } catch (error) {
    console.error('❌ Test order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create test order',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
