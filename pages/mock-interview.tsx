import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { FiClock, FiCheck, FiX, FiArrowRight, FiArrowLeft, FiAward, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../hooks/useTheme';
import NavBar from '../components/NavBar';
import DSAEditor from '../components/DSAEditor';
import CodeEditor from '../components/CodeEditor';
import SystemDesignCanvas from '../components/SystemDesignCanvas';
import TheoryEditor from '../components/TheoryEditor';
import {
  MockInterviewProblem,
  MockInterviewSubmission,
  MockInterviewEvaluation,
  MockInterviewResult
} from '../types/problem';
import {
  getMockInterviewSession,
  updateMockInterviewSession,
  saveMockInterviewSubmission,
  saveMockInterviewResult
} from '../services/firebase';
import {
  evaluateMockInterviewSubmission
} from '../services/geminiApi';
import {
  PageContainer,
  ContentContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  Card,
  Button,
  ButtonContainer,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ErrorMessage,
  ProgressContainer,
  ProgressHeader,
  ProgressText,
  ProgressBar,
  ProgressFill,
  TimerContainer,
  TimeWarning,
  DifficultyBadge,
  FlexContainer
} from '../styles/SharedUI';

// Additional styled components specific to this page
const ProblemContainer = styled.div`
  background: ${({ theme }) => theme.secondary};
  border-radius: 12px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.border}20;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  min-height: 600px;
`;

const ProblemHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bodyBg};
`;

const ProblemTitle = styled.h2`
  color: ${({ theme }) => theme.neutralDark};
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ProblemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: ${({ theme }) => theme.neutral};
  font-size: 0.9rem;
