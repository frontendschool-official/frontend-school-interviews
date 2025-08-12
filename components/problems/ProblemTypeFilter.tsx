import React from 'react';
import { FiTarget, FiCode, FiBarChart2, FiBookOpen } from 'react-icons/fi';

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
  showCount = true,
}: ProblemTypeFilterProps) {
  const getFilterButtonClasses = (isActive: boolean) => {
    const baseClasses =
      'px-6 py-3 rounded-lg font-semibold text-sm border cursor-pointer transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0';
    return isActive
      ? `${baseClasses} border-primary bg-primary text-white`
      : `${baseClasses} border-border bg-secondary text-text hover:shadow-border/20`;
  };

  return (
    <div className='flex gap-4 mb-8 flex-wrap'>
      {types.map(type => (
        <button
          key={type.id}
          className={getFilterButtonClasses(activeType === type.id)}
          onClick={() => onTypeChange(type.id)}
        >
          <div
            className='w-5 h-5 flex items-center justify-center text-inherit'
            style={{ color: type.color }}
          >
            <type.icon />
          </div>
          {type.label}
          {showCount && type.count !== undefined && <span>({type.count})</span>}
        </button>
      ))}
    </div>
  );
}

// Predefined problem types for reuse
export const PROBLEM_TYPES: ProblemType[] = [
  {
    id: 'all',
    label: 'All Problems',
    icon: FiTarget,
    color: '#6b7280',
  },
  {
    id: 'dsa',
    label: 'DSA',
    icon: FiTarget,
    color: '#10b981',
  },
  {
    id: 'machine-coding',
    label: 'Machine Coding',
    icon: FiCode,
    color: '#3b82f6',
  },
  {
    id: 'system-design',
    label: 'System Design',
    icon: FiBarChart2,
    color: '#f59e0b',
  },
  {
    id: 'theory',
    label: 'Theory',
    icon: FiBookOpen,
    color: '#8b5cf6',
  },
];
