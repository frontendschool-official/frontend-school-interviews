import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useAuth } from "../../../hooks/useAuth";
import { useThemeContext } from "../../../hooks/useTheme";
import NavBar from "../../../components/NavBar";
import Layout, { PageContainer } from "../../../components/Layout";
import { InterviewRound, MockInterviewSession } from "../../../types/problem";
import { db } from "../../../services/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

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

const RoundsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 30px;
`;

const RoundCard = styled.div<{ isCompleted?: boolean; isActive?: boolean }>`
  background: ${({ theme, isCompleted, isActive }) => 
    isCompleted ? theme.success + '20' : 
    isActive ? theme.primary + '20' : theme.secondary};
  border: 2px solid ${({ theme, isCompleted, isActive }) => 
    isCompleted ? theme.success : 
    isActive ? theme.primary : theme.border};
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  cursor: ${({ isCompleted, isActive }) => isCompleted ? 'default' : 'pointer'};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: ${({ isCompleted }) => isCompleted ? 'none' : 'translateY(-4px)'};
    box-shadow: ${({ isCompleted, theme }) => 
      isCompleted ? 'none' : `0 8px 25px ${theme.border}40`};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ theme, isCompleted, isActive }) => 
      isCompleted ? theme.success : 
      isActive ? theme.primary : theme.border};
  }
`;

const RoundHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const RoundTitle = styled.h3`
  color: ${({ theme }) => theme.text};
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
`;

const RoundStatus = styled.span<{ status: 'pending' | 'active' | 'completed' }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${({ theme, status }) => 
    status === 'completed' ? theme.success + '20' :
    status === 'active' ? theme.primary + '20' : theme.border};
  color: ${({ theme, status }) => 
    status === 'completed' ? theme.success :
    status === 'active' ? theme.primary : theme.neutral};
  border: 1px solid ${({ theme, status }) => 
    status === 'completed' ? theme.success :
    status === 'active' ? theme.primary : theme.border};
`;

const RoundDescription = styled.p`
  color: ${({ theme }) => theme.neutral};
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const RoundDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

const DetailTag = styled.span`
  background: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const StartButton = styled.button<{ disabled?: boolean }>`
  background: ${({ theme, disabled }) => 
    disabled ? theme.border : theme.primary};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: ${({ theme, disabled }) => 
      disabled ? theme.border : theme.primary + 'dd'};
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(-2px)'};
  }

  &:disabled {
    opacity: 0.6;
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

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.border};
  border-radius: 4px;
  margin: 20px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: ${({ theme }) => theme.primary};
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
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

export default function InterviewSimulationDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { theme } = useThemeContext();
  
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const [sessions, setSessions] = useState<MockInterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && user) {
      fetchSimulationData();
    }
  }, [id, user]);

  const fetchSimulationData = async () => {
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

      // Fetch completed sessions for this simulation
      const sessionsQuery = query(
        collection(db, "mock_interview_sessions"),
        where("simulationId", "==", id),
        where("userId", "==", user.uid)
      );
      
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessionsData = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MockInterviewSession[];
      
      setSessions(sessionsData);
    } catch (err) {
      console.error("Error fetching simulation data:", err);
      setError("Failed to load simulation data");
    } finally {
      setLoading(false);
    }
  };

  const getRoundStatus = (roundIndex: number): 'pending' | 'active' | 'completed' => {
    if (!simulation) return 'pending';
    
    if (simulation.completedRounds.includes(roundIndex)) {
      return 'completed';
    }
    
    if (simulation.currentRound === roundIndex) {
      return 'active';
    }
    
    return 'pending';
  };

  const canStartRound = (roundIndex: number): boolean => {
    if (!simulation) return false;
    
    // Can start if it's the current round or if previous round is completed
    if (roundIndex === simulation.currentRound) return true;
    if (roundIndex > 0 && simulation.completedRounds.includes(roundIndex - 1)) return true;
    
    return false;
  };

  const startRound = (roundIndex: number) => {
    if (!canStartRound(roundIndex)) return;
    
    router.push(`/interview-simulation/${id}/${roundIndex}`);
  };

  const viewResult = () => {
    router.push(`/interview-simulation/${id}/result`);
  };

  const calculateProgress = (): number => {
    if (!simulation) return 0;
    return (simulation.completedRounds.length / simulation.rounds.length) * 100;
  };

  if (loading) {
    return (
      <Layout>
        <NavBar />
        <PageContainer>
          <LoadingContainer>
            Loading simulation...
          </LoadingContainer>
        </PageContainer>
      </Layout>
    );
  }

  if (error || !simulation) {
    return (
      <Layout>
        <NavBar />
        <PageContainer>
          <ErrorContainer>
            {error || "Simulation not found"}
          </ErrorContainer>
        </PageContainer>
      </Layout>
    );
  }

  const progress = calculateProgress();
  const isCompleted = simulation.status === 'completed';

  return (
    <Layout>
      <NavBar />
      <PageContainer>
        <Container>
          <Header>
            <Title>{simulation.companyName} Interview Simulation</Title>
            <Subtitle>
              {simulation.roleLevel} • {simulation.rounds.length} Rounds
            </Subtitle>
            
            <ProgressBar>
              <ProgressFill progress={progress} />
            </ProgressBar>
            
            <div style={{ fontSize: '0.9rem', color: theme.neutral }}>
              {simulation.completedRounds.length} of {simulation.rounds.length} rounds completed
            </div>
          </Header>

          <RoundsGrid>
            {simulation.rounds.map((round, index) => {
              const status = getRoundStatus(index);
              const canStart = canStartRound(index);
              const session = sessions.find(s => s.roundName === round.name);
              
              return (
                <RoundCard 
                  key={index}
                  isCompleted={status === 'completed'}
                  isActive={status === 'active'}
                >
                  <RoundHeader>
                    <RoundTitle>Round {index + 1}: {round.name}</RoundTitle>
                    <RoundStatus status={status}>
                      {status === 'completed' ? 'Completed' :
                       status === 'active' ? 'Active' : 'Pending'}
                    </RoundStatus>
                  </RoundHeader>

                  <RoundDescription>{round.description}</RoundDescription>

                  <RoundDetails>
                    <DetailTag>{round.duration}</DetailTag>
                    <DetailTag>{round.difficulty}</DetailTag>
                    {round.focusAreas.slice(0, 2).map((area, i) => (
                      <DetailTag key={i}>{area}</DetailTag>
                    ))}
                  </RoundDetails>

                  {status === 'completed' ? (
                    <StartButton disabled>
                      ✓ Round Completed
                    </StartButton>
                  ) : (
                    <StartButton 
                      onClick={() => startRound(index)}
                      disabled={!canStart}
                    >
                      {status === 'active' ? 'Continue Round' : 'Start Round'}
                    </StartButton>
                  )}
                </RoundCard>
              );
            })}
          </RoundsGrid>

          {isCompleted && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <StartButton onClick={viewResult}>
                View Final Results
              </StartButton>
            </div>
          )}
        </Container>
      </PageContainer>
    </Layout>
  );
} 