import React from 'react';
import { FiLoader } from 'react-icons/fi';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading mock interview data..." }: LoadingStateProps) {
  return (
    <div className="text-center py-12">
      <FiLoader className="animate-spin text-4xl text-primary mx-auto mb-4" />
      <p className="text-text/80">{message}</p>
    </div>
  );
} 