import React from 'react';
import Link from 'next/link';
import { FiClock, FiCheckCircle, FiPlay } from 'react-icons/fi';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function RecentProblems() {
  const { recentProblems, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="bg-secondary border border-border rounded-xl p-6 opacity-70">
        <h3 className="text-xl font-semibold text-text mb-4">Recent Problems</h3>
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex items-center gap-4 mb-4 last:mb-0">
            <div className="w-12 h-12 bg-border rounded animate-pulse"></div>
            <div className="flex-1">
              <div className="w-32 h-4 bg-border rounded mb-2 animate-pulse"></div>
              <div className="w-24 h-3 bg-border rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!recentProblems || recentProblems.length === 0) {
    return (
      <div className="bg-secondary border border-border rounded-xl p-6">
        <h3 className="text-xl font-semibold text-text mb-4">Recent Problems</h3>
        <div className="text-center py-8 text-text/70">
          <p>No recent problems yet.</p>
          <Link href="/problems" className="text-primary hover:underline mt-2 inline-block">
            Start solving problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold text-text mb-4">Recent Problems</h3>
      <div className="space-y-4">
        {recentProblems.map((problem, index) => (
          <div key={index} className="flex items-center gap-4 p-3 bg-bodyBg border border-border rounded-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              {problem.status === 'completed' ? (
                <FiCheckCircle className="text-green-500 text-xl" />
              ) : problem.status === 'in-progress' ? (
                <FiClock className="text-yellow-500 text-xl" />
              ) : (
                <FiPlay className="text-primary text-xl" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-text mb-1">{problem.title}</h4>
                             <p className="text-sm text-text/70">{problem.type} • {problem.date}</p>
            </div>
            <Link 
              href={`/problems/${problem.id}`}
              className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-accent transition-colors"
            >
              {problem.status === 'completed' ? 'Review' : 'Continue'}
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link 
          href="/problems" 
          className="text-primary hover:underline font-medium"
        >
          View all problems
        </Link>
      </div>
    </div>
  );
} 