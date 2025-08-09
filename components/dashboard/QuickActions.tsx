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
    <div className="bg-secondary border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold text-text mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link key={index} href={action.href} className="block">
            <div className="bg-bodyBg border border-border rounded-lg p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-border/30">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3"
                style={{ backgroundColor: action.color }}
              >
                <action.icon className="text-xl" />
              </div>
              <h4 className="font-semibold text-text mb-1">{action.title}</h4>
              <p className="text-sm text-text/70">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 