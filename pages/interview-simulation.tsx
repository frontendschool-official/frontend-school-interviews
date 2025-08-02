import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { InterviewInsightsRequest, InterviewInsightsResponse, InterviewRound, MockInterviewResult } from '../types/problem';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../hooks/useTheme';
import NavBar from '../components/NavBar';
import MockInterview from '../components/MockInterview';

interface Company {
  name: string;
  description?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface StartingRound {
  id: string;
  name: string;
  description: string;
  roundNumber: number;
}

const COMPANIES: Company[] = [
  { name: 'Google', description: 'Search and AI technology company' },
  { name: 'Amazon', description: 'E-commerce and cloud computing' },
  { name: 'Microsoft', description: 'Software and cloud services' },
  { name: 'Meta', description: 'Social media and technology' },
  { name: 'Apple', description: 'Consumer electronics and software' },
  { name: 'Netflix', description: 'Streaming entertainment' },
  { name: 'Uber', description: 'Ride-sharing and delivery' },
  { name: 'Airbnb', description: 'Online marketplace for lodging' },
  { name: 'Stripe', description: 'Payment processing platform' },
  { name: 'Shopify', description: 'E-commerce platform' },
];

const ROLES: Role[] = [
  { id: 'sde1', name: 'SDE1', description: 'Software Development Engineer I - Entry level' },
  { id: 'sde2', name: 'SDE2', description: 'Software Development Engineer II - Mid level' },
  { id: 'sde3', name: 'SDE3', description: 'Software Development Engineer III - Senior level' },
  { id: 'others', name: 'Others', description: 'Other engineering roles' },
];

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: ${({ theme }) => theme.bodyBg};
  font-family: system-ui, -apple-system, sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: ${({ theme }) => theme.secondary};
  border-radius: 12px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.border}20;
  border: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.primary};
  margin-bottom: 10px;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.neutral};
  font-size: 1.1rem;
  margin: 0;
`;

const SetupContainer = styled.div`
  background: ${({ theme }) => theme.secondary};
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.border}20;
  border: 1px solid ${({ theme }) => theme.border};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.neutralDark};
  margin-bottom: 30px;
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
`;

const StepTitle = styled.h3`
  color: ${({ theme }) => theme.neutralDark};
  margin-bottom: 20px;
  font-size: 1.3rem;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 40px;
`;

const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 40px;
`;

const RoundGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 40px;
`;

const SelectableCard = styled.div<{ selected: boolean }>`
  padding: 20px;
  border: 2px solid ${({ theme, selected }) => selected ? theme.primary : theme.border};
  border-radius: 8px;
  cursor: pointer;
  background: ${({ theme, selected }) => selected ? `${theme.primary}10` : theme.bodyBg};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.border}30;
  }
`;

const CardTitle = styled.h4`
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.neutralDark};
  font-weight: 600;
`;

const CardDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.neutral};
  line-height: 1.4;
`;

const ErrorMessage = styled.div`
  padding: 15px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  margin-bottom: 20px;
  color: #c33;
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  padding: 15px 30px;
  font-size: 1.1rem;
  background: ${({ theme, disabled }) => disabled ? theme.neutralLight : theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  transition: all 0.2s ease;
  font-weight: 600;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.border}30;
    background: ${({ theme }) => theme.accent};
  }
`;

const InsightsContainer = styled.div`
  background: ${({ theme }) => theme.secondary};
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.border}20;
  border: 1px solid ${({ theme }) => theme.border};
`;

const InsightsHeader = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const InsightsTitle = styled.h2`
  color: ${({ theme }) => theme.neutralDark};
  margin-bottom: 10px;
  font-size: 1.8rem;
  font-weight: 600;
`;

const InsightsSubtitle = styled.p`
  color: ${({ theme }) => theme.neutral};
  margin: 0;
`;

const RoundsContainer = styled.div`
  margin-bottom: 40px;
`;

const RoundCard = styled.div`
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.bodyBg};
  margin-bottom: 20px;
`;

const RoundHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const RoundName = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.neutralDark};
  font-weight: 600;
