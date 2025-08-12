import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Head from 'next/head';
import {
  FiPlus,
  FiPlay,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiUsers,
  FiBriefcase,
  FiCalendar,
  FiTarget,
} from 'react-icons/fi';
import Layout from '@/components/Layout';
import { InterviewSimulationData, Company } from '@/types/problem';
import { getAllCompanies } from '@/lib/queryBuilder';
import CreateInterview from '@/container/interview-simulation/create-interview';

export default function InterviewSimulation() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeSimulations, setActiveSimulations] = useState<
    InterviewSimulationData[]
  >([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // SEO Data
  const seoData = {
    title: 'Interview Simulation - Practice Real Tech Interviews',
    description:
      'Master tech interviews with our realistic simulation platform. Practice with company-specific problems for Google, Meta, Amazon, Microsoft, Apple, and Netflix. Get AI-powered feedback and improve your skills.',
    keywords:
      'tech interview, coding interview, mock interview, software engineer interview, frontend interview, system design interview, DSA interview, Google interview, Meta interview, Amazon interview',
    ogImage: '/og-interview-simulation.jpg',
    canonical: 'https://frontendschoolinterviews.com/interview-simulation',
  };

  useEffect(() => {
    if (user) {
      fetchActiveSimulations();
      fetchCompanies();
    }
  }, [user]);

  const fetchActiveSimulations = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `/api/interview-simulation/active?userId=${user.uid}`
      );
      if (response.ok) {
        const data = await response.json();
        setActiveSimulations(data);
      } else {
        console.error('Failed to fetch active simulations');
      }
    } catch (error) {
      console.error('Error fetching active simulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const companiesData = await getAllCompanies();
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoundTypeIcon = (type: string) => {
    switch (type) {
      case 'dsa':
        return '🧮';
      case 'machine_coding':
        return '💻';
      case 'system_design':
        return '🏗️';
      case 'theory':
        return '📚';
      default:
        return '❓';
    }
  };

  return (
    <Layout isLoading={loading}>
      <Head>
        <title>{seoData.title}</title>
        <meta name='description' content={seoData.description} />
        <meta name='keywords' content={seoData.keywords} />
        <meta property='og:title' content={seoData.title} />
        <meta property='og:description' content={seoData.description} />
        <meta property='og:image' content={seoData.ogImage} />
        <meta property='og:url' content={seoData.canonical} />
        <link rel='canonical' href={seoData.canonical} />
      </Head>

      {/* Header */}
      <div className='mb-6 sm:mb-8'>
        <h1 className='text-2xl sm:text-3xl font-bold text-text mb-4'>
          Interview Simulation Hub
        </h1>
        <p className='text-text/70 text-base sm:text-lg'>
          Practice real tech interviews with company-specific problems and
          AI-powered feedback
        </p>
      </div>

      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8'>
        <div className='bg-secondary border border-border rounded-xl p-4 sm:p-6'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
              <FiTarget className='w-5 h-5 sm:w-6 sm:h-6 text-blue-600' />
            </div>
            <div>
              <p className='text-xs sm:text-sm text-text/60'>
                Active Simulations
              </p>
              <p className='text-xl sm:text-2xl font-bold text-text'>
                {activeSimulations?.filter(s => s?.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className='bg-secondary border border-border rounded-xl p-4 sm:p-6'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center'>
              <FiCheckCircle className='w-5 h-5 sm:w-6 sm:h-6 text-green-600' />
            </div>
            <div>
              <p className='text-xs sm:text-sm text-text/60'>Completed</p>
              <p className='text-xl sm:text-2xl font-bold text-text'>
                {
                  activeSimulations?.filter(s => s?.status === 'completed')
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className='bg-secondary border border-border rounded-xl p-4 sm:p-6'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
              <FiUsers className='w-5 h-5 sm:w-6 sm:h-6 text-purple-600' />
            </div>
            <div>
              <p className='text-xs sm:text-sm text-text/60'>Companies</p>
              <p className='text-xl sm:text-2xl font-bold text-text'>
                {companies?.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8'>
        <button
          onClick={() => setShowCreateModal(true)}
          className='flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors text-sm sm:text-base'
        >
          <FiPlus className='w-4 h-4 sm:w-5 sm:h-5' />
          Start New Interview
        </button>
        <button
          onClick={() => router.push('/problems')}
          className='flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-border text-text rounded-lg hover:bg-secondary transition-colors text-sm sm:text-base'
        >
          <FiPlay className='w-4 h-4 sm:w-5 sm:h-5' />
          Practice Problems
        </button>
      </div>

      {/* Active Simulations */}
      <div className='mb-6 sm:mb-8'>
        <h2 className='text-xl sm:text-2xl font-bold text-text mb-4 sm:mb-6'>
          Your Interview Simulations
        </h2>

        {activeSimulations.length === 0 ? (
          <div className='bg-secondary border border-border rounded-xl p-6 sm:p-8 text-center'>
            <div className='w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <FiTarget className='w-6 h-6 sm:w-8 sm:h-8 text-primary' />
            </div>
            <h3 className='text-lg sm:text-xl font-semibold text-text mb-2'>
              No Active Simulations
            </h3>
            <p className='text-sm sm:text-base text-text/70 mb-4 sm:mb-6'>
              Start your first interview simulation to practice with real
              company-specific problems
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className='flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors mx-auto text-sm sm:text-base'
            >
              <FiPlus className='w-4 h-4 sm:w-5 sm:h-5' />
              Start Your First Interview
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
            {activeSimulations?.map(simulation => (
              <div
                key={simulation.id}
                className='bg-secondary border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow'
              >
                <div className='flex items-start justify-between mb-3 sm:mb-4'>
                  <div>
                    <h3 className='text-base sm:text-lg font-semibold text-text mb-1'>
                      {simulation.companyName}
                    </h3>
                    <p className='text-text/70 text-xs sm:text-sm'>
                      {simulation.roleLevel}
                    </p>
                  </div>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      simulation.status
                    )}`}
                  >
                    {simulation.status}
                  </span>
                </div>

                <div className='space-y-2 sm:space-y-3 mb-3 sm:mb-4'>
                  <div className='flex items-center gap-2 text-xs sm:text-sm text-text/60'>
                    <FiCalendar className='w-3 h-3 sm:w-4 sm:h-4' />
                    <span>Created: {formatDate(simulation.createdAt)}</span>
                  </div>
                  <div className='flex items-center gap-2 text-xs sm:text-sm text-text/60'>
                    <FiClock className='w-3 h-3 sm:w-4 sm:h-4' />
                    <span>
                      Round {simulation.currentRound + 1} of{' '}
                      {simulation.rounds.length}
                    </span>
                  </div>
                  {simulation.simulationConfig && (
                    <div className='flex items-center gap-2 text-xs sm:text-sm text-text/60'>
                      <FiBriefcase className='w-3 h-3 sm:w-4 sm:h-4' />
                      <span>
                        {simulation.simulationConfig.estimatedDuration}
                      </span>
                    </div>
                  )}
                </div>

                <div className='mb-3 sm:mb-4'>
                  <p className='text-xs sm:text-sm text-text/70 mb-2'>
                    Interview Rounds:
                  </p>
                  <div className='flex flex-wrap gap-1 sm:gap-2'>
                    {simulation?.rounds?.slice(0, 3)?.map((round, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/10 border border-primary/20 rounded-full text-xs'
                      >
                        <span>{getRoundTypeIcon('unknown')}</span>
                        <span className='text-text'>{round.name}</span>
                      </div>
                    ))}
                    {simulation?.rounds?.length > 3 && (
                      <span className='text-xs text-text/50'>
                        +{simulation?.rounds?.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-2'>
                  {simulation?.status === 'active' && (
                    <button
                      onClick={() =>
                        router.push(
                          `/interview-simulation/${simulation?.id}/${
                            simulation?.currentRound + 1
                          }`
                        )
                      }
                      className='flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors text-xs sm:text-sm'
                    >
                      <FiPlay className='w-3 h-3 sm:w-4 sm:h-4' />
                      Continue
                    </button>
                  )}
                  <button
                    onClick={() =>
                      router.push(`/interview-simulation/${simulation?.id}`)
                    }
                    className='flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-border text-text rounded-lg hover:bg-secondary transition-colors text-xs sm:text-sm'
                  >
                    View Details
                    <FiArrowRight className='w-3 h-3 sm:w-4 sm:h-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CreateInterview
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
      />
    </Layout>
  );
}
