import React, { useState } from 'react';
import Link from 'next/link';
import { FiTarget, FiClock, FiAward, FiPlay, FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import { useMockInterviewData } from '@/hooks/useMockInterviewData';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

export default function MockInterviewHub() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const { stats, recentActivity, loading, error, refresh } = useMockInterviewData();

  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Twitter', 'Uber'
  ];

  const levels = [
    'Junior (0-2 years)',
    'Mid-level (3-5 years)',
    'Senior (6-8 years)',
    'Lead (9+ years)'
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiAward className="text-green-500" />;
      case 'in-progress':
        return <FiBarChart2 className="text-blue-500" />;
      case 'failed':
        return <FiTarget className="text-red-500" />;
      default:
        return <FiClock className="text-yellow-500" />;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20';
      case 'in-progress':
        return 'bg-blue-500/20';
      case 'failed':
        return 'bg-red-500/20';
      default:
        return 'bg-yellow-500/20';
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refresh} />;
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text mb-4">Mock Interview Hub</h1>
        <p className="text-lg text-text/80 max-w-2xl mx-auto">
          Practice with realistic interview scenarios tailored to top tech companies. 
          Get instant feedback and improve your skills.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-text">Your Statistics</h2>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:text-accent transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-secondary border border-border rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">{stats.totalInterviews}</div>
          <div className="text-sm text-text/80 font-medium">Total Interviews</div>
        </div>
        
        <div className="bg-secondary border border-border rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-500 mb-2">{stats.averageScore}%</div>
          <div className="text-sm text-text/80 font-medium">Average Score</div>
        </div>
        
        <div className="bg-secondary border border-border rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-500 mb-2">{stats.completedRounds}</div>
          <div className="text-sm text-text/80 font-medium">Completed Rounds</div>
        </div>
        
        <div className="bg-secondary border border-border rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.totalTime}</div>
          <div className="text-sm text-text/80 font-medium">Total Time</div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="bg-secondary border border-border rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-semibold text-text mb-6">Quick Start Interview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-bodyBg text-text focus:outline-none focus:border-primary"
            >
              <option value="">Select a company</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text mb-2">Experience Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-bodyBg text-text focus:outline-none focus:border-primary"
            >
              <option value="">Select your level</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
        
        <Link
          href={`/mock-interview?company=${selectedCompany}&level=${selectedLevel}`}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            selectedCompany && selectedLevel
              ? 'bg-primary text-white hover:bg-accent hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FiPlay />
          Start Mock Interview
        </Link>
      </div>

      {/* Interview Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link href="/mock-interviews/dsa" className="group">
          <div className="bg-secondary border border-border rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary">
            <div className="text-3xl mb-4 text-primary">🧮</div>
            <h3 className="text-lg font-semibold text-text mb-2">DSA Problems</h3>
            <p className="text-sm text-text/60">Data Structures & Algorithms</p>
          </div>
        </Link>
        
        <Link href="/mock-interviews/machine-coding" className="group">
          <div className="bg-secondary border border-border rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary">
            <div className="text-3xl mb-4 text-blue-500">💻</div>
            <h3 className="text-lg font-semibold text-text mb-2">Machine Coding</h3>
            <p className="text-sm text-text/60">Build functional applications</p>
          </div>
        </Link>
        
        <Link href="/mock-interviews/system-design" className="group">
          <div className="bg-secondary border border-border rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary">
            <div className="text-3xl mb-4 text-yellow-500">🏗️</div>
            <h3 className="text-lg font-semibold text-text mb-2">System Design</h3>
            <p className="text-sm text-text/60">Architecture & scalability</p>
          </div>
        </Link>
        
        <Link href="/mock-interviews/theory" className="group">
          <div className="bg-secondary border border-border rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary">
            <div className="text-3xl mb-4 text-purple-500">📚</div>
            <h3 className="text-lg font-semibold text-text mb-2">Theory</h3>
            <p className="text-sm text-text/60">Frontend concepts & concepts</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-secondary border border-border rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-text mb-6">Recent Activity</h2>
        
        {recentActivity.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-bodyBg rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${getStatusBgColor(activity.status)} rounded-full flex items-center justify-center`}>
                    {getStatusIcon(activity.status)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-text">{activity.title}</h4>
                    <p className="text-sm text-text/60">
                      {activity.status === 'completed' && activity.score 
                        ? `Completed • Score: ${activity.score}%`
                        : activity.status === 'in-progress'
                        ? `In Progress • ${activity.timeSpent || 'Time tracking...'}`
                        : activity.status === 'failed'
                        ? 'Failed • Try again'
                        : 'Unknown status'
                      }
                    </p>
                  </div>
                </div>
                <div className="text-sm text-text/60">
                  {activity.completedAt ? formatTimeAgo(activity.completedAt) : 'Recently'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 