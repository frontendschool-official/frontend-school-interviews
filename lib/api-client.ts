/**
 * Reusable client-side API service for making HTTP requests to our API endpoints
 * This centralizes all API calls and provides consistent error handling
 */

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface SessionResponse {
  authenticated: boolean;
  userId?: string;
  userProfile?: any;
  message?: string;
  error?: string;
}

type CacheEntry<T> = {
  data: T;
  expiry: number;
};

class ApiClient {
  private baseUrl: string;
  private inFlight: Map<string, Promise<ApiResponse<any>>> = new Map();
  private cache: Map<string, CacheEntry<any>> = new Map();

  constructor() {
    // For client-side requests, we don't need a base URL as we're calling relative endpoints
    this.baseUrl = '';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const cacheKey = `${options.method || 'GET'}:${url}:${options.body || ''}`;

      // Dedupe in-flight requests with the same key
      if (this.inFlight.has(cacheKey)) {
        return (await this.inFlight.get(cacheKey)) as ApiResponse<T>;
      }

      // Serve from short-lived cache for idempotent GETs
      if ((options.method || 'GET').toUpperCase() === 'GET') {
        const cached = this.cache.get(cacheKey);
        if (cached && cached.expiry > Date.now()) {
          return { data: cached.data } as ApiResponse<T>;
        }
      }

      const fetchPromise = fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      this.inFlight.set(cacheKey, fetchPromise.then(async response => {
        const data = await response.json();
        if (!response.ok) {
          return {
            error: data.error || 'Request failed',
            message: data.message,
          } as ApiResponse<T>;
        }

        // Cache successful GET responses for a very short time (stale-while-revalidate pattern could extend this)
        if ((options.method || 'GET').toUpperCase() === 'GET') {
          this.cache.set(cacheKey, {
            data,
            expiry: Date.now() + 5_000, // 5 seconds
          });
        }
        return { data } as ApiResponse<T>;
      }).finally(() => {
        // Clear in-flight after settlement to avoid memory leaks
        this.inFlight.delete(cacheKey);
      }));

      return (await this.inFlight.get(cacheKey)) as ApiResponse<T>;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: 'Network error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Problem-related API calls
  async getAllProblems(page: number = 1, limit: number = 12) {
    return this.request(`/api/problems/get-all?page=${page}&limit=${limit}`);
  }

  async getProblemStats() {
    return this.request('/api/problems/get-stats');
  }

  async getUserStats() {
    return this.request('/api/dashboard/user-stats');
  }

  async getProblemById(id: string) {
    return this.request(`/api/problems/get-by-id?id=${id}`);
  }

  async getProblemsByUserId() {
    return this.request('/api/problems/get-by-user-id');
  }

  async getSubmissionsByUserId() {
    return this.request('/api/problems/get-submissions-by-user');
  }

  async markProblemAsAttempted(problemId: string, problemData: any) {
    return this.request('/api/problems/mark-attempted', {
      method: 'POST',
      body: JSON.stringify({ problemId, problemData }),
    });
  }

  async markProblemAsCompleted(
    problemId: string,
    score: number,
    timeSpent: number
  ) {
    return this.request('/api/problems/mark-completed', {
      method: 'POST',
      body: JSON.stringify({ problemId, score, timeSpent }),
    });
  }

  async saveSubmission(problemId: string, submissionData: any) {
    return this.request('/api/problems/save-submission', {
      method: 'POST',
      body: JSON.stringify({ problemId, submissionData }),
    });
  }

  async saveInterviewProblem(problemData: any) {
    return this.request('/api/problems/save-interview-problem', {
      method: 'POST',
      body: JSON.stringify({ problemData }),
    });
  }

  async saveFeedback(problemId: string, feedbackData: any) {
    return this.request('/api/problems/save-feedback', {
      method: 'POST',
      body: JSON.stringify({ problemId, feedbackData }),
    });
  }

  // Evaluation-related API calls
  async evaluateSubmission(
    designation: string,
    code: string,
    drawingImage?: string
  ) {
    return this.request('/api/evaluation/evaluate-submission', {
      method: 'POST',
      body: JSON.stringify({ designation, code, drawingImage }),
    });
  }

  // Session-related API calls
  async checkSession(): Promise<SessionResponse> {
    const response = await this.request('/api/auth/session', {
      method: 'GET',
    });

    if (response.error) {
      return {
        authenticated: false,
        error: response.error,
        message: response.message,
      };
    }

    return response.data as SessionResponse;
  }

  // User profile-related API calls
  async getUserProfile() {
    return this.request('/api/user-profile/get');
  }

  async updateUserProfile(updates: any) {
    return this.request('/api/user-profile/update', {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    });
  }

  async completeOnboarding(onboardingData: any) {
    return this.request('/api/user-profile/complete-onboarding', {
      method: 'POST',
      body: JSON.stringify({ onboardingData }),
    });
  }

  // Interview simulation-related API calls
  async generateMockInterviewProblem(
    roundType: string,
    companyName: string,
    roleLevel: string,
    difficulty: string = 'medium'
  ) {
    return this.request('/api/interview-simulation/generate-problem', {
      method: 'POST',
      body: JSON.stringify({ roundType, companyName, roleLevel, difficulty }),
    });
  }

  async evaluateMockInterviewSubmission(problem: any, submission: any) {
    return this.request('/api/interview-simulation/evaluate-submission', {
      method: 'POST',
      body: JSON.stringify({ problem, submission }),
    });
  }

  // Payment-related API calls (existing ones)
  async createOrder(orderData: any) {
    return this.request('/api/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async verifyPayment(paymentData: any) {
    return this.request('/api/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async savePayment(paymentData: any) {
    return this.request('/api/save-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getSubscriptionStatus() {
    return this.request('/api/subscription/status', {
      method: 'GET',
    });
  }

  async activateSubscription(subscriptionData: any) {
    return this.request('/api/subscription/activate', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

// Export individual functions for easier imports
export const {
  getAllProblems,
  getProblemById,
  getProblemsByUserId,
  getSubmissionsByUserId,
  markProblemAsAttempted,
  markProblemAsCompleted,
  saveSubmission,
  saveInterviewProblem,
  saveFeedback,
  evaluateSubmission,
  checkSession,
  getUserProfile,
  updateUserProfile,
  completeOnboarding,
  generateMockInterviewProblem,
  evaluateMockInterviewSubmission,
  createOrder,
  verifyPayment,
  savePayment,
} = apiClient;
