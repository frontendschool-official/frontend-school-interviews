import { NextApiRequest, NextApiResponse } from 'next';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';
import { updateUserProfile } from '@/services/firebase/user-profile';
import { updateUserStats } from '@/services/firebase/user-profile';

interface UpdateRequest {
  displayName?: string;
  phoneNumber?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'auto';
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    dailyGoal?: number;
    focusAreas?: string[];
    timezone?: string;
  };
  stats?: {
    totalProblemsAttempted?: number;
    totalProblemsCompleted?: number;
    totalTimeSpent?: number;
    currentStreak?: number;
    longestStreak?: number;
    averageScore?: number;
    problemsByType?: {
      machineCoding?: number;
      systemDesign?: number;
      dsa?: number;
    };
    problemsByDifficulty?: {
      easy?: number;
      medium?: number;
      hard?: number;
    };
  };
}

interface ValidationErrors {
  displayName?: string;
  phoneNumber?: string;
  preferences?: {
    dailyGoal?: string;
    theme?: string;
    difficulty?: string;
    focusAreas?: string;
  };
  stats?: {
    [key: string]: string;
  };
}

function validateUpdateData(data: UpdateRequest): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  // Validate display name
  if (data.displayName !== undefined) {
    if (!data.displayName.trim()) {
      errors.displayName = 'Display name is required';
    } else if (data.displayName.length < 2) {
      errors.displayName = 'Display name must be at least 2 characters';
    } else if (data.displayName.length > 50) {
      errors.displayName = 'Display name must be less than 50 characters';
    } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(data.displayName)) {
      errors.displayName = 'Display name contains invalid characters';
    }
  }

  // Validate phone number
  if (data.phoneNumber !== undefined) {
    if (data.phoneNumber && !/^\+?[\d\s\-()]{10,}$/.test(data.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
  }

  // Validate preferences
  if (data.preferences) {
    if (data.preferences.dailyGoal !== undefined) {
      if (data.preferences.dailyGoal < 5 || data.preferences.dailyGoal > 480) {
        errors.preferences = {
          ...errors.preferences,
          dailyGoal: 'Daily goal must be between 5 and 480 minutes',
        };
      }
    }

    if (data.preferences.theme !== undefined) {
      if (!['light', 'dark', 'auto'].includes(data.preferences.theme)) {
        errors.preferences = {
          ...errors.preferences,
          theme: 'Theme must be light, dark, or auto',
        };
      }
    }

    if (data.preferences.difficulty !== undefined) {
      if (
        !['beginner', 'intermediate', 'advanced'].includes(
          data.preferences.difficulty
        )
      ) {
        errors.preferences = {
          ...errors.preferences,
          difficulty: 'Difficulty must be beginner, intermediate, or advanced',
        };
      }
    }

    if (data.preferences.focusAreas !== undefined) {
      if (!Array.isArray(data.preferences.focusAreas)) {
        errors.preferences = {
          ...errors.preferences,
          focusAreas: 'Focus areas must be an array',
        };
      } else if (data.preferences.focusAreas.length > 10) {
        errors.preferences = {
          ...errors.preferences,
          focusAreas: 'Maximum 10 focus areas allowed',
        };
      }
    }
  }

  // Validate stats
  if (data.stats) {
    const statFields = [
      'totalProblemsAttempted',
      'totalProblemsCompleted',
      'totalTimeSpent',
      'currentStreak',
      'longestStreak',
      'averageScore',
    ];

    statFields.forEach(field => {
      const value = data.stats![field as keyof typeof data.stats];
      if (value !== undefined) {
        if (typeof value !== 'number' || value < 0) {
          errors.stats = {
            ...errors.stats,
            [field]: `${field} must be a non-negative number`,
          };
        }
      }
    });

    // Validate average score specifically
    if (data.stats.averageScore !== undefined) {
      if (data.stats.averageScore < 0 || data.stats.averageScore > 100) {
        errors.stats = {
          ...errors.stats,
          averageScore: 'Average score must be between 0 and 100',
        };
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function sanitizeUpdateData(data: UpdateRequest): UpdateRequest {
  const sanitized: UpdateRequest = {};

  // Sanitize display name
  if (data.displayName !== undefined) {
    sanitized.displayName = data.displayName.trim();
  }

  // Sanitize phone number
  if (data.phoneNumber !== undefined) {
    sanitized.phoneNumber = data.phoneNumber.trim() || undefined;
  }

  // Sanitize preferences
  if (data.preferences) {
    sanitized.preferences = {};

    if (data.preferences.theme !== undefined) {
      sanitized.preferences.theme = data.preferences.theme;
    }

    if (data.preferences.difficulty !== undefined) {
      sanitized.preferences.difficulty = data.preferences.difficulty;
    }

    if (data.preferences.dailyGoal !== undefined) {
      sanitized.preferences.dailyGoal = Math.max(
        5,
        Math.min(480, data.preferences.dailyGoal)
      );
    }

    if (data.preferences.focusAreas !== undefined) {
      sanitized.preferences.focusAreas = data.preferences.focusAreas
        .slice(0, 10)
        .map(area => area.trim())
        .filter(area => area.length > 0);
    }

    if (data.preferences.timezone !== undefined) {
      sanitized.preferences.timezone = data.preferences.timezone;
    }
  }

  // Sanitize stats
  if (data.stats) {
    sanitized.stats = {};

    Object.entries(data.stats).forEach(([key, value]) => {
      if (typeof value === 'number' && value >= 0) {
        if (key === 'averageScore') {
          (sanitized.stats as any)[key] = Math.max(0, Math.min(100, value));
        } else {
          (sanitized.stats as any)[key] = value;
        }
      }
    });
  }

  return sanitized;
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.userId!;
    const updateData: UpdateRequest = req.body;

    // Validate request body
    if (!updateData || typeof updateData !== 'object') {
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'Request body must be a valid object',
      });
    }

    // Validate the update data
    const validation = validateUpdateData(updateData);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please fix the validation errors',
        errors: validation.errors,
      });
    }

    // Sanitize the data
    const sanitizedData = sanitizeUpdateData(updateData);

    // Separate profile updates from stats updates
    const profileUpdates: any = {};
    const statsUpdates: any = {};

    // Extract profile fields
    if (sanitizedData.displayName !== undefined) {
      profileUpdates.displayName = sanitizedData.displayName;
    }
    if (sanitizedData.phoneNumber !== undefined) {
      profileUpdates.phoneNumber = sanitizedData.phoneNumber;
    }
    if (sanitizedData.preferences) {
      profileUpdates.preferences = sanitizedData.preferences;
    }

    // Extract stats fields
    if (sanitizedData.stats) {
      statsUpdates.stats = sanitizedData.stats;
    }

    // Update profile and stats in parallel if both exist
    const updatePromises = [];

    if (Object.keys(profileUpdates).length > 0) {
      updatePromises.push(updateUserProfile(userId, profileUpdates));
    }

    if (Object.keys(statsUpdates).length > 0) {
      updatePromises.push(updateUserStats(userId, statsUpdates.stats));
    }

    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      updatedFields: Object.keys(sanitizedData),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      error: 'Failed to update user profile',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
