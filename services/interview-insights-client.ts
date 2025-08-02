import { InterviewInsightsRequest, InterviewInsightsResponse } from '../types/problem';

/**
 * Client utility for making API calls to the interview insights endpoint
 */
export class InterviewInsightsClient {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  /**
   * Get interview insights for a company and role level
   */
  async getInsights(request: InterviewInsightsRequest): Promise<InterviewInsightsResponse> {
    const response = await fetch(`${this.baseURL}/api/interview-insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Force refresh interview insights (bypass cache)
   */
  async refreshInsights(request: InterviewInsightsRequest): Promise<InterviewInsightsResponse> {
    const response = await fetch(`${this.baseURL}/api/interview-insights?refresh=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get insights with error handling and retry logic
   */
  async getInsightsWithRetry(
    request: InterviewInsightsRequest, 
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<InterviewInsightsResponse> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.getInsights(request);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError!;
  }
}

// Default client instance
export const interviewInsightsClient = new InterviewInsightsClient();

// Convenience functions
export const getInterviewInsights = (request: InterviewInsightsRequest) => 
  interviewInsightsClient.getInsights(request);

export const refreshInterviewInsights = (request: InterviewInsightsRequest) => 
  interviewInsightsClient.refreshInsights(request);

export const getInterviewInsightsWithRetry = (
  request: InterviewInsightsRequest, 
  maxRetries?: number, 
  delay?: number
) => interviewInsightsClient.getInsightsWithRetry(request, maxRetries, delay); 