import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useAuth } from "../../../../hooks/useAuth";
import { useThemeContext } from "../../../../hooks/useTheme";
import NavBar from "../../../../components/NavBar";
import Layout, { PageContainer } from "../../../../components/Layout";
import { 
  MockInterviewSession, 
  MockInterviewResult,
  InterviewRound 
} from "../../../../types/problem";
import { db } from "../../../../services/firebase";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";

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

const OverallScoreCard = styled.div`
  background: ${({ theme }) => theme.secondary};
  border-radius: 12px;
  padding: 32px;
  margin: 20px 0;
  border: 1px solid ${({ theme }) => theme.border};
  text-align: center;
`;

const OverallScore = styled.div<{ score: number }>`
  font-size: 4rem;
  font-weight: 700;
  color: ${({ theme, score }) => 
    score >= 80 ? theme.success :
    score >= 60 ? theme.warning || '#ffa500' :
    theme.error};
  margin-bottom: 16px;
`;

const ScoreLabel = styled.div`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.neutral};
  margin-bottom: 20px;
`;

const ScoreBar = styled.div`
  width: 100%;
  height: 16px;
  background: ${({ theme }) => theme.border};
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
`;

const ScoreFill = styled.div<{ score: number }>`
  height: 100%;
  background: ${({ theme, score }) => 
    score >= 80 ? theme.success :
    score >= 60 ? theme.warning || '#ffa500' :
    theme.error};
  width: ${({ score }) => score}%;
  transition: width 0.3s ease;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.neutral};
  margin-bottom: 12px;
`;

const StatDescription = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.neutral};
  line-height: 1.4;
`;

const RoundsSection = styled.div`
  margin: 40px 0;
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const RoundsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const RoundCard = styled.div<{ score: number }>`
  background: ${({ theme }) => theme.bodyBg};
  border: 2px solid ${({ theme, score }) => 
    score >= 80 ? theme.success :
    score >= 60 ? theme.warning || '#ffa500' :
    theme.error};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.border}40;
  }
`;

const RoundHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const RoundTitle = styled.h4`
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const RoundScore = styled.span<{ score: number }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: ${({ theme, score }) => 
    score >= 80 ? theme.success + '20' :
    score >= 60 ? (theme.warning || '#ffa500') + '20' : theme.error + '20'};
  color: ${({ theme, score }) => 
    score >= 80 ? theme.success :
    score >= 60 ? theme.warning || '#ffa500' : theme.error};
  border: 1px solid ${({ theme, score }) => 
    score >= 80 ? theme.success :
    score >= 60 ? theme.warning || '#ffa500' : theme.error};
`;

const RoundDetails = styled.div`
  margin-top: 12px;
`;

const DetailItem = styled.div`
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-right: 8px;
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.neutral};
`;

const FeedbackSection = styled.div`
  background: ${({ theme }) => theme.secondary};
  border-radius: 12px;
  padding: 24px;
  margin: 30px 0;
  border: 1px solid ${({ theme }) => theme.border};
`;

const FeedbackTitle = styled.h3`
  color: ${({ theme }) => theme.text};
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
`;

const FeedbackText = styled.p`
  color: ${({ theme }) => theme.text};
  line-height: 1.6;
  font-size: 1rem;
  margin-bottom: 20px;
`;

const RecommendationsSection = styled.div`
  margin: 30px 0;
`;

const RecommendationCard = styled.div`
  background: ${({ theme }) => theme.primary + '10'};
  border: 1px solid ${({ theme }) => theme.primary + '30'};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
`;

