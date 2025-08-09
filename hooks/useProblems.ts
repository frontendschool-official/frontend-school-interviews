import { useEffect, useRef } from 'react';
import { getAllProblems, getSubmissionsForUser } from '@/services/firebase';
import { useAuth } from './useAuth';
import { ProblemData, ParsedProblemData, PredefinedProblem } from '@/types/problem';
import { useAppStore } from '@/store';

export type ProblemStatus = 'attempted' | 'solved' | 'unsolved';

export type Problem = ProblemData | ParsedProblemData | PredefinedProblem;

export interface ProblemsState {
  problems: Problem[];
  statuses: Record<string, ProblemStatus>;
  loading: boolean;
  error: string | null;
}

export const useProblems = () => {
  const { user } = useAuth();

  const problems = useAppStore((s) => s.problems || []);
  const statuses = useAppStore((s) => s.statuses || {});
  const loadingProblems = useAppStore((s) => s.loadingProblems || false);
  const problemsError = useAppStore((s) => s.problemsError || null);
  const setProblems = useAppStore((s) => s.setProblems);
  const setProblemsLoading = useAppStore((s) => s.setProblemsLoading);
  const setProblemsError = useAppStore((s) => s.setProblemsError);
  const addProblem = useAppStore((s) => s.addProblem);
  const updateProblemStatus = useAppStore((s) => s.updateProblemStatus);

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

        const allProblems = await getAllProblems();
        const problemsArray = Array.isArray(allProblems) ? allProblems : [];

        const statusMap: Record<string, ProblemStatus> = {};
        problemsArray.forEach((p: Problem) => {
          const id = (p as any)?.id as string | undefined;
          if (id) statusMap[id] = 'unsolved';
        });

        if (user) {
          try {
            const submissionDocs = await getSubmissionsForUser(user.uid);
            const submissionsArray = Array.isArray(submissionDocs) ? submissionDocs : [];

            problemsArray.forEach((p: Problem) => {
              const id = (p as any)?.id as string | undefined;
              if (!id) return;
              const submission = submissionsArray.find((s: any) => s.problemId === id);
              if (submission) statusMap[id] = 'attempted';
            });
          } catch (submissionError) {
            console.error('Error fetching submissions:', submissionError);
          }
        }

        if (!isCancelled) {
          setProblemsRef.current?.(problemsArray, statusMap);
          setProblemsLoadingRef.current?.(false);
          setProblemsErrorRef.current?.(null);
        }
      } catch (error) {
        console.error('Error loading problems:', error);
        if (!isCancelled) {
          let errorMessage = 'Failed to load problems';
          if (error instanceof Error && error.message.includes('Firebase is not properly initialized')) {
            errorMessage = 'Firebase configuration is missing. Please check your environment variables.';
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
  }, [user]);

  return {
    problems,
    statuses,
    loading: loadingProblems,
    error: problemsError,
    addProblem,
    updateProblemStatus,
  };
}; 