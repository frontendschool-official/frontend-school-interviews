import { useMemo } from 'react';
import { Problem, ProblemStatus } from '../../../hooks/useProblems';
import { ProblemType } from '@/types/problem';
import { useAppStore } from '@/store';

export type FilterType = 'all' | 'dsa' | 'machine_coding' | 'system_design' | 'theory' | 'attempted';

export interface ProblemStats {
  total: number;
  dsa: number;
  machineCoding: number;
  systemDesign: number;
  theory: number;
  attempted: number;
}

export interface UseProblemFiltersProps {
  problems: Problem[];
  statuses: Record<string, ProblemStatus>;
  user: any;
}

export const useProblemFilters = ({ problems = [], statuses = {}, user }: UseProblemFiltersProps) => {
  const activeProblemFilter = useAppStore((s) => s.activeProblemFilter);
  const setActiveProblemFilter = useAppStore((s) => s.setActiveProblemFilter);

  const getProblemType = (problem: Problem): ProblemType => {
    if (!problem) return 'user_generated';
    
    if ('type' in problem) {
      return problem.type;
    }
    if ('interviewType' in problem) {
      switch (problem.interviewType) {
        case 'dsa': return 'dsa';
        case 'coding': return 'machine_coding';
        case 'design': return 'system_design';
        case 'theory': return 'theory';
        default: return 'user_generated';
      }
    }
    return 'user_generated';
  };

  const stats = useMemo((): ProblemStats => ({
    total: problems?.length || 0,
    dsa: problems?.filter((p) => getProblemType(p) === 'dsa').length || 0,
    machineCoding: problems?.filter((p) => getProblemType(p) === 'machine_coding').length || 0,
    systemDesign: problems?.filter((p) => getProblemType(p) === 'system_design').length || 0,
    theory: problems?.filter((p) => getProblemType(p) === 'theory').length || 0,
    attempted: user && statuses
      ? Object.values(statuses).filter((s) => s === 'attempted').length
      : 0,
  }), [problems, statuses, user]);

  const filteredProblems = useMemo(() => {
    if (!problems || !Array.isArray(problems)) return [];
    
    return problems.filter((problem) => {
      if (!problem) return false;
      
      const problemType = getProblemType(problem);
      if (activeProblemFilter === 'all') return true;
      if (activeProblemFilter === 'dsa') return problemType === 'dsa';
      if (activeProblemFilter === 'machine_coding') return problemType === 'machine_coding';
      if (activeProblemFilter === 'system_design') return problemType === 'system_design';
      if (activeProblemFilter === 'theory') return problemType === 'theory';
      if (activeProblemFilter === 'attempted') return statuses[problem.id || ''] === 'attempted';
      return true;
    });
  }, [problems, statuses, activeProblemFilter]);

  const setFilter = (filter: FilterType) => {
    setActiveProblemFilter(filter);
  };

  return {
    activeFilter: activeProblemFilter,
    stats,
    filteredProblems,
    setFilter,
  };
}; 