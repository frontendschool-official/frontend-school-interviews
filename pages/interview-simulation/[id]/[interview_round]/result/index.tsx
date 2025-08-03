import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useAuth } from "../../../../../hooks/useAuth";
import { useThemeContext } from "../../../../../hooks/useTheme";
import NavBar from "../../../../../components/NavBar";
import Layout, { PageContainer } from "../../../../../components/Layout";
import { 
  MockInterviewSession, 
  MockInterviewResult,
  MockInterviewEvaluation 
} from "../../../../../types/problem";
import { db } from "../../../../../services/firebase";
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

const ScoreCard = styled.div`
  background: ${({ theme }) => theme.secondary};
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
  border: 1px solid ${({ theme }) => theme.border};
  text-align: center;
`;

const ScoreValue = styled.div<{ score: number }>`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme, score }) => 
    score >= 80 ? theme.success :
    score >= 60 ? theme.warning || '#ffa500' :
    theme.error};
  margin-bottom: 8px;
`;

const ScoreLabel = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.neutral};
  margin-bottom: 16px;
`;

const ScoreBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${({ theme }) => theme.border};
  border-radius: 6px;
  overflow: hidden;
  margin: 16px 0;
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

const FeedbackSection = styled.div`
  background: ${({ theme }) => theme.secondary};
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
  border: 1px solid ${({ theme }) => theme.border};
`;

const SectionTitle = styled.h3`
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

const ProblemResults = styled.div`
  margin-top: 30px;
`;

const ProblemCard = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
`;

const ProblemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ProblemTitle = styled.h4`
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const ProblemScore = styled.span<{ score: number }>`
  padding: 4px 12px;
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

const ProblemFeedback = styled.div`
  margin-top: 12px;
`;

const FeedbackItem = styled.div`
  margin-bottom: 8px;
`;

const FeedbackLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-right: 8px;
`;

const FeedbackValue = styled.span`
  color: ${({ theme }) => theme.neutral};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' }>`
  padding: 12px 24px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 20px 0;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.neutral};
