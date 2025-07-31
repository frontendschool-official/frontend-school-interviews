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

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const TopBar = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};

  h2 {
    margin: 0 0 1rem 0;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0.5rem 0;
    color: ${({ theme }) => theme.text};
  }
`;

const Split = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Pane = styled.div`
  h3 {
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.text};
  }
`;

const ProblemBox = styled.div`
  background-color: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 1.5rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.6;
`;

const ProblemSection = styled.div`
  margin-bottom: 1.5rem;

  h4 {
    margin: 0 0 0.5rem 0;
    color: ${({ theme }) => theme.primary};
    font-size: 1.1rem;
  }

  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.25rem;
  }
`;

const DifficultyBadge = styled.span<{ difficulty: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${({ difficulty, theme }) => {
    switch (difficulty) {
      case "easy":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "hard":
        return "#ef4444";
      default:
        return theme.border;
    }
  }};
  color: white;
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
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const ScaleInfo = styled.div`
  background-color: ${({ theme }) => theme.bodyBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
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

const Output = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;

  h4 {
    margin: 0 0 1rem 0;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.text};
    line-height: 1.6;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: ${({ theme }) => theme.text};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  gap: 1rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
`;

const ErrorTitle = styled.h2`
  color: #e74c3c;
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
  color: white;
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

interface ErrorState {
  type: "network" | "not_found" | "unauthorized" | "unknown";
  message: string;
}

const renderMachineCodingProblem = (problem: MachineCodingProblem) => (
  <div>
    <h3>{problem.title}</h3>
    <p>{problem.description}</p>

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

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "1rem",
      }}
    >
      <DifficultyBadge difficulty={problem.difficulty}>
        {problem.difficulty}
      </DifficultyBadge>
      <span>Estimated time: {problem.estimatedTime}</span>
    </div>

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
        <h4>Hints</h4>
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
    <h3>{problem.title}</h3>
    <p>{problem.description}</p>

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
      <h4>Scale</h4>
      <ScaleInfo>
        <p>
          <strong>Users:</strong> {problem.scale.users}
        </p>
        <p>
          <strong>Requests per Second:</strong>{" "}
          {problem.scale.requestsPerSecond}
        </p>
        <p>
          <strong>Data Size:</strong> {problem.scale.dataSize}
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

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "1rem",
      }}
    >
      <DifficultyBadge difficulty={problem.difficulty}>
        {problem.difficulty}
      </DifficultyBadge>
      <span>Estimated time: {problem.estimatedTime}</span>
    </div>

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
        <h4>Follow-up Questions</h4>
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
      <h4>Examples</h4>
      {problem.examples.map((example, index) => (
        <div key={index} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <p><strong>Example {index + 1}:</strong></p>
          <p><strong>Input:</strong> {example.input}</p>
          <p><strong>Output:</strong> {example.output}</p>
          {example.explanation && (
            <p><strong>Explanation:</strong> {example.explanation}</p>
          )}
        </div>
      ))}
    </ProblemSection>

    {problem.hints && problem.hints.length > 0 && (
      <ProblemSection>
        <h4>Hints</h4>
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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {problem.tags.map((tag, index) => (
          <span
            key={index}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#e9ecef',
              borderRadius: '12px',
              fontSize: '0.8rem',
              color: '#495057'
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </ProblemSection>

    <ProblemSection>
      <h4>Difficulty</h4>
      <DifficultyBadge difficulty={problem.difficulty}>
        {problem.difficulty}
      </DifficultyBadge>
    </ProblemSection>

    <ProblemSection>
      <h4>Estimated Time</h4>
      <p>{problem.estimatedTime}</p>
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
  const excalidrawRef = useRef<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

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
    if (id && !authLoading) {
      fetchProblem();
    }
  }, [id, authLoading]);

  const handleEvaluated = (fb: string) => {
    setFeedback(fb);
  };

  const handleRetry = () => {
    fetchProblem();
  };

  const handleBack = () => {
    router.push("/problems");
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <>
        <NavBar />
        <Container>
          <LoadingContainer>
            <p>Loading...</p>
          </LoadingContainer>
        </Container>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <NavBar />
        <Container>
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
        </Container>
      </>
    );
  }

  // Show loading while fetching problem
  if (loading) {
    return (
      <>
        <NavBar />
        <Container>
          <LoadingContainer>
            <p>Loading problem...</p>
          </LoadingContainer>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container>
        {problem ? (
          <>
            <TopBar>
              <h2>{problem.designation} Interview</h2>
              <p>
                <strong>Companies:</strong> {problem.companies || "N/A"}
              </p>
              <p>
                <strong>Round:</strong> {problem.round}
              </p>
              <p>
                <strong>Type:</strong> {problem.interviewType}
              </p>
            </TopBar>
            <Split>
              <Pane>
                <h3>Problem</h3>
                <ProblemBox>
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
                </ProblemBox>
              </Pane>
              <Pane>
                <h3>Solution</h3>
                {problem.interviewType === "coding" || problem.interviewType === "dsa" ? (
                  <CodeEditor code={code} onChange={setCode} />
                ) : (
                  <SystemDesignCanvas ref={excalidrawRef} />
                )}
              </Pane>
            </Split>
            <div>
              <EvaluateButton
                designation={problem.designation}
                code={problem.interviewType === "coding" || problem.interviewType === "dsa" ? code : ""}
                excalidrawRef={excalidrawRef}
                problemId={problem.id || ""}
                onEvaluated={handleEvaluated}
              />
            </div>
            {feedback && (
              <Output>
                <h4>AI Feedback</h4>
                <p>{feedback}</p>
              </Output>
            )}
          </>
        ) : (
          <LoadingContainer>
            <p>Loading problem...</p>
          </LoadingContainer>
        )}
      </Container>
    </>
  );
}
