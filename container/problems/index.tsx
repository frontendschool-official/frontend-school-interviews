import React from 'react';
import { PromptModal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useProblems } from '@/hooks/useProblems';
import { useInterviewGeneration } from '@/container/problems/hooks/useInterviewGeneration';
import { useProblemFilters } from '@/container/problems/hooks/useProblemFilters';
import Layout from '@/components/Layout';
import { ProblemCardLoadingState } from '@/components/ui/LoadingState';
import { FiSearch, FiX, FiGrid, FiList, FiArrowUp } from 'react-icons/fi';
import {
  Button,
  ProblemCard,
  SearchableDropdown,
  Pagination,
  Tabs,
} from '@/components/ui';
import type { SearchableDropdownOption } from '@/components/ui';

const ProblemsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;

  const {
    problems,
    statuses,
    loading: problemsLoading,
    error: problemsError,
    pagination,
  } = useProblems(currentPage, itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { loading: generationLoading, startInterviewAndNavigate } =
    useInterviewGeneration();

  // Use the problem filters hook
  const { activeFilter, stats, filteredProblems, setFilter } =
    useProblemFilters({
      problems: problems || [],
      statuses: statuses || {},
      user,
    });

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Local modal state (avoid global store loops)
  const [modalOpen, setModalOpen] = React.useState(false);
  const openModal = React.useCallback(() => setModalOpen(true), []);
  const closeModal = React.useCallback(() => setModalOpen(false), []);

  // Search and sort state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<SearchableDropdownOption | null>({
    id: 'title',
    label: 'Title',
    icon: <FiArrowUp className='w-3 h-3 text-primary' />,
  });

  // View state
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const sortOptions: SearchableDropdownOption[] = [
    {
      id: 'title',
      label: 'Title',
      icon: <FiArrowUp className='w-3 h-3 text-primary' />,
    },
    {
      id: 'difficulty',
      label: 'Difficulty',
      icon: <FiArrowUp className='w-3 h-3 text-primary' />,
    },
    {
      id: 'type',
      label: 'Type',
      icon: <FiArrowUp className='w-3 h-3 text-primary' />,
    },
  ];

  // Search input ref for keyboard shortcuts
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Add keyboard shortcut for search focus (Ctrl/Cmd + K)
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tab configuration with icons and stats
  const tabItems = React.useMemo(
    () => [
      {
        id: 'all',
        label: 'All Problems',
        count: stats.total,
        icon: '📚',
      },
      {
        id: 'dsa',
        label: 'DSA',
        count: stats.dsa,
        icon: '🧮',
      },
      {
        id: 'machine_coding',
        label: 'Machine Coding',
        count: stats.machineCoding,
        icon: '💻',
      },
      {
        id: 'system_design',
        label: 'System Design',
        count: stats.systemDesign,
        icon: '🏗️',
      },
      {
        id: 'theory',
        label: 'Theory',
        count: stats.theory,
        icon: '📖',
      },
      ...(user
        ? [
            {
              id: 'attempted' as const,
              label: 'Attempted',
              count: stats.attempted,
              icon: '✅',
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
        if (!problem || typeof problem !== 'object') return false;

        const title = problem.title?.toLowerCase() || '';
        const description = problem.description?.toLowerCase() || '';
        const category = problem.category?.toLowerCase() || '';
        const technologies = Array.isArray(problem.technologies)
          ? problem.technologies.join(' ').toLowerCase()
          : '';

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
        switch (sortBy?.id) {
          case 'title':
            const titleA = a.title || '';
            const titleB = b.title || '';
            return titleA.localeCompare(titleB);

          case 'difficulty': {
            const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
            const aDiff = a.difficulty || 'medium';
            const bDiff = b.difficulty || 'medium';
            return (
              (difficultyOrder[aDiff as keyof typeof difficultyOrder] || 2) -
              (difficultyOrder[bDiff as keyof typeof difficultyOrder] || 2)
            );
          }

          case 'type': {
            const typeOrder = {
              dsa: 1,
              machine_coding: 2,
              system_design: 3,
              theory: 4,
            };
            const aType = a.type || 'user_generated';
            const bType = b.type || 'user_generated';
            return (
              (typeOrder[aType as keyof typeof typeOrder] || 5) -
              (typeOrder[bType as keyof typeof typeOrder] || 5)
            );
          }

          default:
            return 0;
        }
      } catch (error) {
        console.error('Error sorting problems:', error);
        return 0;
      }
    });

    return processed;
  }, [filteredProblems, searchQuery, sortBy]);

  const handleStartInterview = async (values: any) => {
    try {
      if (!values || typeof values !== 'object') {
        console.error('Invalid interview values provided');
        return;
      }

      const result = await startInterviewAndNavigate(values);
      console.log('startInterviewAndNavigate', result);
      if (result && result?.problem) {
        // addProblem(result?.problem);
        closeModal();
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
      // You could add a toast notification here for user feedback
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const isLoading = authLoading || problemsLoading;

  return (
    <Layout
      isLoading={false}
      handleRetry={() => {}}
      handleBack={() => window.history.back()}
    >
      <div className='max-w-7xl mx-auto p-4 min-h-screen bg-bodyBg'>
        {isLoading ? (
          <ProblemCardLoadingState count={9} />
        ) : (
          <>
            {/* Header Section */}
            <header className='mb-6 sm:mb-8'>
              <div className='flex justify-between items-start mb-4 sm:mb-6 p-4 sm:p-6 bg-secondary rounded-2xl border border-border shadow-lg md:flex-row flex-col gap-4 text-center md:text-left'>
                <div className='flex-1'>
                  <h1 className='text-2xl sm:text-3xl font-bold text-neutralDark mb-2'>
                    Interview Problems
                  </h1>
                  <p className='text-text opacity-80 text-sm sm:text-base leading-relaxed'>
                    Master coding problems across different categories to ace
                    your technical interviews. Practice DSA, machine coding,
                    system design, and theory questions.
                  </p>
                  {pagination && (
                    <div className='mt-3 text-sm text-text/60'>
                      {pagination.totalItems} problems available - Page{' '}
                      {pagination.currentPage} of {pagination.totalPages}
                    </div>
                  )}
                </div>
                <div className='flex-shrink-0'>
                  {user ? (
                    <button
                      onClick={openModal}
                      disabled={generationLoading}
                      className='w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-none rounded-lg bg-primary text-bodyBg font-semibold text-sm cursor-pointer transition-all duration-300 shadow-md hover:enabled:-translate-y-1 hover:enabled:shadow-lg hover:enabled:bg-accent disabled:opacity-60 disabled:cursor-not-allowed'
                      aria-label='Create new interview problem'
                    >
                      {generationLoading
                        ? 'Creating...'
                        : 'Start New Interview'}
                    </button>
                  ) : (
                    <div className='text-sm text-text opacity-80 text-right font-medium'>
                      Sign in to track your progress and create custom problems
                    </div>
                  )}
                </div>
              </div>
            </header>

            {problemsError && (
              <div className='flex flex-col items-center gap-4 p-8 bg-secondary rounded-xl border border-border mb-6'>
                <p className='text-text text-base m-0'>
                  Failed to load problems. Please try again.
                </p>
                <button
                  onClick={handleRetry}
                  className='px-4 py-2 border border-primary rounded-md bg-transparent text-primary font-medium cursor-pointer transition-all duration-200 hover:bg-primary hover:text-bodyBg'
                >
                  Retry
                </button>
              </div>
            )}

            {!problemsError && (
              <>
                {problems?.length > 0 ? (
                  <div className='space-y-6'>
                    {/* Category Tabs */}
                    <section className='bg-secondary/50 rounded-xl p-4 border border-border/30 shadow-sm'>
                      <Tabs
                        items={tabItems}
                        activeTab={activeFilter}
                        onTabChange={tabId => setFilter(tabId as any)}
                        className='mb-0'
                      />
                    </section>

                    {/* Main Content Area */}
                    <div className='space-y-6'>
                      {/* Search Bar - Always at Top */}
                      <section className='bg-secondary/50 rounded-xl p-4 mb-6 border border-border/30 shadow-sm'>
                        <div className='flex flex-col lg:flex-row gap-4 lg:items-center'>
                          {/* Search Input */}
                          <div className='flex-1'>
                            <label htmlFor='problem-search' className='sr-only'>
                              Search problems
                            </label>
                            <div className='relative'>
                              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-border'>
                                <FiSearch className='h-5 w-5 text-text/40' />
                              </div>
                              <input
                                id='problem-search'
                                ref={searchInputRef}
                                type='text'
                                placeholder='Search problems by title, description, or technologies...'
                                value={searchQuery || ''}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  const value = e?.target?.value;
                                  setSearchQuery(value || '');
                                }}
                                className='w-full pl-10 pr-20 py-3 border border-border border-border/50 rounded-lg bg-secondary text-text text-sm placeholder:text-text/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200'
                                aria-describedby='search-help'
                              />
                              <div className='absolute inset-y-0 right-0 flex items-center'>
                                {searchQuery ? (
                                  <button
                                    onClick={() => setSearchQuery('')}
                                    className='mr-3 text-text/40 hover:text-text transition-colors p-1 rounded-md hover:bg-secondary/50'
                                    type='button'
                                    title='Clear search'
                                    aria-label='Clear search'
                                  >
                                    <FiX className='h-4 w-4' />
                                  </button>
                                ) : (
                                  <div className='mr-3 hidden lg:flex items-center gap-1 text-text/30 text-xs'>
                                    <kbd className='px-1.5 py-0.5 bg-border/20 rounded border text-[10px]'>
                                      {navigator.platform
                                        .toUpperCase()
                                        .indexOf('MAC') >= 0
                                        ? '⌘'
                                        : 'Ctrl'}
                                    </kbd>
                                    <kbd className='px-1.5 py-0.5 bg-border/20 rounded border text-[10px]'>
                                      K
                                    </kbd>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div id='search-help' className='sr-only'>
                              Use Ctrl+K or Cmd+K to quickly focus the search
                              box
                            </div>
                          </div>

                          {/* Sort Dropdown */}
                          <div className='lg:flex-shrink-0'>
                            <SearchableDropdown
                              options={sortOptions}
                              value={sortBy}
                              onValueChange={setSortBy}
                              placeholder='Sort by...'
                              searchPlaceholder='Search sort options...'
                              size='sm'
                              icon={
                                <FiArrowUp className='w-3 h-3 text-primary' />
                              }
                              emptyMessage='No sort options available'
                              noResultsMessage='No sort options found'
                              className='w-full lg:w-48'
                              aria-label='Sort problems by'
                            />
                          </div>

                          {/* Quick Filter Chips */}
                          {searchQuery && (
                            <div className='flex items-center gap-2 lg:flex-shrink-0'>
                              <span className='text-xs text-text/60'>
                                Active search:
                              </span>
                              <span className='inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md'>
                                "{searchQuery}"
                                <button
                                  onClick={() => setSearchQuery('')}
                                  className='hover:bg-primary/20 rounded-sm p-0.5 transition-colors'
                                  aria-label='Clear search'
                                >
                                  <FiX className='h-3 w-3' />
                                </button>
                              </span>
                            </div>
                          )}
                        </div>
                      </section>

                      {/* Results Summary and View Toggle */}
                      {filteredProblems.length > 0 && (
                        <div className='mb-6 flex items-center justify-between'>
                          <div className='flex items-center gap-2 text-sm text-text/70'>
                            <span className='font-medium text-text'>
                              {processedProblems.length}
                            </span>
                            <span>
                              {processedProblems.length === 1
                                ? ' problem'
                                : ' problems'}
                              {searchQuery && searchQuery.trim() && (
                                <span className='text-primary'>
                                  {' '}
                                  matching "{searchQuery}"
                                </span>
                              )}
                            </span>
                          </div>

                          {/* View Toggle */}
                          <div className='flex items-center gap-2'>
                            <span className='text-xs text-text/60 font-medium'>
                              View:
                            </span>
                            <div className='flex items-center gap-1 bg-secondary/50 rounded-lg p-1 border border-border/30 border-border'>
                              <Button
                                variant='icon'
                                size='sm'
                                className={
                                  viewMode === 'grid'
                                    ? 'bg-primary'
                                    : 'bg-transparent hover:bg-secondary'
                                }
                                leftIcon={<FiGrid className='h-4 w-4' />}
                                onClick={() => setViewMode('grid')}
                                aria-label='Grid view'
                                title='Grid view'
                              />
                              <Button
                                variant='icon'
                                size='sm'
                                className={
                                  viewMode === 'list'
                                    ? 'bg-primary'
                                    : 'bg-transparent hover:bg-secondary'
                                }
                                leftIcon={<FiList className='h-4 w-4' />}
                                onClick={() => setViewMode('list')}
                                aria-label='List view'
                                title='List view'
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Problems Grid/List */}
                      {processedProblems.length > 0 ? (
                        <section
                          className={`transition-all duration-300 ease-in-out ${
                            viewMode === 'grid'
                              ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'
                              : 'flex flex-col gap-3'
                          }`}
                          aria-label={`${processedProblems.length} problems in ${viewMode} view`}
                        >
                          {processedProblems
                            ?.map(problem => {
                              // Validate problem object
                              if (
                                !problem ||
                                typeof problem !== 'object' ||
                                !problem?.id
                              ) {
                                console.warn(
                                  'Invalid problem object:',
                                  problem
                                );
                                return null;
                              }

                              // Safely get status with fallback
                              const problemStatus =
                                statuses[problem?.id] || 'unsolved';

                              return (
                                <ProblemCard
                                  key={problem?.id}
                                  problem={problem}
                                  status={problemStatus}
                                  variant={
                                    viewMode === 'list' ? 'list' : 'default'
                                  }
                                />
                              );
                            })
                            .filter(Boolean)}
                        </section>
                      ) : (
                        <div className='text-center py-12 px-4'>
                          <div className='text-4xl mb-4 opacity-60'>
                            {activeFilter === 'all'
                              ? '📚'
                              : activeFilter === 'dsa'
                                ? '🧮'
                                : activeFilter === 'machine_coding'
                                  ? '💻'
                                  : activeFilter === 'system_design'
                                    ? '🏗️'
                                    : activeFilter === 'theory'
                                      ? '📖'
                                      : '✅'}
                          </div>
                          <h3 className='text-xl font-semibold text-neutralDark mb-2'>
                            {searchQuery && searchQuery.trim()
                              ? `No problems found matching "${searchQuery}"`
                              : `No ${
                                  activeFilter === 'all'
                                    ? ''
                                    : activeFilter.replace('_', ' ')
                                } problems available`}
                          </h3>
                          <p className='text-text opacity-70 text-sm'>
                            {searchQuery
                              ? 'Try adjusting your search terms or filters.'
                              : user
                                ? 'Create your first problem to get started.'
                                : 'Sign in to create and track problems.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center min-h-96 py-12 px-4 text-center bg-secondary rounded-2xl border border-border/20 my-8'>
                    <div className='text-6xl mb-6 opacity-60'>📚</div>
                    <h2 className='text-3xl font-semibold text-neutralDark mb-4 md:text-2xl'>
                      No Problems Available
                    </h2>
                    <p className='text-lg text-text opacity-80 mb-8 max-w-lg leading-relaxed md:text-base'>
                      {user
                        ? "Get started by creating your first interview problem using the 'Start New Interview' button above."
                        : 'Sign in to create custom interview problems and track your progress.'}
                    </p>
                    {user && (
                      <div className='mt-4'>
                        <button
                          onClick={openModal}
                          className='px-6 py-3 border-none rounded-lg bg-primary text-bodyBg font-semibold text-sm cursor-pointer transition-all duration-300 shadow-md hover:-translate-y-1 hover:shadow-lg hover:bg-accent'
                        >
                          Create Your First Problem
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <nav className='mt-8' aria-label='Problems pagination'>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </nav>
            )}
            <PromptModal
              title='Start New Interview'
              children={<div>Hello</div>}
              visible={modalOpen}
              onClose={closeModal}
              onSubmit={handleStartInterview}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProblemsPage;
