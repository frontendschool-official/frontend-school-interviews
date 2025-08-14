// Common utility functions used across the application

// Badge color utilities
export const getStatusBadgeColor = (status?: string) => {
  switch (status) {
    case 'solved':
    case 'completed':
      return 'bg-green-500';
    case 'attempted':
    case 'in-progress':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

export const getDifficultyBadgeColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'border-green-500 text-green-500';
    case 'medium':
      return 'border-yellow-500 text-yellow-500';
    case 'hard':
      return 'border-red-500 text-red-500';
    default:
      return 'border-gray-500 text-gray-500';
  }
};

export const getCategoryBadgeColor = (type: string) => {
  switch (type) {
    case 'dsa':
      return 'border-blue-500 text-blue-500';
    case 'machine_coding':
    case 'machine-coding':
      return 'border-purple-500 text-purple-500';
    case 'system_design':
    case 'system-design':
      return 'border-cyan-500 text-cyan-500';
    case 'theory_and_debugging':
    case 'theory':
      return 'border-pink-500 text-pink-500';
    case 'interview':
      return 'border-green-500 text-green-500';
    case 'user_generated':
      return 'border-yellow-500 text-yellow-500';
    default:
      return 'border-gray-500 text-gray-500';
  }
};

export const getTypeDisplayName = (type: string): string => {
  switch (type) {
    case 'dsa':
      return 'DSA';
    case 'machine_coding':
    case 'machine-coding':
      return 'Machine Coding';
    case 'system_design':
    case 'system-design':
      return 'System Design';
    case 'theory_and_debugging':
    case 'theory':
      return 'Theory';
    case 'interview':
      return 'Interview';
    case 'user_generated':
      return 'Custom';
    default:
      return 'Problem';
  }
};

// Status utilities
export const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
    case 'solved':
      return 'Completed';
    case 'in-progress':
    case 'attempted':
      return 'In Progress';
    case 'not-started':
    case 'unsolved':
      return 'Not Started';
    default:
      return 'Not Started';
  }
};

export const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
};

// Button utilities
export const getButtonClasses = (
  variant: 'primary' | 'secondary' | 'success' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md'
) => {
  const baseClasses =
    'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:shadow-focus';

  const variantClasses = {
    primary:
      'bg-primary text-white hover:bg-accent shadow-card hover:shadow-lg',
    secondary:
      'bg-secondary text-text border border-border hover:bg-secondary/80',
    success:
      'bg-primary text-white hover:bg-accent shadow-card hover:shadow-lg',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
};

// String utilities
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Date utilities
export const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Array utilities
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Theme utilities
export const getThemeClass = (theme: string) => {
  switch (theme) {
    case 'dark':
      return 'dark';
    case 'black':
      return 'black';
    default:
      return 'light';
  }
};

// Loading utilities
export const createLoadingStates = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `loading-${i}`,
    loading: true,
  }));
};

// Error utilities
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};

// Local storage utilities
export const setLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return defaultValue;
  }
};

// URL utilities
export const getQueryParam = (param: string): string | null => {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

export const setQueryParam = (param: string, value: string) => {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set(param, value);
  window.history.replaceState({}, '', url.toString());
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
