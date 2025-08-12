import { DifficultyBadge, TechnologyTag } from '../../../styles/SharedUI';
import { IMachineCodingProblem } from '../interviews.types';

interface MachineCodingProblemProps {
  problem: IMachineCodingProblem;
}

const MachineCodingProblem = ({ problem }: MachineCodingProblemProps) => (
  <div className='space-y-6'>
    {/* Header */}
    <div className='border-b border-border pb-6'>
      <div className='flex items-center justify-between flex-wrap gap-4 mb-4'>
        <h1 className='text-2xl font-semibold text-text'>
          {problem?.title || 'Machine Coding Problem'}
        </h1>
        <div className='flex items-center gap-3'>
          <DifficultyBadge difficulty={problem?.difficulty}>
            {problem?.difficulty}
          </DifficultyBadge>
          <span className='text-sm text-neutral'>{problem?.estimatedTime}</span>
        </div>
      </div>
      <p className='text-neutral leading-relaxed'>{problem?.description}</p>
    </div>

    {/* Requirements */}
    {problem?.requirements && problem.requirements.length > 0 && (
      <div>
        <h3 className='font-medium text-text mb-3'>Requirements</h3>
        <ul className='space-y-2'>
          {problem.requirements.map((req, index) => (
            <li
              key={index}
              className='flex items-start gap-2 text-neutral text-sm'
            >
              <span className='text-primary mt-1'>•</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Constraints */}
    {problem?.constraints && problem.constraints.length > 0 && (
      <div>
        <h3 className='font-medium text-text mb-3'>Constraints</h3>
        <ul className='space-y-2'>
          {problem.constraints.map((constraint, index) => (
            <li
              key={index}
              className='flex items-start gap-2 text-neutral text-sm'
            >
              <span className='text-amber-500 mt-1'>•</span>
              <span>{constraint}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Acceptance Criteria */}
    {problem?.acceptanceCriteria && problem.acceptanceCriteria.length > 0 && (
      <div>
        <h3 className='font-medium text-text mb-3'>Acceptance Criteria</h3>
        <ul className='space-y-2'>
          {problem.acceptanceCriteria.map((criterion, index) => (
            <li
              key={index}
              className='flex items-start gap-2 text-neutral text-sm'
            >
              <span className='text-green-500 mt-1'>✓</span>
              <span>{criterion}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Technologies */}
    {problem?.technologies && problem.technologies.length > 0 && (
      <div>
        <h3 className='font-medium text-text mb-3'>Technologies</h3>
        <div className='flex flex-wrap gap-2'>
          {problem.technologies.map((tech, index) => (
            <TechnologyTag key={index}>{tech}</TechnologyTag>
          ))}
        </div>
      </div>
    )}

    {/* Hints */}
    {problem?.hints && problem.hints.length > 0 && (
      <div>
        <h3 className='font-medium text-text mb-3'>Hints</h3>
        <ul className='space-y-2'>
          {problem.hints.map((hint, index) => (
            <li
              key={index}
              className='flex items-start gap-2 text-neutral text-sm'
            >
              <span className='text-primary mt-1'>💡</span>
              <span>{hint}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default MachineCodingProblem;
