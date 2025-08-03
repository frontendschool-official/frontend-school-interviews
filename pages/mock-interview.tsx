import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  FiPlay,
  FiClock,
  FiCheck,
  FiX,
  FiArrowRight,
  FiSearch,
  FiFilter,
  FiHome,
  FiUser,
  FiTarget,
  FiZap,
  FiCode,
  FiAward,
  FiBarChart2,
  FiBookOpen,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useThemeContext } from "../hooks/useTheme";
import NavBar from "../components/NavBar";
import { MockInterviewSession, MockInterviewProblem } from "../types/problem";
import {
  createMockInterviewSession,
  getProblemsByCompanyRoleRound,
} from "../services/firebase";
import { generateMockInterviewProblem } from "../services/geminiApi";
import {
  PageContainer,
  MainContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  Card,
  SelectableCard,
  CardTitle,
  CardDescription,
  CardMeta,
  Grid,
  Button,
  ButtonContainer,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  Modal,
  ModalContent,
  ModalTitle,
  ModalInfo,
  InfoRow,
  InfoLabel,
  InfoValue,
  ModalButtons,
  Section,
  SectionTitle,
  SectionSubtitle,
  ErrorMessage,
} from "../styles/SharedUI";

// Enhanced themed components
const InterviewContainer = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  min-height: 100vh;
  transition: all 0.3s ease;
`;

const CompactMainContainer = styled(MainContainer)`
  padding: 15px;
  max-width: 1400px;
`;

const EnhancedCard = styled(Card)`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px ${({ theme }) => theme.border}10;
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
  animation: ${({ theme }) => theme.fadeInUp || "none"} 0.6s ease-out;

  &:hover {
    box-shadow: 0 6px 20px ${({ theme }) => theme.border}20;
    transform: translateY(-1px);
  }
`;

const EnhancedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`;

const EnhancedSelectableCard = styled(SelectableCard)`
  padding: 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ theme }) => theme.primary}10 50%,
      transparent 100%
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${({ theme }) => theme.border}25;

    &::before {
      left: 100%;
    }
  }

  ${({ selected, theme }) =>
    selected &&
    `
    border-color: ${theme.primary};
    box-shadow: 0 4px 15px ${theme.primary}25;
    background: ${theme.primary}05;
    
    &::after {
      content: '✓';
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 20px;
      height: 20px;
      background: ${theme.primary};
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: bold;
      animation: ${theme.pulse || "none"} 0.6s ease-in-out;
    }
  `}
`;

const EnhancedSection = styled(Section)`
  margin-bottom: 1.5rem;
  animation: ${({ theme }) => theme.fadeInUp || "none"} 0.6s ease-out;
`;

const EnhancedSectionTitle = styled(SectionTitle)`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.neutralDark} 0%,
    ${({ theme }) => theme.neutral} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const EnhancedSectionSubtitle = styled(SectionSubtitle)`
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.neutral};
`;

const EnhancedCardTitle = styled(CardTitle)`
  font-size: 1rem;
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const EnhancedCardDescription = styled(CardDescription)`
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const EnhancedCardMeta = styled(CardMeta)`
  font-size: 0.7rem;
  gap: 0.25rem;
  color: ${({ theme }) => theme.neutral};
