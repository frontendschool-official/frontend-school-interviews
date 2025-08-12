import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from '../../enums/collections';
import { RoadmapDocument } from '../../types/roadmap';
import { DocumentUtils, FirebaseErrorHandler, ValidationUtils } from './utils';

// ============================
// ROADMAP MANAGEMENT
// ============================

/**
 * Save a new roadmap to the database
 */
export const saveRoadmap = async (
  roadmapData: Omit<RoadmapDocument, 'id' | 'createdAt' | 'updatedAt'>
) => {
  console.log('💾 Starting saveRoadmap with:', {
    userId: roadmapData.userId,
    title: roadmapData.title,
    duration: roadmapData.duration,
    companies: roadmapData.companies,
  });

  ValidationUtils.requireField(roadmapData.userId, 'User ID');
  ValidationUtils.requireField(roadmapData.title, 'Title');
  ValidationUtils.requireField(roadmapData.duration, 'Duration');

  console.log('✅ Roadmap data validation passed');

  try {
    const ref = collection(db, COLLECTIONS.ROADMAPS);

    const docData: RoadmapDocument = {
      ...roadmapData,
      status: 'active',
      progress: {
        completedDays: [],
        completedProblems: [],
        totalProblems: roadmapData.overview.totalProblems,
        completedProblemsCount: 0,
      },
      createdAt: DocumentUtils.createTimestamp(),
      updatedAt: DocumentUtils.createTimestamp(),
    };

    console.log('📝 Attempting to add roadmap to Firestore...');
    const docRef = await addDoc(ref, docData);
    console.log('✅ Roadmap saved successfully with ID:', docRef.id);

    return { ...docData, id: docRef.id };
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'save roadmap');
  }
};

/**
 * Get all roadmaps for a specific user
 */
export const getRoadmapsForUser = async (userId: string) => {
  console.log('📋 Getting roadmaps for user:', userId);

  ValidationUtils.requireField(userId, 'User ID');

  try {
    const ref = collection(db, COLLECTIONS.ROADMAPS);

    // First try with ordering, if it fails due to missing index, fall back to simple query
    try {
      const q = query(
        ref,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const roadmaps: RoadmapDocument[] = [];

      querySnapshot.forEach(doc => {
        roadmaps.push({ ...doc.data(), id: doc.id } as RoadmapDocument);
      });

      console.log(
        `✅ Found ${roadmaps.length} roadmaps for user (with ordering)`
      );
      return roadmaps;
    } catch (indexError: any) {
      // If index error, fall back to simple query without ordering
      if (indexError.message && indexError.message.includes('index')) {
        console.log('⚠️ Index not found, falling back to simple query');

        const q = query(ref, where('userId', '==', userId));

        const querySnapshot = await getDocs(q);
        const roadmaps: RoadmapDocument[] = [];

        querySnapshot.forEach(doc => {
          roadmaps.push({ ...doc.data(), id: doc.id } as RoadmapDocument);
        });

        // Sort in memory
        roadmaps.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || a.createdAt || new Date(0);
          const bTime = b.createdAt?.toDate?.() || b.createdAt || new Date(0);
          return bTime.getTime() - aTime.getTime();
        });

        console.log(
          `✅ Found ${roadmaps.length} roadmaps for user (sorted in memory)`
        );
        return roadmaps;
      } else {
        throw indexError;
      }
    }
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'get roadmaps for user');
  }
};

/**
 * Get a specific roadmap by ID
 */
export const getRoadmapById = async (roadmapId: string) => {
  console.log('📋 Getting roadmap by ID:', roadmapId);

  ValidationUtils.requireField(roadmapId, 'Roadmap ID');

  try {
    const docRef = doc(db, COLLECTIONS.ROADMAPS, roadmapId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Roadmap not found');
    }

    const roadmap = { ...docSnap.data(), id: docSnap.id } as RoadmapDocument;
    console.log('✅ Roadmap retrieved successfully');
    return roadmap;
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'get roadmap by ID');
  }
};

/**
 * Update roadmap progress
 */
export const updateRoadmapProgress = async (
  roadmapId: string,
  progress: Partial<RoadmapDocument['progress']>
) => {
  console.log('📝 Updating roadmap progress:', { roadmapId, progress });

  ValidationUtils.requireField(roadmapId, 'Roadmap ID');

  try {
    const docRef = doc(db, COLLECTIONS.ROADMAPS, roadmapId);

    await updateDoc(docRef, {
      progress: progress,
      updatedAt: DocumentUtils.createTimestamp(),
    });

    console.log('✅ Roadmap progress updated successfully');
    return true;
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'update roadmap progress');
  }
};

/**
 * Update roadmap status
 */
export const updateRoadmapStatus = async (
  roadmapId: string,
  status: RoadmapDocument['status']
) => {
  console.log('📝 Updating roadmap status:', { roadmapId, status });

  ValidationUtils.requireField(roadmapId, 'Roadmap ID');
  ValidationUtils.requireField(status, 'Status');

  try {
    const docRef = doc(db, COLLECTIONS.ROADMAPS, roadmapId);

    await updateDoc(docRef, {
      status,
      updatedAt: DocumentUtils.createTimestamp(),
    });

    console.log('✅ Roadmap status updated successfully');
    return true;
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'update roadmap status');
  }
};

/**
 * Delete a roadmap
 */
export const deleteRoadmap = async (roadmapId: string) => {
  console.log('🗑️ Deleting roadmap:', roadmapId);

  ValidationUtils.requireField(roadmapId, 'Roadmap ID');

  try {
    const docRef = doc(db, COLLECTIONS.ROADMAPS, roadmapId);
    await deleteDoc(docRef);

    console.log('✅ Roadmap deleted successfully');
    return true;
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'delete roadmap');
  }
};

/**
 * Get roadmap statistics for a user
 */
export const getRoadmapStats = async (userId: string) => {
  console.log('📊 Getting roadmap stats for user:', userId);

  ValidationUtils.requireField(userId, 'User ID');

  try {
    const roadmaps = await getRoadmapsForUser(userId);

    if (!roadmaps) return null;

    const stats = {
      totalRoadmaps: roadmaps.length,
      activeRoadmaps: roadmaps.filter(r => r.status === 'active').length,
      completedRoadmaps: roadmaps.filter(r => r.status === 'completed').length,
      totalProblems: roadmaps.reduce(
        (sum, r) => sum + (r.overview.totalProblems || 0),
        0
      ),
      completedProblems: roadmaps.reduce(
        (sum, r) => sum + (r.progress?.completedProblemsCount || 0),
        0
      ),
      averageProgress: 0,
    };

    // Calculate average progress
    const roadmapsWithProgress = roadmaps.filter(
      r => r.progress && r.overview.totalProblems > 0
    );
    if (roadmapsWithProgress.length > 0) {
      const totalProgress = roadmapsWithProgress.reduce((sum, r) => {
        return (
          sum +
          (r.progress?.completedProblemsCount || 0) / r.overview.totalProblems
        );
      }, 0);
      stats.averageProgress = Math.round(
        (totalProgress / roadmapsWithProgress.length) * 100
      );
    }

    console.log('✅ Roadmap stats calculated successfully');
    return stats;
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'get roadmap stats');
  }
};
