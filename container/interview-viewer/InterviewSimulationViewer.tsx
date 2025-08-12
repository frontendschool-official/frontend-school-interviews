import React, { useState, useEffect, useRef } from 'react';
import { useThemeContext } from '@/hooks/useTheme';
import CodeEditor from '@/components/CodeEditor';
import DSAEditor from '@/components/DSAEditor';
import FeedbackModal from '@/components/FeedbackModal';
import SystemDesignCanvas from '@/components/SystemDesignCanvas';
import TheoryEditor from '@/components/TheoryEditor';
import EvaluateButton from '@/components/EvaluateButton';
import DSAProblemRenderer from '@/container/interviews/dsa';
import MachineCodingProblem from '@/container/interviews/machine-coding';
import SystemDesignProblem from '@/container/interviews/system-design';
import Layout from '@/components/Layout';
import {
  MainContent,
  ProblemPanel,
  Resizer,
  ProblemContent,
  CollapseButton,
  EditorPanel,
  EditorHeader,
  EditorTabs,
  Tab,
  ActionButtons,
  EditorContainer,
} from '@/container/interviews/interviews.styled';
import {
  MockInterviewSession,
  MockInterviewResult,
  MockInterviewEvaluation,
} from '@/types/problem';
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiClock,
  FiCheck,
  FiPlay,
  FiPause,
  FiRotateCcw,
} from 'react-icons/fi';
import { Button } from '@/components/ui';

interface InterviewSimulationViewerProps {
  session: MockInterviewSession;
  onComplete: (result: MockInterviewResult) => void;
  onExit: () => void;
}

