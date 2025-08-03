import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiClock, FiCheck, FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useThemeContext } from '../hooks/useTheme';
import DSAEditor from './DSAEditor';
import CodeEditor from './CodeEditor';
import SystemDesignCanvas from './SystemDesignCanvas';
import TheoryEditor from './TheoryEditor';
import { SimulationProblem } from '../services/interview-simulation';

const Container = styled.div`
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

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.neutral};
  font-size: 1rem;
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

interface InterviewSimulationProblemProps {
  problem: SimulationProblem;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  isFirst: boolean;
  isLast: boolean;
  currentIndex: number;
  totalProblems: number;
  timeLimit?: number; // in minutes
}

export default function InterviewSimulationProblem({
  problem,
  onNext,
  onPrevious,
  onComplete,
  isFirst,
  isLast,
  currentIndex,
  totalProblems,
  timeLimit = 30
}: InterviewSimulationProblemProps) {
  const { themeObject } = useThemeContext();
  const [code, setCode] = useState('');
  const [answer, setAnswer] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate submission processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    
    if (isLast) {
      onComplete();
    } else {
      onNext();
    }
  };

  const renderProblemContent = () => {
    switch (problem.type) {
      case 'dsa':
        return (
          <DSAEditor
            code={code}
            onChange={setCode}
            problemId={problem.id}
            testCases={problem.content.examples?.map((example: any, index: number) => ({
              id: (index + 1).toString(),
              input: example.input,
              expectedOutput: example.output,
              status: undefined
            })) || []}
            onSubmit={async (code) => {
              await handleSubmit();
              return { success: true, message: 'Submitted successfully' };
            }}
          />
        );

      case 'machine_coding':
        return (
          <CodeEditor
            code={code}
            onChange={setCode}
            onSubmit={async (code) => {
              await handleSubmit();
            }}
          />
        );

      case 'system_design':
        return (
          <SystemDesignCanvas
            onSubmit={async (code, drawingImage) => {
              await handleSubmit();
            }}
          />
        );

      case 'theory':
        return (
          <TheoryEditor
            problem={problem.content}
            answer={answer}
            onChange={setAnswer}
            onEvaluate={async (submission) => {
              await handleSubmit();
            }}
            isEvaluating={isSubmitting}
          />
        );

      default:
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Unsupported problem type: {problem.type}</p>
          </div>
        );
    }
  };

  const renderProblemDescription = () => {
    switch (problem.type) {
      case 'dsa':
        return (
          <div>
            <h3>Problem Statement</h3>
            <p>{problem.content.problemStatement}</p>
            
            <h3>Input Format</h3>
            <p>{problem.content.inputFormat}</p>
            
            <h3>Output Format</h3>
            <p>{problem.content.outputFormat}</p>
            
            {problem.content.constraints && (
              <>
                <h3>Constraints</h3>
                <ul>
                  {problem.content.constraints.map((constraint: string, index: number) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </>
            )}
            
            {problem.content.examples && (
              <>
                <h3>Examples</h3>
                {problem.content.examples.map((example: any, index: number) => (
                  <div key={index} style={{ marginBottom: '15px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
                    <p><strong>Example {index + 1}:</strong></p>
                    <p><strong>Input:</strong> {example.input}</p>
                    <p><strong>Output:</strong> {example.output}</p>
                    {example.explanation && <p><strong>Explanation:</strong> {example.explanation}</p>}
                  </div>
                ))}
              </>
            )}
          </div>
        );

      case 'machine_coding':
        return (
          <div>
            <h3>Requirements</h3>
            <ul>
              {problem.content.requirements?.map((req: string, index: number) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
            
            {problem.content.acceptanceCriteria && (
              <>
                <h3>Acceptance Criteria</h3>
                <ul>
                  {problem.content.acceptanceCriteria.map((criteria: string, index: number) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              </>
            )}
            
            {problem.content.technologies && (
              <>
                <h3>Technologies</h3>
                <p>{problem.content.technologies.join(', ')}</p>
              </>
            )}
            
            {problem.content.hints && (
              <>
                <h3>Hints</h3>
                <ul>
                  {problem.content.hints.map((hint: string, index: number) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        );

      case 'system_design':
        return (
          <div>
            {problem.content.functionalRequirements && (
              <>
                <h3>Functional Requirements</h3>
                <ul>
                  {problem.content.functionalRequirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </>
            )}
            
            {problem.content.nonFunctionalRequirements && (
              <>
                <h3>Non-Functional Requirements</h3>
                <ul>
                  {problem.content.nonFunctionalRequirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </>
            )}
            
            {problem.content.scale && (
              <>
                <h3>Scale</h3>
                <ul>
                  <li><strong>Users:</strong> {problem.content.scale.users}</li>
                  <li><strong>Requests per Second:</strong> {problem.content.scale.requestsPerSecond}</li>
                  <li><strong>Data Size:</strong> {problem.content.scale.dataSize}</li>
                </ul>
              </>
            )}
            
            {problem.content.expectedDeliverables && (
              <>
                <h3>Expected Deliverables</h3>
                <ul>
                  {problem.content.expectedDeliverables.map((deliverable: string, index: number) => (
                    <li key={index}>{deliverable}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        );

      case 'theory':
        return (
          <div>
            <h3>Question</h3>
            <p>{problem.content.question}</p>
            
            {problem.content.keyPoints && (
              <>
                <h3>Key Points to Cover</h3>
                <ul>
                  {problem.content.keyPoints.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </>
            )}
            
            {problem.content.examples && (
              <>
                <h3>Examples to Consider</h3>
                <ul>
                  {problem.content.examples.map((example: string, index: number) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        );

      default:
        return <p>{problem.description}</p>;
    }
  };

  return (
    <Container>
      <ProblemHeader>
        <ProblemTitle>{problem.title}</ProblemTitle>
        <ProblemMeta>
          <DifficultyBadge difficulty={problem.difficulty}>
            {problem.difficulty}
          </DifficultyBadge>
          <span>Estimated Time: {problem.estimatedTime}</span>
          <span>Type: {problem.type.replace('_', ' ').toUpperCase()}</span>
          <TimerContainer>
            <FiClock size={16} />
            {formatTime(elapsedTime)}
          </TimerContainer>
        </ProblemMeta>
      </ProblemHeader>

      <ProblemDescription>
        {renderProblemDescription()}
      </ProblemDescription>

      <EditorContainer>
        {renderProblemContent()}
      </EditorContainer>

      <NavigationContainer>
        <NavigationButton onClick={onPrevious} disabled={isFirst}>
          <FiArrowLeft size={16} />
          Previous
        </NavigationButton>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ color: themeObject.neutral, fontSize: '0.9rem' }}>
            Problem {currentIndex + 1} of {totalProblems}
          </span>
          
          <NavigationButton 
            variant="primary"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Submitting...' : isLast ? 'Complete Interview' : 'Next Problem'}
            <FiArrowRight size={16} />
          </NavigationButton>
        </div>
      </NavigationContainer>
    </Container>
  );
} 