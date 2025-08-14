import React from 'react';
import Link from 'next/link';
import { FiClock, FiTarget, FiCheckCircle, FiPlay } from 'react-icons/fi';
import {
  ProblemData,
  UnifiedProblem,
  PredefinedProblem,
  ParsedProblemData,
  getProblemCardInfo,
} from '@/types/problem';
import { StatusBadge, DifficultyBadge, CategoryBadge } from './Badge';

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
  problem:
    | ProblemData
    | UnifiedProblem
    | PredefinedProblem
    | ParsedProblemData
    | Problem;
  status?:
    | 'attempted'
    | 'solved'
    | 'unsolved'
    | 'completed'
    | 'in-progress'
    | 'not-started';
  showScore?: boolean;
  showStatus?: boolean;
  onStart?: (problemId: string) => void;
  variant?: 'default' | 'compact' | 'detailed' | 'list';
  className?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
    case 'solved':
      return <FiCheckCircle className='text-green-500' />;
    case 'in-progress':
    case 'attempted':
      return <FiPlay className='text-blue-500' />;
    case 'not-started':
    case 'unsolved':
      return <FiTarget className='text-gray-500' />;
    default:
      return <FiTarget className='text-gray-500' />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
    case 'solved':
      return 'Completed';
    case 'in-progress':
    case 'attempted':
      return 'In Progress';
    case 'not-started':
    case 'unsolved':
      return 'Not Started';
    default:
      return 'Not Started';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
};

