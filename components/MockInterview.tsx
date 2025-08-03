import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiPlay, FiCheck, FiX, FiArrowRight, FiArrowLeft, FiClock, FiAward } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../hooks/useTheme';
import DSAEditor from './DSAEditor';
import CodeEditor from './CodeEditor';
import SystemDesignCanvas from './SystemDesignCanvas';
import TheoryEditor from './TheoryEditor';
import {
  MockInterviewSession,
  MockInterviewProblem,
  MockInterviewSubmission,
  MockInterviewEvaluation,
  MockInterviewResult
} from '../types/problem';
import {
  createMockInterviewSession,
  updateMockInterviewSession,
  saveMockInterviewProblem,
  checkProblemExists,
  saveMockInterviewSubmission,
  saveMockInterviewResult
} from '../services/firebase';
import {
  generateMockInterviewProblem,
  evaluateMockInterviewSubmission
} from '../services/geminiApi';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: ${({ theme }) => theme.bodyBg};
  font-family: system-ui, -apple-system, sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: ${({ theme }) => theme.secondary};
  border-radius: 12px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.border}20;
  border: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.primary};
  margin-bottom: 10px;
  font-size: 2rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.neutral};
  font-size: 1rem;
  margin: 0;
`;

const ProgressContainer = styled.div`
  margin-bottom: 30px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ProgressText = styled.span<{ isBold?: boolean }>`
  color: ${({ theme, isBold }) => isBold ? theme.neutralDark : theme.neutral};
  font-weight: ${({ isBold }) => isBold ? '600' : '400'};
  font-size: 1.1rem;
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

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.neutral};
  font-size: 1rem;
`;

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

const NavigationButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ variant, theme }) => 
    variant === 'primary' ? theme.primary : theme.neutral};
  color: ${({ theme }) => theme.bodyBg};

  &:hover {
    background: ${({ variant, theme }) => 
      variant === 'primary' ? theme.accent : theme.neutralDark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.border};
  border-top: 4px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.neutral};
  font-size: 1.1rem;
  margin: 0;
`;

const ErrorContainer = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  text-align: center;
`;

const ErrorText = styled.p`
  color: #c33;
  margin: 0 0 15px 0;
  font-size: 1rem;
`;

const RetryButton = styled.button`
  background: #e5231c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #c41e17;
    transform: translateY(-1px);
  }
`;

const ResultsContainer = styled.div`
  background: ${({ theme }) => theme.secondary};
  border-radius: 12px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.border}20;
  border: 1px solid ${({ theme }) => theme.border};
  padding: 30px;
`;

const ResultsHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const ResultsTitle = styled.h2`
  color: ${({ theme }) => theme.neutralDark};
  margin-bottom: 10px;
  font-size: 1.8rem;
  font-weight: 600;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const ScoreBadge = styled.div<{ score: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${({ score }) => 
    score >= 80 ? '#d4edda' : 
    score >= 60 ? '#fff3cd' : '#f8d7da'};
  color: ${({ score }) => 
    score >= 80 ? '#155724' : 
    score >= 60 ? '#856404' : '#721c24'};
  border-radius: 25px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const EvaluationSection = styled.div`
  margin-bottom: 30px;
`;

const EvaluationTitle = styled.h3`
  color: ${({ theme }) => theme.neutralDark};
  margin-bottom: 15px;
  font-size: 1.3rem;
  font-weight: 600;
`;

const FeedbackText = styled.div`
  color: ${({ theme }) => theme.neutral};
  line-height: 1.6;
  white-space: pre-wrap;
  background: ${({ theme }) => theme.bodyBg};
  padding: 20px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const StrengthsList = styled.div`
  margin-top: 15px;
  
  strong {
    color: ${({ theme }) => theme.neutralDark};
    display: block;
    margin-bottom: 8px;
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
    color: ${({ theme }) => theme.neutral};
  }
  
  li {
    margin-bottom: 4px;
  }
`;

const SuggestionsList = styled.div`
  margin-top: 15px;
  
  strong {
    color: ${({ theme }) => theme.neutralDark};
    display: block;
    margin-bottom: 8px;
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
    color: ${({ theme }) => theme.neutral};
  }
  
  li {
    margin-bottom: 4px;
  }
`;

interface MockInterviewProps {
  companyName: string;
  roleLevel: string;
  roundName: string;
  roundType: 'dsa' | 'machine_coding' | 'system_design' | 'theory';
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete?: (result: MockInterviewResult) => void;
  onExit?: () => void;
}

