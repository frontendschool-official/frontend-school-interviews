import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from '../../components/UserProfile';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useSubscription } from '../../hooks/useSubscription';

// Mock the hooks
jest.mock('../../hooks/useUserProfile');
jest.mock('../../hooks/useSubscription');
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockUseUserProfile = useUserProfile as jest.MockedFunction<
  typeof useUserProfile
>;
const mockUseSubscription = useSubscription as jest.MockedFunction<
  typeof useSubscription
>;

describe('UserProfile Component', () => {
  const mockUserProfile = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: '',
    phoneNumber: '+1234567890',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    lastLoginAt: new Date('2023-01-01'),
    isPremium: false,
    subscriptionStatus: 'free' as const,
    preferences: {
      theme: 'auto' as const,
      notifications: { email: true, push: true, reminders: true },
      difficulty: 'intermediate' as const,
      focusAreas: ['react', 'javascript'],
      dailyGoal: 30,
      timezone: 'UTC',
    },
    stats: {
      totalProblemsAttempted: 10,
      totalProblemsCompleted: 5,
      totalTimeSpent: 120,
      currentStreak: 3,
      longestStreak: 7,
      averageScore: 85,
      problemsByType: {
        machineCoding: 2,
        systemDesign: 1,
        dsa: 2,
      },
      problemsByDifficulty: {
        easy: 3,
        medium: 1,
        hard: 1,
      },
      lastActiveDate: new Date('2023-01-01'),
    },
    onboardingCompleted: true,
  };

  const mockSubscriptionStatus = {
    isPremium: false,
    subscriptionStatus: 'free' as const,
    daysRemaining: 0,
  };

  beforeEach(() => {
    mockUseUserProfile.mockReturnValue({
      isEditing: false,
      editData: {
        displayName: 'Test User',
        phoneNumber: '+1234567890',
        preferences: {
          theme: 'auto',
          difficulty: 'intermediate',
          dailyGoal: 30,
        },
      },
      profileLoading: false,
      userProfile: mockUserProfile,
      validationErrors: {},
      isSubmitting: false,
      handleSave: jest.fn(),
      handleCancel: jest.fn(),
      handleEdit: jest.fn(),
      updateEditData: jest.fn(),
      updatePreferences: jest.fn(),
      formatDate: jest.fn(date => date.toLocaleDateString()),
      getDifficultyColor: jest.fn(),
      getThemeIcon: jest.fn(),
      getCompletionRate: jest.fn(() => 50),
      getAverageTimePerProblem: jest.fn(() => 24),
      getUserLevel: jest.fn(() => 'Intermediate'),
    });

    mockUseSubscription.mockReturnValue({
      subscriptionStatus: mockSubscriptionStatus,
      loading: false,
      error: null,
      hasPremiumAccess: jest.fn(() => false),
      hasLifetimeAccess: jest.fn(() => false),
      isExpired: jest.fn(() => false),
      isExpiringSoon: jest.fn(() => false),
      getExpiryDate: jest.fn(() => null),
      formatDaysRemaining: jest.fn(() => 'Free'),
      getStatusColor: jest.fn(() => 'text-gray-500'),
      getPlanName: jest.fn(() => 'Free'),
      activateSubscription: jest.fn(),
      refreshStatus: jest.fn(),
      clearCache: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders user profile information correctly', () => {
    render(<UserProfile />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Problems completed
    expect(screen.getByText('3')).toBeInTheDocument(); // Current streak
    expect(screen.getByText('10')).toBeInTheDocument(); // Problems attempted
    expect(screen.getByText('85%')).toBeInTheDocument(); // Average score
  });

  it('shows loading state when profile is loading', () => {
    mockUseUserProfile.mockReturnValue({
      ...mockUseUserProfile(),
      profileLoading: true,
      userProfile: null,
    });

    render(<UserProfile />);

    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  it('shows error state when subscription has error', () => {
    mockUseSubscription.mockReturnValue({
      ...mockUseSubscription(),
      error: 'Failed to load subscription',
    });

    render(<UserProfile />);

    expect(screen.getByText('Subscription Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load subscription')).toBeInTheDocument();
  });

  it('displays edit form when editing mode is active', () => {
    mockUseUserProfile.mockReturnValue({
      ...mockUseUserProfile(),
      isEditing: true,
    });

    render(<UserProfile />);

    expect(screen.getByLabelText('Display Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('shows validation errors for invalid display name', () => {
    mockUseUserProfile.mockReturnValue({
      ...mockUseUserProfile(),
      isEditing: true,
      validationErrors: {
        displayName: 'Display name must be at least 2 characters',
      },
    });

    render(<UserProfile />);

    expect(
      screen.getByText('Display name must be at least 2 characters')
    ).toBeInTheDocument();
  });

  it('shows validation errors for invalid phone number', () => {
    mockUseUserProfile.mockReturnValue({
      ...mockUseUserProfile(),
      isEditing: true,
      validationErrors: {
        phoneNumber: 'Please enter a valid phone number',
      },
    });

    render(<UserProfile />);

    expect(
      screen.getByText('Please enter a valid phone number')
    ).toBeInTheDocument();
  });

  it('displays premium badge when user has premium access', () => {
    mockUseSubscription.mockReturnValue({
      ...mockUseSubscription(),
      hasPremiumAccess: jest.fn(() => true),
      hasLifetimeAccess: jest.fn(() => false),
    });

    render(<UserProfile />);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('displays lifetime badge when user has lifetime access', () => {
    mockUseSubscription.mockReturnValue({
      ...mockUseSubscription(),
      hasPremiumAccess: jest.fn(() => true),
      hasLifetimeAccess: jest.fn(() => true),
    });

    render(<UserProfile />);

    expect(screen.getByText('Lifetime')).toBeInTheDocument();
  });

  it('calls handleEdit when edit button is clicked', () => {
    const handleEdit = jest.fn();
    mockUseUserProfile.mockReturnValue({
      ...mockUseUserProfile(),
      handleEdit,
    });

    render(<UserProfile />);

    fireEvent.click(screen.getByText('Edit Profile'));
    expect(handleEdit).toHaveBeenCalled();
  });

  it('calls handleSave when form is submitted', async () => {
    const handleSave = jest.fn();
    mockUseUserProfile.mockReturnValue({
      ...mockUseUserProfile(),
      isEditing: true,
      handleSave,
    });

    render(<UserProfile />);

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalled();
    });
  });

  it('displays subscription status information', () => {
    mockUseSubscription.mockReturnValue({
      ...mockUseSubscription(),
      formatDaysRemaining: jest.fn(() => '30 days remaining'),
    });

    render(<UserProfile />);

    expect(screen.getByText('30 days remaining')).toBeInTheDocument();
  });

  it('shows expiring soon warning when subscription is expiring', () => {
    mockUseSubscription.mockReturnValue({
      ...mockUseSubscription(),
      isExpiringSoon: jest.fn(() => true),
      formatDaysRemaining: jest.fn(() => '3 days remaining (expiring soon)'),
    });

    render(<UserProfile />);

    expect(
      screen.getByText('3 days remaining (expiring soon)')
    ).toBeInTheDocument();
  });

  it('displays statistics correctly', () => {
    render(<UserProfile />);

    // Check that all stats are displayed
    expect(screen.getByText('Problems Completed')).toBeInTheDocument();
    expect(screen.getByText('Day Streak')).toBeInTheDocument();
    expect(screen.getByText('Problems Attempted')).toBeInTheDocument();
    expect(screen.getByText('Average Score')).toBeInTheDocument();
  });

  it('displays preferences information', () => {
    render(<UserProfile />);

    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Difficulty Level')).toBeInTheDocument();
    expect(screen.getByText('Daily Goal')).toBeInTheDocument();
    expect(screen.getByText('Timezone')).toBeInTheDocument();
    expect(screen.getByText('Focus Areas')).toBeInTheDocument();
  });

  it('displays detailed statistics section', () => {
    render(<UserProfile />);

    expect(screen.getByText('Problems by Type:')).toBeInTheDocument();
    expect(screen.getByText('Problems by Difficulty:')).toBeInTheDocument();
    expect(screen.getByText('Time & Streaks:')).toBeInTheDocument();
  });
});
