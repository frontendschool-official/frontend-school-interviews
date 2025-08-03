import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { FiZap, FiClock, FiTarget, FiTrendingUp, FiBookOpen, FiAward, FiPlay } from 'react-icons/fi';

const HubContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text}80;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const PracticeModesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const PracticeModeCard = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px ${({ theme }) => theme.border}20;
    border-color: ${({ theme }) => theme.primary};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ theme }) => theme.primary};
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const ModeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ModeIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const ModeTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const ModeDescription = styled.p`
  color: ${({ theme }) => theme.text}80;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ModeFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
`;

const ModeFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}80;

  &:before {
    content: '✓';
    color: #10b981;
    font-weight: bold;
  }
`;

const ModeStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 8px;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text}80;
  margin-top: 0.25rem;
`;

const ModeActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled(Link)<{ variant: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;

  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
    background: ${theme.primary};
    color: white;
    &:hover {
      background: ${theme.primary}dd;
      transform: translateY(-1px);
    }
  `
      : `
    background: ${theme.secondary};
    color: ${theme.text};
    border: 1px solid ${theme.border};
    &:hover {
      background: ${theme.border};
      transform: translateY(-1px);
    }
  `}
`;

const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const QuickAccessCard = styled(Link)`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.border}20;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const QuickAccessIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
`;

const QuickAccessTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
`;

const QuickAccessDescription = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}80;
  line-height: 1.4;
`;

export default function PracticeHub() {
  const practiceModes = [
    {
      id: 'quick',
      title: 'Quick Practice',
      description: '5-minute challenges to test your skills quickly. Perfect for busy schedules.',
      icon: FiZap,
      color: '#10b981',
      features: [
        '5-minute time limit',
        'Random problem selection',
        'Instant feedback',
        'Progress tracking'
      ],
      stats: [
        { value: '5min', label: 'Duration' },
        { value: '1', label: 'Problem' }
      ],
      startHref: '/practice/quick',
      customizeHref: '/practice/quick/customize'
    },
    {
      id: 'timed',
      title: 'Timed Practice',
      description: 'Full-length practice sessions with realistic time constraints.',
      icon: FiClock,
      color: '#3b82f6',
      features: [
        'Realistic time limits',
        'Multiple problems',
        'Detailed evaluation',
        'Performance analytics'
      ],
      stats: [
        { value: '45min', label: 'Duration' },
        { value: '3', label: 'Problems' }
      ],
      startHref: '/practice/timed',
      customizeHref: '/practice/timed/customize'
    },
    {
      id: 'adaptive',
      title: 'Adaptive Practice',
      description: 'AI-powered practice that adapts to your skill level and learning pace.',
      icon: FiTarget,
      color: '#f59e0b',
      features: [
        'Difficulty adjustment',
        'Personalized problems',
        'Learning path optimization',
        'Skill gap analysis'
      ],
      stats: [
        { value: '30min', label: 'Duration' },
        { value: '2-4', label: 'Problems' }
      ],
      startHref: '/practice/adaptive',
      customizeHref: '/practice/adaptive/customize'
    }
  ];

  const quickAccess = [
    {
      title: 'DSA Practice',
      description: 'Data structures and algorithms',
      icon: FiTrendingUp,
      color: '#10b981',
      href: '/practice/dsa'
    },
    {
      title: 'Machine Coding',
      description: 'React component building',
      icon: FiBookOpen,
      color: '#3b82f6',
      href: '/practice/machine-coding'
    },
    {
      title: 'System Design',
      description: 'Architecture and design',
      icon: FiTarget,
      color: '#f59e0b',
      href: '/practice/system-design'
    },
    {
      title: 'Theory Questions',
      description: 'JavaScript and React concepts',
      icon: FiAward,
      color: '#8b5cf6',
      href: '/practice/theory'
    }
  ];

  return (
    <HubContainer>
      <Header>
        <Title>Practice Hub</Title>
        <Subtitle>
          Choose your practice mode and improve your frontend interview skills.
          From quick challenges to comprehensive sessions, we have everything you need.
        </Subtitle>
      </Header>

      <PracticeModesGrid>
        {practiceModes.map((mode) => (
          <PracticeModeCard key={mode.id}>
            <ModeHeader>
              <ModeIcon color={mode.color}>
                <mode.icon />
              </ModeIcon>
              <ModeTitle>{mode.title}</ModeTitle>
            </ModeHeader>
            <ModeDescription>{mode.description}</ModeDescription>
            <ModeFeatures>
              {mode.features.map((feature, index) => (
                <ModeFeature key={index}>{feature}</ModeFeature>
              ))}
            </ModeFeatures>
            <ModeStats>
              {mode.stats.map((stat, index) => (
                <StatItem key={index}>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                </StatItem>
              ))}
            </ModeStats>
            <ModeActions>
              <ActionButton href={mode.startHref} variant="primary">
                <FiPlay />
                Start Practice
              </ActionButton>
              <ActionButton href={mode.customizeHref} variant="secondary">
                <FiTarget />
                Customize
              </ActionButton>
            </ModeActions>
          </PracticeModeCard>
        ))}
      </PracticeModesGrid>

      <QuickAccessGrid>
        {quickAccess.map((item) => (
          <QuickAccessCard key={item.title} href={item.href}>
            <QuickAccessIcon color={item.color}>
              <item.icon />
            </QuickAccessIcon>
            <QuickAccessTitle>{item.title}</QuickAccessTitle>
            <QuickAccessDescription>{item.description}</QuickAccessDescription>
          </QuickAccessCard>
        ))}
      </QuickAccessGrid>
    </HubContainer>
  );
} 