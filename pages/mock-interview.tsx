import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
import { MockInterviewSession } from "../types/problem";
import {
  createMockInterviewSession,
} from "../services/firebase";
import MockInterviewComponent from "../components/MockInterview";
import {
  Button,
} from "../styles/SharedUI";

// Enhanced themed components with Tailwind CSS classes
const EnhancedPageContainer = ({ children, className = "", ...props }: any) => (
  <div className={`min-h-screen bg-bodyBg transition-all duration-300 ${className}`} {...props}>
    {children}
  </div>
);

const CompactMainContainer = ({ children, className = "", ...props }: any) => (
  <div className={`p-4 max-w-7xl mx-auto ${className}`} {...props}>
    {children}
  </div>
);

const EnhancedCard = ({ children, className = "", ...props }: any) => (
  <div className={`p-6 mb-6 rounded-xl shadow-lg border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`} {...props}>
    {children}
  </div>
);

const EnhancedGrid = ({ children, className = "", ...props }: any) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4 ${className}`} {...props}>
    {children}
  </div>
);

const EnhancedSelectableCard = ({ children, selected = false, className = "", onClick, ...props }: any) => (
  <div 
    className={`p-4 rounded-lg transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
      selected ? 'border-primary shadow-lg bg-primary/5' : ''
    } ${className}`} 
    onClick={onClick}
    {...props}
  >
    {children}
    {selected && (
      <div className="absolute top-3 right-3 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
        ✓
      </div>
    )}
  </div>
);

const EnhancedSection = ({ children, className = "", ...props }: any) => (
  <div className={`mb-6 ${className}`} {...props}>
    {children}
  </div>
);

const EnhancedSectionTitle = ({ children, className = "", ...props }: any) => (
  <h3 className={`text-xl mb-2 font-semibold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent ${className}`} {...props}>
    {children}
  </h3>
);

const EnhancedSectionSubtitle = ({ children, className = "", ...props }: any) => (
  <p className={`text-sm mb-4 text-neutral-600 ${className}`} {...props}>
    {children}
  </p>
);

const EnhancedCardTitle = ({ children, className = "", ...props }: any) => (
  <h4 className={`text-base mb-1 font-semibold ${className}`} {...props}>
    {children}
  </h4>
);

const EnhancedCardDescription = ({ children, className = "", ...props }: any) => (
  <p className={`text-sm mb-2 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

const EnhancedCardMeta = ({ children, className = "", ...props }: any) => (
  <div className={`text-xs gap-1 text-neutral-600 flex items-center ${className}`} {...props}>
    {children}
  </div>
);

const EnhancedButtonContainer = ({ children, className = "", ...props }: any) => (
  <div className={`mt-6 text-center ${className}`} {...props}>
    {children}
  </div>
);

const EnhancedButtonGroup = ({ children, className = "", ...props }: any) => (
  <div className={`flex justify-center gap-4 my-3 flex-wrap ${className}`} {...props}>
    {children}
  </div>
);

const EnhancedInfoCard = ({ children, className = "", ...props }: any) => (
  <div className={`text-center p-3 bg-secondary rounded-lg border border-border min-w-20 ${className}`} {...props}>
    {children}
  </div>
);

const EnhancedInfoValue = ({ children, className = "", ...props }: any) => (
  <div className={`text-xl font-bold text-primary mb-1 ${className}`} {...props}>
    {children}
  </div>
);

const EnhancedInfoLabel = ({ children, className = "", ...props }: any) => (
  <div className={`text-xs text-neutral-600 uppercase tracking-wider ${className}`} {...props}>
    {children}
  </div>
);

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
  const [session, setSession] = useState<MockInterviewSession | null>(null);

  // Load setup data from localStorage or handle type parameter from URL
  useEffect(() => {
    // First try to load from localStorage (from setup page)
    const setupData = localStorage.getItem('mockInterviewSetup');
    if (setupData) {
      try {
        const parsed = JSON.parse(setupData);
        if (parsed.company) setSelectedCompany(parsed.company);
        if (parsed.role) setSelectedRole(parsed.role);
        if (parsed.round) {
          setSelectedRound(parsed.round);
          setSelectedInterviewType(parsed.round.type);
        }
        // Clear the setup data after loading
        localStorage.removeItem('mockInterviewSetup');
        return;
      } catch (error) {
        console.error('Error parsing setup data:', error);
        localStorage.removeItem('mockInterviewSetup');
      }
    }

    // Fallback to type parameter from URL
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
        problems: [],
        currentProblemIndex: 0,
        status: "active" as const,
        startedAt: new Date(),
      };

      const newSession = await createMockInterviewSession(sessionData);
      setSession(newSession);

      // Start the interview
      setStep("interview");
    } catch (error) {
      console.error("Error starting interview:", error);
      setError("Failed to start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  if (authLoading) {
    return (
      <div className="min-h-screen bg-bodyBg">
        <NavBar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (step === "interview" && session) {
    return (
      <MockInterviewComponent
        interviewId={session?.id || "mock-interview"}
        problems={session?.problems || []}
        onComplete={(result: any) => {
          console.log("Interview completed:", result);
          router.push("/mock-interviews");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-bodyBg">
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

            <div className="flex gap-4 mb-4">
              <div className="text-center p-3 bg-secondary rounded-lg border border-border min-w-20">
                <div className="text-xl font-bold text-primary mb-1">{COMPANIES.length}</div>
                <div className="text-xs text-neutral-600 uppercase tracking-wider">Companies</div>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg border border-border min-w-20">
                <div className="text-xl font-bold text-primary mb-1">{selectedCompany ? 1 : 0}</div>
                <div className="text-xs text-neutral-600 uppercase tracking-wider">Selected</div>
              </div>
            </div>

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

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <EnhancedButtonContainer>
          <Button
            onClick={handleStartInterview}
            disabled={!canProceed || loading}
            size="lg"
            className={canProceed && !loading ? "bg-gradient-to-r from-primary to-accent shadow-lg" : ""}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
    </div>
  );
}
