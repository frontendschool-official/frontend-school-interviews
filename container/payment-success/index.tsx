import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { FiCheckCircle, FiArrowRight, FiHome } from 'react-icons/fi';

const PaymentSuccessContainer: NextPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className='max-w-2xl mx-auto py-16 px-8 text-center'>
        <div className='text-6xl text-green-500 mb-8'>
          <FiCheckCircle />
        </div>

        <h1 className='text-4xl font-bold text-text mb-4'>
          Payment Successful!
        </h1>

        <p className='text-xl text-text/80 mb-12 leading-relaxed'>
          Thank you for your purchase! Your payment has been processed
          successfully. You will receive a confirmation email shortly with your
          order details.
        </p>

        <div className='flex gap-4 justify-center flex-wrap'>
          <button
            onClick={() => router.push('/')}
            className='bg-transparent text-text border-2 border-border px-8 py-4 rounded-xl font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2 hover:bg-neutral/10 hover:-translate-y-1'
          >
            <FiHome />
            Go to Home
          </button>

          <button
            onClick={() => router.push('/problems')}
            className='bg-primary text-bodyBg border-2 border-primary px-8 py-4 rounded-xl font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2 hover:bg-accent hover:-translate-y-1'
          >
            <FiArrowRight />
            Start Practicing
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccessContainer;
