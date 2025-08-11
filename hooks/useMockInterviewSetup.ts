import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './useAuth';
import { MockInterviewSession } from '../types/problem';

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

const COMPANIES: Company[] = [
  {
    name: "Google",
    description: "Tech giant focusing on search and AI",
    category: "FAANG",
  },
  {
    name: "Microsoft",
    description: "Software and cloud computing leader",
    category: "FAANG",
  },
  {
    name: "Amazon",
    description: "E-commerce and cloud services",
    category: "FAANG",
  },
  {
    name: "Meta",
    description: "Social media and virtual reality",
    category: "FAANG",
  },
  {
    name: "Apple",
    description: "Consumer electronics and software",
    category: "FAANG",
  },
  {
    name: "Netflix",
    description: "Streaming entertainment platform",
    category: "Tech",
  },
  {
    name: "Uber",
    description: "Ride-sharing and delivery services",
    category: "Tech",
  },
  {
    name: "Airbnb",
    description: "Online marketplace for lodging",
    category: "Tech",
  },
];

const ROLES: Role[] = [
  {
    id: "swe-1",
    name: "Software Engineer I",
    description: "Entry-level software engineering role",
    level: "entry",
  },
  {
    id: "swe-2",
    name: "Software Engineer II",
    description: "Mid-level software engineering role",
    level: "mid",
  },
  {
    id: "swe-3",
    name: "Senior Software Engineer",
    description: "Senior-level software engineering role",
    level: "senior",
  },
  {
    id: "sde-1",
    name: "Software Development Engineer I",
    description: "Entry-level development role",
    level: "entry",
  },
  {
    id: "sde-2",
    name: "Software Development Engineer II",
    description: "Mid-level development role",
    level: "mid",
  },
  {
    id: "sde-3",
    name: "Senior Software Development Engineer",
    description: "Senior-level development role",
    level: "senior",
  },
];

const ROUNDS: Round[] = [
  {
    id: "machine-coding",
    name: "Machine Coding Round",
    description: "Live coding session with real-time problem solving",
    duration: 45,
    type: "Machine Coding",
  },
  {
    id: "system-design",
    name: "System Design Round",
    description: "Architecture and system design discussion",
    duration: 60,
    type: "System Design",
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    description: "Algorithm problem solving and optimization",
    duration: 45,
    type: "DSA",
  },
  {
    id: "theory",
    name: "Technical Theory",
    description: "Core concepts and theoretical knowledge",
    duration: 30,
    type: "Theory",
  },
];

export const useMockInterviewSetup = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { type } = router.query;

  const [step, setStep] = useState<"setup" | "interview" | "loading">("setup");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [selectedInterviewType, setSelectedInterviewType] = useState<string>("");
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
      // Create interview session using API
      const sessionData = {
        userId: user.uid,
        companyName: selectedCompany.name,
        roleLevel: selectedRole.name,
        roundName: selectedRound.name,
        roundType: selectedInterviewType.toLowerCase().replace(" ", "_") as
          | "dsa"
          | "machine_coding"
          | "system_design"
          | "theory_and_debugging",
        problems: [],
        currentProblemIndex: 0,
        status: "active" as const,
        startedAt: new Date(),
      };

      const response = await fetch("/api/interview-simulation/session/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error("Failed to create interview session");
      }

      const result = await response.json();
      const newSession: MockInterviewSession = {
        ...sessionData,
        id: result.sessionId,
      };
      
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

  const handleInterviewComplete = (result: any) => {
    // Handle interview completion
    console.log("Interview completed:", result);
    router.push("/dashboard");
  };

  const handleInterviewExit = () => {
    setStep("setup");
    setSession(null);
  };

  return {
    // State
    step,
    selectedCompany,
    selectedRole,
    selectedRound,
    selectedInterviewType,
    loading,
    error,
    session,
    canProceed,
    authLoading,
    user,

    // Data
    companies: COMPANIES,
    roles: ROLES,
    rounds: ROUNDS,

    // Handlers
    handleCompanySelect,
    handleRoleSelect,
    handleRoundSelect,
    handleStartInterview,
    handleInterviewComplete,
    handleInterviewExit,
  };
}; 