import React from 'react';
import styled from 'styled-components';
import { FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import { useDashboardData } from '@/hooks/useDashboardData';

const ProgressContainer = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressItem = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ProgressLabel = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
`;

const ProgressValue = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}80;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.border};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background: ${({ color }) => color};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const OverallProgress = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const OverallHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const OverallTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const OverallPercentage = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const ProgressStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
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

const LoadingContainer = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  opacity: 0.7;
`;

const LoadingSkeleton = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.border};
  border-radius: 4px;
  margin-bottom: 1.5rem;
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

export default function ProgressOverview() {
  const { progress, loading } = useDashboardData();

  if (loading) {
    return (
      <LoadingContainer>
        <Title>
          <FiBarChart2 />
          Learning Progress
        </Title>
        {[1, 2, 3, 4].map((index) => (
          <LoadingSkeleton key={index} />
        ))}
      </LoadingContainer>
    );
  }

  const progressData = [
    {
      label: 'DSA Problems',
      percentage: progress.dsa.percentage,
      color: '#10b981',
      completed: progress.dsa.completed,
      total: progress.dsa.total,
    },
    {
      label: 'Machine Coding',
      percentage: progress.machineCoding.percentage,
      color: '#3b82f6',
      completed: progress.machineCoding.completed,
      total: progress.machineCoding.total,
    },
    {
      label: 'System Design',
      percentage: progress.systemDesign.percentage,
      color: '#f59e0b',
      completed: progress.systemDesign.completed,
      total: progress.systemDesign.total,
    },
    {
      label: 'Theory Questions',
      percentage: progress.theory.percentage,
      color: '#8b5cf6',
      completed: progress.theory.completed,
      total: progress.theory.total,
    },
  ];

  const overallProgress = Math.round(
    progressData.reduce((sum, item) => sum + item.percentage, 0) / progressData.length
  );

  const totalCompleted = progressData.reduce((sum, item) => sum + item.completed, 0);
  const totalProblems = progressData.reduce((sum, item) => sum + item.total, 0);

  return (
    <ProgressContainer>
      <Title>
        <FiBarChart2 />
        Learning Progress
      </Title>

      {progressData.map((item, index) => (
        <ProgressItem key={index}>
          <ProgressHeader>
            <ProgressLabel>{item.label}</ProgressLabel>
            <ProgressValue>{item.completed}/{item.total}</ProgressValue>
          </ProgressHeader>
          <ProgressBar>
            <ProgressFill percentage={item.percentage} color={item.color} />
          </ProgressBar>
        </ProgressItem>
      ))}

      <OverallProgress>
        <OverallHeader>
          <OverallTitle>Overall Progress</OverallTitle>
          <OverallPercentage>{overallProgress}%</OverallPercentage>
        </OverallHeader>
        <ProgressBar>
          <ProgressFill percentage={overallProgress} color="#e5231c" />
        </ProgressBar>
        <ProgressStats>
          <StatItem>
            <StatValue>{totalCompleted}</StatValue>
            <StatLabel>Completed</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{totalProblems - totalCompleted}</StatValue>
            <StatLabel>Remaining</StatLabel>
          </StatItem>
        </ProgressStats>
      </OverallProgress>
    </ProgressContainer>
  );
} 