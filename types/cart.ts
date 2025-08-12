export interface PaymentItem {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'premium_plan' | 'mock_interview' | 'custom_problem';
  duration?: string; // for premium plans
  features?: string[]; // for premium plans
  quantity: number;
  image?: string;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: PaymentItem[];
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export interface PaymentResponse {
  success: boolean;
  orderId?: string;
  paymentId?: string;
  error?: string;
  message?: string;
}

export interface PremiumPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // e.g., "1 month", "3 months", "1 year"
  features: string[];
  popular?: boolean;
  discount?: number;
}

export interface MockInterviewPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  rounds: number;
  duration: string;
  features: string[];
  includes: string[];
}
