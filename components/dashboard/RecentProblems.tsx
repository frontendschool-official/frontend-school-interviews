import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { FiClock, FiCheckCircle, FiXCircle, FiPlay } from 'react-icons/fi';
import { useDashboardData } from '@/hooks/useDashboardData';

const RecentContainer = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const ViewAllLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    text-decoration: underline;
  }
`;

const ProblemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProblemCard = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.border}20;
  }
`;

const ProblemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const ProblemTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  flex: 1;
`;

const StatusBadge = styled.div<{ status: 'completed' | 'in-progress' | 'failed' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ status, theme }) => {
    switch (status) {
      case 'completed':
        return '#10b98120';
      case 'in-progress':
        return '#3b82f620';
      case 'failed':
        return '#ef444420';
      default:
        return theme.border;
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in-progress':
        return '#3b82f6';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ProblemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const ProblemType = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}80;
  background: ${({ theme }) => theme.border};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const ProblemDate = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}60;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ProblemActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(Link)<{ variant: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
    background: ${theme.primary};
    color: white;
    &:hover {
      background: ${theme.primary}dd;
    }
  `
      : `
    background: ${theme.secondary};
    color: ${theme.text};
    border: 1px solid ${theme.border};
    gap: 0.25rem;
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.text}80;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const LoadingContainer = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  opacity: 0.7;
`;

const LoadingSkeleton = styled.div`
  width: 100%;
  height: 80px;
  background: ${({ theme }) => theme.border};
  border-radius: 8px;
  margin-bottom: 1rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

interface RecentProblem {
  id: string;
  title: string;
  type: 'DSA' | 'Machine Coding' | 'System Design' | 'Theory';
  status: 'completed' | 'in-progress' | 'failed';
  date: string;
  score?: number;
}

export default function RecentProblems() {
  const { recentProblems, loading } = useDashboardData();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle />;
      case 'in-progress':
        return <FiPlay />;
      case 'failed':
        return <FiXCircle />;
      default:
        return <FiClock />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Header>
          <Title>Recent Problems</Title>
        </Header>
        {[1, 2, 3].map((index) => (
          <LoadingSkeleton key={index} />
        ))}
      </LoadingContainer>
    );
  }

  if (recentProblems.length === 0) {
    return (
      <RecentContainer>
        <Header>
          <Title>Recent Problems</Title>
        </Header>
        <EmptyState>
          <EmptyIcon>📝</EmptyIcon>
          <div>No problems attempted yet</div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Start your first problem to see it here
          </div>
        </EmptyState>
      </RecentContainer>
    );
  }

  return (
    <RecentContainer>
      <Header>
        <Title>Recent Problems</Title>
        <ViewAllLink href="/history">View All</ViewAllLink>
      </Header>

      <ProblemList>
        {recentProblems.map((problem) => (
          <ProblemCard key={problem.id}>
            <ProblemHeader>
              <ProblemTitle>{problem.title}</ProblemTitle>
              <StatusBadge status={problem.status}>
                {getStatusIcon(problem.status)}
                {getStatusText(problem.status)}
              </StatusBadge>
            </ProblemHeader>

            <ProblemMeta>
              <ProblemType>{problem.type}</ProblemType>
              <ProblemDate>
                <FiClock />
                {problem.date}
              </ProblemDate>
            </ProblemMeta>

            <ProblemActions>
              <ActionButton href={`/problems/${problem.id}`} variant="primary">
                <FiPlay />
                Continue
              </ActionButton>
              {problem.status === 'completed' && (
                <ActionButton href={`/problems/${problem.id}/feedback`} variant="secondary">
                  View Feedback
                </ActionButton>
              )}
            </ProblemActions>
          </ProblemCard>
        ))}
      </ProblemList>
    </RecentContainer>
  );
} 