import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../services/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Save payment API called with method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, orderId, paymentId, amount, currency, status, items } = req.body;
    console.log('Payment data received:', { userId, orderId, paymentId, amount, currency, status });

    // Validate required fields
    if (!userId || !orderId || !paymentId || !amount) {
      console.error('Missing required fields for saving payment');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save payment to Firebase
    const paymentData = {
      userId,
      orderId,
      paymentId,
      amount,
      currency: currency || 'INR',
      status,
      items,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    console.log('Payment data to save:', paymentData);

    const paymentsRef = collection(db, 'payments');
    const docRef = await addDoc(paymentsRef, paymentData);

    console.log('Payment saved to Firebase with ID:', docRef.id);

    res.status(200).json({
      success: true,
      paymentId: docRef.id,
      message: 'Payment saved successfully',
    });
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save payment',
    });
  }
} 