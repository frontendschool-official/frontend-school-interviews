import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { FiTarget, FiClock, FiAward, FiPlay, FiBarChart2 } from 'react-icons/fi';

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

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.border}20;
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}80;
  font-weight: 500;
`;

const InterviewTypesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const InterviewTypeCard = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px ${({ theme }) => theme.border}20;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const TypeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TypeIcon = styled.div<{ color: string }>`
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

const TypeTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const TypeDescription = styled.p`
  color: ${({ theme }) => theme.text}80;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const TypeFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
`;

const TypeFeature = styled.li`
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

const TypeActions = styled.div`
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

const RecentInterviews = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
`;

const RecentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const RecentTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const ViewAllLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export default function MockInterviewHub() {
  const interviewTypes = [
    {
      id: 'dsa',
      title: 'DSA Interview',
      description: 'Practice data structures and algorithms problems with real-time evaluation.',
      icon: FiTarget,
      color: '#10b981',
      duration: '45-60 min',
      problems: 3,
      features: [
        'Algorithm optimization',
        'Time complexity analysis',
        'Real-time evaluation',
        'Performance feedback'
      ],
      setupHref: '/mock-interviews/setup?type=dsa',
      practiceHref: '/practice/dsa'
    },
    {
      id: 'machine-coding',
      title: 'Machine Coding',
      description: 'Build real React components and applications with live feedback.',
      icon: FiPlay,
      color: '#3b82f6',
      duration: '60-90 min',
      problems: 2,
      features: [
        'Component building',
        'State management',
        'Code quality assessment',
        'Best practices feedback'
      ],
      setupHref: '/mock-interviews/setup?type=machine-coding',
      practiceHref: '/practice/machine-coding'
    },
    {
      id: 'system-design',
      title: 'System Design',
      description: 'Design scalable frontend architectures and component systems.',
      icon: FiBarChart2,
      color: '#f59e0b',
      duration: '60-90 min',
      problems: 2,
      features: [
        'Architecture design',
        'Scalability planning',
        'Component modeling',
        'System evaluation'
      ],
      setupHref: '/mock-interviews/setup?type=system-design',
      practiceHref: '/practice/system-design'
    },
    {
      id: 'theory',
      title: 'Theory & Concepts',
      description: 'Test your knowledge of JavaScript, React, and frontend concepts.',
      icon: FiAward,
      color: '#8b5cf6',
      duration: '30-45 min',
      problems: 5,
      features: [
        'Concept testing',
        'Deep understanding',
        'Real-world scenarios',
        'Knowledge gaps'
      ],
      setupHref: '/mock-interviews/setup?type=theory',
      practiceHref: '/practice/theory'
    }
  ];

  const stats = [
    { value: '12', label: 'Interviews Completed' },
    { value: '85%', label: 'Average Score' },
    { value: '24h', label: 'Total Practice Time' },
    { value: '3', label: 'Current Streak' }
  ];

  return (
    <HubContainer>
      <Header>
        <Title>Mock Interviews</Title>
        <Subtitle>
          Practice real interview scenarios with AI-powered evaluation and feedback.
          Choose your interview type and start practicing today.
        </Subtitle>
      </Header>

      <StatsContainer>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsContainer>

      <InterviewTypesGrid>
        {interviewTypes.map((type) => (
          <InterviewTypeCard key={type.id}>
            <TypeHeader>
              <TypeIcon color={type.color}>
                <type.icon />
              </TypeIcon>
              <TypeTitle>{type.title}</TypeTitle>
            </TypeHeader>
            <TypeDescription>{type.description}</TypeDescription>
            <TypeFeatures>
              {type.features.map((feature, index) => (
                <TypeFeature key={index}>{feature}</TypeFeature>
              ))}
            </TypeFeatures>
            <TypeActions>
              <ActionButton href={type.setupHref} variant="primary">
                <FiPlay />
                Start Interview
              </ActionButton>
              <ActionButton href={type.practiceHref} variant="secondary">
                <FiClock />
                Practice
              </ActionButton>
            </TypeActions>
          </InterviewTypeCard>
        ))}
      </InterviewTypesGrid>

      <RecentInterviews>
        <RecentHeader>
          <RecentTitle>Recent Interviews</RecentTitle>
          <ViewAllLink href="/history">View All</ViewAllLink>
        </RecentHeader>
        <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
          No recent interviews. Start your first mock interview to see your history here.
        </div>
      </RecentInterviews>
    </HubContainer>
  );
} 