import React from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="text-center py-12">
      <FiAlertCircle className="text-4xl text-red-500 mx-auto mb-4" />
      <p className="text-red-500 mb-4">Error loading data: {error}</p>
      <button 
        onClick={handleRetry}
        className="inline-flex items-center gap-2 text-primary hover:underline"
      >
        <FiRefreshCw className="text-sm" />
        Try again
      </button>
    </div>
  );
} 