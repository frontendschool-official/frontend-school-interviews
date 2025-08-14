import { useState } from 'react';
import { useAuth } from './useAuth';
import { ParsedProblemData } from '../types/problem';

export const useInterviewAttempt = (problem: ParsedProblemData | null) => {
  const { user } = useAuth();
  const [isTrackingAttempt, setIsTrackingAttempt] = useState(false);

  const trackProblemAttempt = async () => {
    if (!user || !problem || isTrackingAttempt) return;

    setIsTrackingAttempt(true);
    try {
      const response = await fetch('/api/problems/mark-attempted', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId: problem.id || '',
          attemptData: {
            title: problem.designation,
            type: problem.interviewType,
            designation: problem.designation,
            companies: problem.companies || '',
            round: problem.round,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to track problem attempt');
      }
    } catch (error) {
      console.error('Error tracking problem attempt:', error);
    } finally {
      setIsTrackingAttempt(false);
    }
  };

  const handleCodeChange = (newCode: string) => {
    // Track attempt on first significant code change
    if (newCode.trim().length > 10 && !isTrackingAttempt) {
      trackProblemAttempt();
    }
  };

  return {
    isTrackingAttempt,
    trackProblemAttempt,
    handleCodeChange,
  };
};
