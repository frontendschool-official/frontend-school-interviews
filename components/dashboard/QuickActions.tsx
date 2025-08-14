import React from 'react';
import Link from 'next/link';
import { FiPlay, FiTarget, FiBookOpen, FiZap } from 'react-icons/fi';

export default function QuickActions() {
  const actions = [
    {
      icon: FiPlay,
      title: 'Start Practice',
      description: 'Begin solving problems',
      href: '/problems',
      color: '#10b981',
    },
    {
      icon: FiTarget,
      title: 'Mock Interview',
      description: 'Simulate real interviews',
      href: '/mock-interview-setup',
      color: '#3b82f6',
    },
    {
      icon: FiBookOpen,
      title: 'Study Theory',
      description: 'Learn concepts',
      href: '/practice',
      color: '#f59e0b',
    },
    {
      icon: FiZap,
      title: 'Quick Challenge',
      description: 'Random problem',
      href: '/problems',
      color: '#8b5cf6',
    },
  ];

  return (
    <div className='bg-secondary border border-border rounded-xl p-3 sm:p-4'>
      <h3 className='text-base sm:text-lg font-semibold text-neutralDark mb-3 flex items-center gap-2'>
        <FiZap className='text-primary text-sm' />
        Quick Actions
      </h3>
      <div className='grid grid-cols-2 gap-2'>
        {actions.map((action, index) => (
          <Link key={index} href={action.href} className='block'>
            <div className='bg-bodyBg border border-border rounded-lg p-2 sm:p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 text-center'>
              <div
                className='w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white mx-auto mb-2'
                style={{ backgroundColor: action.color }}
              >
                <action.icon className='text-sm sm:text-base' />
              </div>
              <h4 className='font-semibold text-neutralDark text-xs sm:text-sm mb-1'>{action.title}</h4>
              <p className='text-xs text-text/70 leading-tight'>{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
