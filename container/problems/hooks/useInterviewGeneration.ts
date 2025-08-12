import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
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
      console.log('🚀 Starting interview generation with values:', values);
      console.log('🔑 User ID:', user.uid);

      // Step 1: Generate interview questions using API endpoint
      console.log('📝 Calling generate interview API...');
      const response = await fetch('/api/problems/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          designation,
          companies,
          round,
          interviewType,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to generate interview questions'
        );
      }

      const result = await response.json();
      console.log('✅ Generated result:', result);

      // Step 2: Validate the generated result
      if (!result || !result.docRef) {
        throw new Error('Interview generation returned invalid response');
      }

      const newProblem: ProblemData = {
        id: result.docRef.id,
        userId: user.uid,
        title:
          interviewType === 'dsa'
            ? 'DSA Problem'
            : interviewType === 'theory_and_debugging'
              ? 'Theory Problem'
              : 'Coding Problem',
        designation,
        companies,
        round,
        interviewType,
        ...result.problemData,
      };

      console.log('New problem object:', newProblem);
      setState({ loading: false, error: null });

      return { problem: newProblem, docRef: result.docRef };
    } catch (error) {
      console.error('❌ Error starting interview:', error);

      // Enhanced error logging
      if (error instanceof Error) {
        console.error('❌ Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });

        // Check for specific error types
        if (error.message.includes('permission-denied')) {
          setState({
            loading: false,
            error:
              'Permission denied: Unable to save interview data. Please check your account permissions.',
          });
        } else if (
          error.message.includes('network') ||
          error.message.includes('unavailable')
        ) {
          setState({
            loading: false,
            error:
              'Network error: Please check your internet connection and try again.',
          });
        } else if (error.message.includes('Gemini API')) {
          setState({
            loading: false,
            error:
              'AI service error: Unable to generate interview questions. Please try again.',
          });
        } else if (error.message.includes('not generated properly')) {
          setState({
            loading: false,
            error:
              "Problem generation failed: The AI service didn't return valid interview questions. Please try again.",
          });
        } else {
          setState({
            loading: false,
            error: `Interview generation failed: ${error.message}`,
          });
        }
      } else {
        console.error('❌ Unknown error type:', error);
        setState({
          loading: false,
          error:
            'An unexpected error occurred while generating the interview. Please try again.',
        });
      }

      return null;
    }
  };

  const startInterviewAndNavigate = async (
    values: InterviewGenerationParams
  ) => {
    const result = await generateInterview(values);
    if (result) {
      router.push(`/problems/${result.docRef.id}`);
    }
    return result;
  };

  return {
    ...state,
    generateInterview,
    startInterviewAndNavigate,
  };
};
