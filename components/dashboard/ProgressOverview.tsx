import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function ProgressOverview() {
  const { progress, loading } = useDashboardData();

  if (loading) {
    return (
      <div className='bg-secondary border border-border rounded-xl p-6 opacity-70'>
        <div className='text-xl font-semibold text-text mb-4 flex items-center gap-2'>
          <FiBarChart2 />
          Learning Progress
        </div>
        {[1, 2, 3, 4].map(index => (
          <div
            key={index}
            className='w-full h-2 bg-border rounded mb-6 animate-pulse'
          ></div>
        ))}
      </div>
    );
  }

  const progressData = [
    {
      label: 'DSA Problems',
      percentage: progress.dsa.percentage,
      color: '#10b981',
      completed: progress.dsa.completed,
      total: progress.dsa.total,
    },
    {
      label: 'Machine Coding',
      percentage: progress.machineCoding.percentage,
      color: '#3b82f6',
      completed: progress.machineCoding.completed,
      total: progress.machineCoding.total,
    },
    {
      label: 'System Design',
      percentage: progress.systemDesign.percentage,
      color: '#f59e0b',
      completed: progress.systemDesign.completed,
      total: progress.systemDesign.total,
    },
    {
      label: 'Theory Questions',
      percentage: progress.theory.percentage,
      color: '#8b5cf6',
      completed: progress.theory.completed,
      total: progress.theory.total,
    },
  ];

  const overallProgress = Math.round(
    progressData.reduce((sum, item) => sum + item.percentage, 0) /
      progressData.length
  );

  const totalCompleted = progressData.reduce(
    (sum, item) => sum + item.completed,
    0
  );
  const totalProblems = progressData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className='bg-secondary border border-border rounded-xl p-4 sm:p-6'>
      <div className='text-lg sm:text-xl font-semibold text-neutralDark mb-4 flex items-center gap-2'>
        <FiBarChart2 className='text-primary' />
        Learning Progress
      </div>

      {progressData.map((item, index) => (
        <div key={index} className='mb-4 last:mb-0'>
          <div className='flex justify-between items-center mb-2'>
            <span className='font-medium text-neutralDark text-xs sm:text-sm'>{item.label}</span>
            <span className='text-xs sm:text-sm text-text/70'>
              {item.completed}/{item.total}
            </span>
          </div>
          <div className='w-full h-2 bg-border rounded overflow-hidden'>
            <div
              className='h-full rounded transition-all duration-300'
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
            ></div>
          </div>
        </div>
      ))}

      <div className='mt-4 pt-4 border-t border-border'>
        <div className='flex justify-between items-center'>
          <span className='font-semibold text-neutralDark text-sm sm:text-base'>Overall Progress</span>
          <span className='text-xl sm:text-2xl font-bold text-primary'>
            {overallProgress}%
          </span>
        </div>
        <div className='w-full h-2 bg-border rounded overflow-hidden mb-4'>
          <div
            className='h-full rounded transition-all duration-300'
            style={{ width: `${overallProgress}%`, backgroundColor: '#e5231c' }}
          ></div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='text-center'>
            <div className='text-xl font-semibold text-text'>
              {totalCompleted}
            </div>
            <div className='text-xs text-text/80 mt-1'>Completed</div>
          </div>
          <div className='text-center'>
            <div className='text-xl font-semibold text-text'>
              {totalProblems - totalCompleted}
            </div>
            <div className='text-xs text-text/80 mt-1'>Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
}