export default function ProblemCard({
  problem,
  status,
  showScore = false,
  showStatus = true,
  onStart,
  variant = 'default',
  className = '',
}: ProblemCardProps) {
  // Get problem card info using the centralized function for legacy problems
  const isLegacyProblem =
    problem && 'type' in problem && !('status' in problem);
  const { difficulty, technologies, estimatedTime, type } = isLegacyProblem
    ? getProblemCardInfo(problem as any)
    : { difficulty: '', technologies: [], estimatedTime: '', type: '' };

  // Handle unified schema (new format)
  const isUnifiedSchema = problem && 'type' in problem && 'problem' in problem;

  // Get additional info for unified schema
  const getAdditionalInfo = () => {
    if (isUnifiedSchema) {
      const unifiedProblem = problem as UnifiedProblem;
      return {
        company: unifiedProblem.company || '',
        role: unifiedProblem.role || '',
        description: unifiedProblem.problem?.description || '',
      };
    }
    return {
      company: (problem as any).companies || '',
      role: (problem as any).designation || '',
      description: (problem as any).description || '',
    };
  };

  const { company, role, description } = getAdditionalInfo();

  // Determine the actual values to use
  const actualDifficulty = isLegacyProblem
    ? difficulty
    : (problem as Problem).difficulty;
  const actualType = isLegacyProblem ? type : (problem as Problem).type;
  const actualEstimatedTime = isLegacyProblem
    ? estimatedTime
    : (problem as Problem).estimatedTime;
  const actualTechnologies = isLegacyProblem
    ? technologies
    : (problem as Problem).technologies;
  const actualStatus = status || (problem as Problem).status;
  const actualScore = (problem as Problem).score;

  const getActionButtonClasses = (variant: 'primary' | 'secondary') => {
    const baseClasses =
      'px-4 py-3 rounded-lg font-semibold text-decoration-none transition-all duration-300 flex items-center gap-2 text-sm flex-1 justify-center';
    return variant === 'primary'
      ? `${baseClasses} bg-primary text-white hover:bg-primary/80 hover:-translate-y-0.5`
      : `${baseClasses} bg-secondary text-text border border-border hover:bg-border hover:-translate-y-0.5`;
  };

  if (variant === 'compact') {
    return (
      <div
        className={`border border-border rounded-2xl p-6 bg-secondary flex flex-col gap-3 transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-border/30 hover:border-neutral/30 group ${className}`}
      >
        <div className='absolute top-0 left-0 right-0 h-1 bg-neutralDark opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>

        <div className='flex justify-between items-start gap-2 mb-3'>
          <StatusBadge status={actualStatus || 'New'} size='sm' />
          <div className='flex gap-1.5 flex-wrap'>
            {actualType && <CategoryBadge category={actualType} size='sm' />}
            <DifficultyBadge difficulty={actualDifficulty || ''} size='sm' />
          </div>
        </div>

        <div className='flex-1 flex flex-col gap-2'>
          <h4 className='m-0 text-text text-lg leading-tight font-semibold mb-1'>
            {problem?.title || 'Untitled Problem'}
          </h4>

          {description && (
            <p className='m-0 text-sm text-text opacity-70 leading-relaxed line-clamp-2'>
              {description}
            </p>
          )}

          {(company || role) && (
            <div className='flex flex-col gap-1'>
              {company && (
                <p className='m-0 text-sm text-text opacity-70 leading-relaxed'>
                  Company: {company}
                </p>
              )}
              {role && (
                <p className='m-0 text-sm text-text opacity-70 leading-relaxed'>
                  Role: {role}
                </p>
              )}
            </div>
          )}

          {actualEstimatedTime && (
            <p className='m-0 text-sm text-text opacity-70 leading-relaxed'>
              Estimated Time: {actualEstimatedTime}
            </p>
          )}

          {actualTechnologies && actualTechnologies.length > 0 && (
            <div className='flex flex-wrap gap-1.5 mt-1.5'>
              {actualTechnologies
                .slice(0, 3)
                .map((tech: string, index: number) => (
                  <span
                    key={index}
                    className='bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-300 transition-all duration-200 hover:bg-gray-200 hover:border-gray-400'
                  >
                    {tech}
                  </span>
                ))}
              {actualTechnologies.length > 3 && (
                <span className='bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-300 transition-all duration-200 hover:bg-gray-200 hover:border-gray-400'>
                  +{actualTechnologies.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <Link
          href={`/problems/${problem.id}`}
          className='self-end px-5 py-2.5 bg-primary text-bodyBg no-underline rounded-lg text-sm font-semibold transition-all duration-300 shadow-md shadow-border mt-auto hover:-translate-y-1 hover:shadow-lg hover:shadow-border hover:bg-accent'
        >
          Start Solving
        </Link>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div
        className={`border border-border rounded-xl p-4 bg-secondary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary group ${className}`}
      >
        <div className='flex items-center justify-between gap-4'>
          {/* Left side - Problem info */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-3 mb-2'>
              <h4 className='text-lg font-semibold text-text m-0 truncate'>
                {problem?.title || 'Untitled Problem'}
              </h4>
              <div className='flex gap-1.5 flex-shrink-0'>
                {actualType && (
                  <CategoryBadge category={actualType} size='sm' />
                )}
                <DifficultyBadge
                  difficulty={actualDifficulty || ''}
                  size='sm'
                />
              </div>
            </div>

            {description && (
              <p className='text-sm text-text/70 leading-relaxed line-clamp-1 mb-2'>
                {description}
              </p>
            )}

            <div className='flex items-center gap-4 text-xs text-text/60'>
              {actualEstimatedTime && (
                <div className='flex items-center gap-1'>
                  <FiClock className='text-sm' />
                  <span>{actualEstimatedTime}</span>
                </div>
              )}
              {showStatus && actualStatus && (
                <div className='flex items-center gap-1'>
                  {getStatusIcon(actualStatus)}
                  <span>{getStatusText(actualStatus)}</span>
                </div>
              )}
              {(company || role) && (
                <div className='flex items-center gap-2'>
                  {company && <span>• {company}</span>}
                  {role && <span>• {role}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Technologies and action */}
          <div className='flex items-center gap-3 flex-shrink-0'>
            {actualTechnologies && actualTechnologies.length > 0 && (
              <div className='flex gap-1.5'>
                {actualTechnologies
                  .slice(0, 2)
                  .map((tech: string, index: number) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-300'
                    >
                      {tech}
                    </span>
                  ))}
                {actualTechnologies.length > 2 && (
                  <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-300'>
                    +{actualTechnologies.length - 2}
                  </span>
                )}
              </div>
            )}

            <Link
              href={`/problems/${problem.id}`}
              className='px-4 py-2 bg-primary text-bodyBg no-underline rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-primary/80 hover:-translate-y-0.5 flex items-center gap-2'
            >
              <FiPlay className='w-4 h-4' />
              Start
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default detailed variant
  return (
    <div
      className={`bg-secondary border border-border rounded-xl p-6 transition-all duration-300 h-full flex flex-col hover:-translate-y-1 hover:shadow-lg hover:border-primary ${className}`}
    >
      {/* Header */}
      <div className='flex justify-between items-start mb-4'>
        <h3 className='text-lg font-semibold text-text m-0 leading-tight flex-1'>
          {problem?.title || 'Untitled Problem'}
        </h3>
        <CategoryBadge category={actualType || ''} size='sm' />
      </div>

      {/* Description */}
      <p className='text-text/80 text-sm leading-relaxed mb-4 flex-1 line-clamp-3'>
        {description || (problem as Problem).description}
      </p>

      {/* Meta Info */}
      <div className='flex justify-between items-center mb-4 text-xs text-text/60'>
        <div className='flex items-center gap-1'>
          <FiClock className='text-sm' />
          <span>{actualEstimatedTime}</span>
        </div>
        <DifficultyBadge difficulty={actualDifficulty || ''} size='sm' />
      </div>

      {/* Status */}
      {showStatus && actualStatus && (
        <div className='flex items-center gap-2 mb-4'>
          {getStatusIcon(actualStatus)}
          <span className='text-sm text-text/80'>
            {getStatusText(actualStatus)}
          </span>
        </div>
      )}

      {/* Score */}
      {showScore && actualScore !== undefined && (
        <div className='text-center mb-4'>
          <div
            className={`text-2xl font-bold ${getScoreColor(actualScore)} mb-2`}
          >
            {actualScore}%
          </div>
          <div className='text-xs text-text/60'>Score</div>
        </div>
      )}

      {/* Technologies */}
      {actualTechnologies && actualTechnologies.length > 0 && (
        <div className='flex flex-wrap gap-2 mb-4'>
          {actualTechnologies.map((tech: string, index: number) => (
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
            onClick={() => onStart(problem.id || '')}
            className={getActionButtonClasses('primary')}
          >
            <FiPlay />
            Start Problem
          </button>
        ) : (
          <Link
            href={`/problems/${problem.id || ''}`}
            className={getActionButtonClasses('primary')}
          >
            <FiPlay />
            Start Problem
          </Link>
        )}

        <Link
          href={`/problems/${problem.id || ''}`}
          className={getActionButtonClasses('secondary')}
        >
          <FiTarget />
          View Details
        </Link>
      </div>
    </div>
  );
}
