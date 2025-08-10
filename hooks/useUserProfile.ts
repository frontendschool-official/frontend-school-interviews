import { useState } from 'react';
import { useAuth } from './useAuth';

interface EditData {
  displayName: string;
  phoneNumber: string;
  preferences: {
    theme: string;
    difficulty: string;
    dailyGoal: number;
  };
}

export const useUserProfile = () => {
  const { userProfile, updateProfile, profileLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditData>({
    displayName: userProfile?.displayName || "",
    phoneNumber: userProfile?.phoneNumber || "",
    preferences: {
      theme: userProfile?.preferences.theme || "auto",
      difficulty: userProfile?.preferences.difficulty || "intermediate",
      dailyGoal: userProfile?.preferences.dailyGoal || 30,
    },
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        displayName: editData.displayName,
        phoneNumber: editData.phoneNumber,
        preferences: editData.preferences,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setEditData({
        displayName: userProfile.displayName,
        phoneNumber: userProfile.phoneNumber || "",
        preferences: {
          theme: userProfile.preferences.theme,
          difficulty: userProfile.preferences.difficulty,
          dailyGoal: userProfile.preferences.dailyGoal,
        },
      });
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const updateEditData = (field: keyof EditData, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updatePreferences = (field: keyof EditData['preferences'], value: any) => {
    setEditData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getDifficultyColor = (difficulty: string) => {
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
  };

  const getThemeIcon = (theme: string) => {
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
  };

  return {
    // State
    isEditing,
    editData,
    profileLoading,
    userProfile,

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
  };
}; 