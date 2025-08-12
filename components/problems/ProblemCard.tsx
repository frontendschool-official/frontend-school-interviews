import React from 'react';
import Link from 'next/link';
import { FiClock, FiTarget, FiCheckCircle, FiPlay } from 'react-icons/fi';

export interface Problem {
  id: string;
  title: string;
  description: string;
  type: 'dsa' | 'machine-coding' | 'system-design' | 'theory';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  status: 'completed' | 'in-progress' | 'not-started';
  score?: number;
  technologies?: string[];
}

interface ProblemCardProps {
  problem: Problem;
  showScore?: boolean;
  showStatus?: boolean;
  onStart?: (problemId: string) => void;
}

const TYPE_COLORS = {
  dsa: '#10b981',
  'machine-coding': '#3b82f6',
  'system-design': '#f59e0b',
  theory: '#8b5cf6',
};

const TYPE_LABELS = {
  dsa: 'DSA',
  'machine-coding': 'Machine Coding',
  'system-design': 'System Design',
  theory: 'Theory',
};

export default function ProblemCard({
  problem,
  showScore = false,
  showStatus = true,
  onStart,
}: ProblemCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className='text-green-500' />;
      case 'in-progress':
        return <FiPlay className='text-blue-500' />;
      case 'not-started':
        return <FiTarget className='text-gray-500' />;
      default:
        return <FiTarget className='text-gray-500' />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-started':
        return 'Not Started';
      default:
        return 'Not Started';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getActionButtonClasses = (variant: 'primary' | 'secondary') => {
    const baseClasses =
      'px-4 py-3 rounded-lg font-semibold text-decoration-none transition-all duration-300 flex items-center gap-2 text-sm flex-1 justify-center';
    return variant === 'primary'
      ? `${baseClasses} bg-primary text-white hover:bg-primary/80 hover:-translate-y-0.5`
      : `${baseClasses} bg-secondary text-text border border-border hover:bg-border hover:-translate-y-0.5`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className='bg-secondary border border-border rounded-xl p-6 transition-all duration-300 h-full flex flex-col hover:-translate-y-1 hover:shadow-lg hover:border-primary'>
      {/* Header */}
      <div className='flex justify-between items-start mb-4'>
        <h3 className='text-lg font-semibold text-text m-0 leading-tight flex-1'>
          {problem.title}
        </h3>
        <span
          className='px-3 py-1 rounded-full text-xs font-semibold uppercase ml-4 whitespace-nowrap'
          style={{
            backgroundColor: `${TYPE_COLORS[problem.type]}20`,
            color: TYPE_COLORS[problem.type],
          }}
        >
          {TYPE_LABELS[problem.type]}
        </span>
      </div>

      {/* Description */}
      <p className='text-text/80 text-sm leading-relaxed mb-4 flex-1 line-clamp-3'>
        {problem.description}
      </p>

      {/* Meta Info */}
      <div className='flex justify-between items-center mb-4 text-xs text-text/60'>
        <div className='flex items-center gap-1'>
          <FiClock className='text-sm' />
          <span>{problem.estimatedTime}</span>
        </div>
        <span
          className={`px-3 py-1 rounded-lg font-semibold text-xs ${getDifficultyColor(problem.difficulty)}`}
        >
          {problem.difficulty}
        </span>
      </div>

      {/* Status */}
      {showStatus && (
        <div className='flex items-center gap-2 mb-4'>
          {getStatusIcon(problem.status)}
          <span className='text-sm text-text/80'>
            {getStatusText(problem.status)}
          </span>
        </div>
      )}

      {/* Score */}
      {showScore && problem.score !== undefined && (
        <div className='text-center mb-4'>
          <div
            className={`text-2xl font-bold ${getScoreColor(problem.score)} mb-2`}
          >
            {problem.score}%
          </div>
          <div className='text-xs text-text/60'>Score</div>
        </div>
      )}

      {/* Technologies */}
      {problem.technologies && problem.technologies.length > 0 && (
        <div className='flex flex-wrap gap-2 mb-4'>
          {problem.technologies.map((tech, index) => (
            <span
              key={index}
              className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md'
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className='flex gap-3 mt-auto'>
        {onStart ? (
          <button
            onClick={() => onStart(problem.id)}
            className={getActionButtonClasses('primary')}
          >
            <FiPlay />
            Start Problem
          </button>
        ) : (
          <Link
            href={`/problems/${problem.id}`}
            className={getActionButtonClasses('primary')}
          >
            <FiPlay />
            Start Problem
          </Link>
        )}

        <Link
          href={`/problems/${problem.id}`}
          className={getActionButtonClasses('secondary')}
        >
          <FiTarget />
          View Details
        </Link>
      </div>
    </div>
  );
}
