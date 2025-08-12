import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './useAuth';
import { RoadmapDocument } from '@/types/roadmap';

interface UseRoadmapViewReturn {
  roadmap: RoadmapDocument | null;
  selectedDay: number;
  loading: boolean;
  updatingProgress: boolean;
  setSelectedDay: (day: number) => void;
  updateProgress: (problemId: string, completed: boolean) => Promise<void>;
  isProblemCompleted: (problemId: string) => boolean;
  getProgressPercentage: () => number;
  currentDay: any;
}

export const useRoadmapView = (): UseRoadmapViewReturn => {
  const { user } = useAuth();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<RoadmapDocument | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const fetchRoadmapFromDatabase = async (roadmapId: string) => {
    try {
      const response = await fetch(`/api/roadmap/get-by-id?id=${roadmapId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.roadmap) {
          setRoadmap(data.roadmap);
        } else {
          router.push('/roadmap');
        }
      } else {
        router.push('/roadmap');
      }
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      router.push('/roadmap');
    }
  };

  const updateProgress = async (problemId: string, completed: boolean) => {
    if (!roadmap || !user) return;

    setUpdatingProgress(true);
    try {
      const currentProgress = roadmap.progress || {
        completedDays: [],
        completedProblems: [],
        totalProblems: roadmap.overview.totalProblems,
        completedProblemsCount: 0,
      };

      let newCompletedProblems = [...currentProgress.completedProblems];
      let newCompletedProblemsCount = currentProgress.completedProblemsCount;

      if (completed) {
        if (!newCompletedProblems.includes(problemId)) {
          newCompletedProblems.push(problemId);
          newCompletedProblemsCount++;
        }
      } else {
        newCompletedProblems = newCompletedProblems.filter(
          id => id !== problemId
        );
        newCompletedProblemsCount = Math.max(0, newCompletedProblemsCount - 1);
      }

      const response = await fetch('/api/roadmap/update-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roadmapId: roadmap.id,
          completedProblems: newCompletedProblems,
          completedProblemsCount: newCompletedProblemsCount,
        }),
      });

      if (response.ok) {
        setRoadmap(prev =>
          prev
            ? {
                ...prev,
                progress: {
                  ...prev.progress!,
                  completedProblems: newCompletedProblems,
                  completedProblemsCount: newCompletedProblemsCount,
                },
              }
            : null
        );
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const isProblemCompleted = (problemId: string) => {
    return roadmap?.progress?.completedProblems?.includes(problemId) || false;
  };

  const getProgressPercentage = () => {
    if (!roadmap?.progress) return 0;
    return Math.round(
      (roadmap.progress.completedProblemsCount /
        roadmap.overview.totalProblems) *
        100
    );
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const { id } = router.query;

    if (id && typeof id === 'string') {
      fetchRoadmapFromDatabase(id);
    } else {
      router.push('/roadmap');
    }
    setLoading(false);
  }, [user, router]);

  const currentDay = roadmap?.dailyPlan.find(day => day.day === selectedDay);

  return {
    roadmap,
    selectedDay,
    loading,
    updatingProgress,
    setSelectedDay,
    updateProgress,
    isProblemCompleted,
    getProgressPercentage,
    currentDay,
  };
};
