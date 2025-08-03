import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import CodeEditor from '@/components/CodeEditor';
import DSAEditor from '@/components/DSAEditor';
import SystemDesignCanvas from '@/components/SystemDesignCanvas';
import TheoryEditor from '@/components/TheoryEditor';
import FeedbackModal from '@/components/FeedbackModal';
import EvaluateButton from '@/components/EvaluateButton';
import {
  useInterviewProblem,
  useInterviewCode,
  useInterviewFeedback,
  useInterviewUI,
  useInterviewAttempt,
} from '@/hooks';
import {
  MainContent,
  ProblemPanel,
  Resizer,
  ProblemHeader,
  ProblemContent,
  CollapseButton,
  EditorPanel,
  EditorHeader,
  EditorTabs,
  Tab,
  ActionButtons,
  EditorContainer,
  OutputPanel,
  OutputHeader,
  OutputContent,
} from '@/container/interviews/interviews.styled';

const ProblemSolverContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

interface ProblemSolverProps {
  problemId: string;
}

export default function ProblemSolver({ problemId }: ProblemSolverProps) {
  const router = useRouter();
  const excalidrawRef = useRef<any>(null);

  // Custom hooks
  const { problem, loading, error, retry } = useInterviewProblem();
  const { code, updateCode, clearCode } = useInterviewCode(problem);
  const {
    feedback,
    showFeedbackModal,
    feedbackData,
    handleEvaluated,
    clearFeedback,
    closeFeedbackModal,
  } = useInterviewFeedback(problem);
  const {
    isProblemPanelCollapsed,
    problemPanelWidth,
    isCanvasReady,
    problemPanelRef,
    handleResizeStart,
    toggleProblemPanel,
    setCanvasReady,
  } = useInterviewUI();
  const { handleCodeChange } = useInterviewAttempt(problem);

  // Combined code change handler
  const handleCodeUpdate = (newCode: string) => {
    updateCode(newCode);
    handleCodeChange(newCode);
  };

  const handleRetry = () => {
    retry();
  };

  const handleBack = () => {
    router.push('/problems');
  };

  const renderEditor = () => {
    if (!problem) return null;

    switch (problem.type) {
      case 'machine-coding':
        return (
          <CodeEditor
            code={code}
            onChange={handleCodeUpdate}
            language="javascript"
            theme="vs-dark"
          />
        );
      case 'dsa':
        return (
          <DSAEditor
            code={code}
            onChange={handleCodeUpdate}
            testCases={problem.testCases || []}
          />
        );
      case 'system-design':
        return (
          <SystemDesignCanvas
            ref={excalidrawRef}
            onReady={() => setCanvasReady(true)}
          />
        );
      case 'theory':
        return (
          <TheoryEditor
            content={code}
            onChange={handleCodeUpdate}
            placeholder="Write your answer here..."
          />
        );
      default:
        return (
          <CodeEditor
            code={code}
            onChange={handleCodeUpdate}
            language="javascript"
            theme="vs-dark"
          />
        );
    }
  };

  if (loading) {
    return (
      <ProblemSolverContainer>
        <div>Loading problem...</div>
      </ProblemSolverContainer>
    );
  }

  if (error) {
    return (
      <ProblemSolverContainer>
        <div>Error: {error.message}</div>
        <button onClick={handleRetry}>Retry</button>
        <button onClick={handleBack}>Back to Problems</button>
      </ProblemSolverContainer>
    );
  }

  if (!problem) {
    return (
      <ProblemSolverContainer>
        <div>Problem not found</div>
        <button onClick={handleBack}>Back to Problems</button>
      </ProblemSolverContainer>
    );
  }

  return (
    <ProblemSolverContainer>
      <MainContent>
        <ProblemPanel
          ref={problemPanelRef}
          isCollapsed={isProblemPanelCollapsed}
          style={{
            width: isProblemPanelCollapsed ? '50px' : `${problemPanelWidth}px`,
          }}
        >
          <ProblemHeader>
            <h2>{problem.title}</h2>
            <CollapseButton onClick={toggleProblemPanel}>
              {isProblemPanelCollapsed ? '→' : '←'}
            </CollapseButton>
          </ProblemHeader>
          <ProblemContent>
            <div dangerouslySetInnerHTML={{ __html: problem.description }} />
            {problem.requirements && (
              <div>
                <h3>Requirements:</h3>
                <ul>
                  {problem.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            {problem.constraints && (
              <div>
                <h3>Constraints:</h3>
                <ul>
                  {problem.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            )}
          </ProblemContent>
        </ProblemPanel>

        <Resizer onMouseDown={handleResizeStart} />

        <EditorPanel>
          <EditorHeader>
            <EditorTabs>
              <Tab active>Solution</Tab>
            </EditorTabs>
            <ActionButtons>
              <EvaluateButton
                onEvaluate={handleEvaluated}
                disabled={!code.trim()}
              />
            </ActionButtons>
          </EditorHeader>
          <EditorContainer>
            {renderEditor()}
          </EditorContainer>
        </EditorPanel>

        <OutputPanel>
          <OutputHeader>
            <h3>Output</h3>
          </OutputHeader>
          <OutputContent>
            {feedback && (
              <div>
                <h4>Feedback:</h4>
                <div dangerouslySetInnerHTML={{ __html: feedback }} />
              </div>
            )}
          </OutputContent>
        </OutputPanel>
      </MainContent>

      {showFeedbackModal && (
        <FeedbackModal
          feedback={feedbackData}
          onClose={closeFeedbackModal}
        />
      )}
    </ProblemSolverContainer>
  );
} 