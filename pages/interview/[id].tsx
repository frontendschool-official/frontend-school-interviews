import { useRef } from "react";
import { useRouter } from "next/router";
import CodeEditor from "@/components/CodeEditor";
import DSAEditor from "@/components/DSAEditor";
import FeedbackModal from "@/components/FeedbackModal";
import {
  useAuth,
  useInterviewProblem,
  useInterviewCode,
  useInterviewFeedback,
  useInterviewUI,
  useInterviewAttempt,
} from "../../hooks";
import SystemDesignCanvas from "@/components/SystemDesignCanvas";
import EvaluateButton from "@/components/EvaluateButton";
import DSAProblemRenderer from "@/container/interviews/dsa";
import { Button } from "@/styles/SharedUI";
import { Loader } from "@/components/Loader";
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
  AuthMessage,
} from "@/container/interviews/interviews.styled";
import MachineCodingProblem from "@/container/interviews/machine-coding";
import SystemDesignProblem from "@/container/interviews/system-design";
import Layout from "@/components/Layout";

export default function InterviewPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
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
    router.push("/problems");
  };

  return (
    <Layout
      isLoading={loading || authLoading}
      isError={!!error}
      error={error || undefined}
      handleRetry={handleRetry}
      handleBack={handleBack}
    >
      {problem ? (
        <>
          <MainContent>
            <ProblemPanel
              ref={problemPanelRef}
              isCollapsed={isProblemPanelCollapsed}
              style={{
                width: isProblemPanelCollapsed
                  ? "50px"
                  : `${problemPanelWidth}px`,
              }}
            >
              {!isProblemPanelCollapsed && (
                <>
                  <ProblemHeader>
                    <h1>{problem.machineCodingProblem?.title || problem.systemDesignProblem?.title || problem.dsaProblem?.title || "Problem"}</h1>
                    <div className="meta-info">
                      <span>
                        <strong>Companies:</strong> {problem.companies || "N/A"}
                      </span>
                      <span>
                        <strong>Round:</strong> {problem.round}
                      </span>
                      <span>
                        <strong>Type:</strong> {problem.interviewType}
                      </span>
                    </div>
                    {!user && (
                      <AuthMessage>
                        <strong>Note:</strong> You can view and practice this
                        problem. Sign in to submit your solution and get AI
                        feedback.
                      </AuthMessage>
                    )}
                  </ProblemHeader>
                  <ProblemContent>
                    {problem.interviewType === "design" ? (
                      problem.systemDesignProblem ? (
                        <SystemDesignProblem
                          problem={problem.systemDesignProblem}
                        />
                      ) : (
                        "No system design problem available"
                      )
                    ) : problem.interviewType === "dsa" ? (
                      problem.dsaProblem ? (
                        <DSAProblemRenderer problem={problem.dsaProblem} />
                      ) : (
                        "No DSA problem available"
                      )
                    ) : problem.machineCodingProblem ? (
                      <MachineCodingProblem
                        problem={problem.machineCodingProblem}
                      />
                    ) : (
                      "No machine coding problem available"
                    )}
                  </ProblemContent>
                </>
              )}
              <CollapseButton onClick={toggleProblemPanel}>
                {isProblemPanelCollapsed ? ">" : "<"}
              </CollapseButton>
              <Resizer onMouseDown={handleResizeStart} />
            </ProblemPanel>

            <EditorPanel>
              <EditorHeader>
                <ActionButtons>
                  {problem.interviewType === "coding" && (
                    <EvaluateButton
                      designation={problem.designation}
                      code={code}
                      excalidrawRef={excalidrawRef}
                      problemId={problem.id || ""}
                      onEvaluated={handleEvaluated}
                      interviewType="coding"
                      problemTitle={
                        problem.machineCodingProblem?.title ||
                        problem.designation
                      }
                      problemStatement={
                        problem.machineCodingProblem?.description || ""
                      }
                    />
                  )}
                  {problem.interviewType === "design" && isCanvasReady && (
                    <EvaluateButton
                      designation={problem.designation}
                      code={code}
                      excalidrawRef={excalidrawRef}
                      problemId={problem.id || ""}
                      onEvaluated={handleEvaluated}
                      interviewType="design"
                      problemTitle={
                        problem.systemDesignProblem?.title ||
                        problem.designation
                      }
                      problemStatement={
                        problem.systemDesignProblem?.description || ""
                      }
                    />
                  )}
                  {problem.interviewType === "dsa" && (
                    <Button variant="success">Submit Solution</Button>
                  )}
                </ActionButtons>
              </EditorHeader>
              <EditorContainer>
                {problem.interviewType === "design" ? (
                  <SystemDesignCanvas
                    ref={excalidrawRef}
                    onReady={() => setCanvasReady(true)}
                  />
                ) : problem.interviewType === "dsa" ? (
                  <DSAEditor
                    code={code}
                    onChange={handleCodeUpdate}
                    problemId={problem.id || ""}
                    problemTitle={
                      problem.dsaProblem?.title || problem.designation
                    }
                    problemStatement={
                      problem.dsaProblem?.problemStatement || ""
                    }
                    testCases={
                      problem.dsaProblem?.examples?.map((example, index) => ({
                        id: (index + 1).toString(),
                        input: example.input,
                        expectedOutput: example.output,
                        status: undefined,
                      })) || []
                    }
                  />
                ) : (
                  <CodeEditor code={code} onChange={handleCodeUpdate} />
                )}
              </EditorContainer>
              {problem.interviewType !== "dsa" && (
                <OutputPanel isVisible={feedback !== null}>
                  <OutputHeader>
                    <h4>AI Feedback</h4>
                    <ActionButtons>
                      <Button variant="secondary" onClick={clearFeedback}>
                        Clear
                      </Button>
                      <Button variant="success">Save</Button>
                    </ActionButtons>
                  </OutputHeader>
                  <OutputContent>
                    {feedback ||
                      "No feedback yet. Click 'Evaluate' to get started."}
                  </OutputContent>
                </OutputPanel>
              )}
            </EditorPanel>
          </MainContent>
        </>
      ) : (
        <Loader text="Loading problem..." />
      )}

      {/* AI Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={closeFeedbackModal}
        feedback={feedbackData || {}}
        problemTitle={problem?.designation || "Problem"}
        loading={false}
      />
    </Layout>
  );
}