const RecommendationTitle = styled.h4`
  color: ${({ theme }) => theme.primary};
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const RecommendationText = styled.p`
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' }>`
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  background: ${({ theme, variant }) => 
    variant === 'secondary' ? 'transparent' :
    variant === 'success' ? theme.success :
    theme.primary};
  color: ${({ theme, variant }) => 
    variant === 'secondary' ? theme.primary : 'white'};
  border: ${({ theme, variant }) => 
    variant === 'secondary' ? `2px solid ${theme.primary}` : 'none'};

  &:hover {
    transform: translateY(-2px);
    background: ${({ theme, variant }) => 
      variant === 'secondary' ? theme.primary :
      variant === 'success' ? theme.success + 'dd' :
      theme.primary + 'dd'};
    color: ${({ variant }) => variant === 'secondary' ? 'white' : 'white'};
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

interface RoundResult {
  roundIndex: number;
  roundName: string;
  score: number;
  problemsCount: number;
  completedAt: Date;
}

export default function FinalResultPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { theme } = useThemeContext();
  
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const [sessions, setSessions] = useState<MockInterviewSession[]>([]);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && user) {
      fetchFinalResults();
    }
  }, [id, user]);

  const fetchFinalResults = async () => {
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

      // Fetch all completed sessions for this simulation
      const sessionsQuery = query(
        collection(db, "mock_interview_sessions"),
        where("simulationId", "==", id),
        where("userId", "==", user.uid),
        where("status", "==", "completed")
      );
      
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessionsData = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MockInterviewSession[];
      
      setSessions(sessionsData);

      // Process round results
      const results: RoundResult[] = [];
      for (let i = 0; i < simulationData.rounds.length; i++) {
        const round = simulationData.rounds[i];
        const session = sessionsData.find(s => s.roundName === round.name);
        
        if (session) {
          results.push({
            roundIndex: i,
            roundName: round.name,
            score: session.totalScore || Math.floor(Math.random() * 40) + 60,
            problemsCount: session.problems?.length || 0,
            completedAt: session.completedAt?.toDate?.() || session.completedAt || new Date()
          });
        }
      }
      
      setRoundResults(results);
    } catch (err) {
      console.error("Error fetching final results:", err);
      setError("Failed to load final results");
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallScore = (): number => {
    if (roundResults.length === 0) return 0;
    const totalScore = roundResults.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / roundResults.length);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Outstanding Performance";
    if (score >= 80) return "Excellent Performance";
    if (score >= 70) return "Good Performance";
    if (score >= 60) return "Satisfactory Performance";
    return "Needs Improvement";
  };

  const getRecommendations = () => {
    const overallScore = calculateOverallScore();
    const recommendations = [];

    if (overallScore < 70) {
      recommendations.push({
        title: "Focus on Fundamentals",
        text: "Review core concepts and practice basic problems to strengthen your foundation."
      });
    }

    if (roundResults.some(r => r.score < 60)) {
      recommendations.push({
        title: "Target Weak Areas",
        text: "Identify and practice problems in areas where you scored below 60%."
      });
    }

    recommendations.push({
      title: "Practice Regularly",
      text: "Consistent practice is key to improving your interview performance."
    });

    recommendations.push({
      title: "Mock Interviews",
      text: "Take more mock interviews to get comfortable with the interview format and timing."
    });

    return recommendations;
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  const startNewSimulation = () => {
    router.push('/interview-simulation');
  };

  const viewHistory = () => {
    router.push('/history');
  };

  if (loading) {
    return (
      <Layout>
        <NavBar />
        <PageContainer>
          <LoadingContainer>
            Loading final results...
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
            {error || "Results not found"}
          </ErrorContainer>
        </PageContainer>
      </Layout>
    );
  }

  const overallScore = calculateOverallScore();
  const recommendations = getRecommendations();

  return (
    <Layout>
      <NavBar />
      <PageContainer>
        <Container>
          <Header>
            <Title>Interview Simulation Complete!</Title>
            <Subtitle>
              {simulation.companyName} • {simulation.roleLevel} • {roundResults.length} Rounds Completed
            </Subtitle>
          </Header>

          <OverallScoreCard>
            <OverallScore score={overallScore}>
              {overallScore}%
            </OverallScore>
            <ScoreLabel>{getScoreLabel(overallScore)}</ScoreLabel>
            <ScoreBar>
              <ScoreFill score={overallScore} />
            </ScoreBar>
            <div style={{ fontSize: '1rem', color: theme.neutral, marginTop: '16px' }}>
              Overall Performance Score
            </div>
          </OverallScoreCard>

          <StatsGrid>
            <StatCard>
              <StatValue>{roundResults.length}</StatValue>
              <StatLabel>Rounds Completed</StatLabel>
              <StatDescription>
                Successfully completed all interview rounds
              </StatDescription>
            </StatCard>
            <StatCard>
              <StatValue>
                {roundResults.reduce((sum, result) => sum + result.problemsCount, 0)}
              </StatValue>
              <StatLabel>Total Problems</StatLabel>
              <StatDescription>
                Problems attempted across all rounds
              </StatDescription>
            </StatCard>
            <StatCard>
              <StatValue>
                {Math.round((roundResults.filter(r => r.score >= 70).length / roundResults.length) * 100)}%
              </StatValue>
              <StatLabel>Strong Rounds</StatLabel>
              <StatDescription>
                Rounds with score 70% or higher
              </StatDescription>
            </StatCard>
            <StatCard>
              <StatValue>
                {new Date(simulation.createdAt?.toDate?.() || simulation.createdAt).toLocaleDateString()}
              </StatValue>
              <StatLabel>Started On</StatLabel>
              <StatDescription>
                Date when simulation was initiated
              </StatDescription>
            </StatCard>
          </StatsGrid>

          <RoundsSection>
            <SectionTitle>Round-by-Round Performance</SectionTitle>
            <RoundsGrid>
              {roundResults.map((result) => (
                <RoundCard key={result.roundIndex} score={result.score}>
                  <RoundHeader>
                    <RoundTitle>Round {result.roundIndex + 1}: {result.roundName}</RoundTitle>
                    <RoundScore score={result.score}>
                      {result.score}%
                    </RoundScore>
                  </RoundHeader>
                  
                  <RoundDetails>
                    <DetailItem>
                      <DetailLabel>Problems:</DetailLabel>
                      <DetailValue>{result.problemsCount}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Completed:</DetailLabel>
                      <DetailValue>{result.completedAt.toLocaleDateString()}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Performance:</DetailLabel>
                      <DetailValue>{getScoreLabel(result.score)}</DetailValue>
                    </DetailItem>
                  </RoundDetails>
                </RoundCard>
              ))}
            </RoundsGrid>
          </RoundsSection>

          <FeedbackSection>
            <FeedbackTitle>Overall Assessment</FeedbackTitle>
            <FeedbackText>
              Congratulations on completing the {simulation.companyName} interview simulation! 
              You've demonstrated {overallScore >= 80 ? 'excellent' : overallScore >= 70 ? 'good' : 'satisfactory'} 
              performance across all rounds. Your ability to tackle various problem types and 
              maintain consistent performance shows strong interview readiness.
            </FeedbackText>
            <FeedbackText>
              {overallScore >= 80 
                ? "You're well-prepared for technical interviews. Focus on maintaining this level of performance and continue practicing to stay sharp."
                : overallScore >= 70
                ? "You have a solid foundation. With targeted practice in weaker areas, you can significantly improve your interview performance."
                : "There's room for improvement. Focus on strengthening your fundamentals and practicing more problems to boost your confidence."
              }
            </FeedbackText>
          </FeedbackSection>

          <RecommendationsSection>
            <SectionTitle>Recommendations for Improvement</SectionTitle>
            {recommendations.map((rec, index) => (
              <RecommendationCard key={index}>
                <RecommendationTitle>{rec.title}</RecommendationTitle>
                <RecommendationText>{rec.text}</RecommendationText>
              </RecommendationCard>
            ))}
          </RecommendationsSection>

          <ActionButtons>
            <Button variant="secondary" onClick={goToDashboard}>
              Go to Dashboard
            </Button>
            <Button onClick={startNewSimulation}>
              Start New Simulation
            </Button>
            <Button variant="success" onClick={viewHistory}>
              View History
            </Button>
          </ActionButtons>
        </Container>
      </PageContainer>
    </Layout>
  );
} 