`;

const DifficultyBadge = styled.span<{ difficulty: string }>`
  padding: 4px 12px;
  background: ${({ difficulty, theme }) => 
    difficulty === 'easy' ? '#d4edda' : 
    difficulty === 'medium' ? '#fff3cd' : '#f8d7da'};
  color: ${({ difficulty }) => 
    difficulty === 'easy' ? '#155724' : 
    difficulty === 'medium' ? '#856404' : '#721c24'};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const RoundDescription = styled.p`
  margin: 0 0 15px 0;
  color: ${({ theme }) => theme.neutral};
  line-height: 1.5;
`;

const RoundDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
`;

const DetailItem = styled.div`
  color: ${({ theme }) => theme.neutral};
  
  strong {
    color: ${({ theme }) => theme.neutralDark};
  }
`;

const SampleProblems = styled.div`
  margin-top: 15px;
  
  strong {
    color: ${({ theme }) => theme.neutralDark};
  }
  
  ul {
    margin: 8px 0 0 20px;
    color: ${({ theme }) => theme.neutral};
  }
`;

const ButtonGroup = styled.div`
  text-align: center;
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
`;

const SecondaryButton = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  background: ${({ theme }) => theme.neutral};
  color: ${({ theme }) => theme.bodyBg};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  
  &:hover {
    background: ${({ theme }) => theme.neutralDark};
    transform: translateY(-1px);
  }
`;

const SimulationContainer = styled.div`
  background: ${({ theme }) => theme.secondary};
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.border}20;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ProgressContainer = styled.div`
  margin-bottom: 30px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ProgressText = styled.span<{ isBold?: boolean }>`
  color: ${({ theme, isBold }) => isBold ? theme.neutralDark : theme.neutral};
  font-weight: ${({ isBold }) => isBold ? '600' : '400'};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.border};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percentage: number }>`
  width: ${({ percentage }) => percentage}%;
  height: 100%;
  background: ${({ theme }) => theme.primary};
  transition: width 0.3s ease;
`;

const RoundContent = styled.div`
  margin-bottom: 40px;
`;

const RoundTitle = styled.h2`
  color: ${({ theme }) => theme.neutralDark};
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
`;

const DifficultyBadgeLarge = styled.span<{ difficulty: string }>`
  padding: 6px 16px;
  background: ${({ difficulty, theme }) => 
    difficulty === 'easy' ? '#d4edda' : 
    difficulty === 'medium' ? '#fff3cd' : '#f8d7da'};
  color: ${({ difficulty }) => 
    difficulty === 'easy' ? '#155724' : 
    difficulty === 'medium' ? '#856404' : '#721c24'};
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const RoundDescriptionLarge = styled.p`
  color: ${({ theme }) => theme.neutral};
  line-height: 1.6;
  margin-bottom: 20px;
`;

const RoundDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const DetailGrid = styled.div`
  color: ${({ theme }) => theme.neutral};
  
  strong {
    color: ${({ theme }) => theme.neutralDark};
  }
  
  p {
    margin: 5px 0 0 0;
    color: ${({ theme }) => theme.neutral};
  }
`;

const CriteriaList = styled.div`
  color: ${({ theme }) => theme.neutral};
  
  strong {
    color: ${({ theme }) => theme.neutralDark};
  }
  
  ul {
    margin: 5px 0 0 20px;
    color: ${({ theme }) => theme.neutral};
  }
`;

const ProblemsList = styled.div`
  margin-top: 20px;
  
  strong {
    color: ${({ theme }) => theme.neutralDark};
  }
  
  ul {
    margin: 5px 0 0 20px;
    color: ${({ theme }) => theme.neutral};
  }
`;

const TipsList = styled.div`
  margin-top: 20px;
  
  strong {
    color: ${({ theme }) => theme.neutralDark};
  }
  
  ul {
    margin: 5px 0 0 20px;
    color: ${({ theme }) => theme.neutral};
  }
`;

const CompletionContainer = styled.div`
  background: ${({ theme }) => theme.secondary};
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.border}20;
  border: 1px solid ${({ theme }) => theme.border};
  text-align: center;
`;

const CompletionIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const CompletionTitle = styled.h2`
  color: ${({ theme }) => theme.neutralDark};
  margin-bottom: 15px;
  font-size: 1.8rem;
  font-weight: 600;
`;

