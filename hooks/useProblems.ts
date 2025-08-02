import { useState, useEffect } from 'react';
import { getAllProblems, getSubmissionsForUser } from '@/services/firebase';
import { useAuth } from './useAuth';
import { ProblemData, ParsedProblemData, PredefinedProblem } from '@/types/problem';

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
  const [state, setState] = useState<ProblemsState>({
    problems: [],
    statuses: {},
    loading: true,
    error: null,
  });

  const fetchProblems = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log('Fetching all problems');
      const allProblems = await getAllProblems();
      console.log('Fetched problems:', allProblems);

      // Create status map - all problems show as unsolved for non-authenticated users
      const statusMap: Record<string, ProblemStatus> = {};
      allProblems.forEach((p: Problem) => {
        statusMap[p.id || ''] = 'unsolved';
      });

      // If user is authenticated, fetch their submissions to update status
      if (user) {
        try {
          const submissionDocs = await getSubmissionsForUser(user.uid);
          console.log('Fetched submissions:', submissionDocs);

          allProblems.forEach((p: Problem) => {
            const submission = submissionDocs.find(
              (s: any) => s.problemId === p.id
            );
            if (submission) {
              statusMap[p.id || ''] = 'attempted';
            }
          });
        } catch (submissionError) {
          console.error('Error fetching submissions:', submissionError);
          // Continue with unsolved status for all problems
        }
      }

      setState({
        problems: allProblems,
        statuses: statusMap,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error loading problems:', error);
      
      let errorMessage = 'Failed to load problems';
      if (error instanceof Error && error.message.includes('Firebase is not properly initialized')) {
        errorMessage = 'Firebase configuration is missing. Please check your environment variables.';
      }

      setState({
        problems: [],
        statuses: {},
        loading: false,
        error: errorMessage,
      });
    }
  };

  const addProblem = (problem: Problem) => {
    setState(prev => ({
      ...prev,
      problems: [problem, ...prev.problems],
      statuses: { ...prev.statuses, [problem.id || '']: 'unsolved' },
    }));
  };

  const updateProblemStatus = (problemId: string, status: ProblemStatus) => {
    setState(prev => ({
      ...prev,
      statuses: { ...prev.statuses, [problemId]: status },
    }));
  };

  useEffect(() => {
    fetchProblems();
  }, [user]);

  return {
    ...state,
    refetch: fetchProblems,
    addProblem,
    updateProblemStatus,
  };
}; 