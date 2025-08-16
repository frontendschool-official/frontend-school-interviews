import React from 'react';
import type { Problem } from '@workspace/schemas';

type Props = { problem: Problem };

export const ProblemCard: React.FC<Props> = ({ problem }) => {
  return (
    <div className='rounded border p-3'>
      <div className='text-sm text-gray-500'>{problem.kind}</div>
      <h3 className='font-semibold'>{problem.title}</h3>
      <div className='text-xs text-gray-400'>{problem.visibility}</div>
    </div>
  );
};
