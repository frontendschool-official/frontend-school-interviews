import { useState, useMemo } from 'react';
import { Problem, ProblemStatus } from '../../../hooks/useProblems';
import { ProblemType } from '@/types/problem';

export type FilterType = 'all' | 'dsa' | 'machine_coding' | 'system_design' | 'attempted';

export interface ProblemStats {
  total: number;
  dsa: number;
  machineCoding: number;
  systemDesign: number;
  attempted: number;
}

export interface UseProblemFiltersProps {
  problems: Problem[];
  statuses: Record<string, ProblemStatus>;
  user: any;
}

export const useProblemFilters = ({ problems, statuses, user }: UseProblemFiltersProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const getProblemType = (problem: Problem): ProblemType => {
    if ('type' in problem) {
      return problem.type;
    }
    if ('interviewType' in problem) {
      switch (problem.interviewType) {
        case 'dsa': return 'dsa';
        case 'coding': return 'machine_coding';
        case 'design': return 'system_design';
        default: return 'user_generated';
      }
    }
    return 'user_generated';
  };

  const stats = useMemo((): ProblemStats => ({
    total: problems.length,
    dsa: problems.filter((p) => getProblemType(p) === 'dsa').length,
    machineCoding: problems.filter((p) => getProblemType(p) === 'machine_coding').length,
    systemDesign: problems.filter((p) => getProblemType(p) === 'system_design').length,
    attempted: user
      ? Object.values(statuses).filter((s) => s === 'attempted').length
      : 0,
  }), [problems, statuses, user]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const problemType = getProblemType(problem);
      if (activeFilter === 'all') return true;
      if (activeFilter === 'dsa') return problemType === 'dsa';
      if (activeFilter === 'machine_coding') return problemType === 'machine_coding';
      if (activeFilter === 'system_design') return problemType === 'system_design';
      if (activeFilter === 'attempted') return statuses[problem.id || ''] === 'attempted';
      return true;
    });
  }, [problems, statuses, activeFilter]);

  const setFilter = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  return {
    activeFilter,
    stats,
    filteredProblems,
    setFilter,
  };
}; 