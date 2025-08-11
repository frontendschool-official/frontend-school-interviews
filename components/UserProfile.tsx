import React from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaTrophy,
  FaChartLine,
  FaCog,
} from "react-icons/fa";

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
    updatePreferences,
    formatDate,
    getDifficultyColor,
    getThemeIcon,
  } = useUserProfile();

  if (!userProfile) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center py-16">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 animate-fade-in">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-8 sm:mb-12 p-4 sm:p-8 bg-secondary rounded-2xl shadow-lg text-center sm:text-left">
        <div className="w-20 h-20 sm:w-30 sm:h-30 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl sm:text-3xl text-white overflow-hidden relative">
          {userProfile.photoURL ? (
            <img 
              src={userProfile.photoURL} 
              alt={userProfile.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser />
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text mb-2">{userProfile.displayName}</h1>
          <p className="text-sm sm:text-lg text-text opacity-80 mb-2 sm:mb-4 flex items-center justify-center sm:justify-start gap-2">
            <FaEnvelope />
            {userProfile.email}
          </p>
          <p className="text-xs sm:text-sm text-text opacity-60 flex items-center justify-center sm:justify-start gap-2">
            <FaCalendar />
            Member since {formatDate(userProfile.createdAt)}
          </p>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="bg-gradient-to-r from-primary to-accent text-white border-none px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base"
        >
          <FaEdit />
          Edit Profile
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="bg-secondary p-4 sm:p-5 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-1">
          <div className="text-xl sm:text-2xl text-primary mb-3 sm:mb-4">
            <FaTrophy />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-text mb-2">{userProfile.stats.totalProblemsCompleted}</div>
          <div className="text-xs sm:text-sm text-text opacity-80">Problems Completed</div>
        </div>

        <div className="bg-secondary p-4 sm:p-5 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-1">
          <div className="text-xl sm:text-2xl text-primary mb-3 sm:mb-4">
            <FaChartLine />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-text mb-2">{userProfile.stats.currentStreak}</div>
          <div className="text-xs sm:text-sm text-text opacity-80">Day Streak</div>
        </div>

        <div className="bg-secondary p-4 sm:p-5 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-1">
          <div className="text-xl sm:text-2xl text-primary mb-3 sm:mb-4">
            <FaCog />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-text mb-2">{userProfile.stats.totalProblemsAttempted}</div>
          <div className="text-xs sm:text-sm text-text opacity-80">Problems Attempted</div>
        </div>

        <div className="bg-secondary p-4 sm:p-5 rounded-xl text-center shadow-lg transition-transform duration-300 hover:-translate-y-1">
          <div className="text-xl sm:text-2xl text-primary mb-3 sm:mb-4">
            <FaUser />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-text mb-2">{Math.round(userProfile.stats.averageScore)}%</div>
          <div className="text-xs sm:text-sm text-text opacity-80">Average Score</div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-secondary p-6 sm:p-8 rounded-2xl mb-6 sm:mb-8 shadow-lg">
        <h2 className="text-xl sm:text-2xl font-semibold text-text mb-4 sm:mb-6 flex items-center gap-2">
          <FaUser />
          Personal Information
        </h2>

        {isEditing ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block font-semibold text-text mb-2">Display Name</label>
                <input
                  type="text"
                  value={editData.displayName}
                  onChange={(e) => updateEditData('displayName', e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-border rounded-lg bg-bodyBg text-text text-sm sm:text-base transition-colors duration-300 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={editData.phoneNumber}
                  onChange={(e) => updateEditData('phoneNumber', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-border rounded-lg bg-bodyBg text-text text-sm sm:text-base transition-colors duration-300 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold border-2 border-border bg-transparent text-text cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:border-primary hover:text-primary text-sm sm:text-base"
                >
                  <FaTimes />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold border-none cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 text-sm sm:text-base"
                >
                  <FaSave />
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <strong>Display Name:</strong> {userProfile.displayName}
            </div>
            {userProfile.phoneNumber && (
              <div>
                <strong>Phone:</strong> {userProfile.phoneNumber}
              </div>
            )}
            <div>
              <strong>Last Login:</strong> {formatDate(userProfile.lastLoginAt)}
            </div>
          </div>
        )}
      </div>

      {/* Preferences Section */}
      <div className="bg-secondary p-8 rounded-2xl mb-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-text mb-6 flex items-center gap-2">
          <FaCog />
          Preferences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 border-2 border-border rounded-lg bg-bodyBg">
            <div className="font-semibold text-text mb-2">Theme</div>
            <div className="text-text opacity-80">{userProfile.preferences.theme}</div>
          </div>

          <div className="p-4 border-2 border-border rounded-lg bg-bodyBg">
            <div className="font-semibold text-text mb-2">Difficulty Level</div>
            <div className="text-text opacity-80">{userProfile.preferences.difficulty}</div>
          </div>

          <div className="p-4 border-2 border-border rounded-lg bg-bodyBg">
            <div className="font-semibold text-text mb-2">Daily Goal</div>
            <div className="text-text opacity-80">{userProfile.preferences.dailyGoal} minutes</div>
          </div>

          <div className="p-4 border-2 border-border rounded-lg bg-bodyBg">
            <div className="font-semibold text-text mb-2">Timezone</div>
            <div className="text-text opacity-80">{userProfile.preferences.timezone}</div>
          </div>
        </div>

        {userProfile.preferences.focusAreas.length > 0 && (
          <div className="mt-6">
            <div className="font-semibold text-text mb-4">Focus Areas</div>
            <div className="flex flex-wrap gap-2">
              {userProfile.preferences.focusAreas.map((area, index) => (
                <span
                  key={index}
                  className="bg-primary bg-opacity-20 text-primary px-3 py-1 rounded-full text-sm font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="bg-secondary p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-text mb-6 flex items-center gap-2">
          <FaChartLine />
          Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <strong>Problems by Type:</strong>
            <div>Machine Coding: {userProfile.stats.problemsByType.machineCoding}</div>
            <div>System Design: {userProfile.stats.problemsByType.systemDesign}</div>
            <div>DSA: {userProfile.stats.problemsByType.dsa}</div>
          </div>

          <div>
            <strong>Problems by Difficulty:</strong>
            <div>Easy: {userProfile.stats.problemsByDifficulty.easy}</div>
            <div>Medium: {userProfile.stats.problemsByDifficulty.medium}</div>
            <div>Hard: {userProfile.stats.problemsByDifficulty.hard}</div>
          </div>

          <div>
            <strong>Time Spent:</strong>
            <div>{Math.round(userProfile.stats.totalTimeSpent / 60)} hours</div>
            <strong>Longest Streak:</strong>
            <div>{userProfile.stats.longestStreak} days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