export default function MockInterview({
  companyName,
  roleLevel,
  roundName,
  roundType,
  difficulty,
  onComplete,
  onExit
}: MockInterviewProps) {
  const { user } = useAuth();
  const { themeObject } = useThemeContext();
  const [session, setSession] = useState<MockInterviewSession | null>(null);
  const [currentProblem, setCurrentProblem] = useState<MockInterviewProblem | null>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [code, setCode] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [generatingProblem, setGeneratingProblem] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [evaluations, setEvaluations] = useState<MockInterviewEvaluation[]>([]);
  const [overallFeedback, setOverallFeedback] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (startTime && !showResults) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTime, showResults]);

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Create mock interview session
        const sessionData = {
          userId: user.uid,
          companyName: companyName,
          roleLevel: roleLevel,
          roundName: roundName,
          roundType: roundType,
          problems: [],
          currentProblemIndex: 0,
          status: 'active' as const,
          startedAt: new Date()
        };

        const newSession = await createMockInterviewSession(sessionData);
        setSession(newSession);
        setStartTime(new Date());

        // Generate first problem
        await generateNextProblem();
      } catch (error) {
        console.error('Error initializing mock interview session:', error);
        setError('Failed to initialize mock interview. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, [user, companyName, roleLevel, roundName, roundType]);

  const generateNextProblem = async () => {
    if (!session) return;

    try {
      setGeneratingProblem(true);

      // Generate problem using Gemini API
      const problem = await generateMockInterviewProblem(
        roundType,
        companyName,
        roleLevel,
        difficulty
      );

      // Check if problem already exists in database
      const exists = await checkProblemExists(problem.title, problem.type);
      
      if (!exists) {
        // Save new problem to database
        await saveMockInterviewProblem(problem);
      }

      // Update session with new problem
      const updatedProblems = [...session.problems, problem];
      const updatedSession = {
        ...session,
        problems: updatedProblems,
        currentProblemIndex: currentProblemIndex
      };

      await updateMockInterviewSession(session.id!, updatedSession);
      setSession(updatedSession);
      setCurrentProblem(problem);
    } catch (error) {
      console.error('Error generating problem:', error);
      setError('Failed to generate problem. Please try again.');
    } finally {
      setGeneratingProblem(false);
    }
  };

  const handleSubmit = async (submission: MockInterviewSubmission) => {
    if (!session || !currentProblem) return;

    try {
      // Save submission
      await saveMockInterviewSubmission(submission);

      // Evaluate submission
      setEvaluating(true);
      const evaluation = await evaluateMockInterviewSubmission(currentProblem, submission);
      setEvaluations(prev => [...prev, evaluation]);

      // Move to next problem or complete
      if (currentProblemIndex < 2) { // Generate 3 problems total
        setCurrentProblemIndex(prev => prev + 1);
        await generateNextProblem();
      } else {
        // Complete interview
        await completeInterview();
      }
    } catch (error) {
      console.error('Error handling submission:', error);
    } finally {
      setEvaluating(false);
    }
  };

  const completeInterview = async () => {
    if (!session) return;

    try {
      // Calculate total score and generate overall feedback
      const totalScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0);
      const averageScore = totalScore / evaluations.length;
      
      const overallFeedback = `You completed the ${roundName} round with an average score of ${averageScore.toFixed(1)}/100. 
      
Overall Performance:
- Total Score: ${totalScore}/300
- Average Score: ${averageScore.toFixed(1)}/100
- Problems Attempted: ${evaluations.length}/3

Keep practicing and reviewing the feedback to improve your skills!`;

      // Create result
      const result: MockInterviewResult = {
        sessionId: session.id!,
        totalScore,
        averageScore,
        overallFeedback,
        problemEvaluations: evaluations,
        completedAt: new Date() as any
      };

      // Save result
      await saveMockInterviewResult(result);

      // Update session status
      await updateMockInterviewSession(session.id!, {
        status: 'evaluated',
        completedAt: new Date() as any,
        totalScore,
        feedback: overallFeedback
      });

      setTotalScore(totalScore);
      setOverallFeedback(overallFeedback);
      setShowResults(true);

      // Call onComplete callback
      if (onComplete) {
        onComplete(result);
      }
    } catch (error) {
      console.error('Error completing interview:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Setting up your mock interview...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Mock Interview - {roundName}</Title>
          <Subtitle>
            {companyName} • {roleLevel} • {difficulty} difficulty
          </Subtitle>
        </Header>

        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <RetryButton onClick={() => {
            setError(null);
            setLoading(true);
            // Re-initialize session
            const initializeSession = async () => {
              if (!user) return;
              try {
                              const sessionData = {
                userId: user.uid,
                companyName: companyName,
                roleLevel: roleLevel,
                roundName: roundName,
                roundType: roundType,
                problems: [],
                currentProblemIndex: 0,
                status: 'active' as const,
                startedAt: new Date()
              };
              const newSession = await createMockInterviewSession(sessionData);
              setSession(newSession);
                setStartTime(new Date());
                await generateNextProblem();
              } catch (error) {
                console.error('Error re-initializing mock interview session:', error);
                setError('Failed to restart mock interview. Please try again.');
              } finally {
                setLoading(false);
              }
            };
            initializeSession();
          }}>
            Retry
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  if (showResults) {
    return (
      <Container>
        <Header>
          <Title>Mock Interview Complete!</Title>
          <Subtitle>
            {companyName} - {roleLevel} - {roundName}
          </Subtitle>
        </Header>

        <ResultsContainer>
          <ResultsHeader>
            <ResultsTitle>Your Results</ResultsTitle>
            <ScoreContainer>
              <ScoreBadge score={totalScore / 3}>
                <FiAward size={24} />
                {Math.round(totalScore / 3)}/100
              </ScoreBadge>
            </ScoreContainer>
          </ResultsHeader>

          <EvaluationSection>
            <EvaluationTitle>Overall Feedback</EvaluationTitle>
            <FeedbackText>{overallFeedback}</FeedbackText>
          </EvaluationSection>

          {evaluations.map((evaluation, index) => (
            <EvaluationSection key={index}>
              <EvaluationTitle>Problem {index + 1} Evaluation</EvaluationTitle>
              <FeedbackText>{evaluation.feedback}</FeedbackText>
              
              {evaluation.strengths && evaluation.strengths.length > 0 && (
                <StrengthsList>
                  <strong>Strengths:</strong>
                  <ul>
                    {evaluation.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </StrengthsList>
              )}

              {evaluation.suggestions && evaluation.suggestions.length > 0 && (
                <SuggestionsList>
                  <strong>Suggestions for Improvement:</strong>
                  <ul>
                    {evaluation.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </SuggestionsList>
              )}
            </EvaluationSection>
          ))}

          <NavigationContainer>
            <NavigationButton onClick={onExit}>
              <FiX size={16} />
              Exit Interview
            </NavigationButton>
          </NavigationContainer>
        </ResultsContainer>
      </Container>
    );
  }

  if (!currentProblem) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>
            {generatingProblem ? 'Generating your problem...' : 'Loading problem...'}
          </LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Mock Interview - {roundName}</Title>
        <Subtitle>
          {companyName} • {roleLevel} • {difficulty} difficulty
        </Subtitle>
      </Header>

      <ProgressContainer>
        <ProgressHeader>
          <ProgressText isBold>
            Problem {currentProblemIndex + 1} of 3
          </ProgressText>
          <TimerContainer>
            <FiClock size={16} />
            {formatTime(elapsedTime)}
          </TimerContainer>
        </ProgressHeader>
        <ProgressBar>
          <ProgressFill percentage={((currentProblemIndex + 1) / 3) * 100} />
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
            <span>Type: {roundType.replace('_', ' ').toUpperCase()}</span>
          </ProblemMeta>
        </ProblemHeader>

        <ProblemDescription>{currentProblem.description}</ProblemDescription>

        <EditorContainer>
          {roundType === 'dsa' && (
            <DSAEditor
              code={code}
              onChange={setCode}
              problemId={currentProblem.id}
              testCases={currentProblem.examples?.map((example, index) => ({
                id: (index + 1).toString(),
                input: example.input,
                expectedOutput: example.output,
                status: undefined
              })) || []}
              onSubmit={async (code) => {
                await handleSubmit({
                  problemId: currentProblem.id,
                  type: 'dsa',
                  code,
                  submittedAt: new Date() as any
                });
                return { success: true, message: 'Submitted successfully' };
              }}
            />
          )}

          {roundType === 'machine_coding' && (
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

          {roundType === 'system_design' && (
            <SystemDesignCanvas
              onSubmit={async (code, drawingImage) => {
                await handleSubmit({
                  problemId: currentProblem.id,
                  type: 'system_design',
                  code,
                  drawingImage,
                  submittedAt: new Date() as any
                });
              }}
            />
          )}

          {roundType === 'theory' && (
            <TheoryEditor
              problem={currentProblem}
              answer={answer}
              onChange={setAnswer}
              onEvaluate={async (submission) => {
                await handleSubmit(submission);
              }}
              isEvaluating={evaluating}
            />
          )}
        </EditorContainer>
      </ProblemContainer>

      <NavigationContainer>
        <NavigationButton onClick={onExit}>
          <FiX size={16} />
          Exit Interview
        </NavigationButton>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <NavigationButton disabled={currentProblemIndex === 0}>
            <FiArrowLeft size={16} />
            Previous
          </NavigationButton>
          
          <NavigationButton 
            variant="primary"
            disabled={evaluating || generatingProblem}
            onClick={() => {
              // This will be handled by the individual editors
            }}
          >
            {evaluating ? 'Evaluating...' : generatingProblem ? 'Generating...' : 'Submit & Continue'}
            <FiArrowRight size={16} />
          </NavigationButton>
        </div>
      </NavigationContainer>
    </Container>
  );
} 