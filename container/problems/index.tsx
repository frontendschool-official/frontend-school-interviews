import React from "react";
import ProblemCard from "@/components/ProblemCard";
import PromptModal from "@/components/PromptModal";
import { useAuth } from "@/hooks/useAuth";
import { useProblems } from "@/hooks/useProblems";
import { useInterviewGeneration } from "@/container/problems/hooks/useInterviewGeneration";
import { useProblemFilters } from "@/container/problems/hooks/useProblemFilters";
import Tabs, { TabItem } from "@/components/ui/Tabs";
import Layout from "@/components/Layout";

const ProblemsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    problems,
    statuses,
    loading: problemsLoading,
    error: problemsError,
    addProblem,
  } = useProblems();
  const {
    loading: generationLoading,
    error: generationError,
    startInterviewAndNavigate,
  } = useInterviewGeneration();

  // Use the problem filters hook
  const { activeFilter, stats, filteredProblems, setFilter } =
    useProblemFilters({
      problems: problems || [],
      statuses: statuses || {},
      user,
    });

  // Local modal state (avoid global store loops)
  const [modalOpen, setModalOpen] = React.useState(false);
  const openModal = React.useCallback(() => setModalOpen(true), []);
  const closeModal = React.useCallback(() => setModalOpen(false), []);

  // Search and sort state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"title" | "difficulty" | "type">(
    "title"
  );

  // Search input ref for keyboard shortcuts
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = React.useState(false);

  // Add keyboard shortcut for search focus (Ctrl/Cmd + K)
  React.useEffect(() => {
    // Check if running on Mac for keyboard shortcut display
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Tab configuration with icons and stats
  const tabItems: TabItem[] = React.useMemo(
    () => [
      {
        id: "all",
        label: "All Problems",
        count: stats.total,
        icon: "📚",
      },
      {
        id: "dsa",
        label: "DSA",
        count: stats.dsa,
        icon: "🧮",
      },
      {
        id: "machine_coding",
        label: "Machine Coding",
        count: stats.machineCoding,
        icon: "💻",
      },
      {
        id: "system_design",
        label: "System Design",
        count: stats.systemDesign,
        icon: "🏗️",
      },
      {
        id: "theory",
        label: "Theory",
        count: stats.theory,
        icon: "📖",
      },
      ...(user
        ? [
            {
              id: "attempted" as const,
              label: "Attempted",
              count: stats.attempted,
              icon: "✅",
            },
          ]
        : []),
    ],
    [stats, user]
  );

  // Apply search and sort to filtered problems
  const processedProblems = React.useMemo(() => {
    if (!Array.isArray(filteredProblems)) return [];

    let processed = [...filteredProblems];

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      processed = processed.filter((problem: any) => {
        if (!problem || typeof problem !== "object") return false;

        const title = problem.title?.toLowerCase() || "";
        const description = problem.description?.toLowerCase() || "";
        const category = problem.category?.toLowerCase() || "";
        const technologies = Array.isArray(problem.technologies)
          ? problem.technologies.join(" ").toLowerCase()
          : "";

        return (
          title.includes(query) ||
          description.includes(query) ||
          category.includes(query) ||
          technologies.includes(query)
        );
      });
    }

    // Apply sorting with error handling
    processed.sort((a: any, b: any) => {
      if (!a || !b) return 0;

      try {
        switch (sortBy) {
          case "title":
            const titleA = a.title || "";
            const titleB = b.title || "";
            return titleA.localeCompare(titleB);

          case "difficulty": {
            const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
            const aDiff = a.difficulty || "medium";
            const bDiff = b.difficulty || "medium";
            return (
              (difficultyOrder[aDiff as keyof typeof difficultyOrder] || 2) -
              (difficultyOrder[bDiff as keyof typeof difficultyOrder] || 2)
            );
          }

          case "type": {
            const typeOrder = {
              dsa: 1,
              machine_coding: 2,
              system_design: 3,
              theory: 4,
            };
            const aType = a.type || "user_generated";
            const bType = b.type || "user_generated";
            return (
              (typeOrder[aType as keyof typeof typeOrder] || 5) -
              (typeOrder[bType as keyof typeof typeOrder] || 5)
            );
          }

          default:
            return 0;
        }
      } catch (error) {
        console.error("Error sorting problems:", error);
        return 0;
      }
    });

    return processed;
  }, [filteredProblems, searchQuery, sortBy]);

  const handleStartInterview = async (values: any) => {
    try {
      if (!values || typeof values !== "object") {
        console.error("Invalid interview values provided");
        return;
      }

      const result = await startInterviewAndNavigate(values);
      if (result && result?.problem) {
        // addProblem(result?.problem);
        closeModal();
      }
    } catch (error) {
      console.error("Failed to start interview:", error);
      // You could add a toast notification here for user feedback
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const isLoading = authLoading || problemsLoading;

  return (
    <Layout
      isLoading={isLoading}
      loadingText="Loading problems..."
      handleRetry={() => {}}
      handleBack={() => window.history.back()}
    >
      <div className="max-w-7xl mx-auto p-4 min-h-screen bg-bodyBg">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6 p-6 bg-secondary rounded-2xl border border-border shadow-lg md:flex-row flex-col gap-4 text-center md:text-left">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutralDark mb-2">
                Interview Problems
              </h1>
              <p className="text-text opacity-80 text-sm">
                Practice coding problems across different categories to ace your
                interviews
              </p>
            </div>
            <div>
              {user ? (
                <button
                  onClick={openModal}
                  disabled={generationLoading}
                  className="px-6 py-3 border-none rounded-lg bg-primary text-bodyBg font-semibold text-sm cursor-pointer transition-all duration-300 shadow-md hover:enabled:-translate-y-1 hover:enabled:shadow-lg hover:enabled:bg-accent disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {generationLoading ? "Creating..." : "Start New Interview"}
                </button>
              ) : (
                <div className="text-sm text-text opacity-80 text-right font-medium">
                  Sign in to track your progress and create custom problems
                </div>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mb-6">
            <Tabs
              items={tabItems}
              activeTab={activeFilter}
              onTabChange={(tabId) => setFilter(tabId as any)}
              className="mb-4 justify-center md:justify-start"
            />
          </div>
        </div>

        {problemsError && (
          <div className="flex flex-col items-center gap-4 p-8 bg-secondary rounded-xl border border-border mb-6">
            <p className="text-text text-base m-0">
              Failed to load problems. Please try again.
            </p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 border border-primary rounded-md bg-transparent text-primary font-medium cursor-pointer transition-all duration-200 hover:bg-primary hover:text-bodyBg"
            >
              Retry
            </button>
          </div>
        )}

        {!problemsError && (
          <>
            {problems?.length > 0 ? (
              <>
                {/* Search and Sort Controls */}
                <div className="bg-secondary/50 rounded-xl p-4 mb-6 border border-border/30 border-border shadow-sm">
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    {/* Search Input */}
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-border">
                          <svg
                            className="h-5 w-5 text-text/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search problems by title, description, or technologies..."
                          value={searchQuery || ""}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const value = e?.target?.value;
                            setSearchQuery(value || "");
                          }}
                          className="w-full pl-10 pr-20 py-3 border border-border border-border/50 rounded-lg bg-secondary text-text text-sm placeholder:text-text/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          {searchQuery ? (
                            <button
                              onClick={() => setSearchQuery("")}
                              className="mr-3 text-text/40 hover:text-text transition-colors p-1 rounded-md hover:bg-secondary/50"
                              type="button"
                              title="Clear search"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          ) : (
                            <div className="mr-3 hidden lg:flex items-center gap-1 text-text/30 text-xs">
                              <kbd className="px-1.5 py-0.5 bg-border/20 rounded border text-[10px]">
                                {isMac ? "⌘" : "Ctrl"}
                              </kbd>
                              <kbd className="px-1.5 py-0.5 bg-border/20 rounded border text-[10px]">
                                K
                              </kbd>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sort Controls */}
                    <div className="flex items-center gap-3 lg:min-w-0 lg:flex-shrink-0">
                      <label
                        htmlFor="sort-select"
                        className="text-sm text-text/70 font-medium whitespace-nowrap"
                      >
                        Sort by:
                      </label>
                      <div className="relative">
                        <select
                          id="sort-select"
                          value={sortBy || "title"}
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            const value = e?.target?.value;
                            if (
                              value === "title" ||
                              value === "difficulty" ||
                              value === "type"
                            ) {
                              setSortBy(value);
                            }
                          }}
                          className="appearance-none border-border bg-secondary border border-border/50 rounded-lg px-4 py-2.5 pr-8 text-text text-sm cursor-pointer focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 min-w-[120px]"
                        >
                          <option value="title">Title</option>
                          <option value="difficulty">Difficulty</option>
                          <option value="type">Type</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg
                            className="h-4 w-4 text-text/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m19 9-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Filter Chips (Optional Enhancement) */}
                  {searchQuery && (
                    <div className="mt-3 pt-3 border-t border-border/20">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text/60">
                          Active search:
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                          "{searchQuery}"
                          <button
                            onClick={() => setSearchQuery("")}
                            className="hover:bg-primary/20 rounded-sm p-0.5 transition-colors"
                          >
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Results Summary */}
                {filteredProblems.length > 0 && (
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-text/70">
                      <span className="font-medium text-text">
                        {processedProblems.length}
                      </span>
                      <span>
                        {processedProblems.length === 1
                          ? "problem"
                          : "problems"}
                        {searchQuery && searchQuery.trim() && (
                          <span className="text-primary">
                            {" "}
                            matching your search
                          </span>
                        )}
                      </span>
                    </div>

                    {/* View Toggle (for future enhancement) */}
                    <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1 border border-border/30 border-border">
                      <button
                        className="p-1.5 rounded-md bg-primary text-white transition-colors"
                        title="Grid view"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 rounded-md text-text/40 hover:text-text hover:bg-secondary/50 transition-colors"
                        title="List view"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Problems Grid */}
                {processedProblems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {processedProblems
                      ?.map((problem) => {
                        // Validate problem object
                        if (
                          !problem ||
                          typeof problem !== "object" ||
                          !problem?.id
                        ) {
                          console.warn("Invalid problem object:", problem);
                          return null;
                        }

                        // Safely get status with fallback
                        const problemStatus =
                          statuses[problem?.id] || "unsolved";

                        return (
                          <ProblemCard
                            key={problem?.id}
                            problem={problem}
                            status={problemStatus}
                          />
                        );
                      })
                      .filter(Boolean)}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4">
                    <div className="text-4xl mb-4 opacity-60">
                      {activeFilter === "all"
                        ? "📚"
                        : activeFilter === "dsa"
                        ? "🧮"
                        : activeFilter === "machine_coding"
                        ? "💻"
                        : activeFilter === "system_design"
                        ? "🏗️"
                        : activeFilter === "theory"
                        ? "📖"
                        : "✅"}
                    </div>
                    <h3 className="text-xl font-semibold text-neutralDark mb-2">
                      {searchQuery && searchQuery.trim()
                        ? `No problems found matching "${searchQuery}"`
                        : `No ${
                            activeFilter === "all"
                              ? ""
                              : activeFilter.replace("_", " ")
                          } problems available`}
                    </h3>
                    <p className="text-text opacity-70 text-sm">
                      {searchQuery
                        ? "Try adjusting your search terms or filters."
                        : user
                        ? "Create your first problem to get started."
                        : "Sign in to create and track problems."}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-96 py-12 px-4 text-center bg-secondary rounded-2xl border border-border/20 my-8">
                <div className="text-6xl mb-6 opacity-60">📚</div>
                <h2 className="text-3xl font-semibold text-neutralDark mb-4 md:text-2xl">
                  No Problems Available
                </h2>
                <p className="text-lg text-text opacity-80 mb-8 max-w-lg leading-relaxed md:text-base">
                  {user
                    ? "Get started by creating your first interview problem using the 'Start New Interview' button above."
                    : "Sign in to create custom interview problems and track your progress."}
                </p>
                {user && (
                  <div className="mt-4">
                    <button
                      onClick={openModal}
                      className="px-6 py-3 border-none rounded-lg bg-primary text-bodyBg font-semibold text-sm cursor-pointer transition-all duration-300 shadow-md hover:-translate-y-1 hover:shadow-lg hover:bg-accent"
                    >
                      Create Your First Problem
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <PromptModal
          visible={modalOpen}
          onClose={closeModal}
          onSubmit={handleStartInterview}
        />
      </div>
    </Layout>
  );
};

export default ProblemsPage;