export default function InterviewSimulationViewer({
  session,
  onComplete,
  onExit,
}: InterviewSimulationViewerProps) {
  const { theme } = useThemeContext();
  const excalidrawRef = useRef<any>(null);

  // State management
  const [currentProblemIndex, setCurrentProblemIndex] = useState(
    session.currentProblemIndex || 0
  );
  const [code, setCode] = useState<string>('');
  const [isProblemPanelCollapsed, setIsProblemPanelCollapsed] = useState(false);
  const [problemPanelWidth, setProblemPanelWidth] = useState(400);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] =
    useState<MockInterviewEvaluation | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [completedProblems, setCompletedProblems] = useState<Set<number>>(
    new Set()
  );
  const [problemCodes, setProblemCodes] = useState<Record<number, string>>({});

  const currentProblem = session.problems[currentProblemIndex];
  const problemPanelRef = useRef<HTMLDivElement>(null);

  // Load saved code when switching problems
  useEffect(() => {
    const savedCode = problemCodes[currentProblemIndex] || '';
    setCode(savedCode);
  }, [currentProblemIndex, problemCodes]);

  // Timer effect
  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0 || isTimerPaused) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsTimerActive(false);
          // Auto-submit when time runs out
          handleCompleteInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timeRemaining, isTimerPaused]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle code changes and save to state
  const handleCodeUpdate = (newCode: string) => {
    setCode(newCode);
    setProblemCodes(prev => ({
      ...prev,
      [currentProblemIndex]: newCode,
    }));
  };

  // Toggle problem panel
  const toggleProblemPanel = () => {
    setIsProblemPanelCollapsed(!isProblemPanelCollapsed);
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = problemPanelWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      const minWidth = 300;
      const maxWidth = window.innerWidth * 0.6;
      setProblemPanelWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Navigate between problems
  const handlePreviousProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < session.problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    }
  };

  // Handle tab click
  const handleTabClick = (index: number) => {
    setCurrentProblemIndex(index);
  };

  // Timer controls
  const handlePauseTimer = () => {
    setIsTimerPaused(!isTimerPaused);
  };

  const handleResetTimer = () => {
    setTimeRemaining(45 * 60);
    setIsTimerPaused(false);
  };

  // Complete the entire interview
  const handleCompleteInterview = async () => {
    const totalScore = 0; // Default score since we removed the scoring logic
    const overallFeedback = 'Interview completed'; // Default feedback

    const result: MockInterviewResult = {
      sessionId: session.id || '',
      totalScore,
      averageScore: totalScore,
      overallFeedback,
      problemEvaluations: session.problems.map((_, index) => ({
        problemId: session.problems[index]?.id || '',
        score: 0, // Default score
        feedback: 'No feedback available',
        strengths: [],
        areasForImprovement: [],
        suggestions: [],
      })),
      completedAt: new Date(),
    };

    onComplete(result);
  };

  // Close feedback modal
  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setFeedbackData(null);
  };

  // Get editor type based on problem type
  const getEditorType = (): string => {
    if (!currentProblem) return 'machine-coding';

    switch (currentProblem.type) {
      case 'dsa':
        return 'dsa';
      case 'machine_coding':
        return 'machine-coding';
      case 'system_design':
        return 'system-design';
      case 'theory_and_debugging':
        return 'theory';
      default:
        return 'machine-coding';
    }
  };

  // Render appropriate editor
  const renderEditor = () => {
    if (!currentProblem) return null;

    const editorType = getEditorType();

    switch (editorType) {
      case 'machine-coding':
        return (
          <CodeEditor
            code={code}
            onChange={handleCodeUpdate}
            theme={theme === 'dark' ? 'dark' : 'light'}
          />
        );
      case 'dsa':
        return <DSAEditor code={code} onChange={handleCodeUpdate} />;
      case 'system-design':
        return <SystemDesignCanvas ref={excalidrawRef} onReady={() => {}} />;
      case 'theory':
        return (
          <TheoryEditor
            problem={currentProblem as any}
            problemId={currentProblem.id}
            onEvaluationComplete={_feedback => {
              setShowFeedbackModal(true);
              setCompletedProblems(
                prev => new Set(Array.from(prev).concat([currentProblemIndex]))
              );
            }}
          />
        );
      default:
        return (
          <CodeEditor
            code={code}
            onChange={handleCodeUpdate}
            theme={theme === 'dark' ? 'dark' : 'light'}
          />
        );
    }
  };

  // Render problem content
  const renderProblemContent = () => {
    if (!currentProblem) return null;

    switch (currentProblem.type) {
      case 'dsa':
        return <DSAProblemRenderer problem={currentProblem as any} />;
      case 'system_design':
        return <SystemDesignProblem problem={currentProblem as any} />;
      case 'machine_coding':
        return <MachineCodingProblem problem={currentProblem as any} />;
      case 'theory_and_debugging':
        return (
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold text-text'>
              {currentProblem.title}
            </h2>
            <div className='text-neutral leading-relaxed'>
              {currentProblem.description}
            </div>
            {(currentProblem as any).question && (
              <div className='bg-secondary border border-border rounded-lg p-4'>
                <h3 className='font-medium text-text mb-2'>Question</h3>
                <p className='text-neutral'>
                  {(currentProblem as any).question}
                </p>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold text-text'>
              {currentProblem.title}
            </h2>
            <div className='text-neutral leading-relaxed'>
              {currentProblem.description}
            </div>
          </div>
        );
    }
  };

  if (!currentProblem) {
    return (
      <Layout>
        <div className='min-h-screen bg-bodyBg text-text flex items-center justify-center'>
          <div>No problems available for this round.</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout fullWidth showNavBar={false}>
      <div className='min-h-screen bg-bodyBg text-text'>
        {/* Header */}
        <div className='h-14 bg-secondary border-b border-border flex items-center justify-between px-4'>
          <div className='flex items-center gap-4'>
            <Button
              onClick={onExit}
              variant='danger'
              size='sm'
              leftIcon={<FiX className='w-4 h-4' />}
            >
              Exit Interview
            </Button>
            <div className='h-6 w-px bg-border' />
            <div className='text-sm text-neutral'>
              {session.companyName} • {session.roleLevel} • {session.roundName}
            </div>
          </div>

          <div className='flex items-center gap-4'>
            {/* Timer controls */}
            <div className='flex items-center gap-2'>
              <Button
                onClick={handlePauseTimer}
                variant='icon'
                size='sm'
                leftIcon={
                  isTimerPaused ? (
                    <FiPlay className='w-4 h-4' />
                  ) : (
                    <FiPause className='w-4 h-4' />
                  )
                }
              />
              <Button
                onClick={handleResetTimer}
                variant='icon'
                size='sm'
                leftIcon={<FiRotateCcw className='w-4 h-4' />}
              />
            </div>

            {/* Timer */}
            <div className='flex items-center gap-2 text-sm'>
              <FiClock className='w-4 h-4' />
              <span
                className={
                  timeRemaining < 300 ? 'text-red-500' : 'text-neutral'
                }
              >
                {formatTime(timeRemaining)}
              </span>
            </div>

            {/* Progress indicator */}
            <div className='flex items-center gap-1'>
              {session?.problems?.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    completedProblems.has(index)
                      ? 'bg-green-500'
                      : index === currentProblemIndex
                        ? 'bg-primary'
                        : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Problem Tabs */}
        <div className='bg-secondary border-b border-border px-4 py-2'>
          <div className='flex gap-2 overflow-x-auto'>
            {session?.problems?.map((problem, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  index === currentProblemIndex
                    ? 'bg-primary text-white'
                    : completedProblems.has(index)
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-white dark:bg-gray-800 text-text hover:bg-gray-50 dark:hover:bg-gray-700 border border-border'
                }`}
              >
                <span>Q{index + 1}</span>
                {completedProblems.has(index) && (
                  <FiCheck className='w-3 h-3' />
                )}
                <span className='text-xs opacity-75'>{problem.difficulty}</span>
              </button>
            ))}
          </div>
        </div>

        <MainContent>
          {/* Problem Panel */}
          {currentProblem.type !== 'theory_and_debugging' && (
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
                  {/* <ProblemHeader>
                    <h2 className='text-lg font-semibold text-text truncate'>
                      {currentProblem.title}
                    </h2>
                    <div className='flex items-center gap-2'>
                      {completedProblems.has(currentProblemIndex) && (
                        <FiCheck className='w-4 h-4 text-green-500' />
                      )}
                      <span className='text-xs text-neutral capitalize'>
                        {currentProblem.difficulty}
                      </span>
                    </div>
                  </ProblemHeader> */}
                  <ProblemContent>{renderProblemContent()}</ProblemContent>
                </>
              )}
              <CollapseButton onClick={toggleProblemPanel}>
                {isProblemPanelCollapsed ? '>' : '<'}
              </CollapseButton>
            </ProblemPanel>
          )}

          {/* Resizer */}
          {currentProblem.type !== 'theory_and_debugging' &&
            !isProblemPanelCollapsed && (
              <Resizer onMouseDown={handleResizeStart} />
            )}

          {/* Editor Panel */}
          <EditorPanel>
            <EditorHeader>
              <EditorTabs>
                <Tab active={true}>{getEditorType().replace('-', ' ')}</Tab>
              </EditorTabs>
              <ActionButtons>
                <div className='flex items-center gap-2'>
                  {/* Problem navigation */}
                  <Button
                    onClick={handlePreviousProblem}
                    disabled={currentProblemIndex === 0}
                    variant='icon'
                    size='sm'
                    leftIcon={<FiChevronLeft className='w-4 h-4' />}
                  />
                  <span className='text-sm text-neutral px-2'>
                    {currentProblemIndex + 1} / {session?.problems?.length}
                  </span>
                  <Button
                    onClick={handleNextProblem}
                    disabled={
                      currentProblemIndex === session?.problems?.length - 1
                    }
                    variant='icon'
                    size='sm'
                    leftIcon={<FiChevronRight className='w-4 h-4' />}
                  />
                </div>

                {currentProblem?.type !== 'theory_and_debugging' && (
                  <EvaluateButton
                    designation={session?.roleLevel}
                    code={code}
                    excalidrawRef={excalidrawRef}
                    problemId={currentProblem?.id}
                    onEvaluated={_feedback => {
                      setShowFeedbackModal(true);
                      setCompletedProblems(
                        prev =>
                          new Set(
                            Array.from(prev).concat([currentProblemIndex])
                          )
                      );
                    }}
                    interviewType={
                      currentProblem?.type === 'dsa'
                        ? 'dsa'
                        : currentProblem?.type === 'system_design'
                          ? 'design'
                          : 'coding'
                    }
                    problemTitle={currentProblem?.title}
                    problemStatement={currentProblem?.description}
                  />
                )}
                <Button
                  onClick={handleCompleteInterview}
                  variant='primary'
                  size='sm'
                  leftIcon={<FiCheck className='w-4 h-4' />}
                >
                  Complete Interview
                </Button>
              </ActionButtons>
            </EditorHeader>
            <EditorContainer>{renderEditor()}</EditorContainer>
          </EditorPanel>
        </MainContent>

        {/* Feedback Modal */}
        {showFeedbackModal && feedbackData && (
          <FeedbackModal
            isOpen={showFeedbackModal}
            onClose={closeFeedbackModal}
            feedback={feedbackData?.feedback}
            score={feedbackData?.score}
          />
        )}
      </div>
    </Layout>
  );
}
