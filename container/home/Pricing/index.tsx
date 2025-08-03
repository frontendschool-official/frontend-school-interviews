import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useThemeContext } from '../../../hooks/useTheme';
import { useRouter } from 'next/router';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Styled Components
const PricingSection = styled.section`
  padding: 6rem 2rem;
  background: ${({ theme }) => theme.bodyBg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      ${({ theme }) => theme.neutral}05 0%, 
      ${({ theme }) => theme.neutralLight}05 50%, 
      ${({ theme }) => theme.neutral}05 100%);
    background-size: 400% 400%;
    animation: ${gradientShift} 8s ease infinite;
    z-index: -1;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
  animation: ${fadeInUp} 1s ease-out;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 4rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const PricingCard = styled.div<{ isPopular?: boolean }>`
  background: ${({ theme, isPopular }) => 
    isPopular 
      ? `linear-gradient(135deg, ${theme.primary}10 0%, ${theme.accent}10 100%)`
      : theme.secondary};
  border: 2px solid ${({ theme, isPopular }) => 
    isPopular ? theme.primary : theme.border};
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 1s ease-out;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px ${({ theme }) => theme.border}30;
  }
  
  ${({ isPopular }) => isPopular && `
    transform: scale(1.05);
    z-index: 1;
    
    &:hover {
      transform: scale(1.05) translateY(-10px);
    }
  `}
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  animation: ${pulse} 2s infinite;
`;

const PlanName = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

const Price = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.5rem;
`;

const PricePeriod = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
  margin-bottom: 2rem;
`;

const Savings = styled.div`
  background: ${({ theme }) => theme.primary}20;
  color: ${({ theme }) => theme.primary};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2rem;
  display: inline-block;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  text-align: left;
`;

const FeatureItem = styled.li`
  padding: 0.75rem 0;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &::before {
    content: '✓';
    color: ${({ theme }) => theme.primary};
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

const CTAButton = styled.button<{ isPopular?: boolean }>`
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  background: ${({ theme, isPopular }) => 
    isPopular 
      ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`
      : 'transparent'};
  color: ${({ theme, isPopular }) => 
    isPopular ? theme.bodyBg : theme.text};
  border: 2px solid ${({ theme, isPopular }) => 
    isPopular ? theme.primary : theme.neutralDark};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px ${({ theme, isPopular }) => 
      isPopular ? `${theme.primary}60` : `${theme.neutral}30`};
    
    ${({ isPopular, theme }) => !isPopular && `
      background: ${theme.neutralDark};
      color: ${theme.bodyBg};
    `}
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const MoneyBackGuarantee = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding: 2rem;
  background: ${({ theme }) => theme.secondary};
  border-radius: 15px;
  border: 1px solid ${({ theme }) => theme.border};
  animation: ${fadeInUp} 1s ease-out 0.6s both;
`;

const GuaranteeTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
`;

const GuaranteeText = styled.p`
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  margin: 0;
`;

const GetStartedButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  
  &:hover {
    background: ${({ theme }) => theme.accent};
    transform: translateY(-2px);
  }
`;

const Pricing: React.FC = () => {
  const { themeObject } = useThemeContext();
  const router = useRouter();

  const plans = [
    {
      name: 'Monthly',
      price: '₹999',
      period: 'per month',
      features: [
        'Unlimited DSA Problems',
        'Machine Coding Challenges',
        'System Design Problems',
        'Mock Interview Sessions',
        'Progress Tracking',
        'Community Support'
      ],
      isPopular: false
    },
    {
      name: 'Yearly',
      price: '₹4,999',
      period: 'per year',
      savings: 'Save ₹6,989 (58% off)',
      features: [
        'Everything in Monthly',
        'Priority Support',
        'Advanced Analytics',
        'Custom Study Plans',
        'Interview Preparation Guides',
        'Resume Review Service'
      ],
      isPopular: true
    },
    {
      name: 'Lifetime',
      price: '₹9,999',
      period: 'one-time payment',
      savings: 'Best Value',
      features: [
        'Everything in Yearly',
        'Lifetime Access',
        'All Future Updates',
        'Premium Content Access',
        '1-on-1 Mentoring Sessions',
        'Job Placement Assistance'
      ],
      isPopular: false
    }
  ];



  return (
    <PricingSection>
      <Container>
        <SectionTitle>Choose Your Plan</SectionTitle>
        <SectionSubtitle>
          Start your interview preparation journey with our comprehensive plans. 
          Choose the one that fits your goals and timeline.
        </SectionSubtitle>
        
        <PricingGrid>
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} isPopular={plan.isPopular}>
              {plan.isPopular && <PopularBadge>Most Popular</PopularBadge>}
              
              <PlanName>{plan.name}</PlanName>
              <Price>{plan.price}</Price>
              <PricePeriod>{plan.period}</PricePeriod>
              
              {plan.savings && (
                <Savings>{plan.savings}</Savings>
              )}
              
              <FeaturesList>
                {plan.features.map((feature, featureIndex) => (
                  <FeatureItem key={featureIndex}>{feature}</FeatureItem>
                ))}
              </FeaturesList>
              
              <GetStartedButton onClick={() => router.push('/premium')}>
                Get Started
              </GetStartedButton>
            </PricingCard>
          ))}
        </PricingGrid>
        
        <MoneyBackGuarantee>
          <GuaranteeTitle>30-Day Money-Back Guarantee</GuaranteeTitle>
          <GuaranteeText>
            Not satisfied? Get a full refund within 30 days. No questions asked.
          </GuaranteeText>
        </MoneyBackGuarantee>
      </Container>
    </PricingSection>
  );
};

export default Pricing;
