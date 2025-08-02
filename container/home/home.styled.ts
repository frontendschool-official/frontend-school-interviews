import styled, { keyframes } from 'styled-components';

// Animations
export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

export const gradientShift = keyframes`
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
export const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bodyBg};
`;

export const Hero = styled.section`
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

export const HeroContent = styled.div`
  max-width: 1200px;
  width: 100%;
  animation: ${fadeInUp} 1s ease-out;
`;

export const MainHeading = styled.h1`
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

export const Subtitle = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  color: ${({ theme }) => theme.text};
  opacity: 0.9;
  line-height: 1.6;
`;

export const CtaSection = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 4rem;
`;

export const PrimaryButton = styled.a`
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

export const SecondaryButton = styled.a`
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

export const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

export const StatCard = styled.div`
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

export const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
`;

export const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  background: ${({ theme }) => theme.secondary};
`;

export const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

export const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 4rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const FeatureCard = styled.div`
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

export const FeatureIcon = styled.div`
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

export const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

export const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  line-height: 1.6;
`;

export const FloatingElement = styled.div`
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