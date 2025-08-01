import styled from 'styled-components';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import { useAuth } from '../hooks/useAuth';

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  min-height: 70vh;
`;

const Heading = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.primary};
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const Cta = styled.div`
  display: flex;
  gap: 1rem;
`;

const CtaButton = styled.a`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  color: ${({ theme }) => theme.bodyBg};
  background-color: ${({ theme }) => theme.primary};
  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

const SecondaryButton = styled.a`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.border};
  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

export default function HomePage() {
  const { user } = useAuth();
  return (
    <>
      <NavBar />
      <Hero>
        <Heading>Master Your Frontend Interviews</Heading>
        <Subtitle>
          Practice real-world coding and system design interviews with AI-generated questions and an environment inspired by professional coding platforms.
        </Subtitle>
        <Cta>
          {user ? (
            <Link href="/problems" passHref legacyBehavior>
              <CtaButton>Go to Problems</CtaButton>
            </Link>
          ) : (
            <Link href="/login" passHref legacyBehavior>
              <CtaButton>Get Started</CtaButton>
            </Link>
          )}
          <Link href="/about" passHref legacyBehavior>
            <SecondaryButton>Learn More</SecondaryButton>
          </Link>
        </Cta>
      </Hero>
    </>
  );
}