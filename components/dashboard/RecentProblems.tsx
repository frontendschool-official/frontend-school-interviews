import React from 'react';
import Link from 'next/link';
import { FiClock, FiCheckCircle, FiPlay, FiStar } from 'react-icons/fi';
import { useDashboardData } from '@/hooks/useDashboardData';

interface RecentProblemsProps {
  recentActivity?: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    score?: number;
    timeSpent?: number;
    lastAttemptedAt: any;
    difficulty: string;
  }>;
}

export default function RecentProblems({
  recentActivity,
}: RecentProblemsProps) {
  const { recentProblems, loading } = useDashboardData();

  // Use enhanced data from API if available, otherwise fall back to hook data
  const problemsToShow = recentActivity || recentProblems;

  if (loading) {
    return (
      <div className='bg-secondary border border-border rounded-xl p-4 sm:p-6 opacity-70'>
        <h3 className='text-lg sm:text-xl font-semibold text-neutralDark mb-4 flex items-center gap-2'>
          <FiClock className='text-primary' />
          Recent Problems
        </h3>
        {[1, 2, 3].map(index => (
          <div key={index} className='flex items-center gap-3 mb-3 last:mb-0'>
            <div className='w-8 h-8 sm:w-10 sm:h-10 bg-border rounded animate-pulse'></div>
            <div className='flex-1'>
              <div className='w-24 h-3 bg-border rounded mb-1 animate-pulse'></div>
              <div className='w-20 h-2 bg-border rounded animate-pulse'></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!problemsToShow || problemsToShow.length === 0) {
    return (
      <div className='bg-secondary border border-border rounded-xl p-4 sm:p-6'>
        <h3 className='text-lg sm:text-xl font-semibold text-neutralDark mb-4 flex items-center gap-2'>
          <FiClock className='text-primary' />
          Recent Problems
        </h3>
        <div className='text-center py-6 text-text/70'>
          <p className='text-sm'>No recent problems yet.</p>
          <Link
            href='/problems'
            className='text-primary hover:underline mt-2 inline-block text-sm'
          >
            Start solving problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-secondary border border-border rounded-xl p-4 sm:p-6'>
      <h3 className='text-lg sm:text-xl font-semibold text-neutralDark mb-4 flex items-center gap-2'>
        <FiClock className='text-primary' />
        Recent Problems
      </h3>
      <div className='space-y-3'>
        {problemsToShow.map((problem, index) => {
          const formatDate = (timestamp: any): string => {
            if (!timestamp) return 'Unknown';

            const date = timestamp.toDate
              ? timestamp.toDate()
              : new Date(timestamp);
            const now = new Date();
            const diffInHours = Math.floor(
              (now.getTime() - date.getTime()) / (1000 * 60 * 60)
            );

            if (diffInHours < 1) return 'Just now';
            if (diffInHours < 24) return `${diffInHours} hours ago`;
            if (diffInHours < 48) return '1 day ago';
            return `${Math.floor(diffInHours / 24)} days ago`;
          };

          return (
            <div
              key={index}
              className='flex items-center gap-3 p-3 bg-bodyBg border border-border rounded-lg'
            >
              <div className='w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0'>
                {problem.status === 'completed' ? (
                  <FiCheckCircle className='text-green-500 text-lg sm:text-xl' />
                ) : problem.status === 'attempted' ? (
                  <FiClock className='text-yellow-500 text-lg sm:text-xl' />
                ) : (
                  <FiPlay className='text-primary text-lg sm:text-xl' />
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='font-medium text-neutralDark mb-1 text-sm sm:text-base truncate'>{problem.title}</h4>
                <div className='flex items-center gap-2 text-xs sm:text-sm text-text/70'>
                  <span className='capitalize'>{problem.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span>•</span>
                  <span>
                    {'lastAttemptedAt' in problem
                      ? formatDate(problem.lastAttemptedAt)
                      : problem.date}
                  </span>
                  {problem.score && (
                    <>
                      <span>•</span>
                      <span className='flex items-center gap-1'>
                        <FiStar className='text-yellow-500' />
                        {problem.score}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Link
                href={`/problems/${problem.id}`}
                className='px-2 py-1 bg-primary text-white text-xs sm:text-sm rounded hover:bg-accent transition-colors flex-shrink-0'
              >
                {problem.status === 'completed' ? 'Review' : 'Continue'}
              </Link>
            </div>
          );
        })}
      </div>
      <div className='mt-4 text-center'>
        <Link
          href='/problems'
          className='text-primary hover:underline font-medium text-sm'
        >
          View all problems
        </Link>
      </div>
    </div>
  );
}
