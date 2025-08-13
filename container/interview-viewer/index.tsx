import { useRef } from 'react';
import { useRouter } from 'next/router';
import CodeEditor from '@/components/CodeEditor';
import DSAEditor from '@/components/DSAEditor';
import FeedbackModal from '@/components/FeedbackModal';
import {
  useAuth,
  useInterviewProblem,
  useInterviewCode,
  useInterviewFeedback,
  useInterviewUI,
  useInterviewAttempt,
} from '../../hooks';
import SystemDesignCanvas from '@/components/SystemDesignCanvas';
import EvaluateButton from '@/components/EvaluateButton';
import DSAProblemRenderer from '@/container/interviews/dsa';
import { Loader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import { FiChevronLeft } from 'react-icons/fi';
import {
  MainContent,
  ProblemPanel,
  Resizer,
  ProblemContent,
  EditorPanel,
  EditorContainer,
} from '@/container/interviews/interviews.styled';
import MachineCodingProblem from '@/container/interviews/machine-coding';
import SystemDesignProblem from '@/container/interviews/system-design';
import Layout from '@/components/Layout';
import TheoryEditor from '@/components/TheoryEditor';
import TheoryProblemRenderer from '@/components/TheoryProblem';
import {
  ISystemDesignProblem,
  IDSAProblem,
  IMachineCodingProblem,
} from '@/container/interviews/interviews.types';
import { TheoryProblem } from '@/types/problem';

export default function InterviewViewerPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const excalidrawRef = useRef<any>(null);

  // Custom hooks
  const { problem, loading, error, retry } = useInterviewProblem();
  const { code, updateCode } = useInterviewCode(problem);
  const {
    showFeedbackModal,
    feedbackData,
    handleEvaluated,
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
  return (
    <Layout
      isLoading={loading || authLoading}
      isError={!!error}
      error={error || undefined}
      handleRetry={handleRetry}
      handleBack={handleBack}
      fullWidth
    >
      {problem ? (
        <>
          <MainContent>
            {/* Hide ProblemPanel for theory problems */}
            {(problem?.interviewType as any) !== 'theory_and_debugging' && (
              <ProblemPanel
                ref={problemPanelRef}
                isCollapsed={isProblemPanelCollapsed}
                style={{
                  width: isProblemPanelCollapsed
                    ? '50px'
                    : `${problemPanelWidth}px`,
                  minWidth: isProblemPanelCollapsed ? '50px' : '25%',
                  maxWidth: isProblemPanelCollapsed ? '50px' : '40%',
                }}
              >
                {!isProblemPanelCollapsed && (
                  <>
                    <ProblemContent>
                      {problem?.interviewType === 'design' &&
                        problem?.problem && (
                          <SystemDesignProblem
                            problem={problem?.problem as ISystemDesignProblem}
                          />
                        )}
                      {problem?.interviewType === 'dsa' && problem?.problem && (
                        <DSAProblemRenderer
                          problem={problem?.problem as IDSAProblem}
                        />
                      )}
                      {problem?.interviewType === 'coding' &&
                        problem?.problem && (
                          <MachineCodingProblem
                            problem={problem?.problem as IMachineCodingProblem}
                          />
                        )}
                      {(problem?.interviewType as any) ===
                        'theory_and_debugging' &&
                        problem?.problem && (
                          <TheoryProblemRenderer
                            problem={problem?.problem as TheoryProblem}
                          />
                        )}
                    </ProblemContent>
                  </>
                )}
                <button
                  onClick={toggleProblemPanel}
                  className='absolute top-4 right-2 z-20 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md'
                  title={
                    isProblemPanelCollapsed ? 'Expand panel' : 'Collapse panel'
                  }
                >
                  <FiChevronLeft
                    className={`w-4 h-4 text-gray-600 dark:text-gray-400 transform transition-transform duration-200 ${
                      isProblemPanelCollapsed ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <Resizer onMouseDown={handleResizeStart} />
              </ProblemPanel>
            )}

            <EditorPanel>
              <EditorContainer>
                {problem?.interviewType === 'design' && (
                  <SystemDesignCanvas
                    ref={excalidrawRef}
                    onReady={() => setCanvasReady(true)}
                  />
                )}
                {problem?.interviewType === 'dsa' && (
                  <DSAEditor code={code} onChange={handleCodeUpdate} />
                )}
                {(problem?.interviewType as any) === 'theory_and_debugging' &&
                  problem.problem && (
                    <TheoryEditor
                      problem={problem.problem as TheoryProblem}
                      problemId={problem.id || ''}
                      onEvaluationComplete={handleEvaluated}
                    />
                  )}
                {problem?.interviewType === 'machine_coding' && (
                  <CodeEditor code={code} onChange={handleCodeUpdate} />
                )}
              </EditorContainer>
              <div className='p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                      Solution
                    </h2>
                    <div className='h-1 w-1 bg-gray-400 rounded-full'></div>
                    <span className='text-sm text-gray-500 dark:text-gray-400 capitalize'>
                      {problem?.interviewType} Editor
                    </span>
                  </div>
                  <div className='flex items-center space-x-3'>
                    {problem?.interviewType === 'coding' &&
                      problem?.problem && (
                        <EvaluateButton
                          designation={problem.designation}
                          code={code}
                          excalidrawRef={excalidrawRef}
                          problemId={problem?.id || ''}
                          onEvaluated={handleEvaluated}
                          interviewType='coding'
                          problemTitle={
                            (problem?.problem as IMachineCodingProblem)
                              ?.title || problem?.designation
                          }
                          problemStatement={
                            (problem?.problem as IMachineCodingProblem)
                              ?.description || ''
                          }
                        />
                      )}
                    {problem?.interviewType === 'design' && isCanvasReady && (
                      <EvaluateButton
                        designation={problem?.designation}
                        code={code}
                        excalidrawRef={excalidrawRef}
                        problemId={problem?.id || ''}
                        onEvaluated={handleEvaluated}
                        interviewType='design'
                        problemTitle={
                          (problem?.problem as ISystemDesignProblem)?.title ||
                          problem?.designation
                        }
                        problemStatement={
                          (problem?.problem as ISystemDesignProblem)
                            ?.description || ''
                        }
                      />
                    )}
                    {problem?.interviewType === 'dsa' && (
                      <Button variant='primary'>Submit Solution</Button>
                    )}
                  </div>
                </div>
              </div>
            </EditorPanel>
          </MainContent>
        </>
      ) : (
        <Loader text='Loading problem...' />
      )}

      {/* AI Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={closeFeedbackModal}
        feedback={
          typeof feedbackData === 'object' && feedbackData
            ? feedbackData?.overallFeedback ||
              feedbackData?.rawFeedback ||
              'No feedback available'
            : ''
        }
        isLoading={false}
      />
    </Layout>
  );
}
