import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { OnboardingData } from '../types/user';
import { FaGraduationCap, FaCode, FaChartLine, FaRocket } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.secondary};
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${slideIn} 0.3s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  font-size: 1.1rem;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ active, completed, theme }) => 
    completed ? theme.primary : active ? theme.accent : theme.border};
  transition: all 0.3s ease;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  animation: ${slideIn} 0.3s ease-out;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary}10;
  }
  
  input:checked + & {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary}20;
  }
`;

const Checkbox = styled.input`
  display: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button<{ primary?: boolean; disabled?: boolean }>`
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  
  ${({ primary, theme }) => primary ? `
    background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%);
    color: white;
    box-shadow: 0 4px 15px ${theme.primary}40;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${theme.primary}60;
    }
  ` : `
    background: transparent;
    color: ${theme.text};
    border: 2px solid ${theme.border};
    
    &:hover:not(:disabled) {
      border-color: ${theme.primary};
      color: ${theme.primary};
    }
  `}
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${({ theme }) => theme.border};
  border-radius: 2px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.accent});
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    difficulty: 'intermediate',
    focusAreas: [],
    dailyGoal: 30,
    experience: 'mid',
    targetCompanies: [],
    preferredLanguages: [],
  });

  const steps = [
    { title: 'Experience Level', icon: <FaGraduationCap /> },
    { title: 'Focus Areas', icon: <FaCode /> },
    { title: 'Goals & Preferences', icon: <FaChartLine /> },
    { title: 'Complete Setup', icon: <FaRocket /> },
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner (0-1 years)' },
    { value: 'intermediate', label: 'Intermediate (1-3 years)' },
    { value: 'advanced', label: 'Advanced (3+ years)' },
  ];

  const experienceOptions = [
    { value: 'student', label: 'Student' },
    { value: 'junior', label: 'Junior Developer' },
    { value: 'mid', label: 'Mid-level Developer' },
    { value: 'senior', label: 'Senior Developer' },
  ];

  const focusAreaOptions = [
    'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript',
    'CSS/SCSS', 'Node.js', 'Next.js', 'State Management',
    'Testing', 'Performance', 'Accessibility', 'Mobile'
  ];

  const companyOptions = [
    'Google', 'Facebook', 'Amazon', 'Microsoft', 'Apple',
    'Netflix', 'Airbnb', 'Uber', 'Twitter', 'LinkedIn',
    'Spotify', 'Stripe', 'Shopify', 'Other'
  ];

  const languageOptions = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++',
    'Go', 'Rust', 'Swift', 'Kotlin', 'PHP'
  ];

  const handleInputChange = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof OnboardingData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      await updateProfile({
        preferences: {
          difficulty: formData.difficulty,
          focusAreas: formData.focusAreas,
          dailyGoal: formData.dailyGoal,
        },
        onboardingCompleted: true,
      });
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // You could add a toast notification here
      alert('Error completing onboarding. Please try again.');
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <Header>
          <Title>Welcome! Let's personalize your experience</Title>
          <Subtitle>Help us tailor the platform to your needs</Subtitle>
        </Header>

        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>

        <StepIndicator>
          {steps.map((_, index) => (
            <Step 
              key={index} 
              active={index === currentStep} 
              completed={index < currentStep} 
            />
          ))}
        </StepIndicator>

        {currentStep === 0 && (
          <FormSection>
            <SectionTitle>
              {steps[0].icon}
              What's your experience level?
            </SectionTitle>
            
            <FormGroup>
              <Label>Difficulty Level</Label>
              <Select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
              >
                {difficultyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Professional Experience</Label>
              <Select
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
              >
                {experienceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </FormSection>
        )}

        {currentStep === 1 && (
          <FormSection>
            <SectionTitle>
              {steps[1].icon}
              What areas do you want to focus on?
            </SectionTitle>
            
            <FormGroup>
              <Label>Focus Areas (Select all that apply)</Label>
              <CheckboxGroup>
                {focusAreaOptions.map(area => (
                  <CheckboxLabel key={area}>
                    <Checkbox
                      type="checkbox"
                      checked={formData.focusAreas.includes(area)}
                      onChange={(e) => handleCheckboxChange('focusAreas', area, e.target.checked)}
                    />
                    {area}
                  </CheckboxLabel>
                ))}
              </CheckboxGroup>
            </FormGroup>

            <FormGroup>
              <Label>Preferred Programming Languages</Label>
              <CheckboxGroup>
                {languageOptions.map(lang => (
                  <CheckboxLabel key={lang}>
                    <Checkbox
                      type="checkbox"
                      checked={formData.preferredLanguages.includes(lang)}
                      onChange={(e) => handleCheckboxChange('preferredLanguages', lang, e.target.checked)}
                    />
                    {lang}
                  </CheckboxLabel>
                ))}
              </CheckboxGroup>
            </FormGroup>
          </FormSection>
        )}

        {currentStep === 2 && (
          <FormSection>
            <SectionTitle>
              {steps[2].icon}
              Set your learning goals
            </SectionTitle>
            
            <FormGroup>
              <Label>Daily Practice Goal (minutes)</Label>
              <Input
                type="number"
                min="10"
                max="180"
                value={formData.dailyGoal}
                onChange={(e) => handleInputChange('dailyGoal', parseInt(e.target.value))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Target Companies (Select all that apply)</Label>
              <CheckboxGroup>
                {companyOptions.map(company => (
                  <CheckboxLabel key={company}>
                    <Checkbox
                      type="checkbox"
                      checked={formData.targetCompanies.includes(company)}
                      onChange={(e) => handleCheckboxChange('targetCompanies', company, e.target.checked)}
                    />
                    {company}
                  </CheckboxLabel>
                ))}
              </CheckboxGroup>
            </FormGroup>
          </FormSection>
        )}

        {currentStep === 3 && (
          <FormSection>
            <SectionTitle>
              {steps[3].icon}
              You're all set!
            </SectionTitle>
            
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1rem' }}>
                Based on your preferences, we'll recommend problems and track your progress.
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--text)', opacity: 0.8 }}>
                You can always update these settings later in your profile.
              </p>
            </div>
          </FormSection>
        )}

        <ButtonGroup>
          {currentStep > 0 && (
            <Button onClick={prevStep}>
              Previous
            </Button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <Button primary onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button primary onClick={handleComplete}>
              Complete Setup
            </Button>
          )}
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default OnboardingModal; 