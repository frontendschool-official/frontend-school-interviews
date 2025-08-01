import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import NavBar from "../../components/NavBar";
import CodeEditor from "../../components/CodeEditor";
import { useAuth } from "../../hooks/useAuth";
import { getProblemById } from "../../services/firebase";
import {
  ParsedProblemData,
  MachineCodingProblem,
  SystemDesignProblem,
  DSAProblem,
} from "../../types/problem";
import SystemDesignCanvas from "../../components/SystemDesignCanvas";
import EvaluateButton from "../../components/EvaluateButton";

// Full page layout with LeetCode-like design
const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bodyBg};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const ProblemPanel = styled.div<{ isCollapsed: boolean }>`
  min-width: ${({ isCollapsed }) => (isCollapsed ? "50px" : "300px")};
  max-width: ${({ isCollapsed }) => (isCollapsed ? "50px" : "600px")};
  background-color: ${({ theme }) => theme.secondary};
  border-right: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
`;

const Resizer = styled.div`
  width: 4px;
  background-color: ${({ theme }) => theme.border};
  cursor: col-resize;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
  }
`;

const CollapseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  z-index: 5;

  &:hover {
    background: ${({ theme }) => theme.accent};
  }
`;

const ProblemHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.bodyBg};

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.text};
    font-weight: 600;
  }

  .meta-info {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const ProblemContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.6;
  font-size: 0.95rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.bodyBg};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.textSecondary};
  }
`;

const EditorPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bodyBg};
`;

const EditorHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.secondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditorTabs = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background: ${({ active, theme }) => 
    active ? theme.primary : 'transparent'};
  color: ${({ active, theme }) => 
    active ? 'white' : theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: ${({ active, theme }) => 
      active ? theme.accent : theme.bodyBg};
  }
`;

const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const OutputPanel = styled.div<{ isVisible: boolean }>`
  height: ${({ isVisible }) => (isVisible ? "200px" : "0")};
  background-color: ${({ theme }) => theme.secondary};
  border-top: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  transition: height 0.3s ease;
`;



