import React, { useState } from 'react';
import Link from 'next/link';
import { FiTarget, FiClock, FiAward, FiPlay, FiBarChart2 } from 'react-icons/fi';

export default function MockInterviewHub() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Twitter', 'Uber'
  ];

  const levels = [
    'Junior (0-2 years)',
    'Mid-level (3-5 years)',
    'Senior (6-8 years)',
    'Lead (9+ years)'
  ];

  const mockStats = {
    totalInterviews: 24,
    averageScore: 78,
    completedRounds: 18,
    totalTime: '12h 30m'
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-secondary border border-border rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">{mockStats.totalInterviews}</div>
          <div className="text-sm text-text/80 font-medium">Total Interviews</div>
        </div>
        
        <div className="bg-secondary border border-border rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-500 mb-2">{mockStats.averageScore}%</div>
          <div className="text-sm text-text/80 font-medium">Average Score</div>
        </div>
        
        <div className="bg-secondary border border-border rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-500 mb-2">{mockStats.completedRounds}</div>
          <div className="text-sm text-text/80 font-medium">Completed Rounds</div>
        </div>
        
        <div className="bg-secondary border border-border rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-yellow-500 mb-2">{mockStats.totalTime}</div>
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
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-bodyBg rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <FiAward className="text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-text">Google Frontend Interview</h4>
                <p className="text-sm text-text/60">Completed • Score: 85%</p>
              </div>
            </div>
            <div className="text-sm text-text/60">2 hours ago</div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-bodyBg rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <FiBarChart2 className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-text">Amazon System Design</h4>
                <p className="text-sm text-text/60">In Progress • 25 min remaining</p>
              </div>
            </div>
            <div className="text-sm text-text/60">1 day ago</div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-bodyBg rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <FiTarget className="text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold text-text">Microsoft DSA Practice</h4>
                <p className="text-sm text-text/60">Completed • Score: 92%</p>
              </div>
            </div>
            <div className="text-sm text-text/60">3 days ago</div>
          </div>
        </div>
      </div>
    </>
  );
} 