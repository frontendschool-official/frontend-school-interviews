import type { NextApiResponse } from 'next';
import type { NextApiRequest } from 'next';
import '@/lib/firebase-admin';
import { RoadmapRepo, verifyAuth } from '@workspace/api';
import { z } from 'zod';

interface RoadmapRequest {
  companies: string[];
  designation: string;
  duration: number; // days
}

interface RoadmapDay {
  day: number;
  title: string;
  description: string;
  problems: Array<{
    title: string;
    description: string;
    type: 'dsa' | 'machine_coding' | 'system_design' | 'theory_and_debugging';
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: string;
    focusAreas: string[];
    learningObjectives: string[];
  }>;
  totalTime: string;
  focusAreas: string[];
}

interface RoadmapResponse {
  title: string;
  description: string;
  duration: number;
  companies: string[];
  designation: string;
  overview: {
    totalProblems: number;
    totalTime: string;
    focusAreas: string[];
    learningObjectives: string[];
  };
  dailyPlan: RoadmapDay[];
  tips: string[];
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid } = await verifyAuth(req);
    const requestData = z
      .object({
        companies: z.array(z.string()).min(1),
        designation: z.string().min(1),
        duration: z.number().refine(d => [7, 15, 30, 90].includes(d), {
          message: 'Duration must be 7, 15, 30, or 90 days',
        }),
      })
      .parse(req.body);

    const { companies, designation, duration } = requestData;

    console.log('🚀 Generating roadmap for:', {
      companies,
      designation,
      duration,
    });

    // TODO: Implement roadmap generation with ProblemGenerator
    // For now, use the fallback roadmap
    console.log(
      '⚠️ Using fallback roadmap (AI generation not implemented yet)'
    );

    const fallbackRoadmap: RoadmapResponse = {
      title: `${duration}-Day ${designation} Interview Prep`,
      description: `Comprehensive preparation plan for ${designation} interviews at ${companies.join(', ')}`,
      duration,
      companies,
      designation,
      overview: {
        totalProblems: duration * 3,
        totalTime: `${duration * 2}-${duration * 3} hours`,
        focusAreas: ['React', 'JavaScript', 'TypeScript', 'System Design'],
        learningObjectives: ['Master core concepts', 'Build practical skills'],
      },
      dailyPlan: Array.from({ length: duration }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}: Core Practice`,
        description: 'Focus on fundamental concepts and problem-solving',
        problems: [
          {
            title: `Problem ${i * 3 + 1}`,
            description: 'Basic problem to build foundation',
            type:
              i % 4 === 0
                ? 'dsa'
                : i % 4 === 1
                  ? 'machine_coding'
                  : i % 4 === 2
                    ? 'system_design'
                    : 'theory_and_debugging',
            difficulty:
              i < duration / 3
                ? 'easy'
                : i < (2 * duration) / 3
                  ? 'medium'
                  : 'hard',
            estimatedTime: '30-45 minutes',
            focusAreas: ['React', 'JavaScript'],
            learningObjectives: ['Understand basics', 'Practice coding'],
          },
          {
            title: `Problem ${i * 3 + 2}`,
            description: 'Intermediate problem to strengthen skills',
            type:
              i % 4 === 1
                ? 'dsa'
                : i % 4 === 2
                  ? 'machine_coding'
                  : i % 4 === 3
                    ? 'system_design'
                    : 'theory_and_debugging',
            difficulty:
              i < duration / 3
                ? 'easy'
                : i < (2 * duration) / 3
                  ? 'medium'
                  : 'hard',
            estimatedTime: '45-60 minutes',
            focusAreas: ['TypeScript', 'Performance'],
            learningObjectives: [
              'Build practical skills',
              'Understand concepts',
            ],
          },
          {
            title: `Problem ${i * 3 + 3}`,
            description: 'Advanced problem to challenge your understanding',
            type:
              i % 4 === 2
                ? 'dsa'
                : i % 4 === 3
                  ? 'machine_coding'
                  : i % 4 === 0
                    ? 'system_design'
                    : 'theory_and_debugging',
            difficulty:
              i < duration / 3
                ? 'easy'
                : i < (2 * duration) / 3
                  ? 'medium'
                  : 'hard',
            estimatedTime: '45-60 minutes',
            focusAreas: ['System Design', 'Performance'],
            learningObjectives: ['Think systematically', 'Optimize solutions'],
          },
        ],
        totalTime: '2-3 hours',
        focusAreas: ['React', 'JavaScript', 'TypeScript'],
      })),
      tips: [
        'Practice coding problems daily',
        'Focus on understanding concepts, not just memorizing',
        'Build real projects to apply your knowledge',
        'Review and learn from your mistakes',
        'Stay consistent with your learning schedule',
      ],
    };

    console.log('✅ Fallback roadmap generated successfully');

    // Save fallback roadmap to database
    console.log('💾 Saving fallback roadmap to database...');
    const repo = new RoadmapRepo();
    const savedRoadmap = await repo.create({
      ownerId: uid,
      title: fallbackRoadmap.title,
      description: fallbackRoadmap.description,
      duration: fallbackRoadmap.duration,
      companies: fallbackRoadmap.companies,
      designation: fallbackRoadmap.designation,
      overview: fallbackRoadmap.overview,
      dailyPlan: fallbackRoadmap.dailyPlan,
      tips: fallbackRoadmap.tips,
    });

    console.log(
      '✅ Fallback roadmap saved to database with ID:',
      savedRoadmap.id
    );

    return res.status(200).json({
      success: true,
      roadmap: savedRoadmap,
      message: 'Fallback roadmap generated and saved successfully',
    });
  } catch (error) {
    console.error('❌ Error generating roadmap:', error);

    let errorMessage = 'Failed to generate roadmap';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return res.status(500).json({
      error: errorMessage,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default handler;
