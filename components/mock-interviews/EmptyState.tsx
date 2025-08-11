import React from 'react';
import Link from 'next/link';
import { FiPlay } from 'react-icons/fi';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionLink?: string;
}

export default function EmptyState({ 
  title = "No recent activity yet.",
  message = "Start your first mock interview to see your progress here.",
  actionText = "Start your first mock interview",
  actionLink = "/interview-simulation"
}: EmptyStateProps) {
  return (
    <div className="text-center py-8 text-text/70">
      <p className="mb-4">{title}</p>
      <p className="mb-6 text-sm">{message}</p>
      <Link 
        href={actionLink} 
        className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
      >
        <FiPlay className="text-sm" />
        {actionText}
      </Link>
    </div>
  );
} 