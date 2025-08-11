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
import { useMockInterviewSetup } from "../hooks/useMockInterviewSetup";
import NavBar from "../components/NavBar";
import MockInterviewComponent from "../components/MockInterview";
import Loader from "@/components/ui/Loader";
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



export default function MockInterview() {
  const { themeObject } = useThemeContext();
  const {
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
    companies,
    roles,
    rounds,
    handleCompanySelect,
    handleRoleSelect,
    handleRoundSelect,
    handleStartInterview,
    handleInterviewComplete,
    handleInterviewExit,
  } = useMockInterviewSetup();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bodyBg">
        <NavBar />
        <Loader text="Loading..." size="md" fullScreen />
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
        onComplete={handleInterviewComplete}
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
                <div className="text-xl font-bold text-primary mb-1">{companies.length}</div>
                <div className="text-xs text-neutral-600 uppercase tracking-wider">Companies</div>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg border border-border min-w-20">
                <div className="text-xl font-bold text-primary mb-1">{selectedCompany ? 1 : 0}</div>
                <div className="text-xs text-neutral-600 uppercase tracking-wider">Selected</div>
              </div>
            </div>

            <EnhancedGrid>
              {companies.map((company) => (
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
              {roles.map((role) => (
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
              {rounds.map((round) => (
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
