import React from 'react';
import styled from 'styled-components';
import { FiTarget, FiCode, FiBarChart2, FiBookOpen } from 'react-icons/fi';

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid ${({ theme, active }) => active ? theme.primary : theme.border};
  background: ${({ theme, active }) => active ? theme.primary : theme.secondary};
  color: ${({ theme, active }) => active ? 'white' : theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.border}20;
  }

  &:active {
    transform: translateY(0);
  }
`;

const FilterIcon = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
`;

export interface ProblemType {
  id: string;
  label: string;
  icon: React.ComponentType;
  color: string;
  count?: number;
}

interface ProblemTypeFilterProps {
  types: ProblemType[];
  activeType: string;
  onTypeChange: (typeId: string) => void;
  showCount?: boolean;
}

export default function ProblemTypeFilter({
  types,
  activeType,
  onTypeChange,
  showCount = true
}: ProblemTypeFilterProps) {
  return (
    <FilterContainer>
      {types.map((type) => (
        <FilterButton
          key={type.id}
          active={activeType === type.id}
          onClick={() => onTypeChange(type.id)}
        >
          <FilterIcon color={type.color}>
            <type.icon />
          </FilterIcon>
          {type.label}
          {showCount && type.count !== undefined && (
            <span>({type.count})</span>
          )}
        </FilterButton>
      ))}
    </FilterContainer>
  );
}

// Predefined problem types for reuse
export const PROBLEM_TYPES: ProblemType[] = [
  {
    id: 'all',
    label: 'All Problems',
    icon: FiTarget,
    color: '#6b7280'
  },
  {
    id: 'dsa',
    label: 'DSA',
    icon: FiTarget,
    color: '#10b981'
  },
  {
    id: 'machine-coding',
    label: 'Machine Coding',
    icon: FiCode,
    color: '#3b82f6'
  },
  {
    id: 'system-design',
    label: 'System Design',
    icon: FiBarChart2,
    color: '#f59e0b'
  },
  {
    id: 'theory',
    label: 'Theory',
    icon: FiBookOpen,
    color: '#8b5cf6'
  }
]; 