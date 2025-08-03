import { useState } from 'react';
import { useRouter } from 'next/router';
import { generateInterviewQuestions } from '@/services/geminiApi';
import { saveProblemSet } from '@/services/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Problem } from '@/hooks/useProblems';
import { InterviewType, ProblemData } from '@/types/problem';

export interface InterviewGenerationParams {
  designation: string;
  companies: string;
  round: string;
  interviewType: InterviewType;
}

export interface InterviewGenerationState {
  loading: boolean;
  error: string | null;
}

export const useInterviewGeneration = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<InterviewGenerationState>({
    loading: false,
    error: null,
  });

  const generateInterview = async (values: InterviewGenerationParams) => {
    if (!user) {
      setState({ loading: false, error: 'User must be authenticated' });
      return null;
    }

    setState({ loading: true, error: null });

    try {
      const { designation, companies, round, interviewType } = values;
      console.log('Starting interview with values:', values);

      const result = await generateInterviewQuestions({
        designation,
        companies,
        round,
        interviewType,
      });
      console.log('Generated result:', result);

      const problemData: any = {
        userId: user.uid,
        designation,
        companies,
        round,
        interviewType,
      };

      if (interviewType === 'dsa') {
        problemData.dsaProblem = result.dsaProblem;
        console.log('Setting DSA problem data:', problemData);
      } else {
        problemData.machineCodingProblem = result.machineCodingProblem;
        problemData.systemDesignProblem = result.systemDesignProblem;
        console.log('Setting coding/design problem data:', problemData);
      }

      const docRef = await saveProblemSet(user.uid, problemData);
      console.log('Problem saved with docRef:', docRef);

      const newProblem: ProblemData = {
        id: docRef.id,
        userId: user.uid,
        title: interviewType === 'dsa' 
          ? 'DSA Problem'
          : 'Coding Problem',
        designation,
        companies,
        round,
        interviewType,
        ...problemData,
      };

      console.log('New problem object:', newProblem);
      setState({ loading: false, error: null });
      
      return { problem: newProblem, docRef };
    } catch (error) {
      console.error('Error starting interview', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate interview';
      setState({ loading: false, error: errorMessage });
      return null;
    }
  };

  const startInterviewAndNavigate = async (values: InterviewGenerationParams) => {
    const result = await generateInterview(values);
    if (result) {
      router.push(`/interview/${result.docRef.id}`);
    }
    return result;
  };

  return {
    ...state,
    generateInterview,
    startInterviewAndNavigate,
  };
}; 