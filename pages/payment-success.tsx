import React from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { FiCheckCircle, FiArrowRight, FiHome } from 'react-icons/fi';

const SuccessContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  color: #10b981;
  margin-bottom: 2rem;
`;

const SuccessTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text}80;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ primary?: boolean }>`
  background: ${({ theme, primary }) => primary ? theme.primary : 'transparent'};
  color: ${({ theme, primary }) => primary ? theme.bodyBg : theme.text};
  border: 2px solid ${({ theme, primary }) => primary ? theme.primary : theme.border};
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ theme, primary }) => primary ? theme.accent : theme.neutral}10;
    transform: translateY(-2px);
  }
`;

const PaymentSuccessPage: NextPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <SuccessContainer>
        <SuccessIcon>
          <FiCheckCircle />
        </SuccessIcon>
        
        <SuccessTitle>Payment Successful!</SuccessTitle>
        
        <SuccessMessage>
          Thank you for your purchase! Your payment has been processed successfully. 
          You will receive a confirmation email shortly with your order details.
        </SuccessMessage>
        
        <ActionButtons>
          <Button onClick={() => router.push('/')}>
            <FiHome />
            Go to Home
          </Button>
          
          <Button primary onClick={() => router.push('/problems')}>
            <FiArrowRight />
            Start Practicing
          </Button>
        </ActionButtons>
      </SuccessContainer>
    </Layout>
  );
};

export default PaymentSuccessPage; 