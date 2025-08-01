import styled, { keyframes } from 'styled-components';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';

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

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
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
const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bodyBg};
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem 4rem;
  min-height: 80vh;
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
      ${({ theme }) => theme.neutral}10 0%, 
      ${({ theme }) => theme.neutralLight}10 50%, 
      ${({ theme }) => theme.neutral}10 100%);
    background-size: 400% 400%;
    animation: ${gradientShift} 8s ease infinite;
    z-index: -1;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  width: 100%;
  animation: ${fadeInUp} 1s ease-out;
`;

const MainHeading = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.neutralDark} 0%, 
    ${({ theme }) => theme.neutral} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  color: ${({ theme }) => theme.text};
  opacity: 0.9;
  line-height: 1.6;
`;

const CtaSection = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 4rem;
`;

const PrimaryButton = styled.a`
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
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px ${({ theme }) => theme.primary}60;
    animation: ${pulse} 2s infinite;
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

const SecondaryButton = styled.a`
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  background: transparent;
  border: 2px solid ${({ theme }) => theme.neutralDark};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.neutralDark};
    color: ${({ theme }) => theme.bodyBg};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.neutral}30;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  background: ${({ theme }) => theme.secondary};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px ${({ theme }) => theme.border}40;
  }
  
  &:nth-child(2) {
    animation-delay: 0.4s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.6s;
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
`;

const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  background: ${({ theme }) => theme.secondary};
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
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
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  text-align: center;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 1s ease-out;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px ${({ theme }) => theme.border}30;
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.primary} 0%, 
    ${({ theme }) => theme.accent} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: white;
  animation: ${float} 3s ease-in-out infinite;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  line-height: 1.6;
`;

const FloatingElement = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  background: ${({ theme }) => theme.primary}20;
  border-radius: 50%;
  animation: ${float} 6s ease-in-out infinite;
  
  &:nth-child(1) {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    top: 20%;
    right: 15%;
    animation-delay: 2s;
  }
  
  &:nth-child(3) {
    bottom: 20%;
    left: 15%;
    animation-delay: 4s;
  }
`;

export default function HomePage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Container>
      <NavBar />
      <Hero>
        <FloatingElement />
        <FloatingElement />
        <FloatingElement />
        <HeroContent>
          <MainHeading>
            Master Frontend Interviews
            <br />
            <span style={{ fontSize: '0.8em', opacity: 0.9 }}>
              with AI-Powered Practice
            </span>
          </MainHeading>
          <Subtitle>
            Practice real-world coding challenges, system design interviews, and DSA problems 
            in a professional environment. Get instant feedback and improve your skills with 
            our AI-powered evaluation system.
          </Subtitle>
          <CtaSection>
            {user ? (
              <Link href="/problems" passHref legacyBehavior>
                <PrimaryButton>Start Practicing</PrimaryButton>
              </Link>
            ) : (
              <Link href="/login" passHref legacyBehavior>
                <PrimaryButton>Get Started Free</PrimaryButton>
              </Link>
            )}
            <Link href="/about" passHref legacyBehavior>
              <SecondaryButton>Learn More</SecondaryButton>
            </Link>
          </CtaSection>
          <StatsSection>
            <StatCard>
              <StatNumber>500+</StatNumber>
              <StatLabel>Practice Problems</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>50+</StatNumber>
              <StatLabel>System Design Challenges</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>24/7</StatNumber>
              <StatLabel>AI Evaluation</StatLabel>
            </StatCard>
          </StatsSection>
        </HeroContent>
      </Hero>
      
      <FeaturesSection>
        <SectionTitle>Why Choose Our Platform?</SectionTitle>
        <SectionSubtitle>
          Everything you need to ace your frontend interviews in one place
        </SectionSubtitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>💻</FeatureIcon>
            <FeatureTitle>Real-time Code Editor</FeatureTitle>
            <FeatureDescription>
              Practice with our advanced code editor featuring syntax highlighting, 
              auto-completion, and real-time collaboration capabilities.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>AI-Powered Feedback</FeatureTitle>
            <FeatureDescription>
              Get instant, detailed feedback on your solutions with our advanced 
              AI evaluation system that understands code quality and best practices.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>System Design Canvas</FeatureTitle>
            <FeatureDescription>
              Visualize and design complex systems with our interactive canvas, 
              perfect for system design interviews and architecture discussions.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Progress Tracking</FeatureTitle>
            <FeatureDescription>
              Monitor your improvement with detailed analytics, performance metrics, 
              and personalized learning recommendations.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🚀</FeatureIcon>
            <FeatureTitle>Interview Simulation</FeatureTitle>
            <FeatureDescription>
              Experience realistic interview scenarios with timed challenges, 
              peer reviews, and comprehensive evaluation criteria.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Mobile Responsive</FeatureTitle>
            <FeatureDescription>
              Practice anywhere, anytime with our fully responsive platform 
              that works seamlessly across all devices and screen sizes.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </Container>
  );
}