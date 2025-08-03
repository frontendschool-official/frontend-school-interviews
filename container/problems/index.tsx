import FirebaseConfigError from "@/components/FirebaseConfigError";
import NavBar from "@/components/NavBar";
import ProblemCard from "@/components/ProblemCard";
import PromptModal from "@/components/PromptModal";
import { useAuth } from "@/hooks/useAuth";
import { useProblems } from "@/hooks/useProblems";
import { useInterviewGeneration } from "@/container/problems/hooks/useInterviewGeneration";
import { useProblemFilters } from "@/container/problems/hooks/useProblemFilters";
import { useModal } from "@/container/problems/hooks/useModal";
import {
  PageContainer,
  LoadingContainer,
  Header,
  Title,
  StartButton,
  SignInMessage,
  FilterContainer,
  FilterButton,
  Grid,
  EmptyState,
} from "./problems.styled";
import Layout from "@/components/Layout";

export default function ProblemsPage() {
  const { user, loading } = useAuth();
  const {
    problems,
    statuses,
    loading: loadingProblems,
    error: firebaseError,
    addProblem,
  } = useProblems();
  const {
    loading: loadingNew,
    error: generationError,
    startInterviewAndNavigate,
  } = useInterviewGeneration();
  const { activeFilter, stats, filteredProblems, setFilter } =
    useProblemFilters({ problems, statuses, user });
  const { isOpen: modalOpen, open: openModal, close: closeModal } = useModal();

  console.log(
    "ProblemsPage render - user:",
    user?.uid,
    "loading:",
    loading,
    "loadingProblems:",
    loadingProblems
  );

  const handleStartInterview = async (values: any) => {
    const result = await startInterviewAndNavigate(values);
    if (result) {
      addProblem(result.problem);
      closeModal();
    }
  };

  // Show Firebase configuration error if present
  if (firebaseError) {
    return <FirebaseConfigError />;
  }
  console.log(problems, "problems");
  return (
    <Layout
      isLoading={loadingProblems || loading}
      loadingText="Loading problems..."
      handleRetry={() => {}}
      handleBack={() => {}}
    >
      <PageContainer>
        <Header>
          <Title>All Available Problems</Title>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.5rem",
            }}
          >
            {user ? (
              <StartButton onClick={openModal}>Start New Interview</StartButton>
            ) : (
              <SignInMessage>
                Sign in to track your progress and create custom problems
              </SignInMessage>
            )}
          </div>
        </Header>

        <FilterContainer>
          <FilterButton
            active={activeFilter === "all"}
            onClick={() => setFilter("all")}
          >
            All ({stats.total})
          </FilterButton>
          <FilterButton
            active={activeFilter === "dsa"}
            onClick={() => setFilter("dsa")}
          >
            DSA ({stats.dsa})
          </FilterButton>
          <FilterButton
            active={activeFilter === "machine_coding"}
            onClick={() => setFilter("machine_coding")}
          >
            Machine Coding ({stats.machineCoding})
          </FilterButton>
          <FilterButton
            active={activeFilter === "system_design"}
            onClick={() => setFilter("system_design")}
          >
            System Design ({stats.systemDesign})
          </FilterButton>
          {user && (
            <FilterButton
              active={activeFilter === "attempted"}
              onClick={() => setFilter("attempted")}
            >
              Attempted ({stats.attempted})
            </FilterButton>
          )}
        </FilterContainer>

        <Grid>
          {filteredProblems?.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              status={statuses[problem?.id || ""] || "unsolved"}
            />
          ))}
        </Grid>

        {filteredProblems.length === 0 && (
          <EmptyState>No problems found for the selected filter.</EmptyState>
        )}

        <PromptModal
          visible={modalOpen}
          onClose={closeModal}
          onSubmit={handleStartInterview}
        />
      </PageContainer>
    </Layout>
  );
}
