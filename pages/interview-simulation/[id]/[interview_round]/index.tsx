import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useAuth } from "../../../../hooks/useAuth";
import { useThemeContext } from "../../../../hooks/useTheme";
import NavBar from "../../../../components/NavBar";
import Layout, { PageContainer } from "../../../../components/Layout";
import MockInterview from "../../../../components/MockInterview";
import { 
  InterviewRound, 
  MockInterviewSession, 
  MockInterviewProblem,
  MockInterviewResult 
} from "../../../../types/problem";
import { db } from "../../../../services/firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc 
} from "firebase/firestore";
import { generateMockInterviewProblem } from "../../../../services/geminiApi";

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
  margin-bottom: 0;
`;

const RoundInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding: 16px;
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const InfoItem = styled.div`
  text-align: center;
`;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.neutral};
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const StartButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 20px 0;

  &:hover {
    background: ${({ theme }) => theme.primary + 'dd'};
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.neutral};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.error};
  font-size: 1.1rem;
`;

const BackButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.primary};
  border: 2px solid ${({ theme }) => theme.primary};
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const CompleteButton = styled.button`
  background: ${({ theme }) => theme.success};
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 20px 0;

  &:hover {
    background: ${({ theme }) => theme.success + 'dd'};
    transform: translateY(-2px);
  }
`;

interface SimulationData {
  id: string;
  userId: string;
  companyName: string;
  roleLevel: string;
  rounds: InterviewRound[];
  currentRound: number;
  completedRounds: number[];
  status: 'active' | 'completed';
  createdAt: any;
}

