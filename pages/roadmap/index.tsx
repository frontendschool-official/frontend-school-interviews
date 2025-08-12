import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useRoadmapGeneration } from '@/hooks/useRoadmapGeneration';
import { Company } from '@/types/problem';
import { RoadmapDuration, RoadmapDocument } from '@/types/roadmap';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import { CardLoadingState } from '@/components/ui/LoadingState';

const RoadmapPage: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { loading, error, generateRoadmap, resetState } =
    useRoadmapGeneration();

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [designation, setDesignation] = useState('');
  const [duration, setDuration] = useState<RoadmapDuration>(15);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Roadmaps list state
  const [userRoadmaps, setUserRoadmaps] = useState<RoadmapDocument[]>([]);
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabCounts = {
    all: userRoadmaps.length,
    active: userRoadmaps.filter(r => r.status === 'active').length,
    completed: userRoadmaps.filter(r => r.status === 'completed').length,
    archived: userRoadmaps.filter(r => r.status === 'archived').length,
  };

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies/get-all');
        if (response.ok) {
          const data = await response.json();
          setCompanies(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch user roadmaps
  useEffect(() => {
    const fetchUserRoadmaps = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/roadmap/get-user-roadmaps');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUserRoadmaps(data.roadmaps || []);
          }
        }
      } catch (error) {
        console.error('Error fetching user roadmaps:', error);
      } finally {
        setLoadingRoadmaps(false);
      }
    };

    fetchUserRoadmaps();
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleCompanyToggle = (companyId: string) => {
    setSelectedCompanies(prev =>
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleGenerateRoadmap = async () => {
    if (!selectedCompanies.length || !designation.trim()) {
      return;
    }

    const selectedCompanyNames = companies
      .filter(company => selectedCompanies.includes(company.id))
      .map(company => company.name);

    const roadmapResponse = await generateRoadmap({
      companies: selectedCompanyNames,
      designation: designation.trim(),
      duration,
    });

    if (roadmapResponse && 'id' in roadmapResponse) {
      // Close modal and refresh roadmaps list
      setShowCreateModal(false);
      resetForm();

      // Refresh the roadmaps list
      const response = await fetch('/api/roadmap/get-user-roadmaps');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserRoadmaps(data.roadmaps || []);
        }
      }

      // Navigate to the new roadmap
      router.push(`/roadmap/${(roadmapResponse as any).id}`);
    }
  };

  const resetForm = () => {
    setSelectedCompanies([]);
    setDesignation('');
    setDuration(15);
    resetState();
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    resetForm();
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const getProgressPercentage = (roadmap: RoadmapDocument) => {
    if (!roadmap.progress) return 0;
    return Math.round(
      (roadmap.progress.completedProblemsCount /
        roadmap.overview.totalProblems) *
        100
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'archived':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <Layout>
      <div className='min-h-screen bg-bodyBg'>
        {/* Hero Section */}
        <div className='bg-gradient-to-br from-primary/5 via-secondary to-bodyBg'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
            <div className='text-center max-w-4xl mx-auto'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6'>
                <span className='text-3xl'>🗺️</span>
              </div>
              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-neutralDark mb-4 sm:mb-6'>
                Learning Roadmaps
              </h1>
              <p className='text-lg sm:text-xl text-text opacity-80 mb-8 sm:mb-10 leading-relaxed'>
                Personalized learning paths tailored to your career goals. Track
                progress, master skills, and ace your interviews with structured
                guidance.
              </p>
              <Button
                onClick={handleOpenCreateModal}
                size='lg'
                leftIcon={<span>✨</span>}
              >
                Create New Roadmap
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
          {/* Roadmaps List */}
          <div className='space-y-8'>
            {loadingRoadmaps ? (
              <CardLoadingState count={6} />
            ) : userRoadmaps.length === 0 ? (
              <div className='flex flex-col items-center justify-center min-h-96 py-16 px-4 text-center'>
                <div className='relative mb-8'>
                  <div className='w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center'>
                    <span className='text-4xl'>🗺️</span>
                  </div>
                  <div className='absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm'>+</span>
                  </div>
                </div>
                <h2 className='text-3xl sm:text-4xl font-bold text-neutralDark mb-4'>
                  Start Your Journey
                </h2>
                <p className='text-lg sm:text-xl text-text opacity-70 mb-8 max-w-2xl leading-relaxed'>
                  Create your first learning roadmap to begin your structured
                  interview preparation journey. We'll guide you through every
                  step.
                </p>
                <Button
                  onClick={handleOpenCreateModal}
                  size='lg'
                  leftIcon={<span>🚀</span>}
                >
                  Create Your First Roadmap
                </Button>
              </div>
            ) : (
              <>
                <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6'>
                  <div>
                    <h2 className='text-2xl sm:text-3xl font-bold text-neutralDark mb-2'>
                      Your Roadmaps
                    </h2>
                    <p className='text-text opacity-70'>
                      {userRoadmaps.length} roadmap
                      {userRoadmaps.length !== 1 ? 's' : ''} • Keep learning and
                      growing
                    </p>
                  </div>
                  <div className='flex items-center justify-between md:justify-end gap-3'>
                    <Tabs
                      items={[
                        { id: 'all', label: 'All', count: tabCounts.all },
                        {
                          id: 'active',
                          label: 'Active',
                          count: tabCounts.active,
                        },
                        {
                          id: 'completed',
                          label: 'Completed',
                          count: tabCounts.completed,
                        },
                        {
                          id: 'archived',
                          label: 'Archived',
                          count: tabCounts.archived,
                        },
                      ]}
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                    />
                    <Button
                      onClick={handleOpenCreateModal}
                      className='hidden sm:inline-flex'
                      leftIcon={<span>+</span>}
                    >
                      New Roadmap
                    </Button>
                  </div>
                </div>

                {/** Filtered list by tab */}
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8'>
                  {userRoadmaps
                    .filter(r =>
                      activeTab === 'all' ? true : r.status === activeTab
                    )
                    .map(roadmap => (
                      <Card
                        key={roadmap.id}
                        className='group cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-2 hover:border-primary/20 overflow-hidden'
                        onClick={() => router.push(`/roadmap/${roadmap.id}`)}
                      >
                        <div className='p-6 sm:p-8'>
                          {/* Header */}
                          <div className='flex items-start justify-between mb-6'>
                            <div className='flex-1 min-w-0'>
                              <h3 className='text-xl sm:text-2xl font-bold text-neutralDark mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300'>
                                {roadmap.title}
                              </h3>
                              <p className='text-text opacity-70 text-sm sm:text-base line-clamp-3 leading-relaxed'>
                                {roadmap.description}
                              </p>
                            </div>
                            <span
                              className={`ml-4 px-3 py-1.5 text-xs sm:text-sm rounded-full border font-semibold flex-shrink-0 ${getStatusColor(roadmap.status)}`}
                            >
                              {roadmap.status}
                            </span>
                          </div>

                          {/* Meta Info */}
                          <div className='space-y-3 mb-6'>
                            <div className='flex items-center space-x-3 text-sm sm:text-base text-text opacity-70'>
                              <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0'>
                                <span className='text-primary font-semibold'>
                                  🎯
                                </span>
                              </div>
                              <span className='font-medium truncate'>
                                {roadmap.designation}
                              </span>
                            </div>
                            <div className='flex items-center space-x-3 text-sm sm:text-base text-text opacity-70'>
                              <div className='w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0'>
                                <span className='text-blue-500 font-semibold'>
                                  🏢
                                </span>
                              </div>
                              <span className='font-medium truncate'>
                                {roadmap.companies.slice(0, 2).join(', ')}
                                {roadmap.companies.length > 2 ? '...' : ''}
                              </span>
                            </div>
                            <div className='flex items-center space-x-3 text-sm sm:text-base text-text opacity-70'>
                              <div className='w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0'>
                                <span className='text-green-500 font-semibold'>
                                  📅
                                </span>
                              </div>
                              <span className='font-medium'>
                                {roadmap.duration} days
                              </span>
                            </div>
                          </div>

                          {/* Progress */}
                          {roadmap.progress && (
                            <div className='mb-6'>
                              <div className='flex justify-between items-center text-sm sm:text-base text-text opacity-70 mb-3'>
                                <span className='font-medium'>Progress</span>
                                <span className='font-bold text-primary'>
                                  {roadmap.progress.completedProblemsCount} /{' '}
                                  {roadmap.overview.totalProblems}
                                </span>
                              </div>
                              <div className='relative'>
                                <div className='w-full bg-border rounded-full h-3 overflow-hidden'>
                                  <div
                                    className='bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-1000 ease-out'
                                    style={{
                                      width: `${getProgressPercentage(roadmap)}%`,
                                    }}
                                  ></div>
                                </div>
                                <div className='text-center text-sm sm:text-base font-bold text-primary mt-2'>
                                  {getProgressPercentage(roadmap)}% Complete
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Footer */}
                          <div className='flex items-center justify-between text-xs sm:text-sm text-text opacity-60 pt-4 border-t border-border/50'>
                            <span>Created {formatDate(roadmap.createdAt)}</span>
                            <div className='flex items-center space-x-2'>
                              <span className='text-primary'>📊</span>
                              <span className='font-medium'>
                                {roadmap.overview.totalProblems} problems
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Create Roadmap Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={handleCloseCreateModal}
          title='Create New Roadmap'
          variant='2xl'
        >
          <div className='space-y-8'>
            {/* Company Selection */}
            <div>
              <div className='flex items-center space-x-4 mb-6'>
                <div className='w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center'>
                  <span className='text-primary text-lg font-bold'>1</span>
                </div>
                <div>
                  <h3 className='text-xl font-bold text-neutralDark'>
                    Select Target Companies
                  </h3>
                  <p className='text-text opacity-70 text-sm'>
                    Choose the companies you want to prepare for
                  </p>
                </div>
              </div>
              {loadingCompanies ? (
                <div className='flex justify-center py-12'>
                  <div className='text-center'>
                    <div className='w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-text opacity-70'>Loading companies...</p>
                  </div>
                </div>
              ) : (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-80 overflow-y-auto p-2'>
                  {companies.map(company => (
                    <div
                      key={company.id}
                      className={`group p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedCompanies.includes(company.id)
                          ? 'border-primary bg-primary/5 shadow-lg scale-105'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50 hover:scale-102'
                      }`}
                      onClick={() => handleCompanyToggle(company.id)}
                    >
                      <div className='flex items-center space-x-4'>
                        <div className='text-3xl group-hover:scale-110 transition-transform duration-300'>
                          {company.logo}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h4 className='font-bold text-neutralDark mb-2 truncate'>
                            {company.name}
                          </h4>
                          <div className='flex items-center space-x-3 text-sm text-text opacity-70'>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                company.difficulty === 'easy'
                                  ? 'bg-green-100 text-green-700'
                                  : company.difficulty === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {company.difficulty}
                            </span>
                            <span>•</span>
                            <span className='truncate'>
                              {company.industry || 'Technology'}
                            </span>
                          </div>
                        </div>
                        {selectedCompanies.includes(company.id) && (
                          <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0'>
                            <svg
                              className='w-4 h-4 text-white'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Designation Input */}
            <div>
              <div className='flex items-center space-x-4 mb-6'>
                <div className='w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center'>
                  <span className='text-primary text-lg font-bold'>2</span>
                </div>
                <div>
                  <h3 className='text-xl font-bold text-neutralDark'>
                    Your Target Role
                  </h3>
                  <p className='text-text opacity-70 text-sm'>
                    What position are you aiming for?
                  </p>
                </div>
              </div>
              <input
                type='text'
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                placeholder='e.g., Frontend Engineer, React Developer, UI Engineer'
                className='w-full px-6 py-4 border-2 border-border rounded-xl bg-secondary text-text placeholder:text-text/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 text-lg'
              />
            </div>

            {/* Duration Selection */}
            <div>
              <div className='flex items-center space-x-4 mb-6'>
                <div className='w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center'>
                  <span className='text-primary text-lg font-bold'>3</span>
                </div>
                <div>
                  <h3 className='text-xl font-bold text-neutralDark'>
                    Learning Timeline
                  </h3>
                  <p className='text-text opacity-70 text-sm'>
                    How long do you want to prepare?
                  </p>
                </div>
              </div>
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                {[
                  {
                    days: 7,
                    label: '1 Week',
                    description: 'Quick prep',
                    icon: '⚡',
                  },
                  {
                    days: 15,
                    label: '2 Weeks',
                    description: 'Standard prep',
                    icon: '📅',
                  },
                  {
                    days: 30,
                    label: '1 Month',
                    description: 'Comprehensive',
                    icon: '📚',
                  },
                  {
                    days: 90,
                    label: '3 Months',
                    description: 'Deep dive',
                    icon: '🎯',
                  },
                ].map(option => (
                  <div
                    key={option.days}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      duration === option.days
                        ? 'border-primary bg-primary/5 shadow-lg scale-105'
                        : 'border-border hover:border-primary/50 hover:bg-secondary/50 hover:scale-102'
                    }`}
                    onClick={() => setDuration(option.days as RoadmapDuration)}
                  >
                    <div className='text-center'>
                      <div className='text-3xl mb-3'>{option.icon}</div>
                      <div className='font-bold text-neutralDark mb-1 text-lg'>
                        {option.label}
                      </div>
                      <div className='text-sm text-text opacity-70'>
                        {option.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className='p-6 bg-red-500/10 border-2 border-red-500/20 rounded-xl'>
                <div className='flex items-center space-x-4'>
                  <span className='text-red-500 text-2xl'>⚠️</span>
                  <p className='text-red-500 font-semibold text-lg'>{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex space-x-4 pt-6'>
              <Button
                variant='secondary'
                className='flex-1'
                onClick={handleCloseCreateModal}
              >
                Cancel
              </Button>
              <Button
                className='flex-1'
                onClick={handleGenerateRoadmap}
                isLoading={loading}
                disabled={!selectedCompanies.length || !designation.trim()}
              >
                Generate Roadmap
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default RoadmapPage;
