import {
  InterviewInsightsData,
  InterviewInsightsDocument,
  InterviewInsightsResponse,
} from '../../types/problem';
import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS } from '../../enums/collections';
import { GEMINI_ENDPOINT, getGeminiApiKey } from '../ai/gemini-config';

/**
 * Generate interview insights using Gemini API
 */
export async function generateInterviewInsights(
  companyName: string,
  designation: string
): Promise<InterviewInsightsData> {
  const prompt = `You are an expert frontend interview coach.

Given the company name = ${companyName} and role = ${designation}, interview rounds based on real-world candidate experiences and publicly available data (e.g., Glassdoor, Blind, Leetcode discussions):
generate comprehensive interview insights for frontend engineers. also add Tech and Non-Tech rounds details.

Return ONLY a valid JSON object with this kind of structure: 
{
  "totalRounds": 4,
  "estimatedDuration": "3-4 hours",
  "rounds": [
    {
      "name": "Round Name (e.g., DSA Round, Machine Coding, System Design, other tech rounds, non-tech rounds)",
      "description": "Detailed description of what this round tests and focuses on Purpose, Topics, Format, etc.",
      "sampleProblems": ["Real problem examples will be generated based on company and role"],
      "duration": "45-60 minutes",
      "focusAreas": ["React", "TypeScript", "State Management"],
      "evaluationCriteria": ["Code quality", "Problem solving", "Communication"],
      "difficulty": "medium",
      "tips": ["Practice system design", "Know your fundamentals"]
    }
  ],
  "overallTips": ["Tip 1", "Tip 2", "Tip 3"],
  "companySpecificNotes": "Specific notes about ${companyName}'s interview process for ${designation} roles"
}

Focus on frontend-specific rounds like:
- Online Assessment
- Phone Screening
- DSA (JavaScript/TypeScript implementation)
- Machine Coding (React/Vue/Angular components)
- System Design (Frontend architecture, component design)
- JavaScript/TypeScript Theory
- CSS/HTML challenges
- Frontend Performance
- Browser APIs and Web APIs
- Behavioral/Cultural Fit
- Hiring Manager Round

Make the insights specific to ${companyName} and appropriate for ${designation} level.
Include all the rounds with detailed descriptions, duration, focus areas, evaluation criteria, and relevant sample problems.
Provide realistic total rounds and duration based on ${companyName}'s typical interview process for ${designation} positions.`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const apiKey = getGeminiApiKey();
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini response');
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);

    // Validate the response structure
    if (!parsedResponse?.rounds || !Array.isArray(parsedResponse?.rounds)) {
      throw new Error('Invalid response structure from Gemini API');
    }

    return parsedResponse as InterviewInsightsData;
  } catch (error) {
    console.error('Error generating interview insights:', error);
    throw new Error('Failed to generate interview insights');
  }
}

export async function getInterviewInsights(
  companyName: string,
  designation: string,
  companyId: string
): Promise<InterviewInsightsResponse> {
  if (!companyName || !designation || !companyId) {
    throw new Error('Company name and role level are required');
  }

  try {
    // First, check if we have cached data
    const cachedInsights = await getCachedInsights(companyName, designation);

    if (cachedInsights) {
      console.log(
        'Returning cached interview insights for:',
        companyName,
        designation
      );
      return {
        companyName: cachedInsights.companyName,
        roleLevel: cachedInsights.roleLevel,
        data: cachedInsights.data,
        updatedAt: cachedInsights.updatedAt,
      };
    }

    // If not cached, generate new insights
    console.log(
      'Generating new interview insights for:',
      companyName,
      designation
    );
    const generatedData = await generateInterviewInsights(
      companyName,
      designation
    );

    const insights: InterviewInsightsResponse = {
      companyName,
      roleLevel: designation,
      data: generatedData,
      updatedAt: Timestamp.now(),
    };

    // Try to save to cache for future requests (but don't fail if it doesn't work)
    try {
      await saveInsightsToCache(insights);
    } catch (cacheError) {
      console.warn('Failed to cache insights, but continuing:', cacheError);
    }

    return insights;
  } catch (error) {
    console.error('Error in getInterviewInsights:', error);
    throw error;
  }
}

/**
 * Check if interview insights exist in Firestore cache
 */
async function getCachedInsights(
  companyName: string,
  roleLevel: string
): Promise<InterviewInsightsDocument | null> {
  try {
    // Check if Firebase is properly initialized
    if (!db) {
      console.warn('Firebase not initialized, skipping cache check');
      return null;
    }

    const insightsRef = collection(db, COLLECTIONS.INTERVIEW_INSIGHTS);
    const q = query(
      insightsRef,
      where('companyName', '==', companyName),
      where('roleLevel', '==', roleLevel)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as InterviewInsightsDocument;
    }

    return null;
  } catch (error) {
    console.warn(
      'Error fetching cached insights (continuing without cache):',
      error
    );
    return null;
  }
}

/**
 * Save interview insights to Firestore cache
 */
export async function saveInsightsToCache(
  insights: InterviewInsightsResponse
): Promise<void> {
  try {
    // Check if Firebase is properly initialized
    if (!db) {
      console.warn('Firebase not initialized, skipping cache save');
      return;
    }

    const insightsRef = collection(db, COLLECTIONS.INTERVIEW_INSIGHTS);
    await addDoc(insightsRef, {
      ...insights,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.warn(
      'Error saving insights to cache (continuing without cache):',
      error
    );
    // Don't throw error, just log it and continue
  }
}