`;

const EnhancedButtonContainer = styled(ButtonContainer)`
  margin-top: 1.5rem;
  text-align: center;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 0.75rem 0;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: ${({ theme }) => theme.secondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  min-width: 80px;
`;

const StatNumber = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.neutral};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Types
interface Company {
  name: string;
  description: string;
  logo?: string;
  category?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  level: "entry" | "mid" | "senior";
}

interface Round {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  type:
    | "Machine Coding"
    | "System Design"
    | "JavaScript Concepts"
    | "DSA"
    | "Theory";
}

// Sample data
const COMPANIES: Company[] = [
  {
    name: "Amazon",
    description: "E-commerce and cloud computing",
    category: "Tech Giants",
  },
  {
    name: "Google",
    description: "Search and AI technology",
    category: "Tech Giants",
  },
  {
    name: "Microsoft",
    description: "Software and cloud services",
    category: "Tech Giants",
  },
  {
    name: "Meta",
    description: "Social media and technology",
    category: "Tech Giants",
  },
  {
    name: "Apple",
    description: "Consumer electronics and software",
    category: "Tech Giants",
  },
  {
    name: "Netflix",
    description: "Streaming entertainment",
    category: "Tech Giants",
  },
  {
    name: "Shopify",
    description: "E-commerce platform",
    category: "E-commerce",
  },
  { name: "Stripe", description: "Payment processing", category: "E-commerce" },
  {
    name: "Uber",
    description: "Ride-sharing and delivery",
    category: "Transportation",
  },
  {
    name: "Airbnb",
    description: "Online marketplace for lodging",
    category: "Travel",
  },
  {
    name: "PayPal",
    description: "Digital payments platform",
    category: "Finance",
  },
  {
    name: "Twitter",
    description: "Social media platform",
    category: "Social Media",
  },
];

const ROLES: Role[] = [
  {
    id: "sde1",
    name: "SDE1",
    description: "Software Development Engineer I - Entry level",
    level: "entry",
  },
  {
    id: "sde2",
    name: "SDE2",
    description: "Software Development Engineer II - Mid level",
    level: "mid",
  },
  {
    id: "sde3",
    name: "SDE3",
    description: "Software Development Engineer III - Senior level",
    level: "senior",
  },
];

const ROUNDS: Round[] = [
  {
    id: "round1",
    name: "Round 1",
    description: "Technical screening and coding assessment",
    duration: 45,
    type: "Machine Coding",
  },
  {
    id: "round2",
    name: "Round 2",
    description: "System design and architecture discussion",
    duration: 60,
    type: "System Design",
  },
  {
    id: "round3",
    name: "Round 3",
    description: "JavaScript concepts and frontend fundamentals",
    duration: 30,
    type: "JavaScript Concepts",
  },
  {
    id: "round4",
    name: "Round 4",
    description: "Data structures and algorithms",
    duration: 45,
    type: "DSA",
  },
  {
    id: "theory",
    name: "Theory Round",
    description: "JavaScript theory and concepts assessment",
    duration: 30,
    type: "Theory",
  },
];

export default function MockInterview() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { themeObject } = useThemeContext();
  const { type } = router.query;

  const [step, setStep] = useState<"setup" | "interview" | "loading">("setup");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [selectedInterviewType, setSelectedInterviewType] =
    useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOverview, setShowOverview] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState<MockInterviewProblem[]>([]);
  const [session, setSession] = useState<MockInterviewSession | null>(null);

  // Handle type parameter from URL
  useEffect(() => {
    if (type && typeof type === "string") {
      const interviewType = type.toLowerCase();

      // Find the appropriate round based on the type
      const matchingRound = ROUNDS.find(
        (round) =>
          round.type.toLowerCase().replace(" ", "_") === interviewType ||
          round.type.toLowerCase().replace(" ", "") === interviewType ||
          round.type.toLowerCase() === interviewType
      );

      if (matchingRound) {
        setSelectedRound(matchingRound);
        setSelectedInterviewType(matchingRound.type);
      }
    }
  }, [type]);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setError(null);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleRoundSelect = (round: Round) => {
    setSelectedRound(round);
    setSelectedInterviewType(round.type);
    setError(null);
  };

  const canProceed = selectedCompany && selectedRole && selectedRound;

  const handleStartInterview = async () => {
    if (!canProceed || !user) return;

    setLoading(true);
    setError(null);

    try {
      // Check if problems already exist for this combination
      const existingProblems = await getProblemsByCompanyRoleRound(
        selectedCompany.name,
        selectedRole.name,
        selectedRound.name,
        selectedInterviewType
      );

      let interviewProblems: MockInterviewProblem[] = [];

      if (existingProblems.length > 0) {
        // Use existing problems
        interviewProblems = existingProblems;
      } else {
        // Generate new problems using Gemini API
        const problemPromises = Array.from({ length: 3 }, () =>
          generateMockInterviewProblem(
            selectedInterviewType.toLowerCase().replace(" ", "_") as any,
            selectedCompany.name,
            selectedRole.name,
            "medium"
          )
        );

        interviewProblems = await Promise.all(problemPromises);
      }

      // Create interview session
      const sessionData = {
        userId: user.uid,
        companyName: selectedCompany.name,
        roleLevel: selectedRole.name,
        roundName: selectedRound.name,
        roundType: selectedInterviewType.toLowerCase().replace(" ", "_") as
          | "dsa"
          | "machine_coding"
          | "system_design"
          | "theory",
        problems: interviewProblems,
        currentProblemIndex: 0,
        status: "active" as const,
        startedAt: new Date(),
      };

      const newSession = await createMockInterviewSession(sessionData);
      setSession(newSession);
      setProblems(interviewProblems);

      // Start the interview
      setStep("interview");
    } catch (error) {
      console.error("Error starting interview:", error);
      setError("Failed to start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    } else {
      // Interview completed
      setStep("loading");
      // Navigate to results or completion page
      router.push("/mock-interviews");
    }
  };

  const handlePreviousProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
    }
  };

  if (authLoading) {
    return (
      <PageContainer>
        <NavBar />
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (!user) {
    return null;
  }

  if (step === "interview" && problems.length > 0) {
    const currentProblem = problems[currentProblemIndex];

    return (
      <InterviewContainer>
        <NavBar />
        <CompactMainContainer>
          <PageHeader>
            <PageTitle>Mock Interview - {selectedCompany?.name}</PageTitle>
            <PageSubtitle>
              {selectedRole?.name} • {selectedRound?.name} • Problem{" "}
              {currentProblemIndex + 1} of {problems.length}
            </PageSubtitle>
          </PageHeader>

          <EnhancedCard>
            <EnhancedSectionTitle>
              Problem {currentProblemIndex + 1}
            </EnhancedSectionTitle>
            <EnhancedSectionSubtitle>
              {currentProblem.title}
            </EnhancedSectionSubtitle>

            <div
              style={{
                background: themeObject.secondary,
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                border: `1px solid ${themeObject.border}`,
              }}
            >
              <h3 style={{ marginBottom: "0.5rem", color: themeObject.text }}>
                Problem Description:
              </h3>
              <p style={{ color: themeObject.neutral, lineHeight: "1.6" }}>
                {currentProblem.description}
              </p>
            </div>

            {currentProblem.examples && currentProblem.examples.length > 0 && (
              <div
                style={{
                  background: themeObject.primary + "10",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  border: `1px solid ${themeObject.primary + "20"}`,
                }}
              >
                <h4
                  style={{ marginBottom: "0.5rem", color: themeObject.primary }}
                >
                  Examples:
                </h4>
                {currentProblem.examples.map((example, index) => (
                  <div key={index} style={{ marginBottom: "0.5rem" }}>
                    <strong style={{ color: themeObject.text }}>
                      Example {index + 1}:
                    </strong>
                    <p
                      style={{
                        color: themeObject.neutral,
                        margin: "0.25rem 0",
                      }}
                    >
                      {typeof example === "string"
                        ? example
                        : JSON.stringify(example)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                background: themeObject.accent + "10",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                border: `1px solid ${themeObject.accent + "20"}`,
              }}
            >
              <h4 style={{ marginBottom: "0.5rem", color: themeObject.accent }}>
                Your Answer:
              </h4>
              <textarea
                style={{
                  width: "100%",
                  minHeight: "200px",
                  padding: "1rem",
                  border: `1px solid ${themeObject.border}`,
                  borderRadius: "8px",
                  background: themeObject.secondary,
                  color: themeObject.text,
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  resize: "vertical",
                }}
                placeholder="Write your answer here..."
              />
            </div>

            <EnhancedButtonContainer>
              <Button
                variant="secondary"
                onClick={handlePreviousProblem}
                disabled={currentProblemIndex === 0}
                style={{ marginRight: "1rem" }}
              >
                <FiArrowRight
                  size={16}
                  style={{ transform: "rotate(180deg)" }}
                />
                Previous
              </Button>

              <Button onClick={handleNextProblem} size="large">
                {currentProblemIndex === problems.length - 1 ? (
                  <>
                    <FiCheck size={16} />
                    Complete Interview
                  </>
                ) : (
                  <>
                    Next Problem
                    <FiArrowRight size={16} />
                  </>
                )}
              </Button>
            </EnhancedButtonContainer>
          </EnhancedCard>
        </CompactMainContainer>
      </InterviewContainer>
    );
  }

  return (
    <InterviewContainer>
      <NavBar />

      <CompactMainContainer>
        {/* <PageHeader style={{ padding: "1.5rem", marginBottom: "1rem" }}>
          <PageTitle style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            {type
              ? `${
                  typeof type === "string"
                    ? type.charAt(0).toUpperCase() + type.slice(1)
                    : type[0]?.charAt(0).toUpperCase() + type[0]?.slice(1)
                } Mock Interview`
              : "Mock Interview Setup"}
          </PageTitle>
          <PageSubtitle style={{ fontSize: "1rem" }}>
            Configure your AI-powered mock interview experience
          </PageSubtitle>
        </PageHeader> */}

        {/* Step 1: Company Selection */}
        <EnhancedSection>
          <EnhancedCard>
            <EnhancedSectionTitle>Step 1: Select Company</EnhancedSectionTitle>
            <EnhancedSectionSubtitle>
              Choose the company you want to practice interviewing for
            </EnhancedSectionSubtitle>

            <StatsContainer>
              <StatItem>
                <StatNumber>{COMPANIES.length}</StatNumber>
                <StatLabel>Companies</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{selectedCompany ? 1 : 0}</StatNumber>
                <StatLabel>Selected</StatLabel>
              </StatItem>
            </StatsContainer>

            <EnhancedGrid>
              {COMPANIES.map((company) => (
                <EnhancedSelectableCard
                  key={company.name}
                  selected={selectedCompany?.name === company.name}
                  onClick={() => handleCompanySelect(company)}
                >
                  <EnhancedCardTitle>{company.name}</EnhancedCardTitle>
                  <EnhancedCardDescription>
                    {company.description}
                  </EnhancedCardDescription>
                  {company.category && (
                    <EnhancedCardMeta>
                      <FiFilter size={12} />
                      {company.category}
                    </EnhancedCardMeta>
                  )}
                </EnhancedSelectableCard>
              ))}
            </EnhancedGrid>
          </EnhancedCard>
        </EnhancedSection>

        {/* Step 2: Role Selection */}
        <EnhancedSection>
          <EnhancedCard>
            <EnhancedSectionTitle>
              Step 2: Select Role Level
            </EnhancedSectionTitle>
            <EnhancedSectionSubtitle>
              Choose your target role level
            </EnhancedSectionSubtitle>
            <EnhancedGrid>
              {ROLES.map((role) => (
                <EnhancedSelectableCard
                  key={role.id}
                  selected={selectedRole?.id === role.id}
                  onClick={() => handleRoleSelect(role)}
                >
                  <EnhancedCardTitle>{role.name}</EnhancedCardTitle>
                  <EnhancedCardDescription>
                    {role.description}
                  </EnhancedCardDescription>
                  <EnhancedCardMeta>
                    <FiClock size={12} />
                    {role.level} level
                  </EnhancedCardMeta>
                </EnhancedSelectableCard>
              ))}
            </EnhancedGrid>
          </EnhancedCard>
        </EnhancedSection>

        {/* Step 3: Round Selection */}
        <EnhancedSection>
          <EnhancedCard>
            <EnhancedSectionTitle>
              Step 3: Select Interview Round
            </EnhancedSectionTitle>
            <EnhancedSectionSubtitle>
              Choose the specific round you want to practice
            </EnhancedSectionSubtitle>
            <EnhancedGrid>
              {ROUNDS.map((round) => (
                <EnhancedSelectableCard
                  key={round.id}
                  selected={selectedRound?.id === round.id}
                  onClick={() => handleRoundSelect(round)}
                >
                  <EnhancedCardTitle>{round.name}</EnhancedCardTitle>
                  <EnhancedCardDescription>
                    {round.description}
                  </EnhancedCardDescription>
                  <EnhancedCardMeta>
                    <FiClock size={12} />
                    {round.duration} min • {round.type}
                  </EnhancedCardMeta>
                </EnhancedSelectableCard>
              ))}
            </EnhancedGrid>
          </EnhancedCard>
        </EnhancedSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <EnhancedButtonContainer>
          <Button
            onClick={handleStartInterview}
            disabled={!canProceed || loading}
            size="large"
            style={{
              background:
                canProceed && !loading
                  ? `linear-gradient(135deg, ${themeObject.primary} 0%, ${themeObject.accent} 100%)`
                  : undefined,
              boxShadow:
                canProceed && !loading
                  ? `0 6px 20px ${themeObject.primary}25`
                  : undefined,
            }}
          >
            {loading ? (
              <>
                <LoadingSpinner
                  style={{ width: "16px", height: "16px", margin: 0 }}
                />
                Starting Interview...
              </>
            ) : (
              <>
                <FiPlay size={16} />
                Start Mock Interview
              </>
            )}
          </Button>
        </EnhancedButtonContainer>
      </CompactMainContainer>
    </InterviewContainer>
  );
}
