import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../hooks/useTheme';
import NavBar from '../components/NavBar';
import MockInterview from '../components/MockInterview';
import { MockInterviewResult } from '../types/problem';

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const InterviewCard = styled.div`
  padding: 25px;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.bodyBg};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.border}30;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.neutralDark};
  font-weight: 600;
  font-size: 1.3rem;
`;

const CardDescription = styled.p`
  margin: 0 0 15px 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.neutral};
  line-height: 1.5;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
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

const TypeBadge = styled.span`
  padding: 4px 12px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.accent};
    transform: translateY(-1px);
  }
`;

const ResultsContainer = styled.div`
  background: ${({ theme }) => theme.secondary};
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.border}20;
  border: 1px solid ${({ theme }) => theme.border};
  margin-top: 30px;
`;

const ResultsTitle = styled.h3`
  color: ${({ theme }) => theme.neutralDark};
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ResultItem = styled.div`
  margin-bottom: 15px;
  padding: 15px;
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ResultText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.neutral};
  line-height: 1.5;
`;

interface InterviewConfig {
  companyName: string;
  roleLevel: string;
  roundName: string;
  roundType: 'dsa' | 'machine_coding' | 'system_design' | 'theory';
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
}

const INTERVIEW_CONFIGS: InterviewConfig[] = [
  {
    companyName: 'Google',
    roleLevel: 'SDE2',
    roundName: 'DSA Round',
    roundType: 'dsa',
    difficulty: 'medium',
    description: 'Practice data structures and algorithms problems commonly asked at Google interviews.'
  },
  {
    companyName: 'Meta',
    roleLevel: 'SDE1',
    roundName: 'Machine Coding',
    roundType: 'machine_coding',
    difficulty: 'medium',
    description: 'Build React components and implement frontend features under time pressure.'
  },
  {
    companyName: 'Amazon',
    roleLevel: 'SDE3',
    roundName: 'System Design',
    roundType: 'system_design',
    difficulty: 'hard',
    description: 'Design scalable frontend architectures and component systems.'
  },
  {
    companyName: 'Microsoft',
    roleLevel: 'SDE2',
    roundName: 'Theory Round',
    roundType: 'theory',
    difficulty: 'medium',
    description: 'Answer questions about JavaScript, React, and frontend development concepts.'
  }
];

export default function MockInterviewDemo() {
  const { user, loading: authLoading } = useAuth();
  const { themeObject } = useThemeContext();
  const [selectedInterview, setSelectedInterview] = useState<InterviewConfig | null>(null);
  const [completedInterviews, setCompletedInterviews] = useState<MockInterviewResult[]>([]);

  const handleStartInterview = (config: InterviewConfig) => {
    setSelectedInterview(config);
  };

  const handleInterviewComplete = (result: MockInterviewResult) => {
    setCompletedInterviews(prev => [...prev, result]);
    setSelectedInterview(null);
  };

  const handleInterviewExit = () => {
    setSelectedInterview(null);
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Container>
        <Header>
          <Title>Mock Interview Demo</Title>
          <Subtitle>Please log in to access mock interviews</Subtitle>
        </Header>
      </Container>
    );
  }

  if (selectedInterview) {
    return (
      <MockInterview
        companyName={selectedInterview.companyName}
        roleLevel={selectedInterview.roleLevel}
        roundName={selectedInterview.roundName}
        roundType={selectedInterview.roundType}
        difficulty={selectedInterview.difficulty}
        onComplete={handleInterviewComplete}
        onExit={handleInterviewExit}
      />
    );
  }

  return (
    <Container>
      <NavBar />
      <Header>
        <Title>Mock Interview Demo</Title>
        <Subtitle>Practice different types of frontend interview rounds</Subtitle>
      </Header>

      <SetupContainer>
        <SectionTitle>Choose Your Mock Interview</SectionTitle>
        
        <Grid>
          {INTERVIEW_CONFIGS.map((config, index) => (
            <InterviewCard key={index} onClick={() => handleStartInterview(config)}>
              <CardTitle>{config.roundName}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
              
              <CardMeta>
                <DifficultyBadge difficulty={config.difficulty}>
                  {config.difficulty}
                </DifficultyBadge>
                <TypeBadge>{config.roundType.replace('_', ' ').toUpperCase()}</TypeBadge>
              </CardMeta>
              
              <div style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#666' }}>
                <strong>{config.companyName}</strong> • {config.roleLevel}
              </div>
              
              <ActionButton>
                Start Interview
              </ActionButton>
            </InterviewCard>
          ))}
        </Grid>
      </SetupContainer>

      {completedInterviews.length > 0 && (
        <ResultsContainer>
          <ResultsTitle>Completed Interviews</ResultsTitle>
          {completedInterviews.map((result, index) => (
            <ResultItem key={index}>
              <ResultText>
                <strong>Interview {index + 1}:</strong> Score: {Math.round(result.averageScore)}/100 
                (Total: {result.totalScore}/300)
              </ResultText>
            </ResultItem>
          ))}
        </ResultsContainer>
      )}
    </Container>
  );
} 