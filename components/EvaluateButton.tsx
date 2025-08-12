import React, { useState } from 'react';
import { FiPlay, FiRotateCcw } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useEvaluateSubmission } from '@/hooks/useApi';

interface ExcalidrawRef {
  getScene: () => unknown;
  exportToCanvas: () => Promise<HTMLCanvasElement>;
}

interface EvaluateButtonProps {
  designation: string;
  code: string;
  excalidrawRef: React.RefObject<ExcalidrawRef | null>;
  problemId: string;
  onEvaluated: (feedback: string) => void;
  interviewType: string;
  problemStatement: string;
  problemTitle: string;
}

export default function EvaluateButton({
  designation,
  code,
  excalidrawRef,
  onEvaluated,
  interviewType,
}: EvaluateButtonProps) {
  const { user } = useAuth();
  const { execute: evaluateSubmission } = useEvaluateSubmission();
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = async () => {
    if (!user) {
      alert('Please sign in to evaluate your solution');
      return;
    }

    setIsEvaluating(true);

    try {
      let drawingImage = '';

      // For system design problems, capture the canvas
      if (interviewType === 'design' && excalidrawRef.current) {
        try {
          const canvas = await excalidrawRef.current.exportToCanvas();
          drawingImage = canvas.toDataURL('image/png').split(',')[1]; // Remove data URL prefix
        } catch (error) {
          console.error('Error capturing canvas:', error);
        }
      }

      const evaluationData = {
        designation,
        code,
        drawingImage,
      };

      const result = await evaluateSubmission(evaluationData);

      if (result.error) {
        onEvaluated(result.error || 'Evaluation failed');
      } else {
        onEvaluated((result.data as any)?.feedback || 'Evaluation completed');
      }
    } catch (error) {
      console.error('Evaluation error:', error);
      onEvaluated('Error during evaluation. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <button
      onClick={handleEvaluate}
      disabled={isEvaluating || !user}
      className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
    >
      {isEvaluating ? (
        <FiRotateCcw className='text-sm animate-spin' />
      ) : (
        <FiPlay className='text-sm' />
      )}
      {isEvaluating ? 'Evaluating...' : 'Evaluate'}
    </button>
  );
}
