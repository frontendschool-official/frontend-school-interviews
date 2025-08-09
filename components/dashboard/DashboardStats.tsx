import React from 'react';
import { FiTrendingUp, FiClock, FiCheckCircle, FiTarget } from 'react-icons/fi';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function DashboardStats() {
  const { stats, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="bg-secondary border border-border rounded-xl p-6 flex items-center gap-4 opacity-70">
            <div className="w-12 h-12 rounded-xl bg-border animate-pulse"></div>
            <div className="flex-1">
              <div className="w-16 h-8 bg-border rounded mb-2 animate-pulse"></div>
              <div className="w-24 h-4 bg-border rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((stat, index) => (
        <div key={index} className="bg-secondary border border-border rounded-xl p-6 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-border/20">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
          >
            <stat.icon />
          </div>
          <div className="flex-1">
            <div className="text-3xl font-bold text-text mb-1">{stat.value}</div>
            <div className="text-sm text-text/80 font-medium mb-1">{stat.label}</div>
            <div className={`text-xs font-semibold flex items-center gap-1 ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 