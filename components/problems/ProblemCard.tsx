import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { FiClock, FiTarget, FiCheckCircle, FiXCircle, FiPlay } from 'react-icons/fi';

const Card = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.border}20;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  line-height: 1.4;
  flex: 1;
`;

const TypeBadge = styled.div<{ color: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
  margin-left: 1rem;
  white-space: nowrap;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.text}80;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}60;
`;

const Difficulty = styled.div<{ difficulty: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.75rem;
  background: ${({ difficulty }) => {
    switch (difficulty) {
      case 'easy':
        return '#10b98120';
      case 'medium':
        return '#f59e0b20';
      case 'hard':
        return '#ef444420';
      default:
        return '#6b728020';
    }
  }};
  color: ${({ difficulty }) => {
    switch (difficulty) {
      case 'easy':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }};
`;

const TimeEstimate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StatusBadge = styled.div<{ status: 'completed' | 'in-progress' | 'not-started' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ status }) => {
    switch (status) {
      case 'completed':
        return '#10b98120';
      case 'in-progress':
        return '#3b82f620';
      case 'not-started':
        return '#6b728020';
      default:
        return '#6b728020';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in-progress':
        return '#3b82f6';
      case 'not-started':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  }};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
`;

const ActionButton = styled(Link)<{ variant: 'primary' | 'secondary' }>`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
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

const Score = styled.div<{ score: number }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ score }) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  }};
  text-align: center;
  margin-bottom: 0.5rem;
`;

const ScoreLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text}60;
  text-align: center;
`;

export interface Problem {
  id: string;
  title: string;
  description: string;
  type: 'dsa' | 'machine-coding' | 'system-design' | 'theory';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  status: 'completed' | 'in-progress' | 'not-started';
  score?: number;
  technologies?: string[];
}

interface ProblemCardProps {
  problem: Problem;
  showScore?: boolean;
  showStatus?: boolean;
  onStart?: (problemId: string) => void;
}

const TYPE_COLORS = {
  'dsa': '#10b981',
  'machine-coding': '#3b82f6',
  'system-design': '#f59e0b',
  'theory': '#8b5cf6'
};

const TYPE_LABELS = {
  'dsa': 'DSA',
  'machine-coding': 'Machine Coding',
  'system-design': 'System Design',
  'theory': 'Theory'
};

export default function ProblemCard({
  problem,
  showScore = false,
  showStatus = true,
  onStart
}: ProblemCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle />;
      case 'in-progress':
        return <FiPlay />;
      case 'not-started':
        return <FiTarget />;
      default:
        return <FiTarget />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-started':
        return 'Not Started';
      default:
        return 'Not Started';
    }
  };

  return (
    <Card>
      <CardHeader>
        <Title>{problem.title}</Title>
        <TypeBadge color={TYPE_COLORS[problem.type]}>
          {TYPE_LABELS[problem.type]}
        </TypeBadge>
      </CardHeader>

      <Description>{problem.description}</Description>

      <MetaInfo>
        <Difficulty difficulty={problem.difficulty}>
          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
        </Difficulty>
        <TimeEstimate>
          <FiClock />
          {problem.estimatedTime}
        </TimeEstimate>
      </MetaInfo>

      {showScore && problem.score !== undefined && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <Score score={problem.score}>{problem.score}%</Score>
          <ScoreLabel>Score</ScoreLabel>
        </div>
      )}

      {showStatus && (
        <StatusBadge status={problem.status}>
          {getStatusIcon(problem.status)}
          {getStatusText(problem.status)}
        </StatusBadge>
      )}

      <CardActions>
        <ActionButton href={`/problems/${problem.id}`} variant="primary">
          <FiPlay />
          {problem.status === 'completed' ? 'Review' : 'Start'}
        </ActionButton>
        {problem.status === 'completed' && (
          <ActionButton href={`/problems/${problem.id}/feedback`} variant="secondary">
            Feedback
          </ActionButton>
        )}
      </CardActions>
    </Card>
  );
} 