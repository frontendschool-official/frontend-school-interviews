import React from 'react';
import styled from 'styled-components';
import { FiTrendingUp, FiClock, FiCheckCircle, FiTarget } from 'react-icons/fi';
import { useDashboardData } from '@/hooks/useDashboardData';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.border}20;
  }
`;

const StatIcon = styled.div<{ color: string }>`
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

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}80;
  font-weight: 500;
`;

const StatChange = styled.div<{ positive: boolean }>`
  font-size: 0.8rem;
  color: ${({ positive, theme }) => positive ? '#10b981' : '#ef4444'};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const LoadingContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const LoadingCard = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  opacity: 0.7;
`;

const LoadingSkeleton = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${({ theme }) => theme.border};
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

const LoadingText = styled.div`
  flex: 1;
`;

const LoadingValue = styled.div`
  width: 60px;
  height: 32px;
  background: ${({ theme }) => theme.border};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const LoadingLabel = styled.div`
  width: 100px;
  height: 16px;
  background: ${({ theme }) => theme.border};
  border-radius: 4px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

export default function DashboardStats() {
  const { stats, loading } = useDashboardData();

  if (loading) {
    return (
      <LoadingContainer>
        {[1, 2, 3, 4].map((index) => (
          <LoadingCard key={index}>
            <LoadingSkeleton />
            <LoadingText>
              <LoadingValue />
              <LoadingLabel />
            </LoadingText>
          </LoadingCard>
        ))}
      </LoadingContainer>
    );
  }

  const statItems = [
    {
      icon: FiCheckCircle,
      color: '#10b981',
      value: stats.problemsSolved,
      label: 'Problems Solved',
      change: '+3 this week',
      positive: true,
    },
    {
      icon: FiClock,
      color: '#3b82f6',
      value: `${stats.timeSpent}h`,
      label: 'Time Spent',
      change: '+2h today',
      positive: true,
    },
    {
      icon: FiTrendingUp,
      color: '#f59e0b',
      value: `${stats.successRate}%`,
      label: 'Success Rate',
      change: '+5% this month',
      positive: true,
    },
    {
      icon: FiTarget,
      color: '#8b5cf6',
      value: stats.currentStreak,
      label: 'Current Streak',
      change: 'days',
      positive: true,
    },
  ];

  return (
    <StatsContainer>
      {statItems.map((stat, index) => (
        <StatCard key={index}>
          <StatIcon color={stat.color}>
            <stat.icon />
          </StatIcon>
          <StatContent>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
            <StatChange positive={stat.positive}>
              {stat.change}
            </StatChange>
          </StatContent>
        </StatCard>
      ))}
    </StatsContainer>
  );
} 