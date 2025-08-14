import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProblems } from '@/hooks/useProblems';
import { useInterviewGeneration } from './useInterviewGeneration';
import { useProblemFilters } from './useProblemFilters';

export interface UseProblemsPageReturn {
  // Auth and data
  user: any;
  authLoading: boolean;
  problems: any[];
  statuses: Record<string, any>;
  problemsLoading: boolean;
  problemsError: any;
  
  // Filters and search
  activeFilter: string;
  stats: any;
  filteredProblems: any[];
  setFilter: (filter: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'title' | 'difficulty' | 'type';
  setSortBy: (sort: 'title' | 'difficulty' | 'type') => void;
  
  // Modal state
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  
  // Interview generation
  generationLoading: boolean;
  startInterviewAndNavigate: (values: any) => Promise<any>;
  
  // Processed data
  processedProblems: any[];
  tabItems: any[];
  
  // UI helpers
  isMac: boolean;
  searchInputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  
  // Handlers
  handleStartInterview: (values: any) => Promise<void>;
  handleRetry: () => void;
}

export const useProblemsPage = (): UseProblemsPageReturn => {
  const { user, loading: authLoading } = useAuth();
  const {
    problems,
    statuses,
    loading: problemsLoading,
    error: problemsError,
  } = useProblems();
  const { loading: generationLoading, startInterviewAndNavigate } =
    useInterviewGeneration();

  // Use the problem filters hook
  const { activeFilter, stats, filteredProblems, setFilter } =
    useProblemFilters({
      problems: problems || [],
      statuses: statuses || {},
      user,
    });

  // Local modal state (avoid global store loops)
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  // Search and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'difficulty' | 'type'>(
    'title'
  );

  // Search input ref for keyboard shortcuts
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = useState(false);

  // Add keyboard shortcut for search focus (Ctrl/Cmd + K)
  useEffect(() => {
    // Check if running on Mac for keyboard shortcut display
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tab configuration with icons and stats
  const tabItems = useMemo(
    () => [
      {
        id: 'all',
        label: 'All Problems',
        count: stats.total,
        icon: '📚',
      },
      {
        id: 'dsa',
        label: 'DSA',
        count: stats.dsa,
        icon: '🧮',
      },
      {
        id: 'machine_coding',
        label: 'Machine Coding',
        count: stats.machineCoding,
        icon: '💻',
      },
      {
        id: 'system_design',
        label: 'System Design',
        count: stats.systemDesign,
        icon: '🏗️',
      },
      {
        id: 'theory',
        label: 'Theory',
        count: stats.theory,
        icon: '📖',
      },
      ...(user
        ? [
            {
              id: 'attempted' as const,
              label: 'Attempted',
              count: stats.attempted,
              icon: '✅',
            },
          ]
        : []),
    ],
    [stats, user]
  );

  // Apply search and sort to filtered problems
  const processedProblems = useMemo(() => {
    if (!Array.isArray(filteredProblems)) return [];

    let processed = [...filteredProblems];

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      processed = processed.filter((problem: any) => {
        if (!problem || typeof problem !== 'object') return false;

        const title = problem.title?.toLowerCase() || '';
        const description = problem.description?.toLowerCase() || '';
        const category = problem.category?.toLowerCase() || '';
        const technologies = Array.isArray(problem.technologies)
          ? problem.technologies.join(' ').toLowerCase()
          : '';

        return (
          title.includes(query) ||
          description.includes(query) ||
          category.includes(query) ||
          technologies.includes(query)
        );
      });
    }

    // Apply sorting with error handling
    processed.sort((a: any, b: any) => {
      if (!a || !b) return 0;

      try {
        switch (sortBy) {
          case 'title':
            const titleA = a.title || '';
            const titleB = b.title || '';
            return titleA.localeCompare(titleB);

          case 'difficulty': {
            const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
            const aDiff = a.difficulty || 'medium';
            const bDiff = b.difficulty || 'medium';
            return (
              (difficultyOrder[aDiff as keyof typeof difficultyOrder] || 2) -
              (difficultyOrder[bDiff as keyof typeof difficultyOrder] || 2)
            );
          }

          case 'type': {
            const typeOrder = {
              dsa: 1,
              machine_coding: 2,
              system_design: 3,
              theory: 4,
            };
            const aType = a.type || 'user_generated';
            const bType = b.type || 'user_generated';
            return (
              (typeOrder[aType as keyof typeof typeOrder] || 5) -
              (typeOrder[bType as keyof typeof typeOrder] || 5)
            );
          }

          default:
            return 0;
        }
      } catch (error) {
        console.error('Error sorting problems:', error);
        return 0;
      }
    });

    return processed;
  }, [filteredProblems, searchQuery, sortBy]);

  const handleStartInterview = async (values: any) => {
    try {
      if (!values || typeof values !== 'object') {
        console.error('Invalid interview values provided');
        return;
      }

      const result = await startInterviewAndNavigate(values);
      console.log('startInterviewAndNavigate', result);
      if (result && result?.problem) {
        // addProblem(result?.problem);
        closeModal();
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
      // You could add a toast notification here for user feedback
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const isLoading = authLoading || problemsLoading;

  return {
    // Auth and data
    user,
    authLoading,
    problems,
    statuses,
    problemsLoading,
    problemsError,
    
    // Filters and search
    activeFilter,
    stats,
    filteredProblems,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    
    // Modal state
    modalOpen,
    openModal,
    closeModal,
    
    // Interview generation
    generationLoading,
    startInterviewAndNavigate,
    
    // Processed data
    processedProblems,
    tabItems,
    
    // UI helpers
    isMac,
    searchInputRef,
    isLoading,
    
    // Handlers
    handleStartInterview,
    handleRetry,
  };
};
