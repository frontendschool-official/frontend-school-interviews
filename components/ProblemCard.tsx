import styled from 'styled-components';
import Link from 'next/link';
import { getProblemCardInfo, ProblemData, ParsedProblemData, PredefinedProblem, ProblemType } from '../types/problem';

interface ProblemCardProps {
  problem: ProblemData | ParsedProblemData | PredefinedProblem;
  status?: 'attempted' | 'solved' | 'unsolved';
}

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.secondary};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.primary};
  font-size: 1.1rem;
  line-height: 1.4;
`;

const Meta = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
`;

const StatusBadge = styled.span<{ status?: string }>`
  align-self: flex-start;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${({ status, theme }) =>
    status === 'solved'
      ? '#10b981'
      : status === 'attempted'
      ? '#f59e0b'
      : theme.primary};
  color: #fff;
`;

const DifficultyBadge = styled.span<{ difficulty: string }>`
  align-self: flex-start;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${({ difficulty }) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  color: white;
`;

const CategoryBadge = styled.span<{ type: ProblemType }>`
  align-self: flex-start;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${({ type }) => {
    switch (type) {
      case 'dsa': return '#3b82f6';
      case 'machine_coding': return '#8b5cf6';
      case 'system_design': return '#06b6d4';
      case 'interview': return '#10b981';
      case 'user_generated': return '#f59e0b';
      default: return '#6b7280';
    }
  }};
  color: white;
`;

const TechnologyTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const TechnologyTag = styled.span`
  background-color: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.7rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const SolveButton = styled(Link)`
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

export default function ProblemCard({ problem, status }: ProblemCardProps) {
  // Handle different problem types
  const isPredefined = 'type' in problem && problem.type !== 'user_generated';
  
  let title = '';
  let difficulty: any = 'medium';
  let technologies: string[] = [];
  let estimatedTime = '';
  let category = '';
  let type: ProblemType = 'user_generated';

  if (isPredefined) {
    // Handle predefined problems
    const predefinedProblem = problem as PredefinedProblem;
    title = predefinedProblem.title;
    difficulty = predefinedProblem.difficulty;
    technologies = predefinedProblem.technologies || [];
    estimatedTime = predefinedProblem.estimatedTime || '';
    category = predefinedProblem.category;
    type = predefinedProblem.type;
  } else {
    // Handle user-generated problems (existing logic)
    const { title: cardTitle, difficulty: cardDifficulty, technologies: cardTechnologies, estimatedTime: cardEstimatedTime } = getProblemCardInfo(problem);
    title = cardTitle;
    difficulty = cardDifficulty;
    technologies = cardTechnologies;
    estimatedTime = cardEstimatedTime;
    category = 'Custom Problem';
    type = 'user_generated';
  }

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <StatusBadge status={status}>{status || 'New'}</StatusBadge>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <CategoryBadge type={type}>{type.replace('_', ' ')}</CategoryBadge>
          <DifficultyBadge difficulty={difficulty}>{difficulty}</DifficultyBadge>
        </div>
      </div>
      
      <Title>{title}</Title>
      
      {!isPredefined && (
        <>
          <Meta>Companies: {(problem as any).companies || 'N/A'}</Meta>
          <Meta>Type: {(problem as any).interviewType || ((problem as any).systemDesignProblem ? 'design' : 'coding')}</Meta>
        </>
      )}
      
      {category && (
        <Meta>Category: {category}</Meta>
      )}
      
      {estimatedTime && (
        <Meta>Estimated Time: {estimatedTime}</Meta>
      )}
      
      {technologies.length > 0 && (
        <div>
          <Meta style={{ marginBottom: '0.5rem' }}>Technologies:</Meta>
          <TechnologyTags>
            {technologies.slice(0, 3).map((tech: string, index: number) => (
              <TechnologyTag key={index}>{tech}</TechnologyTag>
            ))}
            {technologies.length > 3 && (
              <TechnologyTag>+{technologies.length - 3} more</TechnologyTag>
            )}
          </TechnologyTags>
        </div>
      )}
      
      <SolveButton href={`/interview/${problem.id}`}>Start Solving</SolveButton>
    </Card>
  );
}