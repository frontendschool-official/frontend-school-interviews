import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useSubscription } from '../hooks/useSubscription';
import { Input } from '@/components/ui';
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaTrophy,
  FaChartLine,
  FaCog,
  FaCrown,
  FaExclamationTriangle,
  FaSpinner,
  FaPhone,
  FaGlobe,
  FaBullseye,
  FaClock,
} from 'react-icons/fa';

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

interface ValidationErrors {
  displayName?: string;
  phoneNumber?: string;
}

const UserProfile: React.FC = () => {
  const {
    isEditing,
    editData,
    profileLoading,
    userProfile,
    handleSave,
    handleCancel,
    handleEdit,
    updateEditData,
    formatDate,
  } = useUserProfile();

  const {
    subscriptionStatus,
    error: subscriptionError,
    hasPremiumAccess,
    hasLifetimeAccess,
    formatDaysRemaining,
  } = useSubscription();

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form data
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!editData.displayName?.trim()) {
      errors.displayName = 'Display name is required';
    } else if (editData.displayName.length < 2) {
      errors.displayName = 'Display name must be at least 2 characters';
    } else if (editData.displayName.length > 50) {
      errors.displayName = 'Display name must be less than 50 characters';
    }

    if (
      editData.phoneNumber &&
      !/^\+?[\d\s\-()]{10,}$/.test(editData.phoneNumber)
    ) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enhanced save handler with validation
  const handleSaveWithValidation = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsSubmitting(true);
    try {
      await handleSave();
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear validation errors when editing is cancelled
  useEffect(() => {
    if (!isEditing) {
      setValidationErrors({});
    }
  }, [isEditing]);

  // Loading state
  if (profileLoading || !userProfile) {
    return (
      <div className='max-w-6xl mx-auto p-8'>
        <div className='flex items-center justify-center py-16'>
          <div className='text-center'>
            <FaSpinner className='animate-spin text-4xl text-primary mx-auto mb-4' />
            <p className='text-text opacity-80'>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (subscriptionError) {
    return (
      <div className='max-w-6xl mx-auto p-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <FaExclamationTriangle className='text-red-500 text-3xl mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-red-800 mb-2'>
            Subscription Error
          </h2>
          <p className='text-red-600 mb-4'>{subscriptionError}</p>
          <button
            onClick={() => window.location.reload()}
            className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto p-4 sm:p-8 animate-fade-in'>
      {/* Profile Header */}
      <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-8 sm:mb-12 p-4 sm:p-8 bg-secondary rounded-2xl shadow-lg text-center sm:text-left'>
        <div className='relative'>
          <div className='w-20 h-20 sm:w-30 sm:h-30 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl sm:text-3xl text-white overflow-hidden relative'>
            {userProfile.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt={userProfile.displayName}
                className='w-full h-full object-cover'
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <FaUser className={userProfile.photoURL ? 'hidden' : ''} />
          </div>
          {hasPremiumAccess() && (
            <div className='absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-1'>
              <FaCrown className='text-sm' />
            </div>
          )}
        </div>

        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-2'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-text'>
              {userProfile.displayName}
            </h1>
            {hasPremiumAccess() && (
              <span className='bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold'>
                {hasLifetimeAccess() ? 'Lifetime' : 'Premium'}
              </span>
            )}
          </div>
          <p className='text-sm sm:text-lg text-text opacity-80 mb-2 sm:mb-4 flex items-center justify-center sm:justify-start gap-2'>
            <FaEnvelope />
            {userProfile.email}
          </p>
          <p className='text-xs sm:text-sm text-text opacity-60 flex items-center justify-center sm:justify-start gap-2'>
            <FaCalendar />
            Member since {formatDate(userProfile.createdAt)}
          </p>
          {subscriptionStatus && (
            <p className='text-xs sm:text-sm text-text opacity-60 flex items-center justify-center sm:justify-start gap-2 mt-1'>
              <FaCrown />
              {formatDaysRemaining()}
            </p>
          )}
        </div>

        <button
          onClick={handleEdit}
          disabled={isSubmitting}
          className='bg-gradient-to-r from-primary to-accent text-white border-none px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed'
        >
          <FaEdit />
          Edit Profile
        </button>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12'>
        <div className='bg-secondary p-4 sm:p-5 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-1'>
          <div className='text-xl sm:text-2xl text-primary mb-3 sm:mb-4'>
            <FaTrophy />
          </div>
          <div className='text-lg sm:text-xl md:text-2xl font-bold text-text mb-2'>
            {userProfile.stats.totalProblemsCompleted || 0}
          </div>
          <div className='text-xs sm:text-sm text-text opacity-80'>
            Problems Completed
          </div>
        </div>

        <div className='bg-secondary p-4 sm:p-5 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-1'>
          <div className='text-xl sm:text-2xl text-primary mb-3 sm:mb-4'>
            <FaChartLine />
          </div>
          <div className='text-lg sm:text-xl md:text-2xl font-bold text-text mb-2'>
            {userProfile.stats.currentStreak || 0}
          </div>
          <div className='text-xs sm:text-sm text-text opacity-80'>
            Day Streak
          </div>
        </div>

        <div className='bg-secondary p-4 sm:p-5 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-1'>
          <div className='text-xl sm:text-2xl text-primary mb-3 sm:mb-4'>
            <FaCog />
          </div>
          <div className='text-lg sm:text-xl md:text-2xl font-bold text-text mb-2'>
            {userProfile.stats.totalProblemsAttempted || 0}
          </div>
          <div className='text-xs sm:text-sm text-text opacity-80'>
            Problems Attempted
          </div>
        </div>

        <div className='bg-secondary p-4 sm:p-5 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-1'>
          <div className='text-xl sm:text-2xl text-primary mb-3 sm:mb-4'>
            <FaUser />
          </div>
          <div className='text-lg sm:text-xl md:text-2xl font-bold text-text mb-2'>
            {Math.round(userProfile.stats.averageScore || 0)}%
          </div>
          <div className='text-xs sm:text-sm text-text opacity-80'>
            Average Score
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className='bg-secondary p-6 sm:p-8 rounded-2xl mb-6 sm:mb-8 shadow-lg'>
        <h2 className='text-xl sm:text-2xl font-semibold text-text mb-4 sm:mb-6 flex items-center gap-2'>
          <FaUser />
          Personal Information
        </h2>

        {isEditing ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSaveWithValidation();
            }}
          >
            <div className='space-y-4 sm:space-y-6'>
              <Input
                label='Display Name *'
                type='text'
                value={editData.displayName}
                onChange={e => updateEditData('displayName', e.target.value)}
                required
                maxLength={50}
                error={validationErrors.displayName}
              />

              <Input
                label='Phone Number'
                type='tel'
                value={editData.phoneNumber}
                onChange={e => updateEditData('phoneNumber', e.target.value)}
                placeholder='+1 (555) 123-4567'
                leftIcon={<FaPhone className='text-text opacity-60' />}
                error={validationErrors.phoneNumber}
              />

              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mt-4 sm:mt-6'>
                <button
                  type='button'
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className='px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold border-2 border-border bg-transparent text-text cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:border-primary hover:text-primary text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed'
                >
                  <FaTimes />
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting || profileLoading}
                  className='px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold border-none cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 text-sm sm:text-base'
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className='animate-spin' />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <FaUser className='text-text opacity-60' />
              <span>
                <strong>Display Name:</strong> {userProfile.displayName}
              </span>
            </div>
            {userProfile.phoneNumber && (
              <div className='flex items-center gap-2'>
                <FaPhone className='text-text opacity-60' />
                <span>
                  <strong>Phone:</strong> {userProfile.phoneNumber}
                </span>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <FaCalendar className='text-text opacity-60' />
              <span>
                <strong>Last Login:</strong>{' '}
                {formatDate(userProfile.lastLoginAt)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Preferences Section */}
      <div className='bg-secondary p-8 rounded-2xl mb-8 shadow-lg'>
        <h2 className='text-2xl font-semibold text-text mb-6 flex items-center gap-2'>
          <FaCog />
          Preferences
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='p-4 border-2 border-border rounded-lg bg-bodyBg'>
            <div className='font-semibold text-text mb-2 flex items-center gap-2'>
              <FaGlobe />
              Theme
            </div>
            <div className='text-text opacity-80 capitalize'>
              {userProfile.preferences.theme}
            </div>
          </div>

          <div className='p-4 border-2 border-border rounded-lg bg-bodyBg'>
            <div className='font-semibold text-text mb-2 flex items-center gap-2'>
              <FaBullseye />
              Difficulty Level
            </div>
            <div className='text-text opacity-80 capitalize'>
              {userProfile.preferences.difficulty}
            </div>
          </div>

          <div className='p-4 border-2 border-border rounded-lg bg-bodyBg'>
            <div className='font-semibold text-text mb-2 flex items-center gap-2'>
              <FaClock />
              Daily Goal
            </div>
            <div className='text-text opacity-80'>
              {userProfile.preferences.dailyGoal} minutes
            </div>
          </div>

          <div className='p-4 border-2 border-border rounded-lg bg-bodyBg'>
            <div className='font-semibold text-text mb-2 flex items-center gap-2'>
              <FaGlobe />
              Timezone
            </div>
            <div className='text-text opacity-80'>
              {userProfile.preferences.timezone}
            </div>
          </div>
        </div>

        {userProfile.preferences.focusAreas &&
          userProfile.preferences.focusAreas.length > 0 && (
            <div className='mt-6'>
              <div className='font-semibold text-text mb-4 flex items-center gap-2'>
                <FaBullseye />
                Focus Areas
              </div>
              <div className='flex flex-wrap gap-2'>
                {userProfile.preferences.focusAreas.map((area, index) => (
                  <span
                    key={index}
                    className='bg-primary bg-opacity-20 text-primary px-3 py-1 rounded-full text-sm font-medium'
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Statistics Section */}
      <div className='bg-secondary p-8 rounded-2xl shadow-lg'>
        <h2 className='text-2xl font-semibold text-text mb-6 flex items-center gap-2'>
          <FaChartLine />
          Statistics
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div>
            <strong className='text-text'>Problems by Type:</strong>
            <div className='mt-2 space-y-1'>
              <div className='flex justify-between'>
                <span className='text-text opacity-80'>Machine Coding:</span>
                <span className='font-semibold'>
                  {userProfile.stats.problemsByType?.machineCoding || 0}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-text opacity-80'>System Design:</span>
                <span className='font-semibold'>
                  {userProfile.stats.problemsByType?.systemDesign || 0}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-text opacity-80'>DSA:</span>
                <span className='font-semibold'>
                  {userProfile.stats.problemsByType?.dsa || 0}
                </span>
              </div>
            </div>
          </div>

          <div>
            <strong className='text-text'>Problems by Difficulty:</strong>
            <div className='mt-2 space-y-1'>
              <div className='flex justify-between'>
                <span className='text-green-600'>Easy:</span>
                <span className='font-semibold'>
                  {userProfile.stats.problemsByDifficulty?.easy || 0}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-yellow-600'>Medium:</span>
                <span className='font-semibold'>
                  {userProfile.stats.problemsByDifficulty?.medium || 0}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-red-600'>Hard:</span>
                <span className='font-semibold'>
                  {userProfile.stats.problemsByDifficulty?.hard || 0}
                </span>
              </div>
            </div>
          </div>

          <div>
            <strong className='text-text'>Time & Streaks:</strong>
            <div className='mt-2 space-y-1'>
              <div className='flex justify-between'>
                <span className='text-text opacity-80'>Time Spent:</span>
                <span className='font-semibold'>
                  {Math.round((userProfile.stats.totalTimeSpent || 0) / 60)}{' '}
                  hours
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-text opacity-80'>Longest Streak:</span>
                <span className='font-semibold'>
                  {userProfile.stats.longestStreak || 0} days
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-text opacity-80'>Average Score:</span>
                <span className='font-semibold'>
                  {Math.round(userProfile.stats.averageScore || 0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