const CompletionMessage = styled.p`
  color: ${({ theme }) => theme.neutral};
  margin-bottom: 30px;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const STARTING_ROUNDS: StartingRound[] = [
  { id: 'default', name: 'Default', description: 'Start from the beginning', roundNumber: 1 },
  { id: 'r2', name: 'Round 2', description: 'Start from second round', roundNumber: 2 },
  { id: 'r3', name: 'Round 3', description: 'Start from third round', roundNumber: 3 },
  { id: 'r4', name: 'Round 4', description: 'Start from fourth round', roundNumber: 4 },
];

export default function InterviewSimulation() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { themeObject } = useThemeContext();
  const [step, setStep] = useState<'setup' | 'insights' | 'simulation' | 'mock-interview'>('setup');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedStartingRound, setSelectedStartingRound] = useState<StartingRound | null>(null);
  const [insights, setInsights] = useState<InterviewInsightsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [interviewProgress, setInterviewProgress] = useState<{
    completedRounds: number[];
    currentRound: InterviewRound | null;
    totalRounds: number;
  }>({
    completedRounds: [],
    currentRound: null,
    totalRounds: 0,
  });
  const [mockInterviewConfig, setMockInterviewConfig] = useState<{
    roundName: string;
    roundType: 'dsa' | 'machine_coding' | 'system_design' | 'theory';
    difficulty: 'easy' | 'medium' | 'hard';
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchInterviewInsights = async () => {
    if (!selectedCompany || !selectedRole) {
      setError('Please select both company and role');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: InterviewInsightsRequest = {
        companyName: selectedCompany.name,
        roleLevel: selectedRole.name,
      };

      const response = await fetch('/api/interview-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch interview insights');
      }

      if (!result.data) {
        throw new Error('No data received from interview insights API');
      }

      setInsights(result.data);
      setStep('insights');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const startSimulation = () => {
    if (!insights || !selectedStartingRound) return;

    const startingRoundIndex = (selectedStartingRound?.roundNumber || 1) - 1;
    const adjustedRounds = insights.data.rounds.slice(startingRoundIndex);
    
    setInterviewProgress({
      completedRounds: [],
      currentRound: adjustedRounds[0] || null,
      totalRounds: adjustedRounds.length,
    });
    
    setCurrentRoundIndex(0);
    setStep('simulation');
  };

  const nextRound = () => {
    if (!insights) return;

    const startingRoundIndex = (selectedStartingRound?.roundNumber || 1) - 1;
    const adjustedRounds = insights.data.rounds.slice(startingRoundIndex);
    
    const newCompletedRounds = [...interviewProgress.completedRounds, currentRoundIndex];
    const nextIndex = currentRoundIndex + 1;

    if (nextIndex < adjustedRounds.length) {
      setInterviewProgress({
        completedRounds: newCompletedRounds,
        currentRound: adjustedRounds[nextIndex],
        totalRounds: adjustedRounds.length,
      });
      setCurrentRoundIndex(nextIndex);
    } else {
      setInterviewProgress({
        completedRounds: newCompletedRounds,
        currentRound: null,
        totalRounds: adjustedRounds.length,
      });
    }
  };

  const resetSimulation = () => {
    setStep('setup');
    setSelectedCompany(null);
    setSelectedRole(null);
    setSelectedStartingRound(null);
    setInsights(null);
    setCurrentRoundIndex(0);
    setInterviewProgress({
      completedRounds: [],
      currentRound: null,
      totalRounds: 0,
    });
    setMockInterviewConfig(null);
  };

  const startMockInterview = (round: InterviewRound) => {
    // Determine round type based on round name and focus areas
    let roundType: 'dsa' | 'machine_coding' | 'system_design' | 'theory' = 'theory';
    
    const roundNameLower = round.name.toLowerCase();
    const focusAreasLower = round.focusAreas.map(area => area.toLowerCase());
    
    if (roundNameLower.includes('dsa') || roundNameLower.includes('algorithm') || 
        focusAreasLower.some(area => area.includes('algorithm') || area.includes('data structure'))) {
      roundType = 'dsa';
    } else if (roundNameLower.includes('coding') || roundNameLower.includes('machine') ||
               focusAreasLower.some(area => area.includes('react') || area.includes('component'))) {
      roundType = 'machine_coding';
    } else if (roundNameLower.includes('design') || roundNameLower.includes('system') ||
               focusAreasLower.some(area => area.includes('architecture') || area.includes('design'))) {
      roundType = 'system_design';
    }

    setMockInterviewConfig({
      roundName: round.name,
      roundType,
      difficulty: round.difficulty
    });
    setStep('mock-interview');
  };

  const handleMockInterviewComplete = (result: MockInterviewResult) => {
    console.log('Mock interview completed:', result);
    // You can add additional logic here like showing a success message
  };

  const handleMockInterviewExit = () => {
    setStep('insights');
    setMockInterviewConfig(null);
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <Container>
      <NavBar />
      <Header>
        <Title>Interview Simulation</Title>
        <Subtitle>Practice real-world frontend engineering interviews</Subtitle>
      </Header>
      
      {step === 'setup' && (
        <SetupContainer>
          <SectionTitle>Configure Your Interview</SectionTitle>
          
          {/* Company Selection */}
          <div>
            <StepTitle>1. Select Company</StepTitle>
            <Grid>
              {COMPANIES.map((company) => (
                <SelectableCard
                  key={company.name}
                  selected={selectedCompany?.name === company.name}
                  onClick={() => setSelectedCompany(company)}
                >
                  <CardTitle>{company.name}</CardTitle>
                  {company.description && <CardDescription>{company.description}</CardDescription>}
                </SelectableCard>
              ))}
            </Grid>
          </div>

          {/* Role Selection */}
          <div>
            <StepTitle>2. Select Role Level</StepTitle>
            <RoleGrid>
              {ROLES.map((role) => (
                <SelectableCard
                  key={role.id}
                  selected={selectedRole?.id === role.id}
                  onClick={() => setSelectedRole(role)}
                >
                  <CardTitle>{role.name}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </SelectableCard>
              ))}
            </RoleGrid>
          </div>

          {/* Starting Round Selection */}
          <div>
            <StepTitle>3. Select Starting Round</StepTitle>
            <RoundGrid>
              {STARTING_ROUNDS.map((round) => (
                <SelectableCard
                  key={round.id}
                  selected={selectedStartingRound?.id === round.id}
                  onClick={() => setSelectedStartingRound(round)}
                >
                  <CardTitle>{round.name}</CardTitle>
                  <CardDescription>{round.description}</CardDescription>
                </SelectableCard>
              ))}
            </RoundGrid>
          </div>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <div style={{ textAlign: 'center' }}>
            <ActionButton
              onClick={fetchInterviewInsights}
              disabled={!selectedCompany || !selectedRole || !selectedStartingRound || loading}
            >
              {loading ? 'Loading Insights...' : 'Get Interview Insights'}
            </ActionButton>
          </div>
        </SetupContainer>
      )}

      {step === 'insights' && insights && (
        <InsightsContainer>
          <InsightsHeader>
            <InsightsTitle>Interview Insights for {selectedCompany?.name} - {selectedRole?.name}</InsightsTitle>
            <InsightsSubtitle>
              Total Rounds: {insights.data.totalRounds} | Estimated Duration: {insights.data.estimatedDuration}
            </InsightsSubtitle>
          </InsightsHeader>
          
          <RoundsContainer>
            <StepTitle>Interview Rounds</StepTitle>
            {insights.data.rounds.map((round, index) => (
              <RoundCard key={index}>
                <RoundHeader>
                  <RoundName>{round.name}</RoundName>
                  <DifficultyBadge difficulty={round.difficulty}>
                    {round.difficulty}
                  </DifficultyBadge>
                </RoundHeader>
                <RoundDescription>{round.description}</RoundDescription>
                <RoundDetails>
                  <DetailItem>
                    <strong>Duration:</strong> {round.duration}
                  </DetailItem>
                  <DetailItem>
                    <strong>Focus Areas:</strong> {round.focusAreas.join(', ')}
                  </DetailItem>
                </RoundDetails>
                {round.sampleProblems.length > 0 && (
                  <SampleProblems>
                    <strong>Sample Problems:</strong>
                    <ul>
                      {round.sampleProblems.map((problem, pIndex) => (
                        <li key={pIndex}>{problem}</li>
                      ))}
                    </ul>
                  </SampleProblems>
                )}
                
                <div style={{ 
                  marginTop: '20px', 
                  paddingTop: '15px', 
                  borderTop: '1px solid #e0e0e0',
                  textAlign: 'center'
                }}>
                  <ActionButton
                    onClick={() => startMockInterview(round)}
                    style={{
                      padding: '10px 20px',
                      fontSize: '14px',
                      backgroundColor: '#e5231c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#c41e17';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#e5231c';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Start Mock Interview
                  </ActionButton>
                </div>
              </RoundCard>
            ))}
          </RoundsContainer>

          <ButtonGroup>
            <SecondaryButton onClick={resetSimulation}>
              Back to Setup
            </SecondaryButton>
            <ActionButton onClick={startSimulation}>
              Start Simulation
            </ActionButton>
          </ButtonGroup>
        </InsightsContainer>
      )}

      {/* Simulation Step */}
      {step === 'simulation' && interviewProgress.currentRound && (
        <SimulationContainer>
          {/* Progress Bar */}
          <ProgressContainer>
            <ProgressHeader>
              <ProgressText isBold>
                Round {currentRoundIndex + 1} of {interviewProgress.totalRounds}
              </ProgressText>
              <ProgressText>
                {Math.round(((currentRoundIndex + 1) / interviewProgress.totalRounds) * 100)}% Complete
              </ProgressText>
            </ProgressHeader>
            <ProgressBar>
              <ProgressFill percentage={((currentRoundIndex + 1) / interviewProgress.totalRounds) * 100} />
            </ProgressBar>
          </ProgressContainer>

          {/* Current Round */}
          <RoundContent>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px' 
            }}>
              <RoundTitle>{interviewProgress.currentRound.name}</RoundTitle>
              <DifficultyBadgeLarge difficulty={interviewProgress.currentRound.difficulty}>
                {interviewProgress.currentRound.difficulty}
              </DifficultyBadgeLarge>
            </div>

            <RoundDescriptionLarge>
              {interviewProgress.currentRound.description}
            </RoundDescriptionLarge>

            <RoundDetailsGrid>
              <DetailGrid>
                <strong>Duration:</strong>
                <p>{interviewProgress.currentRound.duration}</p>
              </DetailGrid>
              <DetailGrid>
                <strong>Focus Areas:</strong>
                <p>{interviewProgress.currentRound.focusAreas.join(', ')}</p>
              </DetailGrid>
            </RoundDetailsGrid>

            <CriteriaList>
              <strong>Evaluation Criteria:</strong>
              <ul>
                {interviewProgress.currentRound.evaluationCriteria.map((criteria, index) => (
                  <li key={index}>{criteria}</li>
                ))}
              </ul>
            </CriteriaList>

            {interviewProgress.currentRound.sampleProblems.length > 0 && (
              <ProblemsList>
                <strong>Sample Problems:</strong>
                <ul>
                  {interviewProgress.currentRound.sampleProblems.map((problem, index) => (
                    <li key={index}>{problem}</li>
                  ))}
                </ul>
              </ProblemsList>
            )}

            {interviewProgress.currentRound.tips.length > 0 && (
              <TipsList>
                <strong>Tips:</strong>
                <ul>
                  {interviewProgress.currentRound.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </TipsList>
            )}
          </RoundContent>

          {/* Action Buttons */}
          <ButtonGroup>
            <SecondaryButton onClick={resetSimulation}>
              End Simulation
            </SecondaryButton>
            <ActionButton onClick={nextRound}>
              {currentRoundIndex + 1 < interviewProgress.totalRounds ? 'Next Round' : 'Complete Interview'}
            </ActionButton>
          </ButtonGroup>
        </SimulationContainer>
      )}

      {/* Interview Completed */}
      {step === 'simulation' && !interviewProgress.currentRound && interviewProgress.totalRounds > 0 && (
        <CompletionContainer>
          <CompletionIcon>🎉</CompletionIcon>
          <CompletionTitle>Interview Simulation Complete!</CompletionTitle>
          <CompletionMessage>
            You've completed all {interviewProgress.totalRounds} rounds of the {selectedCompany?.name} {selectedRole?.name} interview simulation.
          </CompletionMessage>
          
          <ActionButton onClick={resetSimulation}>
            Start New Simulation
          </ActionButton>
        </CompletionContainer>
      )}

      {/* Mock Interview */}
      {step === 'mock-interview' && mockInterviewConfig && (
        <MockInterview
          companyName={selectedCompany?.name || ''}
          roleLevel={selectedRole?.name || ''}
          roundName={mockInterviewConfig.roundName}
          roundType={mockInterviewConfig.roundType}
          difficulty={mockInterviewConfig.difficulty}
          onComplete={handleMockInterviewComplete}
          onExit={handleMockInterviewExit}
        />
      )}
    </Container>
  );
}
