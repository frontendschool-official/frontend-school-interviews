import { ProblemCardLoadingState } from '@/components/ui';

// Skeleton Components for Problems Page
const HeaderSkeleton = () => (
  <div className='mb-6 sm:mb-8'>
    <div className='flex justify-between items-start mb-4 sm:mb-6 p-4 sm:p-6 bg-secondary rounded-2xl border border-border shadow-lg md:flex-row flex-col gap-4 text-center md:text-left'>
      <div className='flex-1'>
        <div className='w-48 h-8 bg-border rounded-lg animate-pulse mb-2'></div>
        <div className='w-80 h-4 bg-border rounded-lg animate-pulse'></div>
      </div>
      <div className='w-32 h-10 bg-border rounded-lg animate-pulse'></div>
    </div>

    {/* Tabs Skeleton */}
    <div className='mb-6'>
      <div className='flex flex-wrap gap-2 mb-4 justify-center md:justify-start'>
        {[1, 2, 3, 4, 5].map(index => (
          <div
            key={index}
            className='w-24 h-10 bg-border rounded-lg animate-pulse'
          ></div>
        ))}
      </div>
    </div>
  </div>
);

const SearchAndSortSkeleton = () => (
  <div className='bg-secondary/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-border/30 border-border shadow-sm'>
    <div className='flex flex-col lg:flex-row gap-3 sm:gap-4 lg:items-center'>
      <div className='flex-1'>
        <div className='w-full h-10 bg-border rounded-lg animate-pulse'></div>
      </div>
      <div className='flex items-center gap-2 sm:gap-3 lg:min-w-0 lg:flex-shrink-0'>
        <div className='w-16 h-4 bg-border rounded animate-pulse'></div>
        <div className='w-24 h-10 bg-border rounded-lg animate-pulse'></div>
      </div>
    </div>
  </div>
);

const ResultsSummarySkeleton = () => (
  <div className='mb-6 flex items-center justify-between'>
    <div className='w-32 h-4 bg-border rounded animate-pulse'></div>
    <div className='flex items-center gap-1 bg-secondary/50 rounded-lg p-1 border border-border/30 border-border'>
      <div className='w-8 h-8 bg-border rounded-md animate-pulse'></div>
      <div className='w-8 h-8 bg-border rounded-md animate-pulse'></div>
    </div>
  </div>
);

const ProblemsPageSkeleton = () => (
  <div className='max-w-7xl mx-auto p-4 min-h-screen bg-bodyBg'>
    <ProblemCardLoadingState count={9} />
  </div>
);

export const ProblemsLoader = () => {
  return (
    <>
      <HeaderSkeleton />
      <SearchAndSortSkeleton />
      <ResultsSummarySkeleton />
      <ProblemsPageSkeleton />
    </>
  );
};
