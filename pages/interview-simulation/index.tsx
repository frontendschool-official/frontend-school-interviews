import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  InterviewInsightsRequest,
  InterviewInsightsResponse,
  InterviewRound,
  MockInterviewResult,
} from "../../types/problem";
import { useAuth } from "../../hooks/useAuth";
import { useThemeContext } from "../../hooks/useTheme";
import NavBar from "../../components/NavBar";
import MockInterview from "../../components/MockInterview";
import InterviewSimulationProblem from "../../components/InterviewSimulationProblem";
import {
  generateSimulationProblems,
  SimulationConfig,
  SimulationProblem,
} from "../../services/interview-simulation";
import Layout, { PageContainer } from "@/components/Layout";
import { Container } from "@/container/home/home.styled";
import {
  HeroTitle,
  HeroSubtitle,
  SetupSection,
  StepIndicator,
  Step,
  CompanyGrid,
  CompanyCard,
  CompanyLogo,
  CompanyName,
  CompanyDescription,
  RoleGrid,
  RoleCard,
  RoleHeader,
  RoleName,
  RoleLevel,
  RoleDescription,
  InsightsSection,
  InsightsHeader,
  InsightsTitle,
  InsightsSubtitle,
  RoundsGrid,
  RoundCard,
  RoundHeader,
  RoundName,
  RoundDescription,
  RoundDetails,
  DetailItem,
  FocusAreas,
  FocusAreaTag,
  StartSimulationButton,
  HeroSection
} from "@/container/interview-simulation/interviewSimulation.styled";
import {
  SectionTitle,
  ErrorMessage,
  ButtonContainer,
  ActionButton,
  DifficultyBadge,
  LoadingSpinner,
} from "@/styles/SharedUI";

interface Company {
  name: string;
  description?: string;
  logo?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  level: string;
}

interface StartingRound {
  id: string;
  name: string;
  description: string;
  roundNumber: number;
}

const COMPANIES: Company[] = [
  {
    name: "Google",
    description: "Search and AI technology company",
    logo: "🔍",
  },
  {
    name: "Amazon",
    description: "E-commerce and cloud computing",
    logo: "📦",
  },
  {
    name: "Microsoft",
    description: "Software and cloud services",
    logo: "🪟",
  },
  {
    name: "Meta",
    description: "Social media and technology",
    logo: "📘",
  },
  {
    name: "Apple",
    description: "Consumer electronics and software",
    logo: "🍎",
  },
  {
    name: "Netflix",
    description: "Streaming entertainment",
    logo: "📺",
  },
  {
    name: "Uber",
    description: "Ride-sharing and delivery",
    logo: "🚗",
  },
  {
    name: "Airbnb",
    description: "Online marketplace for lodging",
    logo: "🏠",
  },
  {
    name: "Stripe",
    description: "Payment processing platform",
    logo: "💳",
  },
  {
    name: "Shopify",
    description: "E-commerce platform",
    logo: "🛒",
  },
];

const ROLES: Role[] = [
  {
    id: "sde1",
    name: "SDE1",
    description: "Software Development Engineer I - Entry level",
    level: "Entry",
  },
  {
    id: "sde2",
    name: "SDE2",
    description: "Software Development Engineer II - Mid level",
    level: "Mid",
  },
  {
    id: "sde3",
    name: "SDE3",
    description: "Software Development Engineer III - Senior level",
    level: "Senior",
  },
  {
    id: "others",
    name: "Others",
    description: "Other engineering roles",
    level: "Mixed",
  },
];

