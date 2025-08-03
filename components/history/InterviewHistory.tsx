import React, { useState } from 'react';
import styled from 'styled-components';
import { FiCalendar, FiClock, FiTrendingUp, FiBarChart2, FiFilter } from 'react-icons/fi';
import ProblemTypeFilter, { PROBLEM_TYPES } from '@/components/problems/ProblemTypeFilter';
import ProblemCard, { Problem } from '@/components/problems/ProblemCard';

const HistoryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text}80;
  margin-bottom: 1rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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

const FilterSection = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const FilterInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ProblemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.text}80;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;

export default function InterviewHistory() {
  const [activeType, setActiveType] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with real data from Firebase
  const mockProblems: Problem[] = [
    {
      id: '1',
      title: 'Implement a React Todo List Component',
      description: 'Create a fully functional todo list component with add, delete, and toggle functionality.',
      type: 'machine-coding',
      difficulty: 'medium',
      estimatedTime: '45-60 min',
      status: 'completed',
      score: 85,
    },
    {
      id: '2',
      title: 'Binary Tree Level Order Traversal',
      description: 'Implement a function to perform level order traversal of a binary tree.',
      type: 'dsa',
      difficulty: 'medium',
      estimatedTime: '30-45 min',
      status: 'completed',
      score: 92,
    },
    {
      id: '3',
      title: 'Design a URL Shortener System',
      description: 'Design a system to shorten URLs with high availability and scalability.',
      type: 'system-design',
      difficulty: 'hard',
      estimatedTime: '60-90 min',
      status: 'completed',
      score: 78,
    },
    {
      id: '4',
      title: 'JavaScript Event Loop Explained',
      description: 'Explain how the JavaScript event loop works with examples.',
      type: 'theory',
      difficulty: 'easy',
      estimatedTime: '15-20 min',
      status: 'completed',
      score: 95,
    },
    {
      id: '5',
      title: 'Implement a Custom Hook for API Calls',
      description: 'Create a reusable custom hook for handling API calls with loading and error states.',
      type: 'machine-coding',
      difficulty: 'medium',
      estimatedTime: '30-45 min',
      status: 'in-progress',
    },
  ];

  const stats = [
    { value: '24', label: 'Problems Attempted' },
    { value: '18', label: 'Problems Completed' },
    { value: '82%', label: 'Average Score' },
    { value: '12h', label: 'Total Time Spent' }
  ];

  const filteredProblems = mockProblems.filter(problem => {
    const matchesType = activeType === 'all' || problem.type === activeType;
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesDifficulty && matchesSearch;
  });

  const typeCounts = PROBLEM_TYPES.map(type => ({
    ...type,
    count: mockProblems.filter(p => type.id === 'all' || p.type === type.id).length
  }));

  return (
    <HistoryContainer>
      <Header>
        <Title>Interview History</Title>
        <Subtitle>Track your progress and review past interviews</Subtitle>
      </Header>

      <StatsContainer>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsContainer>

      <FilterSection>
        <FilterHeader>
          <FiFilter />
          Filters
        </FilterHeader>
        <FilterRow>
          <ProblemTypeFilter
            types={typeCounts}
            activeType={activeType}
            onTypeChange={setActiveType}
            showCount={true}
          />
        </FilterRow>
        <FilterRow>
          <FilterSelect
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </FilterSelect>
          <FilterSelect
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </FilterSelect>
          <FilterInput
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FilterRow>
      </FilterSection>

      {filteredProblems.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📝</EmptyIcon>
          <EmptyTitle>No problems found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your filters or start solving your first problem.
          </EmptyDescription>
        </EmptyState>
      ) : (
        <ProblemsGrid>
          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              showScore={true}
              showStatus={true}
            />
          ))}
        </ProblemsGrid>
      )}
    </HistoryContainer>
  );
} 