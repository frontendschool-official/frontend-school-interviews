import React, { useState } from 'react';
import { FiCalendar, FiClock, FiTrendingUp, FiBarChart2, FiFilter } from 'react-icons/fi';
import ProblemTypeFilter, { PROBLEM_TYPES } from '@/components/problems/ProblemTypeFilter';
import ProblemCard, { Problem } from '@/components/problems/ProblemCard';

export default function InterviewHistory() {
  const [activeType, setActiveType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Mock data - replace with actual data from your backend
  const mockProblems: Problem[] = [
    {
      id: '1',
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      type: 'dsa',
      difficulty: 'easy',
      estimatedTime: '15 min',
      status: 'completed',
      score: 95
    },
    {
      id: '2',
      title: 'Build a Todo App',
      description: 'Create a full-stack todo application with React frontend and Node.js backend.',
      type: 'machine-coding',
      difficulty: 'medium',
      estimatedTime: '45 min',
      status: 'in-progress',
      score: 78
    },
    {
      id: '3',
      title: 'Design a URL Shortener',
      description: 'Design a URL shortening service like bit.ly with high availability and scalability.',
      type: 'system-design',
      difficulty: 'hard',
      estimatedTime: '60 min',
      status: 'completed',
      score: 88
    }
  ];

  const filteredProblems = mockProblems.filter(problem => {
    const matchesType = activeType === 'all' || problem.type === activeType;
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.id).getTime() - new Date(a.id).getTime();
      case 'difficulty':
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'score':
        return (b.score || 0) - (a.score || 0);
      default:
        return 0;
    }
  });

  const stats = {
    total: mockProblems.length,
    completed: mockProblems.filter(p => p.status === 'completed').length,
    inProgress: mockProblems.filter(p => p.status === 'in-progress').length,
    averageScore: Math.round(mockProblems.reduce((sum, p) => sum + (p.score || 0), 0) / mockProblems.length)
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text mb-2">Interview History</h1>
        <p className="text-lg text-text/80 mb-4">Track your progress and review past interviews</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-secondary border border-border rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="text-3xl font-bold text-primary mb-2">{stats.total}</div>
          <div className="text-sm text-text/80 font-medium">Total Problems</div>
        </div>
        
        <div className="bg-secondary border border-border rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="text-3xl font-bold text-green-500 mb-2">{stats.completed}</div>
          <div className="text-sm text-text/80 font-medium">Completed</div>
        </div>
        
        <div className="bg-secondary border border-border rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="text-3xl font-bold text-blue-500 mb-2">{stats.inProgress}</div>
          <div className="text-sm text-text/80 font-medium">In Progress</div>
        </div>
        
        <div className="bg-secondary border border-border rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.averageScore}%</div>
          <div className="text-sm text-text/80 font-medium">Avg Score</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-secondary border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4 font-semibold text-text">
          <FiFilter />
          Filters & Search
        </div>
        
        <div className="flex gap-4 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-bodyBg text-text text-sm focus:outline-none focus:border-primary"
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-bodyBg text-text text-sm focus:outline-none focus:border-primary"
          >
            <option value="date">Sort by Date</option>
            <option value="difficulty">Sort by Difficulty</option>
            <option value="score">Sort by Score</option>
          </select>
        </div>
      </div>

      {/* Problem Type Filter */}
      <ProblemTypeFilter
        types={PROBLEM_TYPES.map(type => ({
          ...type,
          count: mockProblems.filter(p => type.id === 'all' || p.type === type.id).length
        }))}
        activeType={activeType}
        onTypeChange={setActiveType}
      />

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProblems.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            showScore={true}
            showStatus={true}
          />
        ))}
      </div>

      {sortedProblems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-text mb-2">No problems found</h3>
          <p className="text-text/60">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
} 