export default function InterviewSimulation() {
  const router = useRouter();
  const { user } = useAuth();
  const { themeObject } = useThemeContext();

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [insights, setInsights] = useState<InterviewInsightsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const fetchInterviewInsights = async () => {
    if (!selectedCompany || !selectedRole) return;

    try {
      setLoading(true);
      setError(null);

      const request: InterviewInsightsRequest = {
        companyName: selectedCompany.name,
        roleLevel: selectedRole.name,
      };

      const response = await fetch("/api/interview-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch interview insights");
      }

      const data: InterviewInsightsResponse = await response.json();
      setInsights(data);
      setCurrentStep(3);
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError("Failed to load interview insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startSimulation = async () => {
    if (!selectedCompany || !selectedRole || !insights) return;

    try {
      setLoading(true);
      setError(null);

      const simulationConfig = await generateSimulationProblems(
        insights,
        selectedCompany.name,
        selectedRole.name
      );

      // Generate a unique ID for the simulation
      const simulationId = `sim_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Navigate to the simulation
      router.push(`/interview-simulation/${simulationId}`);
    } catch (err) {
      console.error("Error starting simulation:", err);
      setError("Failed to start simulation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setCurrentStep(2);
    setInsights(null);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    if (selectedCompany) {
      fetchInterviewInsights();
    }
  };

  const resetSelection = () => {
    setSelectedCompany(null);
    setSelectedRole(null);
    setInsights(null);
    setCurrentStep(1);
    setError(null);
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <PageContainer>
        <Container>
          <HeroSection>
            <HeroTitle>Interview Simulation</HeroTitle>
            <HeroSubtitle>
              Practice with realistic interview scenarios tailored to your
              target company and role. Get personalized insights and improve
              your interview skills.
            </HeroSubtitle>
          </HeroSection>

          <SetupSection>
            <SectionTitle>Setup Your Simulation</SectionTitle>

            <StepIndicator>
              <Step active={currentStep === 1} completed={currentStep > 1}>
                <div className="step-number">1</div>
                <div className="step-label">Choose Company</div>
              </Step>
              <Step active={currentStep === 2} completed={currentStep > 2}>
                <div className="step-number">2</div>
                <div className="step-label">Select Role</div>
              </Step>
              <Step active={currentStep === 3} completed={false}>
                <div className="step-number">3</div>
                <div className="step-label">Review & Start</div>
              </Step>
            </StepIndicator>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {currentStep === 1 && (
              <>
                <CompanyGrid>
                  {COMPANIES.map((company) => (
                    <CompanyCard
                      key={company.name}
                      selected={selectedCompany?.name === company.name}
                      onClick={() => handleCompanySelect(company)}
                    >
                      <CompanyLogo>{company.logo}</CompanyLogo>
                      <CompanyName>{company.name}</CompanyName>
                      <CompanyDescription>
                        {company.description}
                      </CompanyDescription>
                    </CompanyCard>
                  ))}
                </CompanyGrid>
              </>
            )}

            {currentStep === 2 && selectedCompany && (
              <>
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                  <h3 style={{ color: themeObject.text, marginBottom: "8px" }}>
                    Selected: {selectedCompany.name}
                  </h3>
                  <p style={{ color: themeObject.neutral, margin: 0 }}>
                    Now choose your target role
                  </p>
                </div>

                <RoleGrid>
                  {ROLES.map((role) => (
                    <RoleCard
                      key={role.id}
                      selected={selectedRole?.id === role.id}
                      onClick={() => handleRoleSelect(role)}
                    >
                      <RoleHeader>
                        <RoleName>{role.name}</RoleName>
                        <RoleLevel level={role.level}>{role.level}</RoleLevel>
                      </RoleHeader>
                      <RoleDescription>{role.description}</RoleDescription>
                    </RoleCard>
                  ))}
                </RoleGrid>

                <ButtonContainer>
                  <ActionButton variant="secondary" onClick={resetSelection}>
                    ← Back to Companies
                  </ActionButton>
                </ButtonContainer>
              </>
            )}

            {currentStep === 3 && insights && (
              <InsightsSection>
                <InsightsHeader>
                  <InsightsTitle>Interview Insights</InsightsTitle>
                  <InsightsSubtitle>
                    Here's what to expect in your {selectedCompany?.name}{" "}
                    {selectedRole?.name} interview
                  </InsightsSubtitle>
                </InsightsHeader>

                <RoundsGrid>
                  {insights.data.rounds.map((round, index) => (
                    <RoundCard key={index}>
                      <RoundHeader>
                        <RoundName>
                          Round {index + 1}: {round.name}
                        </RoundName>
                        <DifficultyBadge difficulty={round.difficulty}>
                          {round.difficulty}
                        </DifficultyBadge>
                      </RoundHeader>

                      <RoundDescription>{round.description}</RoundDescription>

                      <RoundDetails>
                        <DetailItem>
                          <strong>Duration</strong>
                          {round.duration}
                        </DetailItem>
                        <DetailItem>
                          <strong>Focus Areas</strong>
                          <FocusAreas>
                            {round.focusAreas.slice(0, 2).map((area, i) => (
                              <FocusAreaTag key={i}>{area}</FocusAreaTag>
                            ))}
                            {round.focusAreas.length > 2 && (
                              <span
                                style={{
                                  color: themeObject.neutral,
                                  fontSize: "0.8rem",
                                }}
                              >
                                +{round.focusAreas.length - 2} more
                              </span>
                            )}
                          </FocusAreas>
                        </DetailItem>
                      </RoundDetails>
                    </RoundCard>
                  ))}
                </RoundsGrid>

                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      color: themeObject.neutral,
                      marginBottom: "30px",
                      fontSize: "1.1rem",
                    }}
                  >
                    Estimated total duration:{" "}
                    <strong>{insights.data.estimatedDuration}</strong>
                  </p>

                  <ButtonContainer>
                    <ActionButton variant="secondary" onClick={resetSelection}>
                      ← Start Over
                    </ActionButton>
                    <StartSimulationButton
                      onClick={startSimulation}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner />
                          Starting Simulation...
                        </>
                      ) : (
                        "🚀 Start Simulation"
                      )}
                    </StartSimulationButton>
                  </ButtonContainer>
                </div>
              </InsightsSection>
            )}
          </SetupSection>
        </Container>
      </PageContainer>
    </Layout>
  );
}
