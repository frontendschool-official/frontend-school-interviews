import React from 'react';
import Link from 'next/link';
import {
  ProblemData,
  UnifiedProblem,
  PredefinedProblem,
  ParsedProblemData,
  getProblemCardInfo,
} from '@/types/problem';

interface ProblemCardProps {
  problem: ProblemData | UnifiedProblem | PredefinedProblem | ParsedProblemData;
  status?: 'attempted' | 'solved' | 'unsolved';
}

// Helper functions for badge colors
const getStatusBadgeColor = (status?: string) => {
  switch (status) {
    case 'solved':
      return 'bg-green-500';
    case 'attempted':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

const getDifficultyBadgeColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'border-green-500 text-green-500';
    case 'medium':
      return 'border-yellow-500 text-yellow-500';
    case 'hard':
      return 'border-red-500 text-red-500';
    default:
      return 'border-gray-500 text-gray-500';
  }
};

const getCategoryBadgeColor = (type: string) => {
  switch (type) {
    case 'dsa':
      return 'border-blue-500 text-blue-500';
    case 'machine_coding':
      return 'border-purple-500 text-purple-500';
    case 'system_design':
      return 'border-cyan-500 text-cyan-500';
    case 'theory_and_debugging':
      return 'border-pink-500 text-pink-500';
    case 'interview':
      return 'border-green-500 text-green-500';
    case 'user_generated':
      return 'border-yellow-500 text-yellow-500';
    default:
      return 'border-gray-500 text-gray-500';
  }
};

const getTypeDisplayName = (type: string): string => {
  switch (type) {
    case 'dsa':
      return 'DSA';
    case 'machine_coding':
      return 'Machine Coding';
    case 'system_design':
      return 'System Design';
    case 'theory_and_debugging':
      return 'Theory';
    case 'interview':
      return 'Interview';
    case 'user_generated':
      return 'Custom';
    default:
      return 'Problem';
  }
};

export default function ProblemCard({ problem, status }: ProblemCardProps) {
  // Get problem card info using the centralized function
  const { difficulty, technologies, estimatedTime, type } =
    getProblemCardInfo(problem);

  // Handle unified schema (new format)
  const isUnifiedSchema = problem && 'type' in problem && 'problem' in problem;
  console.log(problem, 'problem');
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

  return (
    <div className='border border-border rounded-2xl p-6 bg-secondary flex flex-col gap-3 transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-border/30 hover:border-neutral/30 group'>
      <div className='absolute top-0 left-0 right-0 h-1 bg-neutralDark opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>

      <div className='flex justify-between items-start gap-2 mb-3'>
        <span
          className={`px-3 py-1 rounded-2xl text-xs font-semibold uppercase tracking-wider text-white shadow-sm ${getStatusBadgeColor(status)}`}
        >
          {status || 'New'}
        </span>
        <div className='flex gap-1.5 flex-wrap'>
          {type && (
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border ${getCategoryBadgeColor(type)} shadow-sm`}
            >
              {getTypeDisplayName(type)}
            </span>
          )}
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border ${getDifficultyBadgeColor(difficulty)} shadow-sm`}
          >
            {difficulty}
          </span>
        </div>
      </div>

      <div className='flex-1 flex flex-col gap-2'>
        <h4 className='m-0 text-text text-lg leading-tight font-semibold mb-1'>
          {problem?.title || 'Untitled Problem'}
        </h4>

        {/* Show description if available */}
        {description && (
          <p className='m-0 text-sm text-text opacity-70 leading-relaxed line-clamp-2'>
            {description}
          </p>
        )}

        {/* Show company and role info */}
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

        {/* Show estimated time */}
        {estimatedTime && (
          <p className='m-0 text-sm text-text opacity-70 leading-relaxed'>
            Estimated Time: {estimatedTime}
          </p>
        )}

        {/* Show technologies/tags */}
        {technologies && technologies.length > 0 && (
          <div className='flex flex-wrap gap-1.5 mt-1.5'>
            {technologies.slice(0, 3).map((tech: string, index: number) => (
              <span
                key={index}
                className='bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-300 transition-all duration-200 hover:bg-gray-200 hover:border-gray-400'
              >
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className='bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-300 transition-all duration-200 hover:bg-gray-200 hover:border-gray-400'>
                +{technologies.length - 3} more
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
