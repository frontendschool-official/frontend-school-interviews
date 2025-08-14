import React from 'react';
import { FiTrendingUp, FiClock, FiCheckCircle, FiTarget } from 'react-icons/fi';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatsGridSkeleton } from '@/components/ui';

export default function DashboardStats() {
  const { stats, loading } = useDashboardData();

  if (loading) {
    return <StatsGridSkeleton />;
  }

  const statItems = [
    {
      icon: FiCheckCircle,
      color: '#10b981',
      value: stats.problemsSolved,
      label: 'Problems Solved',
      change: '+3 this week',
      positive: true,
    },
    {
      icon: FiClock,
      color: '#3b82f6',
      value: `${stats.timeSpent}h`,
      label: 'Time Spent',
      change: '+2h today',
      positive: true,
    },
    {
      icon: FiTrendingUp,
      color: '#f59e0b',
      value: `${stats.successRate}%`,
      label: 'Success Rate',
      change: '+5% this month',
      positive: true,
    },
    {
      icon: FiTarget,
      color: '#8b5cf6',
      value: stats.currentStreak,
      label: 'Current Streak',
      change: 'days',
      positive: true,
    },
  ];

  return (
    <div className='bg-secondary border border-border rounded-xl p-4 sm:p-6'>
      <h3 className='text-lg sm:text-xl font-semibold text-neutralDark mb-4 flex items-center gap-2'>
        <FiTrendingUp className='text-primary' />
        Overview Stats
      </h3>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {statItems.map((stat, index) => (
          <div
            key={index}
            className='bg-bodyBg border border-border rounded-lg p-3 sm:p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20'
          >
            <div
              className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg sm:text-xl mx-auto mb-2'
              style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
            >
              <stat.icon />
            </div>
            <div className='text-xl sm:text-2xl font-bold text-neutralDark mb-1'>
              {stat.value}
            </div>
            <div className='text-xs sm:text-sm text-text/70 font-medium mb-1'>
              {stat.label}
            </div>
            <div
              className={`text-xs font-semibold ${stat.positive ? 'text-green-500' : 'text-red-500'}`}
            >
              {stat.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
