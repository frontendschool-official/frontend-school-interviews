import React from 'react';
import Loader from '@/components/ui/Loader';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = 'Loading mock interview data...',
}: LoadingStateProps) {
  return <Loader text={message} size='lg' variant='spinner' />;
}
