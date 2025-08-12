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

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Request failed',
          message: data.message,
        };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: 'Network error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Problem-related API calls
  async getAllProblems() {
    return this.request('/api/problems/get-all');
  }

  async getProblemStats() {
    return this.request('/api/problems/get-stats');
  }

  async getUserStats(userId: string) {
    return this.request(`/api/dashboard/user-stats?userId=${userId}`);
  }

  async getProblemById(id: string) {
    return this.request(`/api/problems/get-by-id?id=${id}`);
  }

  async getProblemsByUserId(userId: string) {
    return this.request(`/api/problems/get-by-user-id?userId=${userId}`);
  }

  async getSubmissionsByUserId(userId: string) {
    return this.request(
      `/api/problems/get-submissions-by-user?userId=${userId}`
    );
  }

  async markProblemAsAttempted(
    userId: string,
    problemId: string,
    problemData: any
  ) {
    return this.request('/api/problems/mark-attempted', {
      method: 'POST',
      body: JSON.stringify({ userId, problemId, problemData }),
    });
  }

  async markProblemAsCompleted(
    userId: string,
    problemId: string,
    score: number,
    timeSpent: number
  ) {
    return this.request('/api/problems/mark-completed', {
      method: 'POST',
      body: JSON.stringify({ userId, problemId, score, timeSpent }),
    });
  }

  async saveSubmission(userId: string, problemId: string, submissionData: any) {
    return this.request('/api/problems/save-submission', {
      method: 'POST',
      body: JSON.stringify({ userId, problemId, submissionData }),
    });
  }

  async saveInterviewProblem(problemData: any) {
    return this.request('/api/problems/save-interview-problem', {
      method: 'POST',
      body: JSON.stringify({ problemData }),
    });
  }

  async saveFeedback(userId: string, problemId: string, feedbackData: any) {
    return this.request('/api/problems/save-feedback', {
      method: 'POST',
      body: JSON.stringify({ userId, problemId, feedbackData }),
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

  // User profile-related API calls
  async getUserProfile(uid: string) {
    return this.request(`/api/user-profile/get?uid=${uid}`);
  }

  async updateUserProfile(uid: string, updates: any) {
    return this.request('/api/user-profile/update', {
      method: 'PUT',
      body: JSON.stringify({ uid, updates }),
    });
  }

  async completeOnboarding(uid: string, onboardingData: any) {
    return this.request('/api/user-profile/complete-onboarding', {
      method: 'POST',
      body: JSON.stringify({ uid, onboardingData }),
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
  getUserProfile,
  updateUserProfile,
  completeOnboarding,
  generateMockInterviewProblem,
  evaluateMockInterviewSubmission,
  createOrder,
  verifyPayment,
  savePayment,
} = apiClient;
