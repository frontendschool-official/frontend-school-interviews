import React, { useState } from 'react';
import { Input, SearchableDropdown } from './';
import type { SearchableDropdownOption } from './';
import { FiUser, FiBriefcase } from 'react-icons/fi';

interface InterviewFormValues {
  designation: string;
  companies: string;
  round: string;
  interviewType:
    | 'coding'
    | 'design'
    | 'dsa'
    | 'theory'
    | 'behavioral/managerial';
}

interface InterviewFormProps {
  onSubmit: (values: InterviewFormValues) => void;
  onCancel?: () => void;
  initialValues?: Partial<InterviewFormValues>;
  className?: string;
}

export default function InterviewForm({
  onSubmit,
  onCancel: _onCancel,
  initialValues = {},
  className = '',
}: InterviewFormProps) {
  const [values, setValues] = useState<InterviewFormValues>({
    designation: 'Frontend Developer',
    companies: '',
    round: '',
    interviewType: 'coding',
    ...initialValues,
  });

  const [selectedRound, setSelectedRound] =
    useState<SearchableDropdownOption | null>(
      initialValues.round
        ? {
            id: initialValues.round,
            label: getRoundLabel(initialValues.round),
            icon: <FiUser className='w-3 h-3 text-primary' />,
          }
        : null
    );

  const [selectedInterviewType, setSelectedInterviewType] =
    useState<SearchableDropdownOption | null>(
      initialValues.interviewType
        ? {
            id: initialValues.interviewType,
            label: getInterviewTypeLabel(initialValues.interviewType),
            icon: <FiBriefcase className='w-3 h-3 text-primary' />,
          }
        : null
    );

  const roundOptions: SearchableDropdownOption[] = [
    {
      id: 'SDE1',
      label: 'SDE1 or L3',
      icon: <FiUser className='w-3 h-3 text-primary' />,
    },
    {
      id: 'SDE2',
      label: 'SDE2 or L4',
      icon: <FiUser className='w-3 h-3 text-primary' />,
    },
    {
      id: 'SDE3',
      label: 'SDE3 or L5',
      icon: <FiUser className='w-3 h-3 text-primary' />,
    },
    {
      id: 'SDE4',
      label: 'SDE4 or L6',
      icon: <FiUser className='w-3 h-3 text-primary' />,
    },
    {
      id: 'Architect',
      label: 'Architect or L6+',
      icon: <FiUser className='w-3 h-3 text-primary' />,
    },
  ];

  const interviewTypeOptions: SearchableDropdownOption[] = [
    {
      id: 'coding',
      label: 'Machine Coding',
      icon: <FiBriefcase className='w-3 h-3 text-primary' />,
    },
    {
      id: 'design',
      label: 'System Design',
      icon: <FiBriefcase className='w-3 h-3 text-primary' />,
    },
    {
      id: 'dsa',
      label: 'DSA',
      icon: <FiBriefcase className='w-3 h-3 text-primary' />,
    },
    {
      id: 'theory',
      label: 'Theory',
      icon: <FiBriefcase className='w-3 h-3 text-primary' />,
    },
    {
      id: 'behavioral/managerial',
      label: 'Behavioral/Managerial',
      icon: <FiBriefcase className='w-3 h-3 text-primary' />,
    },
  ];

  function getRoundLabel(value: string): string {
    const option = roundOptions.find(opt => opt.id === value);
    return option?.label || value;
  }

  function getInterviewTypeLabel(value: string): string {
    const option = interviewTypeOptions.find(opt => opt.id === value);
    return option?.label || value;
  }

  const handleSubmit = () => {
    if (values.designation && selectedRound && selectedInterviewType) {
      onSubmit({
        ...values,
        round: selectedRound.id,
        interviewType:
          selectedInterviewType.id as InterviewFormValues['interviewType'],
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Input
        label='Job Title / Designation'
        type='text'
        placeholder='e.g., Frontend Developer, React Developer'
        value={values.designation}
        onChange={e => setValues({ ...values, designation: e.target.value })}
        onKeyPress={handleKeyPress}
      />

      <Input
        label='Companies (Optional)'
        type='text'
        placeholder='e.g., Google, Meta, Amazon'
        value={values.companies}
        onChange={e => setValues({ ...values, companies: e.target.value })}
        onKeyPress={handleKeyPress}
      />

      <div>
        <label className='block text-sm font-medium text-text mb-2'>
          Designation
        </label>
        <SearchableDropdown
          options={roundOptions}
          value={selectedRound}
          onValueChange={setSelectedRound}
          placeholder='Select Designation'
          searchPlaceholder='Search designations...'
          icon={<FiUser className='w-3 h-3 text-primary' />}
          emptyMessage='No designations available'
          noResultsMessage='No designations found'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-text mb-2'>
          Interview Type
        </label>
        <SearchableDropdown
          options={interviewTypeOptions}
          value={selectedInterviewType}
          onValueChange={setSelectedInterviewType}
          placeholder='Select Interview Type'
          searchPlaceholder='Search interview types...'
          icon={<FiBriefcase className='w-3 h-3 text-primary' />}
          emptyMessage='No interview types available'
          noResultsMessage='No interview types found'
        />
      </div>
    </div>
  );
}
