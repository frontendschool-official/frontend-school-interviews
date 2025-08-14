import { useState } from 'react';
import { useAuth } from './useAuth';
import { ParsedProblemData } from '../types/problem';

interface FeedbackData {
  overallFeedback: string;
  codeQuality: string;
  algorithmAnalysis: string;
  suggestions: string[];
  improvements: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  rawFeedback: string;
}

export const useInterviewFeedback = (problem: ParsedProblemData | null) => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);

  const parseFeedback = (fb: string): FeedbackData => {
    try {
      const sections = fb.split(/(?=💡|🔍|⚡|🚀|🎯)/);

      const overallFeedback =
        sections.find(s => s.includes('Overall') || s.includes('Feedback')) ||
        fb;
      const codeQuality =
        sections.find(
          s => s.includes('Code Quality') || s.includes('Quality')
        ) || '';
      const algorithmAnalysis =
        sections.find(
          s => s.includes('Algorithm') || s.includes('Complexity')
        ) || '';

      const suggestionsMatch = fb.match(
        /Suggestions?[:\s]*([\s\S]*?)(?=Improvements?|$)/i
      );
      const improvementsMatch = fb.match(
        /Improvements?[:\s]*([\s\S]*?)(?=Suggestions?|$)/i
      );

      const suggestions = suggestionsMatch
        ? suggestionsMatch[1]
            .split('\n')
            .filter(
              s =>
                s.trim().startsWith('-') ||
                s.trim().startsWith('•') ||
                s.trim().startsWith('*')
            )
            .map(s => s.replace(/^[-•*]\s*/, '').trim())
            .filter(s => s.length > 0)
        : [];

      const improvements = improvementsMatch
        ? improvementsMatch[1]
            .split('\n')
            .filter(
              s =>
                s.trim().startsWith('-') ||
                s.trim().startsWith('•') ||
                s.trim().startsWith('*')
            )
            .map(s => s.replace(/^[-•*]\s*/, '').trim())
            .filter(s => s.length > 0)
        : [];

      const timeComplexityMatch = fb.match(/Time Complexity[:\s]*([^\n]+)/i);
      const spaceComplexityMatch = fb.match(/Space Complexity[:\s]*([^\n]+)/i);

      return {
        overallFeedback: overallFeedback
          .replace(/^[💡🔍⚡🚀🎯]\s*/u, '')
          .trim(),
        codeQuality: codeQuality.replace(/^[💡🔍⚡🚀🎯]\s*/u, '').trim(),
        algorithmAnalysis: algorithmAnalysis
          .replace(/^[💡🔍⚡🚀🎯]\s*/u, '')
          .trim(),
        suggestions,
        improvements,
        timeComplexity: timeComplexityMatch
          ? timeComplexityMatch[1].trim()
          : undefined,
        spaceComplexity: spaceComplexityMatch
          ? spaceComplexityMatch[1].trim()
          : undefined,
        rawFeedback: fb,
      };
    } catch (error) {
      console.error('Error parsing feedback:', error);
      return {
        overallFeedback: fb,
        codeQuality: '',
        algorithmAnalysis: '',
        suggestions: [],
        improvements: [],
        rawFeedback: fb,
      };
    }
  };

  const handleEvaluated = async (fb: string) => {
    setFeedback(fb);

    const parsedFeedback = parseFeedback(fb);
    setFeedbackData(parsedFeedback);
    setShowFeedbackModal(true);

    // Save detailed feedback to database using API
    if (user && problem) {
      try {
        const response = await fetch('/api/problems/save-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            problemId: problem.id || '',
            feedbackData: {
              ...parsedFeedback,
              problemTitle: problem.designation,
              problemType: problem.interviewType,
              designation: problem.designation,
            },
          }),
        });

        if (!response.ok) {
          console.error('Error saving feedback:', response.statusText);
        }
      } catch (error) {
        console.error('Error saving feedback:', error);
      }
    }
  };

  const clearFeedback = () => {
    setFeedback(null);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
  };

  return {
    feedback,
    showFeedbackModal,
    feedbackData,
    handleEvaluated,
    clearFeedback,
    closeFeedbackModal,
  };
};
