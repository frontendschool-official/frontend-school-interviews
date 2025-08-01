import { useState } from 'react';
import styled from 'styled-components';
import { evaluateSubmission } from '../services/geminiApi';
import { saveSubmission } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { exportToBlob } from '@excalidraw/excalidraw';

interface EvaluateButtonProps {
  designation: string;
  code: string;
  excalidrawRef: any;
  problemId: string;
  onEvaluated: (feedback: string) => void;
}

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  color: ${({ theme }) => theme.bodyBg};
  background-color: ${({ theme }) => theme.primary};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  color: #dc2626;
  font-size: 0.9rem;
`;

const RetryButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

export default function EvaluateButton({ designation, code, excalidrawRef, problemId, onEvaluated }: EvaluateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleClick = async () => {
    if (!user) {
      setError('You must be logged in to evaluate your submission.');
      return;
    }

    // Check if this is a system design problem and canvas is required
    if (designation === 'design' && !excalidrawRef.current) {
      setError('System design canvas is not available. Please refresh the page and try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate that we have content to evaluate
      if (designation === 'coding' && !code.trim()) {
        throw new Error('Please provide some code before evaluating.');
      }

      // Get canvas elements for system design
      const elements = excalidrawRef.current.getSceneElements();
      const appState = excalidrawRef.current.getAppState();
      const files = excalidrawRef.current.getFiles();
      
      // Check if there's any content in the canvas for design problems
      if (designation === 'design' && (!elements || elements.length === 0)) {
        throw new Error('Please add some elements to your system design before evaluating.');
      }

      // Export canvas to blob
      const blob = await exportToBlob({ 
        elements, 
        appState, 
        files, 
        mimeType: 'image/png' 
      });

      // Convert blob to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('Failed to process canvas image'));
        reader.readAsDataURL(blob);
      });

      // Evaluate submission
      const feedback = await evaluateSubmission({ 
        designation, 
        code, 
        drawingImage: base64Data 
      });

      // Save submission to database
      await saveSubmission(user.uid, problemId, { 
        designation, 
        code, 
        feedback 
      });

      onEvaluated(feedback);
    } catch (err) {
      console.error('Evaluation error:', err);
      
      let errorMessage = 'An unexpected error occurred during evaluation.';
      
      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (err.message.includes('API') || err.message.includes('key') || err.message.includes('AI service')) {
          errorMessage = 'AI evaluation service is not configured. Please contact support to enable AI feedback.';
        } else if (err.message.includes('permission') || err.message.includes('unauthorized')) {
          errorMessage = 'You do not have permission to save this submission.';
        } else if (err.message.includes('canvas') || err.message.includes('image')) {
          errorMessage = 'Failed to process your system design. Please try again.';
        } else {
          errorMessage = err.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleClick();
  };

  return (
    <div>
      <Button onClick={handleClick} disabled={loading}>
        {loading ? 'Evaluating…' : 'Evaluate'}
      </Button>
      
      {error && (
        <ErrorMessage>
          <div>{error}</div>
          <RetryButton onClick={handleRetry}>
            Try Again
          </RetryButton>
        </ErrorMessage>
      )}
    </div>
  );
}