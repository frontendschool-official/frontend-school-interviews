import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { apiClient } from '@/lib/api-client';
import {
  ProblemData,
  ParsedProblemData,
  PredefinedProblem,
} from '@/types/problem';
import { useAppStore } from '@/store';

export type ProblemStatus = 'attempted' | 'solved' | 'unsolved';

export type Problem = ProblemData | ParsedProblemData | PredefinedProblem;

export interface ProblemsState {
  problems: Problem[];
  statuses: Record<string, ProblemStatus>;
  loading: boolean;
  error: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const useProblems = (page: number = 1, limit: number = 12) => {
  const { user } = useAuth();

  const problems = useAppStore(s => s.problems || []);
  const statuses = useAppStore(s => s.statuses || {});
  const loadingProblems = useAppStore(s => s.loadingProblems || false);
  const problemsError = useAppStore(s => s.problemsError || null);
  const pagination = useAppStore(s => s.pagination);
  const setProblems = useAppStore(s => s.setProblems);
  const setProblemsLoading = useAppStore(s => s.setProblemsLoading);
  const setProblemsError = useAppStore(s => s.setProblemsError);
  const addProblem = useAppStore(s => s.addProblem);
  const updateProblemStatus = useAppStore(s => s.updateProblemStatus);

  // Keep setter functions in refs to avoid re-running effects when their identity changes
  const setProblemsRef = useRef(setProblems);
  const setProblemsLoadingRef = useRef(setProblemsLoading);
  const setProblemsErrorRef = useRef(setProblemsError);

  // Update refs when setters change (does not trigger re-renders)
  setProblemsRef.current = setProblems;
  setProblemsLoadingRef.current = setProblemsLoading;
  setProblemsErrorRef.current = setProblemsError;

  useEffect(() => {
    let isCancelled = false;

    const fetchProblems = async () => {
      try {
        setProblemsLoadingRef.current?.(true);
        setProblemsErrorRef.current?.(null);

        // Fetch problems and submissions in parallel to reduce latency
        const allProblemsResponsePromise = apiClient.getAllProblems(page, limit);
        const submissionsPromise = user ? apiClient.getSubmissionsByUserId() : Promise.resolve({ data: [] } as any);

        const [allProblemsResponse, submissionResponse] = await Promise.all([
          allProblemsResponsePromise,
          submissionsPromise,
        ]);
        if (allProblemsResponse.error) {
          throw new Error(allProblemsResponse.error);
        }
        
        const responseData = allProblemsResponse.data as any || {};
        const problemsArray = responseData.problems || [];
        const paginationData = responseData.pagination;

        const statusMap: Record<string, ProblemStatus> = {};
        problemsArray.forEach((p: Problem) => {
          const id = (p as any)?.id as string | undefined;
          if (id) statusMap[id] = 'unsolved';
        });

        if (user && !submissionResponse.error) {
          const submissionDocs = submissionResponse.data || [];
          const submissionsArray = Array.isArray(submissionDocs)
            ? submissionDocs
            : [];

          problemsArray.forEach((p: Problem) => {
            const id = (p as any)?.id as string | undefined;
            if (!id) return;
            const submission = submissionsArray.find((s: any) => s.problemId === id);
            if (submission) statusMap[id] = 'attempted';
          });
        }

        if (!isCancelled) {
          setProblemsRef.current?.(problemsArray, statusMap, paginationData);
          setProblemsLoadingRef.current?.(false);
          setProblemsErrorRef.current?.(null);
        }
      } catch (error) {
        console.error('Error loading problems:', error);
        if (!isCancelled) {
          let errorMessage = 'Failed to load problems';
          if (
            error instanceof Error &&
            error.message.includes('Firebase is not properly initialized')
          ) {
            errorMessage =
              'Firebase configuration is missing. Please check your environment variables.';
          }
          setProblemsRef.current?.([], {});
          setProblemsLoadingRef.current?.(false);
          setProblemsErrorRef.current?.(errorMessage);
        }
      }
    };

    fetchProblems();

    return () => {
      isCancelled = true;
    };
  }, [user, page, limit]);

  return {
    problems,
    statuses,
    loading: loadingProblems,
    error: problemsError,
    pagination,
    addProblem,
    updateProblemStatus,
  };
};
