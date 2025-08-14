import React from 'react';
import Link from 'next/link';
import {
  FiZap,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiBookOpen,
  FiAward,
  FiPlay,
} from 'react-icons/fi';
import { usePracticeData } from '@/hooks/usePracticeData';
import { Skeleton } from '@/components/ui';



export default function PracticeHub() {
  const { problemStats, userStats, loading, error } = usePracticeData();

  // Generate dynamic stats based on API data
  const stats = [
    { 
      label: 'Total Problems', 
      value: problemStats ? `${problemStats.total}+` : '...', 
      icon: FiAward 
    },
    { 
      label: 'Success Rate', 
      value: userStats ? `${Math.round(userStats.completionRate * 100)}%` : '...', 
      icon: FiTrendingUp 
    },
    { 
      label: 'Current Streak', 
      value: userStats ? `${userStats.currentStreak} days` : '...', 
      icon: FiClock 
    },
    { 
      label: 'Completed', 
      value: userStats ? `${userStats.completedProblems}` : '...', 
      icon: FiPlay 
    },
  ];

  // Generate dynamic practice categories with real data
  const dynamicPracticeCategories = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      description:
        'Master fundamental algorithms and data structures with hands-on coding challenges.',
      icon: FiTarget,
      color: '#3B82F6',
      features: [
        'Array & String Manipulation',
        'Linked Lists & Trees',
        'Dynamic Programming',
        'Graph Algorithms',
        'Time & Space Complexity',
      ],
      stats: { 
        problems: problemStats?.dsa || 0, 
        difficulty: 'Medium-Hard',
        userProgress: userStats?.performanceByType.dsa
      },
      link: '/problems?type=dsa',
    },
    {
      id: 'machine-coding',
      title: 'Machine Coding',
      description:
        'Build real-world applications with modern JavaScript frameworks and libraries.',
      icon: FiZap,
      color: '#10B981',
      features: [
        'React Component Building',
        'State Management',
        'API Integration',
        'Performance Optimization',
        'Testing & Debugging',
      ],
      stats: { 
        problems: problemStats?.machineCoding || 0, 
        difficulty: 'Medium',
        userProgress: userStats?.performanceByType.machineCoding
      },
      link: '/problems?type=machine-coding',
    },
    {
      id: 'system-design',
      title: 'System Design',
      description:
        'Design scalable systems and understand distributed architecture principles.',
      icon: FiTrendingUp,
      color: '#8B5CF6',
      features: [
        'Scalability Patterns',
        'Database Design',
        'Microservices Architecture',
        'Load Balancing',
        'Caching Strategies',
      ],
      stats: { 
        problems: problemStats?.systemDesign || 0, 
        difficulty: 'Hard',
        userProgress: userStats?.performanceByType.systemDesign
      },
      link: '/problems?type=system-design',
    },
    {
      id: 'theory',
      title: 'Frontend Theory',
      description:
        'Deep dive into JavaScript, React, and web development concepts.',
      icon: FiBookOpen,
      color: '#F59E0B',
      features: [
        'JavaScript Fundamentals',
        'React Hooks & Lifecycle',
        'Web APIs & Browser',
        'Performance & Security',
        'Modern ES6+ Features',
      ],
      stats: { 
        problems: problemStats?.theory || 0, 
        difficulty: 'Easy-Medium',
        userProgress: userStats?.performanceByType.theory
      },
      link: '/problems?type=theory',
    },
  ];

  // Loading skeleton components
  const StatsSkeleton = () => (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6'>
      {[1, 2, 3, 4].map(index => (
        <div
          key={index}
          className='bg-secondary border border-border rounded-xl p-4 sm:p-6 text-center'
        >
          <div className='w-6 h-6 sm:w-8 sm:h-8 bg-border rounded animate-pulse mx-auto mb-2 sm:mb-3'></div>
          <div className='w-16 h-6 bg-border rounded animate-pulse mx-auto mb-1'></div>
          <div className='w-20 h-4 bg-border rounded animate-pulse mx-auto'></div>
        </div>
      ))}
    </div>
  );

  const CategorySkeleton = () => (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
      {[1, 2, 3, 4].map(index => (
        <div
          key={index}
          className='bg-secondary border border-border rounded-2xl p-6 sm:p-8'
        >
          <div className='flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-border rounded-xl animate-pulse'></div>
            <div className='w-32 h-6 bg-border rounded animate-pulse'></div>
          </div>
          <div className='w-full h-4 bg-border rounded animate-pulse mb-4 sm:mb-6'></div>
          <div className='space-y-2 mb-4 sm:mb-6'>
            {[1, 2, 3, 4, 5].map(item => (
              <div key={item} className='w-full h-3 bg-border rounded animate-pulse'></div>
            ))}
          </div>
          <div className='flex items-center justify-between mb-4 sm:mb-6'>
            <div className='w-20 h-4 bg-border rounded animate-pulse'></div>
            <div className='w-24 h-4 bg-border rounded animate-pulse'></div>
          </div>
          <div className='w-32 h-10 bg-border rounded-xl animate-pulse'></div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <>
        {/* Header Section Skeleton */}
        <div className='mb-6 sm:mb-8'>
          <div className='flex justify-between items-start mb-4 sm:mb-6 p-4 sm:p-6 bg-secondary rounded-2xl border border-border shadow-lg md:flex-row flex-col gap-4'>
            <div className='flex-1'>
              <div className='w-48 h-8 bg-border rounded-lg animate-pulse mb-2'></div>
              <div className='w-96 h-4 bg-border rounded-lg animate-pulse'></div>
            </div>
            <div className='w-16 h-16 bg-border rounded-lg animate-pulse'></div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className='mb-6 sm:mb-8'>
          <StatsSkeleton />
        </div>

        {/* Categories Skeleton */}
        <div className='mb-6 sm:mb-8'>
          <CategorySkeleton />
        </div>

        {/* Quick Actions Skeleton */}
        <div className='mb-6 sm:mb-8'>
          <div className='bg-secondary border border-border rounded-2xl p-6 sm:p-8'>
            <div className='w-48 h-6 bg-border rounded animate-pulse mx-auto mb-4'></div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4'>
              {[1, 2, 3].map(index => (
                <div key={index} className='bg-secondary border border-border rounded-xl p-3 sm:p-4 text-center'>
                  <div className='w-6 h-6 sm:w-8 sm:h-8 bg-border rounded animate-pulse mx-auto mb-2'></div>
                  <div className='w-24 h-4 bg-border rounded animate-pulse mx-auto mb-1'></div>
                  <div className='w-20 h-3 bg-border rounded animate-pulse mx-auto'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='text-4xl mb-4 opacity-60'>⚠️</div>
        <h3 className='text-xl font-semibold text-text mb-2'>
          Failed to load practice data
        </h3>
        <p className='text-text opacity-70 text-sm mb-4'>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors'
        >
          Try Again
        </button>
      </div>
    );
  }
  return (
    <>
      {/* Header Section */}
      <div className='mb-6 sm:mb-8'>
        <div className='flex justify-between items-start mb-4 sm:mb-6 p-4 sm:p-6 bg-secondary rounded-2xl border border-border shadow-lg md:flex-row flex-col gap-4 text-center md:text-left'>
          <div className='flex-1'>
            <h1 className='text-2xl sm:text-3xl font-bold text-neutralDark mb-2'>
              Practice Hub
            </h1>
            <p className='text-text opacity-80 text-xs sm:text-sm'>
              Choose your learning path and master the skills needed for frontend interviews. From DSA to system design, we've got you covered with comprehensive practice problems.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <div className='text-center'>
              <div className='text-2xl sm:text-3xl mb-1'>📚</div>
              <div className='text-xs text-text/70'>Learning</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='mb-6 sm:mb-8'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6'>
          {stats.map((stat, index) => (
            <div
              key={index}
              className='bg-secondary border border-border rounded-xl p-4 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20'
            >
              <stat.icon className='w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3' />
              <div className='text-lg sm:text-xl md:text-2xl font-bold text-neutralDark mb-1'>
                {stat.value}
              </div>
              <div className='text-xs sm:text-sm text-text/70'>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Categories */}
      <div className='mb-6 sm:mb-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
        {dynamicPracticeCategories.map(category => (
          <div
            key={category.id}
            className='bg-secondary border border-border rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary relative overflow-hidden group'
          >
            {/* Top accent bar */}
            <div
              className='absolute top-0 left-0 right-0 h-1 bg-primary transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100'
              style={{ backgroundColor: category.color }}
            ></div>

            {/* Header */}
            <div className='flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4'>
              <div
                className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl'
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                }}
              >
                <category.icon />
              </div>
              <h3 className='text-lg sm:text-xl font-semibold text-neutralDark m-0'>
                {category.title}
              </h3>
            </div>

            {/* Description */}
            <p className='text-sm sm:text-base text-text/70 leading-relaxed mb-4 sm:mb-6'>
              {category.description}
            </p>

            {/* Features */}
            <ul className='space-y-1 sm:space-y-2 mb-4 sm:mb-6'>
              {category.features.map((feature, index) => (
                <li
                  key={index}
                  className='flex items-center gap-2 text-xs sm:text-sm text-text/70'
                >
                  <div className='w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary'></div>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className='flex items-center justify-between mb-4 sm:mb-6'>
              <div className='text-xs sm:text-sm text-text/70'>
                <span className='font-semibold'>{category.stats.problems}</span>{' '}
                problems
              </div>
              <div className='text-xs sm:text-sm text-text/70'>
                Difficulty:{' '}
                <span className='font-semibold'>
                  {category.stats.difficulty}
                </span>
              </div>
            </div>

            {/* User Progress (if available) */}
            {category.stats.userProgress && (
              <div className='mb-4 sm:mb-6 p-3 bg-primary/5 rounded-lg border border-primary/10'>
                <div className='text-xs sm:text-sm text-text/70 mb-2'>
                  Your Progress:
                </div>
                <div className='flex items-center justify-between text-xs sm:text-sm'>
                  <span>
                    Attempted: <span className='font-semibold text-primary'>{category.stats.userProgress.attempted}</span>
                  </span>
                  <span>
                    Completed: <span className='font-semibold text-green-600'>{category.stats.userProgress.completed}</span>
                  </span>
                  <span>
                    Avg Score: <span className='font-semibold text-blue-600'>{Math.round(category.stats.userProgress.averageScore || 0)}%</span>
                  </span>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <Link
              href={category.link}
              className='inline-flex items-center gap-2 bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-accent hover:-translate-y-0.5 group-hover:shadow-lg'
            >
              Start Practice
              <FiPlay className='w-3 h-3 sm:w-4 sm:h-4' />
            </Link>
          </div>
        ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className='mb-6 sm:mb-8'>
        <div className='bg-secondary border border-border rounded-2xl p-6 sm:p-8'>
          <h2 className='text-xl sm:text-2xl font-bold text-neutralDark mb-4 text-center'>
            Quick Actions
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4'>
          <Link
            href='/mock-interviews'
            className='bg-secondary border border-border rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary group'
          >
            <FiPlay className='w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform duration-300' />
            <div className='font-semibold text-sm sm:text-base text-neutralDark mb-1'>
              Mock Interviews
            </div>
            <div className='text-xs sm:text-sm text-text/70'>
              Practice with AI
            </div>
          </Link>

          <Link
            href='/dashboard'
            className='bg-secondary border border-border rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary group'
          >
            <FiTrendingUp className='w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform duration-300' />
            <div className='font-semibold text-sm sm:text-base text-neutralDark mb-1'>
              Progress Dashboard
            </div>
            <div className='text-xs sm:text-sm text-text/70'>
              Track your growth
            </div>
          </Link>

          <Link
            href='/solved'
            className='bg-secondary border border-border rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary group'
          >
            <FiAward className='w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform duration-300' />
            <div className='font-semibold text-sm sm:text-base text-neutralDark mb-1'>
              Solved Problems
            </div>
            <div className='text-xs sm:text-sm text-text/70'>
              Review your work
            </div>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
