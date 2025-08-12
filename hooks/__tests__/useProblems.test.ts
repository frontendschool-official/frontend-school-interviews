// Simple test to verify hook exports
import { useProblems } from '../useProblems';
import { useInterviewGeneration } from '../../container/problems/hooks/useInterviewGeneration';
import { useProblemFilters } from '../../container/problems/hooks/useProblemFilters';
import { useModal } from '../../container/problems/hooks/useModal';

// This is just to verify the hooks can be imported and have the expected structure
describe('Hooks', () => {
  test('useProblems should be defined', () => {
    expect(useProblems).toBeDefined();
  });

  test('useInterviewGeneration should be defined', () => {
    expect(useInterviewGeneration).toBeDefined();
  });

  test('useProblemFilters should be defined', () => {
    expect(useProblemFilters).toBeDefined();
  });

  test('useModal should be defined', () => {
    expect(useModal).toBeDefined();
  });
});