const OutputContent = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  color: ${({ theme }) => theme.text};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.primary};
          color: white;
          &:hover { background: ${theme.accent}; }
        `;
      case 'success':
        return `
          background: #10b981;
          color: white;
          &:hover { background: #059669; }
        `;
      default:
        return `
          background: transparent;
          color: ${theme.text};
          border: 1px solid ${theme.border};
          &:hover { background: ${theme.secondary}; }
        `;
    }
  }}
`;

const DifficultyBadge = styled.span<{ difficulty: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${({ difficulty }) => {
    switch (difficulty) {
      case "easy":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "hard":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  }};
  color: white;
`;

const ProblemSection = styled.div`
  margin-bottom: 1.5rem;

  h4 {
    margin: 0 0 0.75rem 0;
    color: ${({ theme }) => theme.primary};
    font-size: 1.1rem;
    font-weight: 600;
  }

  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.5rem 0;
  }
`;

const TechnologyTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const TechnologyTag = styled.span`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ScaleInfo = styled.div`
  background-color: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  padding: 1rem;
  margin: 0.5rem 0;

  h5 {
    margin: 0 0 0.5rem 0;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }
`;

const ExampleBox = styled.div`
  background-color: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;

  p {
    margin: 0.25rem 0;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
`;

const AuthMessage = styled.div`
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: #fef3c7;
  border-radius: 6px;
  border: 1px solid #f59e0b;
  color: #92400e;
  font-size: 0.9rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.secondary};
`;

const ErrorTitle = styled.h2`
  color: #ef4444;
  margin: 0;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.text};
  margin: 0;
  max-width: 500px;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bodyBg};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
`;

// Add missing styled components
const OutputHeader = styled.div`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.bodyBg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    margin: 0;
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
  }
`;

interface ErrorState {
  type: "network" | "not_found" | "unauthorized" | "unknown";
  message: string;
}

const renderMachineCodingProblem = (problem: MachineCodingProblem) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
      <DifficultyBadge difficulty={problem.difficulty}>
        {problem.difficulty}
      </DifficultyBadge>
      <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
        ⏱️ {problem.estimatedTime}
      </span>
    </div>

    <ProblemSection>
      <h4>Description</h4>
      <p>{problem.description}</p>
    </ProblemSection>

    <ProblemSection>
      <h4>Requirements</h4>
      <ul>
        {problem.requirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>
    </ProblemSection>

    <ProblemSection>
      <h4>Constraints</h4>
      <ul>
        {problem.constraints.map((constraint, index) => (
          <li key={index}>{constraint}</li>
        ))}
      </ul>
    </ProblemSection>

    <ProblemSection>
      <h4>Acceptance Criteria</h4>
      <ul>
        {problem.acceptanceCriteria.map((criterion, index) => (
          <li key={index}>{criterion}</li>
        ))}
      </ul>
    </ProblemSection>

    <ProblemSection>
      <h4>Technologies</h4>
      <TechnologyTags>
        {problem.technologies.map((tech, index) => (
          <TechnologyTag key={index}>{tech}</TechnologyTag>
        ))}
      </TechnologyTags>
    </ProblemSection>

    {problem.hints && problem.hints.length > 0 && (
      <ProblemSection>
        <h4>💡 Hints</h4>
        <ul>
          {problem.hints.map((hint, index) => (
            <li key={index}>{hint}</li>
          ))}
        </ul>
      </ProblemSection>
    )}
  </div>
);

const renderSystemDesignProblem = (problem: SystemDesignProblem) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
      <DifficultyBadge difficulty={problem.difficulty}>
        {problem.difficulty}
      </DifficultyBadge>
      <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
        ⏱️ {problem.estimatedTime}
      </span>
    </div>

    <ProblemSection>
      <h4>Description</h4>
      <p>{problem.description}</p>
    </ProblemSection>

    <ProblemSection>
      <h4>Functional Requirements</h4>
      <ul>
        {problem.functionalRequirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>
    </ProblemSection>

    <ProblemSection>
      <h4>Non-Functional Requirements</h4>
      <ul>
        {problem.nonFunctionalRequirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>
    </ProblemSection>

    <ProblemSection>
      <h4>Constraints</h4>
      <ul>
        {problem.constraints.map((constraint, index) => (
          <li key={index}>{constraint}</li>
        ))}
      </ul>
    </ProblemSection>

    <ProblemSection>
      <h4>📊 Scale</h4>
      <ScaleInfo>
        <p>
          <strong>👥 Users:</strong> {problem.scale.users}
        </p>
        <p>
          <strong>⚡ Requests per Second:</strong>{" "}
          {problem.scale.requestsPerSecond}
        </p>
        <p>
          <strong>💾 Data Size:</strong> {problem.scale.dataSize}
        </p>
      </ScaleInfo>
    </ProblemSection>

    <ProblemSection>
      <h4>Expected Deliverables</h4>
      <ul>
        {problem.expectedDeliverables.map((deliverable, index) => (
          <li key={index}>{deliverable}</li>
        ))}
      </ul>
    </ProblemSection>

    <ProblemSection>
      <h4>Technologies</h4>
      <TechnologyTags>
        {problem.technologies.map((tech, index) => (
          <TechnologyTag key={index}>{tech}</TechnologyTag>
        ))}
      </TechnologyTags>
    </ProblemSection>

    {problem.followUpQuestions && problem.followUpQuestions.length > 0 && (
      <ProblemSection>
        <h4>❓ Follow-up Questions</h4>
        <ul>
          {problem.followUpQuestions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </ProblemSection>
    )}
  </div>
);

const renderDSAProblem = (problem: DSAProblem) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
      <DifficultyBadge difficulty={problem.difficulty}>
        {problem.difficulty}
      </DifficultyBadge>
      <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
        ⏱️ {problem.estimatedTime}
      </span>
    </div>

    <ProblemSection>
      <h4>Problem Statement</h4>
      <p>{problem.problemStatement}</p>
    </ProblemSection>

    <ProblemSection>
      <h4>Input Format</h4>
      <p>{problem.inputFormat}</p>
    </ProblemSection>

    <ProblemSection>
      <h4>Output Format</h4>
      <p>{problem.outputFormat}</p>
    </ProblemSection>

    <ProblemSection>
      <h4>Constraints</h4>
      <ul>
        {problem.constraints.map((constraint, index) => (
          <li key={index}>{constraint}</li>
        ))}
      </ul>
    </ProblemSection>

    <ProblemSection>
      <h4>📝 Examples</h4>
      {problem.examples.map((example, index) => (
        <ExampleBox key={index}>
          <p><strong>Example {index + 1}:</strong></p>
          <p><strong>Input:</strong> {example.input}</p>
          <p><strong>Output:</strong> {example.output}</p>
          {example.explanation && (
            <p><strong>Explanation:</strong> {example.explanation}</p>
          )}
        </ExampleBox>
      ))}
    </ProblemSection>

    {problem.hints && problem.hints.length > 0 && (
      <ProblemSection>
        <h4>💡 Hints</h4>
        <ul>
          {problem.hints.map((hint, index) => (
            <li key={index}>{hint}</li>
          ))}
        </ul>
      </ProblemSection>
    )}

    <ProblemSection>
      <h4>Category</h4>
      <p>{problem.category}</p>
    </ProblemSection>

    <ProblemSection>
      <h4>Tags</h4>
      <TechnologyTags>
        {problem.tags.map((tag, index) => (
          <TechnologyTag key={index}>{tag}</TechnologyTag>
        ))}
      </TechnologyTags>
    </ProblemSection>
  </div>
);

export default function InterviewPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();
  const [problem, setProblem] = useState<ParsedProblemData | null>(null);
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isProblemPanelCollapsed, setIsProblemPanelCollapsed] = useState(false);
  const [problemPanelWidth, setProblemPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const excalidrawRef = useRef<any>(null);
  const problemPanelRef = useRef<HTMLDivElement>(null);

  // Allow non-authenticated users to view problems but show a message
  // No longer redirecting to login

  const fetchProblem = async () => {
    console.log("id not found", id);

    if (!id || Array.isArray(id)) {
      setError({
        type: "not_found",
        message: "Invalid problem ID provided.",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const doc = await getProblemById(id);
      console.log(doc, "doc");
      if (doc) {
        setProblem(doc);
      } else {
        console.log("doc not found");
        setError({
          type: "not_found",
          message:
            "Problem not found. It may have been deleted or the link is incorrect.",
        });
      }
    } catch (err) {
      console.error("Error fetching problem:", err);

      // Determine error type based on the error
      if (err instanceof Error) {
        if (
          err.message.includes("permission") ||
          err.message.includes("unauthorized")
        ) {
          setError({
            type: "unauthorized",
            message: "You do not have permission to access this problem.",
          });
        } else if (
          err.message.includes("network") ||
          err.message.includes("fetch")
        ) {
          setError({
            type: "network",
            message:
              "Network error. Please check your internet connection and try again.",
          });
        } else {
          setError({
            type: "unknown",
            message:
              "An unexpected error occurred while loading the problem. Please try again.",
          });
        }
      } else {
        setError({
          type: "unknown",
          message:
            "An unexpected error occurred while loading the problem. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch problem by id
  useEffect(() => {
    if (id) {
      fetchProblem();
    }
  }, [id]);

  const handleEvaluated = (fb: string) => {
    setFeedback(fb);
  };

  const handleRetry = () => {
    fetchProblem();
  };

  const handleBack = () => {
    router.push("/problems");
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || !problemPanelRef.current) return;
    
    const newWidth = e.clientX;
    const minWidth = 300;
    const maxWidth = 600;
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setProblemPanelWidth(newWidth);
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  const toggleProblemPanel = () => {
    setIsProblemPanelCollapsed(!isProblemPanelCollapsed);
  };

  const clearFeedback = () => {
    setFeedback(null);
  };

  // Add resize event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing]);

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <>
        <NavBar />
        <LoadingContainer>
          <p>Loading...</p>
        </LoadingContainer>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <NavBar />
        <ErrorContainer>
          <ErrorTitle>
            {error.type === "network" && "Network Error"}
            {error.type === "not_found" && "Problem Not Found"}
            {error.type === "unauthorized" && "Access Denied"}
            {error.type === "unknown" && "Error"}
          </ErrorTitle>
          <ErrorMessage>{error.message}</ErrorMessage>
          <div style={{ display: "flex", gap: "1rem" }}>
            <RetryButton onClick={handleRetry}>Try Again</RetryButton>
            <BackButton onClick={handleBack}>Back to Problems</BackButton>
          </div>
        </ErrorContainer>
      </>
    );
  }

  // Show loading while fetching problem
  if (loading) {
    return (
      <>
        <NavBar />
        <LoadingContainer>
          <p>Loading problem...</p>
        </LoadingContainer>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <PageContainer>
        {problem ? (
          <>
            <MainContent>
              <ProblemPanel 
                ref={problemPanelRef}
                isCollapsed={isProblemPanelCollapsed}
                style={{ width: isProblemPanelCollapsed ? '50px' : `${problemPanelWidth}px` }}
              >
                {!isProblemPanelCollapsed && (
                  <>
                    <ProblemHeader>
                      <h1>{problem.designation}</h1>
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
                          <strong>Note:</strong> You can view and practice this problem. Sign in to submit your solution and get AI feedback.
                        </AuthMessage>
                      )}
                    </ProblemHeader>
                    <ProblemContent>
                      {problem.interviewType === "design"
                        ? problem.systemDesignProblem
                          ? renderSystemDesignProblem(problem.systemDesignProblem)
                          : "No system design problem available"
                        : problem.interviewType === "dsa"
                        ? problem.dsaProblem
                          ? renderDSAProblem(problem.dsaProblem)
                          : "No DSA problem available"
                        : problem.machineCodingProblem
                        ? renderMachineCodingProblem(problem.machineCodingProblem)
                        : "No machine coding problem available"}
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
                  <EditorTabs>
                    <Tab active={problem.interviewType === "coding" || problem.interviewType === "dsa"}>
                      {problem.interviewType === "dsa" ? "Solution" : "Code"}
                    </Tab>
                    {problem.interviewType === "design" && (
                      <Tab active={true}>System Design</Tab>
                    )}
                  </EditorTabs>
                  <ActionButtons>
                    <EvaluateButton
                      designation={problem.designation}
                      code={problem.interviewType === "coding" || problem.interviewType === "dsa" ? code : ""}
                      excalidrawRef={excalidrawRef}
                      problemId={problem.id || ""}
                      onEvaluated={handleEvaluated}
                    />
                    <Button variant="success">Submit</Button>
                  </ActionButtons>
                </EditorHeader>
                <EditorContainer>
                  {problem.interviewType === "design" ? (
                    <SystemDesignCanvas ref={excalidrawRef} />
                  ) : (
                    <CodeEditor code={code} onChange={setCode} />
                  )}
                </EditorContainer>
                <OutputPanel isVisible={feedback !== null}>
                  <OutputHeader>
                    <h4>AI Feedback</h4>
                    <ActionButtons>
                      <Button variant="secondary" onClick={clearFeedback}>Clear</Button>
                      <Button variant="success">Save</Button>
                    </ActionButtons>
                  </OutputHeader>
                  <OutputContent>
                    {feedback || "No feedback yet. Click 'Evaluate' to get started."}
                  </OutputContent>
                </OutputPanel>
              </EditorPanel>
            </MainContent>
            
            {/* Remove the hidden evaluate button since we're now using it directly */}
          </>
        ) : (
          <LoadingContainer>
            <p>Loading problem...</p>
          </LoadingContainer>
        )}
      </PageContainer>
    </>
  );
}