`;

const ProblemDescription = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.neutral};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const EditorContainer = styled.div`
  height: 600px;
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: ${({ theme }) => theme.secondary};
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export default function MockInterview() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { themeObject } = useThemeContext();
  
  const [session, setSession] = useState<any>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<MockInterviewProblem | null>(null);
  const [code, setCode] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [evaluations, setEvaluations] = useState<MockInterviewEvaluation[]>([]);
  const [overallFeedback, setOverallFeedback] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load session
  useEffect(() => {
    const loadSession = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Mock session for demo
        const mockSession = {
          id: 'mock-session-' + Date.now(),
          userId: user.uid,
          company: 'Amazon',
          role: 'SDE2',
          round: 'Round 1',
          interviewType: 'Machine Coding',
          problems: [
            {
              id: 'problem-1',
              type: 'machine_coding' as const,
              title: 'Todo List Component',
              description: 'Build a React todo list component with add, delete, and toggle functionality.',
              difficulty: 'medium' as const,
              estimatedTime: '45 minutes',
              requirements: ['Add new todos', 'Delete todos', 'Toggle completion status'],
              acceptanceCriteria: ['Component renders correctly', 'All CRUD operations work'],
              technologies: ['React', 'TypeScript']
            }
          ],
          startTime: null,
          status: 'Not Started',
          score: null,
          feedback: null
        };

        setSession(mockSession);
        setCurrentProblem(mockSession.problems[0]);
        setTimeRemaining(45 * 60);
      } catch (error) {
        console.error('Error loading session:', error);
        setError('Failed to load interview session');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [user]);

  // Timer effect
  useEffect(() => {
    if (session && session.status === 'In Progress' && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          if (newTime === 300) {
            setShowTimeWarning(true);
          }
          
          if (newTime <= 0) {
            handleAutoSubmit();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [session]);

  const startInterview = async () => {
    if (!session) return;

    try {
      const updatedSession = {
        ...session,
        startTime: new Date(),
        status: 'In Progress'
      };

      await updateMockInterviewSession(session.id, updatedSession);
      setSession(updatedSession);
    } catch (error) {
      console.error('Error starting interview:', error);
      setError('Failed to start interview');
    }
  };

  const handleAutoSubmit = async () => {
    if (!currentProblem) return;

    try {
      setEvaluating(true);
      
      const submission: MockInterviewSubmission = {
        problemId: currentProblem.id,
        type: currentProblem.type,
        code: code || 'No code submitted - time ran out',
        submittedAt: new Date() as any
      };

      await saveMockInterviewSubmission(submission);
      
      const evaluation = await evaluateMockInterviewSubmission(currentProblem, submission);
      setEvaluations(prev => [...prev, evaluation]);

      await completeInterview();
    } catch (error) {
      console.error('Error auto-submitting:', error);
    } finally {
      setEvaluating(false);
    }
  };

  const handleSubmit = async (submission: MockInterviewSubmission) => {
    if (!currentProblem) return;

    try {
      setEvaluating(true);
      
      await saveMockInterviewSubmission(submission);
      
      const evaluation = await evaluateMockInterviewSubmission(currentProblem, submission);
      setEvaluations(prev => [...prev, evaluation]);

      await completeInterview();
    } catch (error) {
      console.error('Error handling submission:', error);
    } finally {
      setEvaluating(false);
    }
  };

  const completeInterview = async () => {
    if (!session) return;

    try {
      const totalScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0);
      const averageScore = totalScore / evaluations.length;
      
      const overallFeedback = `You completed the ${session.round} interview with an average score of ${averageScore.toFixed(1)}/100.`;

      const result: MockInterviewResult = {
        sessionId: session.id,
        totalScore,
        averageScore,
        overallFeedback,
        problemEvaluations: evaluations,
        completedAt: new Date() as any
      };

      await saveMockInterviewResult(result);
      await updateMockInterviewSession(session.id, {
        status: 'Evaluated',
        score: totalScore,
        feedback: overallFeedback
      });

      setTotalScore(totalScore);
      setOverallFeedback(overallFeedback);
      setShowResults(true);
    } catch (error) {
      console.error('Error completing interview:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (authLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading your interview session...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ContentContainer>
          <PageHeader>
            <PageTitle>Mock Interview</PageTitle>
            <PageSubtitle>Error occurred</PageSubtitle>
          </PageHeader>
          <Card>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>{error}</p>
              <Button onClick={() => router.push('/mock-interview-setup')}>
                Start New Interview
              </Button>
            </div>
          </Card>
        </ContentContainer>
      </PageContainer>
    );
  }

  if (showResults) {
    return (
      <PageContainer>
        <ContentContainer>
          <PageHeader>
            <PageTitle>Interview Complete!</PageTitle>
            <PageSubtitle>{session?.company} - {session?.role} - {session?.round}</PageSubtitle>
          </PageHeader>
          <Card>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h2>Score: {Math.round(totalScore / evaluations.length)}/100</h2>
              <p>{overallFeedback}</p>
              <Button onClick={() => router.push('/mock-interview-setup')}>
                Start New Interview
              </Button>
            </div>
          </Card>
        </ContentContainer>
      </PageContainer>
    );
  }

  if (!session) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>No interview session found...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (session.status === 'Not Started') {
    return (
      <PageContainer>
        <ContentContainer>
          <PageHeader>
            <PageTitle>Ready to Start?</PageTitle>
            <PageSubtitle>{session.company} - {session.role} - {session.round}</PageSubtitle>
          </PageHeader>
          <Card>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>You're about to start a {session.interviewType} interview for {session.company}.</p>
              <Button variant="primary" onClick={startInterview}>
                Start Interview
              </Button>
            </div>
          </Card>
        </ContentContainer>
      </PageContainer>
    );
  }

  if (!currentProblem) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading problem...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <NavBar />
      <ContentContainer>
        <PageHeader>
          <PageTitle>Mock Interview - {session.round}</PageTitle>
          <PageSubtitle>{session.company} • {session.role} • {session.interviewType}</PageSubtitle>
        </PageHeader>

      {showTimeWarning && (
        <TimeWarning>
          <FiAlertCircle size={16} />
          5 minutes remaining! Please wrap up your solution.
        </TimeWarning>
      )}

      <TimerContainer>
        <FiClock size={20} />
        {formatTime(timeRemaining)}
      </TimerContainer>

      <ProgressContainer>
        <ProgressHeader>
          <ProgressText isBold>Problem {currentProblemIndex + 1} of {session.problems.length}</ProgressText>
        </ProgressHeader>
        <ProgressBar>
          <ProgressFill percentage={((currentProblemIndex + 1) / session.problems.length) * 100} />
        </ProgressBar>
      </ProgressContainer>

      <ProblemContainer>
        <ProblemHeader>
          <ProblemTitle>{currentProblem.title}</ProblemTitle>
          <ProblemMeta>
            <DifficultyBadge difficulty={currentProblem.difficulty}>
              {currentProblem.difficulty}
            </DifficultyBadge>
            <span>Estimated Time: {currentProblem.estimatedTime}</span>
            <span>Type: {currentProblem.type.replace('_', ' ').toUpperCase()}</span>
          </ProblemMeta>
        </ProblemHeader>

        <ProblemDescription>{currentProblem.description}</ProblemDescription>

        <EditorContainer>
          {currentProblem.type === 'machine_coding' && (
            <CodeEditor
              code={code}
              onChange={setCode}
              onSubmit={async (code) => {
                await handleSubmit({
                  problemId: currentProblem.id,
                  type: 'machine_coding',
                  code,
                  submittedAt: new Date() as any
                });
              }}
            />
          )}
        </EditorContainer>
      </ProblemContainer>

      <NavigationContainer>
        <Button onClick={() => router.push('/mock-interview-setup')}>
          <FiX size={16} />
          Exit Interview
        </Button>
        
        <Button 
          variant="primary"
          disabled={evaluating}
        >
          {evaluating ? 'Evaluating...' : 'Submit & Continue'}
          <FiArrowRight size={16} />
        </Button>
      </NavigationContainer>
    </ContentContainer>
  </PageContainer>
  );
} 