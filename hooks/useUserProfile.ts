import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

// Fallback toast implementation in case react-hot-toast is not available
let toast: any;
try {
  const toastModule = require('react-hot-toast');
  toast = toastModule.toast;
} catch (error) {
  // Fallback implementation
  toast = {
    success: (message: string) => console.log('Success:', message),
    error: (message: string) => console.error('Error:', message),
  };
}

interface EditData {
  displayName: string;
  phoneNumber: string;
  preferences: {
    theme: string;
    difficulty: string;
    dailyGoal: number;
  };
}

interface ValidationErrors {
  displayName?: string;
  phoneNumber?: string;
  preferences?: {
    dailyGoal?: string;
  };
}

export const useUserProfile = () => {
  const { userProfile, updateProfile, profileLoading, refreshProfile } =
    useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditData>({
    displayName: '',
    phoneNumber: '',
    preferences: {
      theme: 'auto',
      difficulty: 'intermediate',
      dailyGoal: 30,
    },
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize edit data when user profile changes
  useEffect(() => {
    if (userProfile) {
      setEditData({
        displayName: userProfile.displayName || '',
        phoneNumber: userProfile.phoneNumber || '',
        preferences: {
          theme: userProfile.preferences?.theme || 'auto',
          difficulty: userProfile.preferences?.difficulty || 'intermediate',
          dailyGoal: userProfile.preferences?.dailyGoal || 30,
        },
      });
    }
  }, [userProfile]);

  // Validate form data
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    // Validate display name
    if (!editData.displayName?.trim()) {
      errors.displayName = 'Display name is required';
    } else if (editData.displayName.length < 2) {
      errors.displayName = 'Display name must be at least 2 characters';
    } else if (editData.displayName.length > 50) {
      errors.displayName = 'Display name must be less than 50 characters';
    }

    // Validate phone number
    if (
      editData.phoneNumber &&
      !/^\+?[\d\s\-()]{10,}$/.test(editData.phoneNumber)
    ) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    // Validate daily goal
    if (
      editData.preferences.dailyGoal < 5 ||
      editData.preferences.dailyGoal > 480
    ) {
      errors.preferences = {
        ...errors.preferences,
        dailyGoal: 'Daily goal must be between 5 and 480 minutes',
      };
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [editData]);

  const handleSave = async () => {
    if (!validateForm()) {
      throw new Error('Validation failed');
    }

    if (!userProfile) {
      throw new Error('No user profile found');
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        displayName: editData.displayName.trim(),
        phoneNumber: editData.phoneNumber.trim() || undefined,
        preferences: editData.preferences,
      });

      // Refresh profile to get updated data
      await refreshProfile();
      setIsEditing(false);
      setValidationErrors({});
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = useCallback(() => {
    if (userProfile) {
      setEditData({
        displayName: userProfile.displayName || '',
        phoneNumber: userProfile.phoneNumber || '',
        preferences: {
          theme: userProfile.preferences?.theme || 'auto',
          difficulty: userProfile.preferences?.difficulty || 'intermediate',
          dailyGoal: userProfile.preferences?.dailyGoal || 30,
        },
      });
    }
    setIsEditing(false);
    setValidationErrors({});
  }, [userProfile]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const updateEditData = useCallback((field: keyof EditData, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as keyof ValidationErrors];
      return newErrors;
    });
  }, []);

  const updatePreferences = useCallback(
    (field: keyof EditData['preferences'], value: any) => {
      setEditData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [field]: value,
        },
      }));

      // Clear validation error for this preference
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors.preferences) {
          delete newErrors.preferences[
            field as keyof ValidationErrors['preferences']
          ];
        }
        return newErrors;
      });
    },
    []
  );

  const formatDate = useCallback((date: Date | string) => {
    if (!date) return 'Unknown';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  }, []);

  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }, []);

  const getThemeIcon = useCallback((theme: string) => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'auto':
        return '🔄';
      default:
        return '☀️';
    }
  }, []);

  // Calculate completion rate
  const getCompletionRate = useCallback(() => {
    if (!userProfile?.stats) return 0;

    const { totalProblemsAttempted, totalProblemsCompleted } =
      userProfile.stats;
    if (totalProblemsAttempted === 0) return 0;

    return Math.round((totalProblemsCompleted / totalProblemsAttempted) * 100);
  }, [userProfile?.stats]);

  // Calculate average time per problem
  const getAverageTimePerProblem = useCallback(() => {
    if (!userProfile?.stats) return 0;

    const { totalTimeSpent, totalProblemsCompleted } = userProfile.stats;
    if (totalProblemsCompleted === 0) return 0;

    return Math.round(totalTimeSpent / totalProblemsCompleted);
  }, [userProfile?.stats]);

  // Get user level based on completed problems
  const getUserLevel = useCallback(() => {
    if (!userProfile?.stats) return 'Beginner';

    const completed = userProfile.stats.totalProblemsCompleted;

    if (completed >= 100) return 'Expert';
    if (completed >= 50) return 'Advanced';
    if (completed >= 20) return 'Intermediate';
    if (completed >= 5) return 'Beginner+';
    return 'Beginner';
  }, [userProfile?.stats]);

  return {
    // State
    isEditing,
    editData,
    profileLoading,
    userProfile,
    validationErrors,
    isSubmitting,

    // Handlers
    handleSave,
    handleCancel,
    handleEdit,
    updateEditData,
    updatePreferences,

    // Utilities
    formatDate,
    getDifficultyColor,
    getThemeIcon,
    getCompletionRate,
    getAverageTimePerProblem,
    getUserLevel,
  };
};