`;

export default function RoundResultPage() {
  const router = useRouter();
  const { id, interview_round } = router.query;
  const { user } = useAuth();
  const { theme } = useThemeContext();
  
  const [session, setSession] = useState<MockInterviewSession | null>(null);
  const [result, setResult] = useState<MockInterviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const roundIndex = parseInt(interview_round as string);

  useEffect(() => {
    if (id && interview_round && user) {
      fetchRoundResult();
    }
  }, [id, interview_round, user]);

  const fetchRoundResult = async () => {
    try {
      setLoading(true);
      
      // Fetch session data
      const sessionsQuery = query(
        collection(db, "mock_interview_sessions"),
        where("simulationId", "==", id),
        where("userId", "==", user.uid),
        where("status", "==", "completed")
      );
      
      const sessionsSnapshot = await getDocs(sessionsQuery);
      
      if (sessionsSnapshot.empty) {
        setError("No completed session found for this round");
        return;
      }

      // Find the session for this specific round
      const sessionDoc = sessionsSnapshot.docs.find(doc => {
        const data = doc.data();
        return data.roundName && data.roundName.includes(`Round ${roundIndex + 1}`);
      });

      if (!sessionDoc) {
        setError("Session not found for this round");
        return;
      }

      const sessionData = {
        id: sessionDoc.id,
        ...sessionDoc.data()
      } as MockInterviewSession;
      
      setSession(sessionData);

      // Fetch result data
      const resultsQuery = query(
        collection(db, "mock_interview_results"),
        where("sessionId", "==", sessionDoc.id)
      );
      
      const resultsSnapshot = await getDocs(resultsQuery);
      
      if (!resultsSnapshot.empty) {
        const resultData = {
          id: resultsSnapshot.docs[0].id,
          ...resultsSnapshot.docs[0].data()
        } as MockInterviewResult;
        
        setResult(resultData);
      } else {
        // Generate mock result if not found
        const mockResult: MockInterviewResult = {
          sessionId: sessionDoc.id,
          totalScore: sessionData.totalScore || 75,
          averageScore: sessionData.totalScore || 75,
          overallFeedback: sessionData.feedback || "Good performance overall. Keep practicing to improve your skills.",
          problemEvaluations: sessionData.problems?.map((problem, index) => ({
            problemId: problem.id,
            score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
            feedback: `Good attempt on ${problem.title}. Focus on improving your approach.`,
            strengths: ["Good problem understanding", "Clear communication"],
            areasForImprovement: ["Optimization", "Edge case handling"],
            suggestions: ["Practice similar problems", "Review time complexity"]
          })) || [],
          completedAt: sessionData.completedAt || new Date()
        };
        
        setResult(mockResult);
      }
    } catch (err) {
      console.error("Error fetching round result:", err);
      setError("Failed to load round result");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.success;
    if (score >= 60) return theme.warning || '#ffa500';
    return theme.error;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Satisfactory";
    return "Needs Improvement";
  };

  const goBackToSimulation = () => {
    router.push(`/interview-simulation/${id}`);
  };

  const goToNextRound = () => {
    router.push(`/interview-simulation/${id}/${roundIndex + 1}`);
  };

  const viewFinalResults = () => {
    router.push(`/interview-simulation/${id}/result`);
  };

  if (loading) {
    return (
      <Layout>
        <NavBar />
        <PageContainer>
          <LoadingContainer>
            Loading round results...
          </LoadingContainer>
        </PageContainer>
      </Layout>
    );
  }

  if (error || !session || !result) {
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

  return (
    <Layout>
      <NavBar />
      <PageContainer>
        <Container>
          <Header>
            <Title>Round {roundIndex + 1} Results</Title>
            <Subtitle>
              {session.companyName} • {session.roleLevel} • {session.roundName}
            </Subtitle>
          </Header>

          <ScoreCard>
            <ScoreValue score={result.totalScore}>
              {result.totalScore}%
            </ScoreValue>
            <ScoreLabel>{getScoreLabel(result.totalScore)}</ScoreLabel>
            <ScoreBar>
              <ScoreFill score={result.totalScore} />
            </ScoreBar>
            <div style={{ fontSize: '0.9rem', color: theme.neutral }}>
              Average Score: {result.averageScore}%
            </div>
          </ScoreCard>

          <StatsGrid>
            <StatCard>
              <StatValue>{session.problems?.length || 0}</StatValue>
              <StatLabel>Problems Attempted</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{result.problemEvaluations.length}</StatValue>
              <StatLabel>Problems Evaluated</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>
                {Math.round((result.problemEvaluations.filter(eval => eval.score >= 70).length / result.problemEvaluations.length) * 100)}%
              </StatValue>
              <StatLabel>Problems Above 70%</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>
                {new Date(session.completedAt?.toDate?.() || session.completedAt).toLocaleDateString()}
              </StatValue>
              <StatLabel>Completed On</StatLabel>
            </StatCard>
          </StatsGrid>

          <FeedbackSection>
            <SectionTitle>Overall Feedback</SectionTitle>
            <FeedbackText>{result.overallFeedback}</FeedbackText>
          </FeedbackSection>

          <ProblemResults>
            <SectionTitle>Problem-by-Problem Analysis</SectionTitle>
            {result.problemEvaluations.map((evaluation, index) => {
              const problem = session.problems?.[index];
              return (
                <ProblemCard key={evaluation.problemId}>
                  <ProblemHeader>
                    <ProblemTitle>
                      Problem {index + 1}: {problem?.title || `Problem ${index + 1}`}
                    </ProblemTitle>
                    <ProblemScore score={evaluation.score}>
                      {evaluation.score}%
                    </ProblemScore>
                  </ProblemHeader>
                  
                  <ProblemFeedback>
                    <FeedbackItem>
                      <FeedbackLabel>Feedback:</FeedbackLabel>
                      <FeedbackValue>{evaluation.feedback}</FeedbackValue>
                    </FeedbackItem>
                    
                    <FeedbackItem>
                      <FeedbackLabel>Strengths:</FeedbackLabel>
                      <FeedbackValue>{evaluation.strengths.join(', ')}</FeedbackValue>
                    </FeedbackItem>
                    
                    <FeedbackItem>
                      <FeedbackLabel>Areas for Improvement:</FeedbackLabel>
                      <FeedbackValue>{evaluation.areasForImprovement.join(', ')}</FeedbackValue>
                    </FeedbackItem>
                    
                    <FeedbackItem>
                      <FeedbackLabel>Suggestions:</FeedbackLabel>
                      <FeedbackValue>{evaluation.suggestions.join(', ')}</FeedbackValue>
                    </FeedbackItem>
                  </ProblemFeedback>
                </ProblemCard>
              );
            })}
          </ProblemResults>

          <ActionButtons>
            <Button variant="secondary" onClick={goBackToSimulation}>
              Back to Simulation
            </Button>
            
            {roundIndex < 3 && ( // Assuming max 4 rounds (0-3)
              <Button onClick={goToNextRound}>
                Next Round
              </Button>
            )}
            
            <Button variant="success" onClick={viewFinalResults}>
              View Final Results
            </Button>
          </ActionButtons>
        </Container>
      </PageContainer>
    </Layout>
  );
} 