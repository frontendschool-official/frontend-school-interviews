import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiUsers,
  FiBriefcase,
} from "react-icons/fi";
import { getInterviewInsights } from "@/services/interview-rounds";
import { createInterviewSimulation } from "@/services/firebase";
import Layout from "@/components/Layout";

interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
}

interface Role {
  id: string;
  title: string;
  level: "junior" | "mid" | "senior";
  description: string;
  estimatedTime: string;
}

interface Round {
  id: string;
  name: string;
  type: "dsa" | "machine_coding" | "system_design" | "theory";
  description: string;
  duration: string;
}

const companies: Company[] = [
  {
    id: "google",
    name: "Google",
    logo: "🔍",
    description: "Search and AI technology",
    difficulty: "hard",
  },
  {
    id: "meta",
    name: "Meta",
    logo: "📘",
    description: "Social media and VR",
    difficulty: "hard",
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "📦",
    description: "E-commerce and cloud",
    difficulty: "hard",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "🪟",
    description: "Software and cloud",
    difficulty: "medium",
  },
  {
    id: "apple",
    name: "Apple",
    logo: "🍎",
    description: "Hardware and software",
    difficulty: "hard",
  },
  {
    id: "netflix",
    name: "Netflix",
    logo: "📺",
    description: "Streaming entertainment",
    difficulty: "medium",
  },
];

const roles: Role[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    level: "mid",
    description: "Build user interfaces and web applications",
    estimatedTime: "45 minutes",
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    level: "senior",
    description: "End-to-end application development",
    estimatedTime: "60 minutes",
  },
  {
    id: "ui-ux",
    title: "UI/UX Developer",
    level: "mid",
    description: "Create beautiful and functional interfaces",
    estimatedTime: "45 minutes",
  },
  {
    id: "react",
    title: "React Developer",
    level: "mid",
    description: "Specialized in React ecosystem",
    estimatedTime: "45 minutes",
  },
];

const rounds: Round[] = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    type: "dsa",
    description: "Solve algorithmic problems",
    duration: "30 minutes",
  },
  {
    id: "machine_coding",
    name: "Machine Coding",
    type: "machine_coding",
    description: "Build functional components",
    duration: "45 minutes",
  },
  {
    id: "system_design",
    name: "System Design",
    type: "system_design",
    description: "Design scalable systems",
    duration: "60 minutes",
  },
  {
    id: "theory",
    name: "Frontend Theory",
    type: "theory",
    description: "JavaScript and React concepts",
    duration: "30 minutes",
  },
];

const steps = [
  { id: "company", title: "Company", description: "Choose target company" },
  { id: "role", title: "Role", description: "Select position" },
  { id: "round", title: "Round", description: "Pick interview type" },
  { id: "start", title: "Start", description: "Begin interview" },
];

export default function InterviewSimulation() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleRoundSelect = (round: Round) => {
    setSelectedRound(round);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/dashboard");
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleStartInterview();
    }
  };

  const handleStartInterview = async () => {
    if (!user || !selectedCompany || !selectedRole) return;

    setLoading(true);
    try {
      // 1) Get rounds via Gemini insights (cached or fresh)
      const insights = await getInterviewInsights({
        companyName: selectedCompany.name,
        roleLevel: selectedRole.title,
      });

      // 2) Create simulation document
      const simulationId = await createInterviewSimulation({
        userId: user.uid,
        companyName: insights.companyName,
        roleLevel: insights.roleLevel,
        insights: insights.data,
      });

      // 3) Navigate to round 1 of the new simulation
      router.push(`/interview-simulation/${simulationId}/1`);
    } catch (error) {
      console.error("Error starting interview:", error);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedCompany !== null;
      case 1:
        return selectedRole !== null;
      case 2:
        return selectedRound !== null;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-text mb-4">
                Choose Your Target Company
              </h2>
              <p className="text-text/80 text-lg">
                Select the company you want to practice interviewing for
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => handleCompanySelect(company)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    selectedCompany?.id === company.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{company.logo}</div>
                    <h3 className="text-xl font-semibold text-text mb-2">
                      {company.name}
                    </h3>
                    <p className="text-text/70 text-sm mb-3">
                      {company.description}
                    </p>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        company.difficulty === "hard"
                          ? "bg-red-100 text-red-800"
                          : company.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {company.difficulty} difficulty
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-text mb-4">
                Select Your Role
              </h2>
              <p className="text-text/80 text-lg">
                Choose the position you're applying for
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    selectedRole?.id === role.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <FiBriefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-text mb-2">
                        {role.title}
                      </h3>
                      <p className="text-text/70 text-sm mb-3">
                        {role.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-text/60">
                        <span className="capitalize">{role.level} level</span>
                        <span className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          {role.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-text mb-4">
                Choose Interview Round
              </h2>
              <p className="text-text/80 text-lg">
                Select the type of interview you want to practice
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rounds.map((round) => (
                <div
                  key={round.id}
                  onClick={() => handleRoundSelect(round)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    selectedRound?.id === round.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <FiUsers className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-text mb-2">
                        {round.name}
                      </h3>
                      <p className="text-text/70 text-sm mb-3">
                        {round.description}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-text/60">
                        <FiClock className="w-4 h-4" />
                        {round.duration}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-text mb-4">
                Ready to Start?
              </h2>
              <p className="text-text/80 text-lg">
                Review your selections and begin the interview
              </p>
            </div>

            <div className="bg-secondary border border-border rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">{selectedCompany?.logo}</div>
                  <h3 className="font-semibold text-text">
                    {selectedCompany?.name}
                  </h3>
                  <p className="text-sm text-text/70">
                    {selectedCompany?.description}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <FiBriefcase className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-text">
                    {selectedRole?.title}
                  </h3>
                  <p className="text-sm text-text/70 capitalize">
                    {selectedRole?.level} level
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <FiUsers className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-text">
                    {selectedRound?.name}
                  </h3>
                  <p className="text-sm text-text/70">
                    {selectedRound?.duration}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-text/70 mb-4">
                You'll be presented with problems tailored to your selections.
                Good luck!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-text hover:bg-secondary transition-colors"
        >
          <FiArrowLeft />
          Back
        </button>
        <h1 className="text-2xl font-bold text-text">Interview Simulation</h1>
        <div className="w-20"></div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                index <= currentStep ? "opacity-100" : "opacity-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                    ? "bg-primary text-white"
                    : "bg-border text-text/50"
                }`}
              >
                {index < currentStep ? (
                  <FiCheck className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-text">
                  {step.title}
                </div>
                <div className="text-xs text-text/60">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">{renderStepContent()}</div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg text-text hover:bg-secondary transition-colors"
        >
          <FiArrowLeft />
          {currentStep === 0 ? "Back to Dashboard" : "Previous"}
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed() || loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            "Starting..."
          ) : currentStep === steps.length - 1 ? (
            <>
              Start Interview
              <FiArrowRight />
            </>
          ) : (
            <>
              Next
              <FiArrowRight />
            </>
          )}
        </button>
      </div>
    </Layout>
  );
}
