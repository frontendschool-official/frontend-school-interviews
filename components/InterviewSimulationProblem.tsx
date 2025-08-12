import React, { useState, useEffect } from 'react';
import { FiClock, FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useThemeContext } from '../hooks/useTheme';
import DSAEditor from './DSAEditor';
import CodeEditor from './CodeEditor';
import SystemDesignCanvas from './SystemDesignCanvas';
import { SimulationProblem } from '../types/problem';

interface InterviewSimulationProblemProps {
  problem: SimulationProblem;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: (solution: any) => void;
  currentIndex: number;
  totalProblems: number;
  timeLimit?: number; // in minutes
}

export default function InterviewSimulationProblem({
  problem,
  onNext,
  onPrevious,
  onSubmit,
  currentIndex,
  totalProblems,
  timeLimit = 45,
}: InterviewSimulationProblemProps) {
  const { theme } = useThemeContext();
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // Convert to seconds
  const [solution, setSolution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getButtonClasses = (variant: 'primary' | 'secondary') => {
    const baseClasses =
      'flex items-center gap-2 px-6 py-3 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200';
    return variant === 'primary'
      ? `${baseClasses} bg-primary text-bodyBg hover:bg-accent hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none`
      : `${baseClasses} bg-neutral text-bodyBg hover:bg-neutralDark hover:-translate-y-0.5`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        problemId: problem.id,
        solution,
        timeSpent: timeLimit * 60 - timeRemaining,
      });
    } catch (error) {
      console.error('Error submitting solution:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProblemContent = () => {
    switch (problem.type) {
      case 'dsa':
        return <DSAEditor code={solution} onChange={setSolution} />;

      case 'machine_coding':
        return (
          <CodeEditor
            code={solution}
            onChange={setSolution}
            theme={theme === 'dark' ? 'dark' : 'light'}
          />
        );

      case 'system_design':
        return (
          <SystemDesignCanvas onReady={() => console.log('Canvas ready')} />
        );

      case 'theory_and_debugging':
        return (
          <div className='h-96'>
            <textarea
              value={solution}
              onChange={e => setSolution(e.target.value)}
              placeholder='Write your answer here...'
              className='w-full h-full p-4 border border-border rounded-lg bg-bodyBg text-text resize-none focus:outline-none focus:border-primary'
            />
          </div>
        );

      default:
        return <div>Unsupported problem type</div>;
    }
  };

  const renderProblemDescription = () => (
    <div className='p-5 text-neutral leading-relaxed whitespace-pre-wrap'>
      {problem.description}
    </div>
  );

  return (
    <div className='bg-secondary border border-border rounded-xl shadow-lg overflow-hidden min-h-[600px]'>
      {/* Header */}
      <div className='p-5 border-b border-border bg-bodyBg'>
        <h2 className='text-2xl font-semibold text-neutralDark mb-2'>
          {problem.title}
        </h2>

        <div className='flex items-center gap-4 text-neutral text-sm'>
          <div className='flex items-center gap-2'>
            <FiClock />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}
          >
            {problem.difficulty}
          </span>

          <span>
            Problem {currentIndex + 1} of {totalProblems}
          </span>
        </div>
      </div>

      {/* Problem Description */}
      {renderProblemDescription()}

      {/* Solution Area */}
      <div className='h-96'>{renderProblemContent()}</div>

      {/* Footer */}
      <div className='flex justify-between items-center p-5 bg-secondary border-t border-border'>
        <div className='flex items-center gap-2 text-neutral text-base'>
          <FiClock />
          <span>Time remaining: {formatTime(timeRemaining)}</span>
        </div>

        <div className='flex gap-3'>
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={getButtonClasses('secondary')}
          >
            <FiArrowLeft />
            Previous
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || timeRemaining === 0}
            className={getButtonClasses('primary')}
          >
            {isSubmitting ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                Submitting...
              </>
            ) : (
              <>
                <FiCheck />
                Submit
              </>
            )}
          </button>

          <button
            onClick={onNext}
            disabled={currentIndex === totalProblems - 1}
            className={getButtonClasses('secondary')}
          >
            Next
            <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
