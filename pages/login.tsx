import { useEffect } from "react";
import { useRouter } from "next/router";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../hooks/useAuth";
import GoogleSignInButton from "../components/GoogleSignInButton";
import Layout from "@/components/Layout";
import { FcGoogle } from 'react-icons/fc';
import { FaCode, FaRobot, FaChartLine, FaLaptopCode } from 'react-icons/fa';

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

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Styled Components
const LoginPageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.primary} 0%, 
    ${({ theme }) => theme.accent} 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 3rem;
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
      rgba(255,255,255,0.1) 0%, 
      rgba(255,255,255,0.05) 50%, 
      rgba(255,255,255,0.1) 100%);
    background-size: 400% 400%;
    animation: ${gradientShift} 8s ease infinite;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 3rem 2rem;
    min-height: 50vh;
  }
`;

const RightSection = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.bodyBg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 3rem;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 3rem 2rem;
    min-height: 50vh;
  }
`;

const FloatingElement = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  animation: ${float} 6s ease-in-out infinite;
  z-index: 2;
  
  &:nth-child(1) {
    top: 15%;
    left: 15%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    top: 25%;
    right: 20%;
    animation-delay: 2s;
  }
  
  &:nth-child(3) {
    bottom: 25%;
    left: 20%;
    animation-delay: 4s;
  }
`;

const LeftContent = styled.div`
  text-align: center;
  color: white;
  z-index: 3;
  animation: ${fadeInLeft} 1s ease-out;
  max-width: 500px;
`;

const LeftTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
`;

const LeftSubtitle = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  margin-bottom: 3rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(255,255,255,0.2);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255,255,255,0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.9;
`;

const FeatureTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.4;
`;

const RightContent = styled.div`
  text-align: center;
  max-width: 400px;
  width: 100%;
  animation: ${fadeInRight} 1s ease-out;
`;

const RightTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

const RightSubtitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  line-height: 1.6;
`;

const LoginCard = styled.div`
  background: ${({ theme }) => theme.secondary};
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 10px 30px ${({ theme }) => theme.border}20;
  margin-bottom: 2rem;
`;

const StyledGoogleSignInButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  color: ${({ theme }) => theme.bodyBg};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.primary} 0%, 
    ${({ theme }) => theme.accent} 100%);
  box-shadow: 0 8px 25px ${({ theme }) => theme.primary}40;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: none;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px ${({ theme }) => theme.primary}60;
    animation: ${pulse} 2s infinite;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
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

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  font-size: 0.95rem;
`;

const CheckIcon = styled.span`
  color: ${({ theme }) => theme.primary};
  font-weight: bold;
  font-size: 1.1rem;
`;

export default function LoginPage() {
  const { user, signIn, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (user) {
      router.replace("/problems");
    }
  }, [user, router]);

  return (
    <Layout showNavBar={false}>
      <LoginPageContainer>
        {/* Left Section - Information */}
        <LeftSection>
          <FloatingElement />
          <FloatingElement />
          <FloatingElement />
          
          <LeftContent>
            <LeftTitle>Master Frontend Interviews</LeftTitle>
            <LeftSubtitle>
              Practice real-world coding challenges, system design interviews, and DSA problems 
              in a professional environment with AI-powered feedback.
            </LeftSubtitle>
            
            <FeaturesGrid>
              <FeatureCard>
                <FeatureIcon>
                  <FaCode />
                </FeatureIcon>
                <FeatureTitle>Machine Coding</FeatureTitle>
                <FeatureDescription>
                  Build real components with live feedback
                </FeatureDescription>
              </FeatureCard>
              
              <FeatureCard>
                <FeatureIcon>
                  <FaLaptopCode />
                </FeatureIcon>
                <FeatureTitle>System Design</FeatureTitle>
                <FeatureDescription>
                  Design scalable architectures
                </FeatureDescription>
              </FeatureCard>
              
              <FeatureCard>
                <FeatureIcon>
                  <FaRobot />
                </FeatureIcon>
                <FeatureTitle>AI Feedback</FeatureTitle>
                <FeatureDescription>
                  Get instant intelligent feedback
                </FeatureDescription>
              </FeatureCard>
              
              <FeatureCard>
                <FeatureIcon>
                  <FaChartLine />
                </FeatureIcon>
                <FeatureTitle>Progress Tracking</FeatureTitle>
                <FeatureDescription>
                  Monitor your improvement journey
                </FeatureDescription>
              </FeatureCard>
            </FeaturesGrid>
          </LeftContent>
        </LeftSection>

        {/* Right Section - Login */}
        <RightSection>
          <RightContent>
            <RightTitle>Welcome Back</RightTitle>
            <RightSubtitle>
              Sign in to continue your frontend interview preparation journey
            </RightSubtitle>
            
            <LoginCard>
              <StyledGoogleSignInButton onClick={signIn} disabled={loading}>
                <FcGoogle size={20} />
                {loading ? "Signing in..." : "Sign in with Google"}
              </StyledGoogleSignInButton>
            </LoginCard>
            
            <BenefitsList>
              <BenefitItem>
                <CheckIcon>✓</CheckIcon>
                Free access to all practice problems
              </BenefitItem>
              <BenefitItem>
                <CheckIcon>✓</CheckIcon>
                Instant AI-powered code evaluation
              </BenefitItem>
              <BenefitItem>
                <CheckIcon>✓</CheckIcon>
                Progress tracking and analytics
              </BenefitItem>
              <BenefitItem>
                <CheckIcon>✓</CheckIcon>
                Real-world interview scenarios
              </BenefitItem>
            </BenefitsList>
          </RightContent>
        </RightSection>
      </LoginPageContainer>
    </Layout>
  );
}
