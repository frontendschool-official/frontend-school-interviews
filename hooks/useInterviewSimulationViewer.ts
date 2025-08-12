import { useState, useEffect, useRef } from 'react';
import {
  MockInterviewEvaluation,
  MockInterviewSession,
} from '../types/problem';

interface UseInterviewSimulationViewerProps {
  session: MockInterviewSession;
  onComplete: (score: number, feedback: string) => void;
  onExit: () => void;
}

export const useInterviewSimulationViewer = ({
  session,
  onComplete,
  onExit,
}: UseInterviewSimulationViewerProps) => {
  const excalidrawRef = useRef<any>(null);

  // State management
  const [currentProblemIndex, setCurrentProblemIndex] = useState(
    session.currentProblemIndex || 0
  );
  const [code, setCode] = useState<string>('');
  const [isProblemPanelCollapsed, setIsProblemPanelCollapsed] = useState(false);
  const [problemPanelWidth, setProblemPanelWidth] = useState(400);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] =
    useState<MockInterviewEvaluation | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [completedProblems, setCompletedProblems] = useState<Set<number>>(
    new Set()
  );
  const [problemScores, setProblemScores] = useState<Record<number, number>>(
    {}
  );
  const [problemFeedbacks, setProblemFeedbacks] = useState<
    Record<number, string>
  >({});

  const currentProblem = session.problems[currentProblemIndex];
  const problemPanelRef = useRef<HTMLDivElement>(null);

  // Timer effect
  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsTimerActive(false);
          // Auto-submit when time runs out
          handleCompleteInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timeRemaining]);

  // Handle problem panel resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (problemPanelRef.current) {
        const newWidth = e.clientX;
        if (newWidth > 200 && newWidth < 800) {
          setProblemPanelWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = () => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const resizeHandle = document.querySelector('.resize-handle');
    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (resizeHandle) {
        resizeHandle.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < session.problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setCode('');
      setFeedback(null);
    }
  };

  const handlePreviousProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
      setCode('');
      setFeedback(null);
    }
  };

  const handleSubmitProblem = async () => {
    if (!currentProblem) return;

    setIsEvaluating(true);
    try {
      const response = await fetch('/api/interview-simulation/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId: currentProblem.id,
          code,
          sessionId: session.id,
          problemIndex: currentProblemIndex,
        }),
      });

      if (!response.ok) {
        throw new Error('Evaluation failed');
      }

      const result = await response.json();
      setFeedback(result.feedback);
      setProblemScores(prev => ({
        ...prev,
        [currentProblemIndex]: result.score,
      }));
      setProblemFeedbacks(prev => ({
        ...prev,
        [currentProblemIndex]: result.feedback,
      }));
      setCompletedProblems(prev => new Set([...prev, currentProblemIndex]));
      setShowFeedbackModal(true);
      setFeedbackData(result);
    } catch (error) {
      console.error('Error evaluating problem:', error);
      setFeedback('Error evaluating submission. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCompleteInterview = async () => {
    try {
      const totalScore = Object.values(problemScores).reduce(
        (sum, score) => sum + score,
        0
      );
      const averageScore = totalScore / session.problems.length;

      const result = {
        sessionId: session.id,
        totalScore,
        averageScore,
        completedProblems: Array.from(completedProblems),
        problemScores,
        problemFeedbacks,
        timeSpent: 45 * 60 - timeRemaining,
      };

      onComplete(
        totalScore,
        result.problemFeedbacks[currentProblemIndex] || ''
      );
    } catch (error) {
      console.error('Error completing interview:', error);
    }
  };

  const handleExit = () => {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
      onExit();
    }
  };

  const toggleProblemPanel = () => {
    setIsProblemPanelCollapsed(!isProblemPanelCollapsed);
  };

  const handleCanvasReady = () => {
    setCanvasReady(true);
  };

  return {
    // State
    currentProblemIndex,
    code,
    isProblemPanelCollapsed,
    problemPanelWidth,
    isCanvasReady,
    isEvaluating,
    feedback,
    showFeedbackModal,
    feedbackData,
    timeRemaining,
    isTimerActive,
    completedProblems,
    problemScores,
    problemFeedbacks,
    currentProblem,

    // Refs
    excalidrawRef,
    problemPanelRef,

    // Computed values
    totalProblems: session.problems.length,
    formattedTime: formatTime(timeRemaining),
    isLastProblem: currentProblemIndex === session.problems.length - 1,
    isFirstProblem: currentProblemIndex === 0,
    progressPercentage:
      ((currentProblemIndex + 1) / session.problems.length) * 100,

    // Handlers
    setCode,
    handleNextProblem,
    handlePreviousProblem,
    handleSubmitProblem,
    handleCompleteInterview,
    handleExit,
    toggleProblemPanel,
    handleCanvasReady,
    setShowFeedbackModal,
  };
};