export default function InterviewRoundPage() {
  const router = useRouter();
  const { id, interview_round } = router.query;
  const { user } = useAuth();
  const { theme } = useThemeContext();
  
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const [currentRound, setCurrentRound] = useState<InterviewRound | null>(null);
  const [session, setSession] = useState<MockInterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [showInterview, setShowInterview] = useState(false);

  const roundIndex = parseInt(interview_round as string);

  useEffect(() => {
    if (id && interview_round && user) {
      fetchRoundData();
    }
  }, [id, interview_round, user]);

  const fetchRoundData = async () => {
    try {
      setLoading(true);
      
      // Fetch simulation data
      const simulationDoc = await getDoc(doc(db, "interview_simulations", id as string));
      
      if (!simulationDoc.exists()) {
        setError("Simulation not found");
        return;
      }

      const simulationData = simulationDoc.data() as SimulationData;
      setSimulation(simulationData);

      // Get current round
      if (roundIndex >= 0 && roundIndex < simulationData.rounds.length) {
        setCurrentRound(simulationData.rounds[roundIndex]);
      } else {
        setError("Invalid round number");
        return;
      }

      // Check if session already exists
      const sessionsQuery = query(
        collection(db, "mock_interview_sessions"),
        where("simulationId", "==", id),
        where("userId", "==", user.uid),
        where("roundName", "==", simulationData.rounds[roundIndex].name)
      );
      
      const sessionsSnapshot = await getDocs(sessionsQuery);
      
      if (!sessionsSnapshot.empty) {
        const sessionData = {
          id: sessionsSnapshot.docs[0].id,
          ...sessionsSnapshot.docs[0].data()
        } as MockInterviewSession;
        
        setSession(sessionData);
        
        // If session is active, show interview
        if (sessionData.status === 'active') {
          setShowInterview(true);
        }
      }
    } catch (err) {
      console.error("Error fetching round data:", err);
      setError("Failed to load round data");
    } finally {
      setLoading(false);
    }
  };

  const startRound = async () => {
    if (!simulation || !currentRound || !user) return;
    
    try {
      setIsStarting(true);
      
      // Generate problems for this round
      const problems: MockInterviewProblem[] = [];
      const roundDuration = parseInt(currentRound.duration.split('-')[1].split(' ')[0]);
      const problemsCount = Math.max(1, Math.floor(roundDuration / 15)); // 15 minutes per problem
      
      for (let i = 0; i < problemsCount; i++) {
        try {
          const problem = await generateMockInterviewProblem(
            determineRoundType(currentRound),
            simulation.companyName,
            simulation.roleLevel,
            currentRound.difficulty
          );
          
          problems.push({
            id: `${currentRound.name}_${i + 1}_${Date.now()}`,
            type: determineRoundType(currentRound),
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            estimatedTime: problem.estimatedTime,
            ...problem
          });
        } catch (error) {
          console.error(`Error generating problem ${i + 1}:`, error);
          // Add fallback problem
          problems.push(generateFallbackProblem(currentRound, i + 1));
        }
      }
      
      // Create session
      const sessionData: MockInterviewSession = {
        userId: user.uid,
        simulationId: id as string,
        companyName: simulation.companyName,
        roleLevel: simulation.roleLevel,
        roundName: currentRound.name,
        roundType: determineRoundType(currentRound),
        problems,
        currentProblemIndex: 0,
        status: 'active',
        startedAt: new Date()
      };
      
      const sessionRef = await addDoc(collection(db, "mock_interview_sessions"), sessionData);
      sessionData.id = sessionRef.id;
      
      setSession(sessionData);
      setShowInterview(true);
      
    } catch (err) {
      console.error("Error starting round:", err);
      setError("Failed to start round");
    } finally {
      setIsStarting(false);
    }
  };

  const handleInterviewComplete = async (result: MockInterviewResult) => {
    if (!session || !simulation) return;
    
    try {
      // Update session status
      await updateDoc(doc(db, "mock_interview_sessions", session.id), {
        status: 'completed',
        completedAt: new Date(),
        totalScore: result.totalScore,
        feedback: result.overallFeedback
      });
      
      // Update simulation progress
      const newCompletedRounds = [...simulation.completedRounds, roundIndex];
      const newCurrentRound = roundIndex + 1;
      const newStatus = newCurrentRound >= simulation.rounds.length ? 'completed' : 'active';
      
      await updateDoc(doc(db, "interview_simulations", id as string), {
        completedRounds: newCompletedRounds,
        currentRound: newCurrentRound,
        status: newStatus
      });
      
      // Navigate to result page
      router.push(`/interview-simulation/${id}/${roundIndex}/result`);
      
    } catch (err) {
      console.error("Error completing round:", err);
      setError("Failed to complete round");
    }
  };

  const handleInterviewExit = () => {
    setShowInterview(false);
  };

  const goBack = () => {
    router.push(`/interview-simulation/${id}`);
  };

  const determineRoundType = (round: InterviewRound): 'dsa' | 'machine_coding' | 'system_design' | 'theory' => {
    const name = round.name.toLowerCase();
    const focusAreas = round.focusAreas.map(area => area.toLowerCase());
    
    if (name.includes('coding') || name.includes('programming') || focusAreas.some(area => 
      area.includes('react') || area.includes('javascript') || area.includes('typescript'))) {
      return 'machine_coding';
    }
    
    if (name.includes('system') || name.includes('design') || name.includes('architecture')) {
      return 'system_design';
    }
    
    if (name.includes('dsa') || name.includes('algorithm') || name.includes('data structure')) {
      return 'dsa';
    }
    
    return 'theory';
  };

  const generateFallbackProblem = (round: InterviewRound, problemNumber: number): MockInterviewProblem => {
    const type = determineRoundType(round);
    
    return {
      id: `${round.name}_${problemNumber}_fallback`,
      type,
      title: `Fallback Problem ${problemNumber}`,
      description: `This is a fallback problem for ${round.name}. Please try again later.`,
      difficulty: round.difficulty,
      estimatedTime: '15 minutes',
      problemStatement: 'Implement a basic solution.',
      requirements: ['Create a working solution'],
      acceptanceCriteria: ['Code compiles and runs']
    };
  };

  if (loading) {
    return (
      <Layout>
        <NavBar />
        <PageContainer>
          <LoadingContainer>
            Loading round...
          </LoadingContainer>
        </PageContainer>
      </Layout>
    );
  }

  if (error || !simulation || !currentRound) {
    return (
      <Layout>
        <NavBar />
        <PageContainer>
          <ErrorContainer>
            {error || "Round not found"}
          </ErrorContainer>
        </PageContainer>
      </Layout>
    );
  }

  if (showInterview && session) {
    return (
      <MockInterview
        session={session}
        onComplete={handleInterviewComplete}
        onExit={handleInterviewExit}
      />
    );
  }

  return (
    <Layout>
      <NavBar />
      <PageContainer>
        <Container>
          <BackButton onClick={goBack}>
            ← Back to Simulation
          </BackButton>

          <Header>
            <Title>Round {roundIndex + 1}: {currentRound.name}</Title>
            <Subtitle>
              {simulation.companyName} • {simulation.roleLevel}
            </Subtitle>
          </Header>

          <RoundInfo>
            <InfoItem>
              <InfoLabel>Duration</InfoLabel>
              <InfoValue>{currentRound.duration}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Difficulty</InfoLabel>
              <InfoValue>{currentRound.difficulty}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Focus Areas</InfoLabel>
              <InfoValue>{currentRound.focusAreas.slice(0, 2).join(', ')}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Problems</InfoLabel>
              <InfoValue>{Math.max(1, Math.floor(parseInt(currentRound.duration.split('-')[1].split(' ')[0]) / 15))}</InfoValue>
            </InfoItem>
          </RoundInfo>

          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <p style={{ color: theme.neutral, marginBottom: '20px', lineHeight: '1.6' }}>
              {currentRound.description}
            </p>
            
            {session?.status === 'completed' ? (
              <CompleteButton onClick={() => router.push(`/interview-simulation/${id}/${roundIndex}/result`)}>
                View Round Results
              </CompleteButton>
            ) : (
              <StartButton onClick={startRound} disabled={isStarting}>
                {isStarting ? 'Starting Round...' : 'Start Round'}
              </StartButton>
            )}
          </div>

          <div style={{ marginTop: '40px' }}>
            <h3 style={{ color: theme.text, marginBottom: '16px' }}>Evaluation Criteria</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              {currentRound.evaluationCriteria.map((criteria, index) => (
                <div key={index} style={{ 
                  padding: '12px', 
                  background: theme.secondary, 
                  borderRadius: '6px',
                  border: `1px solid ${theme.border}`
                }}>
                  <span style={{ color: theme.text, fontSize: '0.9rem' }}>{criteria}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '40px' }}>
            <h3 style={{ color: theme.text, marginBottom: '16px' }}>Tips for Success</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              {currentRound.tips.map((tip, index) => (
                <div key={index} style={{ 
                  padding: '12px', 
                  background: theme.primary + '10', 
                  borderRadius: '6px',
                  border: `1px solid ${theme.primary + '30'}`
                }}>
                  <span style={{ color: theme.text, fontSize: '0.9rem' }}>💡 {tip}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </PageContainer>
    </Layout>
  );
} 