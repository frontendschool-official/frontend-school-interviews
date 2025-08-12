import Modal from '@/components/ui/Modal';
import { FiAlertCircle, FiChevronDown } from 'react-icons/fi';
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
}

const roles: Role[] = [
  {
    id: 'sde1',
    title: 'SDE-1 (Software Developer I)',
    level: 'junior',
    description: 'Entry-level software development position',
    estimatedTime: '90 minutes',
  },
  {
    id: 'sde2',
    title: 'SDE-2 (Software Developer II)',
    level: 'mid',
    description: 'Mid-level software development with 2-4 years experience',
    estimatedTime: '120 minutes',
  },
  {
    id: 'sde3',
    title: 'SDE-3 (Senior Software Developer)',
    level: 'senior',
    description: 'Senior software development with 5+ years experience',
    estimatedTime: '150 minutes',
  },
  {
    id: 'frontend',
    title: 'Frontend Developer',
    level: 'mid',
    description: 'Specialized in frontend technologies and user interfaces',
    estimatedTime: '105 minutes',
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    level: 'senior',
    description: 'End-to-end application development',
    estimatedTime: '135 minutes',
  },
  {
    id: 'staff',
    title: 'Staff Engineer',
    level: 'senior',
    description: 'Technical leadership and complex system design',
    estimatedTime: '180 minutes',
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
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  return (
    <Modal
      isOpen={showCreateModal}
      onClose={() => setShowCreateModal(false)}
      title='Start New Interview Simulation'
    >
      <div className='p-6 w-full max-w-2xl'>
        {error && (
          <div className='flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4'>
            <FiAlertCircle className='w-5 h-5 text-red-600' />
            <span className='text-red-700'>{error}</span>
          </div>
        )}

        <div className='space-y-6'>
          {/* Company Dropdown */}
          <div>
            <h3 className='text-lg font-semibold text-text mb-3'>
              Select Company
            </h3>
            <div className='relative'>
              <button
                type='button'
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className='w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
              >
                {selectedCompany ? (
                  <div className='flex items-center gap-3'>
                    <span className='font-medium text-text'>
                      {selectedCompany.name}
                    </span>
                  </div>
                ) : (
                  <span className='text-gray-500'>Choose a company...</span>
                )}
                <FiChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    showCompanyDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showCompanyDropdown && (
                <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                  {loading ? (
                    <div className='px-3 py-2 text-gray-500'>
                      Loading companies...
                    </div>
                  ) : companies?.length > 0 ? (
                    companies?.map(company => (
                      <button
                        key={company.id}
                        type='button'
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowCompanyDropdown(false);
                        }}
                        className='w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none'
                      >
                        <div className='flex-1'>
                          <div className='font-medium text-text'>
                            {company.name}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className='px-3 py-2 text-gray-500'>
                      No companies available
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <h3 className='text-lg font-semibold text-text mb-3'>
              Select Role
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {roles.map(role => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRole?.id === role.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <h4 className='font-medium text-text mb-1'>{role.title}</h4>
                  <p className='text-text/70 text-sm mb-2'>
                    {role.description}
                  </p>
                  <div className='flex items-center gap-2 text-xs text-text/60'>
                    <span className='capitalize'>{role.level} level</span>
                    <span>•</span>
                    <span>{role.estimatedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='flex gap-3 mt-6'>
          <button
            onClick={() => setShowCreateModal(false)}
            className='flex-1 px-4 py-2 border border-border text-text rounded-lg hover:bg-secondary transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleCreateSimulation}
            disabled={!selectedCompany || !selectedRole || creating}
            className='flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {creating ? 'Creating...' : 'Start Interview'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
