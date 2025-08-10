import React from 'react';
import { FiCalendar, FiTrendingUp, FiAward, FiClock } from 'react-icons/fi';

interface WeeklyStatsProps {
  weeklyStats?: {
    problemsAttempted: number;
    problemsCompleted: number;
    timeSpent: number;
    averageScore: number;
  };
  performanceByType?: {
    dsa: { attempted: number; completed: number; averageScore: number };
    machineCoding: { attempted: number; completed: number; averageScore: number };
    systemDesign: { attempted: number; completed: number; averageScore: number };
    theory: { attempted: number; completed: number; averageScore: number };
  };
  loading?: boolean;
}

export default function WeeklyStats({ weeklyStats, performanceByType, loading }: WeeklyStatsProps) {
  if (loading) {
    return (
      <div className="bg-secondary border border-border rounded-xl p-6 opacity-70">
        <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
          <FiCalendar />
          This Week's Activity
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-8 bg-border rounded mb-2 animate-pulse mx-auto"></div>
              <div className="w-16 h-3 bg-border rounded animate-pulse mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!weeklyStats) {
    return null;
  }

  const weeklyItems = [
    {
      icon: FiTrendingUp,
      color: '#10b981',
      value: weeklyStats.problemsAttempted,
      label: 'Problems Attempted',
      change: 'this week',
    },
    {
      icon: FiAward,
      color: '#3b82f6',
      value: weeklyStats.problemsCompleted,
      label: 'Problems Completed',
      change: 'this week',
    },
    {
      icon: FiClock,
      color: '#f59e0b',
      value: `${Math.round(weeklyStats.timeSpent / 60)}h`,
      label: 'Time Spent',
      change: 'this week',
    },
    {
      icon: FiAward,
      color: '#8b5cf6',
      value: `${weeklyStats.averageScore}%`,
      label: 'Average Score',
      change: 'this week',
    },
  ];

  return (
    <div className="bg-secondary border border-border rounded-xl p-6 mb-8">
      <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
        <FiCalendar />
        This Week's Activity
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {weeklyItems.map((stat, index) => (
          <div key={index} className="text-center">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mx-auto mb-2"
              style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
            >
              <stat.icon />
            </div>
            <div className="text-2xl font-bold text-text mb-1">{stat.value}</div>
            <div className="text-sm text-text/80 font-medium mb-1">{stat.label}</div>
            <div className="text-xs text-text/60">{stat.change}</div>
          </div>
        ))}
      </div>

      {performanceByType && (
        <div className="border-t border-border pt-6">
          <h4 className="text-lg font-semibold text-text mb-4">Performance by Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(performanceByType).map(([type, stats]) => (
              <div key={type} className="bg-bodyBg border border-border rounded-lg p-4">
                <h5 className="font-semibold text-text mb-2 capitalize">{type}</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text/70">Attempted:</span>
                    <span className="font-medium">{stats.attempted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/70">Completed:</span>
                    <span className="font-medium text-green-500">{stats.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/70">Avg Score:</span>
                    <span className="font-medium text-primary">{stats.averageScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 