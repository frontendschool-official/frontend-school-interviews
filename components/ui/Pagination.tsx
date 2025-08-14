import React from 'react';
import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = '',
}) => {

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Items info */}
      <div className='text-sm text-text/70'>
        Showing {startItem} to {endItem} of {totalItems} problems
      </div>

      {/* Pagination controls */}
      <div className='flex items-center gap-1'>
        {/* Previous button */}
        <Button
          variant='icon'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='p-2'
          aria-label='Previous page'
        >
          <FiChevronLeft className='h-4 w-4' />
        </Button>

        {/* Page numbers */}
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <div className='flex items-center justify-center w-8 h-8 text-text/40'>
                <FiMoreHorizontal className='h-4 w-4' />
              </div>
            ) : (
              <Button
                variant={currentPage === page ? 'primary' : 'secondary'}
                size='sm'
                onClick={() => onPageChange(page as number)}
                className='w-8 h-8 p-0 text-sm font-medium'
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        {/* Next button */}
        <Button
          variant='icon'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='p-2'
          aria-label='Next page'
        >
          <FiChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};
