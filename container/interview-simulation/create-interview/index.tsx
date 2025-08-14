import { Modal, Button, Card, SearchableDropdown } from '@/components/ui';
import type { SearchableDropdownOption } from '@/components/ui';
import {
  FiAlertCircle,
  FiHome,
  FiUser,
  FiClock,
  FiStar,
  FiPlay,
  FiX,
} from 'react-icons/fi';
import React, { useState, useEffect } from 'react';
import { Company } from '@/types/problem';
import { useAuth } from '@/hooks/useAuth';
import { authenticatedPost } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Role {
  id: string;
  title: string;
  level: 'junior' | 'mid' | 'senior';
  description: string;
  estimatedTime: string;
  difficulty: string;
  focusAreas: string[];
}

const roles: Role[] = [
  {
    id: 'sde1/L3',
    title: 'SDE-1/L3',
    level: 'junior',
    description: 'Entry-level software development position',
    estimatedTime: '90 minutes',
    difficulty: 'Easy to Medium',
    focusAreas: [
      'Basic Algorithms',
      'Data Structures',
      'System Design Fundamentals',
    ],
  },
  {
    id: 'sde2/L4',
    title: 'SDE-2/L4',
    level: 'mid',
    description: 'Mid-level software development with 2-4 years experience',
    estimatedTime: '120 minutes',
    difficulty: 'Medium to Hard',
    focusAreas: [
      'Advanced Algorithms',
      'System Design',
      'Architecture Patterns',
    ],
  },
  {
    id: 'sde3/L5',
    title: 'SDE-3/L5',
    level: 'senior',
    description: 'Senior software development with 5+ years experience',
    estimatedTime: '150 minutes',
    difficulty: 'Hard',
    focusAreas: [
      'Complex System Design',
      'Leadership',
      'Technical Architecture',
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Developer',
    level: 'mid',
    description: 'Specialized in frontend technologies and user interfaces',
    estimatedTime: '105 minutes',
    difficulty: 'Medium',
    focusAreas: [
      'React/Next.js',
      'CSS/Design Systems',
      'Performance Optimization',
    ],
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    level: 'senior',
    description: 'End-to-end application development',
    estimatedTime: '135 minutes',
    difficulty: 'Hard',
    focusAreas: ['Full Stack Architecture', 'Database Design', 'API Design'],
  },
  {
    id: 'staff/L6',
    title: 'Staff Engineer/L6',
    level: 'senior',
    description: 'Technical leadership and complex system design',
    estimatedTime: '180 minutes',
    difficulty: 'Expert',
    focusAreas: [
      'Technical Leadership',
      'System Architecture',
      'Cross-team Collaboration',
    ],
  },
];

interface CreateInterviewProps {
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
}

export default function CreateInterview({
  showCreateModal,
  setShowCreateModal,
}: CreateInterviewProps) {
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [creating, setCreating] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Convert companies to dropdown options
  const companyOptions: SearchableDropdownOption[] = companies.map(company => ({
    id: company.id,
    label: company.name,
    icon: <FiHome className='w-3 h-3 text-primary' />,
  }));

  // Convert selected company to dropdown option
  const selectedCompanyOption: SearchableDropdownOption | null = selectedCompany
    ? {
        id: selectedCompany.id,
        label: selectedCompany.name,
        icon: <FiHome className='w-3 h-3 text-primary' />,
      }
    : null;

  // Fetch all companies on component mount
  useEffect(() => {
    if (showCreateModal) {
      fetchCompanies();
    }
  }, [showCreateModal]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/companies/get-all');
      if (response.ok) {
        const companies = await response.json();
        setCompanies(companies?.data);
      } else {
        throw new Error('Failed to fetch companies');
      }
    } catch (error) {
      console.error('Error fetching companies', error);
      setError('Failed to load companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSimulation = async () => {
    if (!user || !selectedCompany || !selectedRole) {
      setError('Please select both company and role');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      // Get interview insights first
      const insights = await authenticatedPost('/api/interview-insights', {
        companyName: selectedCompany.name,
        roleLevel: selectedRole.title,
      });

      // Create simulation
      const { simulationId } = await authenticatedPost(
        '/api/interview-simulation/create',
        {
          companyName: selectedCompany.name,
          roleLevel: selectedRole.title,
          insights: insights.data,
        }
      );

      // Navigate to the first round
      router.push(`/interview-simulation/${simulationId}/1`);
    } catch (error) {
      console.error('Error creating simulation:', error);
      setError('Failed to create interview simulation. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'junior':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'mid':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'senior':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty.includes('Easy'))
      return 'text-green-600 dark:text-green-400';
    if (difficulty.includes('Medium'))
      return 'text-yellow-600 dark:text-yellow-400';
    if (difficulty.includes('Hard'))
      return 'text-orange-600 dark:text-orange-400';
    if (difficulty.includes('Expert')) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <Modal
      isOpen={showCreateModal}
      onClose={() => setShowCreateModal(false)}
      title='Start New Interview Simulation'
      size='xl'
      headerClassName='border-b border-border/50 pb-3'
    >
      <div className='space-y-4'>
        {/* Error Display */}
        {error && (
          <div className='flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
            <FiAlertCircle className='w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0' />
            <span className='text-red-700 dark:text-red-300 text-sm'>
              {error}
            </span>
          </div>
        )}

        {/* Company Selection */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <FiHome className='w-4 h-4 text-primary' />
            <h3 className='text-base font-semibold text-text'>
              Select Company
            </h3>
          </div>

          <SearchableDropdown
            options={companyOptions}
            value={selectedCompanyOption}
            onValueChange={option => {
              const company = companies.find(c => c.id === option?.id) || null;
              setSelectedCompany(company);
            }}
            placeholder='Choose a company'
            searchPlaceholder='Search companies...'
            loading={loading}
            icon={<FiHome className='w-3 h-3 text-primary' />}
            emptyMessage='No companies available'
            noResultsMessage='No companies found'
          />
        </div>

        {/* Role Selection */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <FiUser className='w-4 h-4 text-primary' />
            <h3 className='text-base font-semibold text-text'>Select Role</h3>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {roles.map(role => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md p-3 ${
                  selectedRole?.id === role.id
                    ? 'ring-2 ring-primary border-primary bg-primary/5'
                    : 'hover:border-primary/50 hover:bg-secondary/50'
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <div className='space-y-2'>
                  {/* Header */}
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <h4 className='font-semibold text-text text-sm'>
                        {role.title}
                      </h4>
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(role.level)}`}
                    >
                      {role.level}
                    </div>
                  </div>

                  {/* Details */}
                  <div className='flex items-center gap-4 text-xs'>
                    <div className='flex items-center gap-1'>
                      <FiClock className='w-3 h-3 text-neutral' />
                      <span className='text-text'>{role.estimatedTime}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <FiStar className='w-3 h-3 text-neutral' />
                      <span
                        className={`font-medium ${getDifficultyColor(role.difficulty)}`}
                      >
                        {role.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary */}
        {(selectedCompany || selectedRole) && (
          <Card className='bg-secondary/50 border-primary/20 p-3'>
            <div className='space-y-2'>
              <h4 className='font-semibold text-text text-sm'>
                Interview Summary
              </h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {selectedCompany && (
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center'>
                      <FiHome className='w-3 h-3 text-primary' />
                    </div>
                    <div>
                      <div className='text-xs text-neutral'>Company</div>
                      <div className='font-medium text-text text-sm'>
                        {selectedCompany.name}
                      </div>
                    </div>
                  </div>
                )}
                {selectedRole && (
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center'>
                      <FiUser className='w-3 h-3 text-primary' />
                    </div>
                    <div>
                      <div className='text-xs text-neutral'>Role</div>
                      <div className='font-medium text-text text-sm'>
                        {selectedRole.title}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {selectedRole && (
                <div className='pt-2 border-t border-border/50'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-neutral'>Duration:</span>
                    <span className='font-medium text-text'>
                      {selectedRole.estimatedTime}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Footer Actions */}
      <div className='flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-border/50'>
        <Button
          variant='secondary'
          onClick={() => setShowCreateModal(false)}
          className='flex-1'
          size='sm'
          leftIcon={<FiX />}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateSimulation}
          disabled={!selectedCompany || !selectedRole || creating}
          className='flex-1'
          size='sm'
          isLoading={creating}
          leftIcon={<FiPlay />}
        >
          {creating ? 'Creating...' : 'Start Interview'}
        </Button>
      </div>
    </Modal>
  );
}
