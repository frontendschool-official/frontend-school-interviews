import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { CodeEditor } from '@/components/ui';

import SystemDesignCanvas, {
  SystemDesignCanvasRef,
} from '@/components/SystemDesignCanvas';
import TheoryEditor from '@/components/TheoryEditor';
import { FeedbackModal } from '@/components/ui';
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

interface ProblemSolverProps {
  problemId: string;
}

export default function ProblemSolver({ problemId }: ProblemSolverProps) {
  const router = useRouter();
  const excalidrawRef = useRef<SystemDesignCanvasRef | null>(null);

  // Custom hooks
  const { problem, loading, error, retry } = useInterviewProblem();
  const { code, updateCode } = useInterviewCode(problem);
  const {
    feedback,
    showFeedbackModal,
    feedbackData,
    handleEvaluated,
    closeFeedbackModal,
  } = useInterviewFeedback(problem);
  const {
    isProblemPanelCollapsed,
    problemPanelWidth,
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

    console.log('=== ProblemSolver Debug ===');
    console.log('Problem ID:', problemId);
    console.log('Problem:', problem);
    console.log('Interview Type:', problem.interviewType);
    console.log('Theory Problem exists:', !!problem.theoryProblem);
    console.log(
      'Machine Coding Problem exists:',
      !!problem.machineCodingProblem
    );
    console.log('DSA Problem exists:', !!problem.dsaProblem);
    console.log('System Design Problem exists:', !!problem.systemDesignProblem);

    // Map interviewType to editor type
    const getEditorType = () => {
      // If the problem has theoryProblem data, it should be a theory problem
      if (problem.theoryProblem) {
        return 'theory';
      }

      switch (problem.interviewType) {
        case 'dsa':
          return 'dsa';
        case 'coding':
          return 'machine-coding';
        case 'design':
          return 'system-design';
        case 'theory_and_debugging':
          return 'theory';
        default:
          return 'machine-coding';
      }
    };

    const editorType = getEditorType();
    console.log('Selected Editor Type:', editorType);
    if (
      problem.theoryProblem &&
      problem.interviewType !== 'theory_and_debugging'
    ) {
      console.log(
        '⚠️ FALLBACK: Problem has theoryProblem but interviewType is not "theory_and_debugging"'
      );
      console.log('Using theory editor as fallback');
    }
    console.log('=== End Debug ===');

    switch (editorType) {
      case 'machine-coding':
        return (
          <CodeEditor code={code} onChange={handleCodeUpdate} theme='dark' />
        );
      case 'dsa':
        return (
          <CodeEditor code={code} onChange={handleCodeUpdate} mode='dsa' />
        );
      case 'system-design':
        return (
          <SystemDesignCanvas
            ref={excalidrawRef}
            onReady={() => setCanvasReady(true)}
          />
        );
      case 'theory':
        return problem.theoryProblem ? (
          <TheoryEditor
            problem={problem.theoryProblem}
            problemId={problemId}
            onEvaluationComplete={handleEvaluated}
          />
        ) : (
          <div className='flex items-center justify-center h-full'>
            <p>No theory problem data available</p>
          </div>
        );
      default:
        return (
          <CodeEditor code={code} onChange={handleCodeUpdate} theme='dark' />
        );
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-bodyBg text-text p-6'>
        <div>Loading problem...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-bodyBg text-text p-6'>
        <div>Error: {error.message}</div>
        <button onClick={handleRetry}>Retry</button>
        <button onClick={handleBack}>Back to Problems</button>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className='min-h-screen bg-bodyBg text-text p-6'>
        <div>Problem not found</div>
        <button onClick={handleBack}>Back to Problems</button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-bodyBg text-text'>
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
            <div
              dangerouslySetInnerHTML={{ __html: problem.description || '' }}
            />
            {problem.interviewType === 'coding' &&
              problem.machineCodingProblem?.requirements && (
                <div>
                  <h3>Requirements:</h3>
                  <ul>
                    {problem.machineCodingProblem.requirements.map(
                      (req: string, index: number) => (
                        <li key={index}>{req}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            {problem.interviewType === 'coding' &&
              problem.machineCodingProblem?.constraints && (
                <div>
                  <h3>Constraints:</h3>
                  <ul>
                    {problem.machineCodingProblem.constraints.map(
                      (constraint: string, index: number) => (
                        <li key={index}>{constraint}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            {problem.interviewType === 'dsa' &&
              problem.dsaProblem?.constraints && (
                <div>
                  <h3>Constraints:</h3>
                  <ul>
                    {problem.dsaProblem.constraints.map(
                      (constraint: string, index: number) => (
                        <li key={index}>{constraint}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            {problem.interviewType === 'theory_and_debugging' &&
              problem.theoryProblem?.keyPoints && (
                <div>
                  <h3>Key Points:</h3>
                  <ul>
                    {problem.theoryProblem.keyPoints.map(
                      (point: string, index: number) => (
                        <li key={index}>{point}</li>
                      )
                    )}
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
              {problem.interviewType !== 'theory_and_debugging' && (
                <EvaluateButton
                  designation={problem.designation}
                  code={code}
                  excalidrawRef={excalidrawRef}
                  problemId={problemId}
                  onEvaluated={handleEvaluated}
                  interviewType={problem.interviewType}
                  problemStatement={
                    problem.dsaProblem?.problemStatement ||
                    problem.machineCodingProblem?.description ||
                    ''
                  }
                  problemTitle={problem.title}
                />
              )}
            </ActionButtons>
          </EditorHeader>
          <EditorContainer>{renderEditor()}</EditorContainer>
        </EditorPanel>

        <OutputPanel isVisible={!!feedback}>
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

      {showFeedbackModal && feedbackData && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          feedback={
            feedbackData.overallFeedback ||
            feedbackData.rawFeedback ||
            'No feedback available'
          }
          onClose={closeFeedbackModal}
        />
      )}
    </div>
  );
}
