import { useState, useCallback } from 'react';
import { apiClient, ApiResponse } from '@/lib/api-client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<ApiResponse<T>>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  initialData: T | null = null
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiFunction(...args);
        
        if (response.error) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: response.error,
          }));
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            data: response.data,
          }));
        }
        
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        
        return { error: errorMessage };
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for common operations
export function useProblems() {
  return useApi(apiClient.getAllProblems);
}

export function useProblemById(id: string) {
  return useApi(() => apiClient.getProblemById(id));
}

export function useProblemsByUserId(userId: string) {
  return useApi(() => apiClient.getProblemsByUserId(userId));
}

export function useUserProfile(uid: string) {
  return useApi(() => apiClient.getUserProfile(uid));
}

// Hook for operations that don't return data (like POST/PUT operations)
export function useApiOperation<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiFunction(...args);
        
        if (response.error) {
          setError(response.error);
        }
        
        setLoading(false);
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        setLoading(false);
        return { error: errorMessage };
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    reset,
  };
}

// Specific operation hooks
export function useMarkProblemAsAttempted() {
  return useApiOperation(apiClient.markProblemAsAttempted);
}

export function useMarkProblemAsCompleted() {
  return useApiOperation(apiClient.markProblemAsCompleted);
}

export function useSaveSubmission() {
  return useApiOperation(apiClient.saveSubmission);
}

export function useSaveInterviewProblem() {
  return useApiOperation(apiClient.saveInterviewProblem);
}

export function useSaveFeedback() {
  return useApiOperation(apiClient.saveFeedback);
}

export function useEvaluateSubmission() {
  return useApiOperation(apiClient.evaluateSubmission);
}

export function useUpdateUserProfile() {
  return useApiOperation(apiClient.updateUserProfile);
}

export function useCompleteOnboarding() {
  return useApiOperation(apiClient.completeOnboarding);
}

export function useGenerateMockInterviewProblem() {
  return useApiOperation(apiClient.generateMockInterviewProblem);
}

export function useEvaluateMockInterviewSubmission() {
  return useApiOperation(apiClient.evaluateMockInterviewSubmission);
} 