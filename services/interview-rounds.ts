import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  InterviewInsightsRequest,
  InterviewInsightsResponse,
  InterviewInsightsDocument,
  InterviewInsightsData,
} from "../types/problem";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Generate interview insights using Gemini API
 */
async function generateInterviewInsights(
  companyName: string,
  roleLevel: string
): Promise<InterviewInsightsData> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  const prompt = `You are an expert frontend interview coach.

Given the company name = ${companyName} and role = ${roleLevel}, interview rounds based on real-world candidate experiences and publicly available data (e.g., Glassdoor, Blind, Leetcode discussions):
generate comprehensive interview insights for frontend engineers. also add Tech and Non-Tech rounds details.

Return ONLY a valid JSON object with this kind of structure: 
{
  "totalRounds": 4,
  "estimatedDuration": "3-4 hours",
  "rounds": [
    {
      "name": "Round Name (e.g., DSA Round, Machine Coding, System Design, other tech rounds, non-tech rounds)",
      "description": "Detailed description of what this round tests and focuses on Purpose, Topics, Format, etc.",
      "sampleProblems": ["Example problem 1", "Example problem 2", "Example problem 3"],
      "duration": "45-60 minutes",
      "focusAreas": ["React", "TypeScript", "State Management"],
      "evaluationCriteria": ["Code quality", "Problem solving", "Communication"],
      "difficulty": "medium",
      "tips": ["Practice system design", "Know your fundamentals"]
    }
  ],
  "overallTips": ["Tip 1", "Tip 2", "Tip 3"],
  "companySpecificNotes": "Specific notes about ${companyName}'s interview process for ${roleLevel} roles"
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

Make the insights specific to ${companyName} and appropriate for ${roleLevel} level.
Include all the rounds with detailed descriptions, duration, focus areas, evaluation criteria, and relevant sample problems.
Provide realistic total rounds and duration based on ${companyName}'s typical interview process for ${roleLevel} positions.`;

  if (!apiKey) {
    console.warn('No Gemini API key configured. Using fallback data.');
    console.log('Expected environment variable: NEXT_PUBLIC_GEMINI_API_KEY');
    // Return sample data if no API key is configured
    return {
      totalRounds: 5,
      estimatedDuration: "4-5 hours",
      rounds: [
        {
          name: "DSA Round",
          description:
            "Focus on array, hashmap, recursion problems implemented in JavaScript/TypeScript. Tests algorithmic thinking and data structure knowledge.",
          sampleProblems: [
            "Two Sum",
            "Valid Parentheses",
            "LRU Cache",
            "Binary Tree Traversal",
          ],
          duration: "45-60 minutes",
          focusAreas: [
            "JavaScript",
            "TypeScript",
            "Algorithms",
            "Data Structures",
          ],
          evaluationCriteria: [
            "Problem solving approach",
            "Code efficiency",
            "Edge case handling",
            "Time complexity",
          ],
          difficulty: "medium",
          tips: [
            "Practice common patterns",
            "Know time/space complexity",
            "Think out loud",
            "Consider edge cases",
          ],
        },
        {
          name: "Machine Coding",
          description:
            "Build functional UI components using React/TypeScript. Tests component architecture, state management, and coding practices.",
          sampleProblems: [
            "Implement a dropdown component",
            "Create a modal with backdrop",
            "Build a todo list",
            "Design a pagination component",
          ],
          duration: "60-90 minutes",
          focusAreas: [
            "React",
            "TypeScript",
            "State Management",
            "Component Design",
          ],
          evaluationCriteria: [
            "Code organization",
            "Component reusability",
            "State management",
            "User experience",
          ],
          difficulty: "medium",
          tips: [
            "Plan component structure",
            "Use TypeScript properly",
            "Consider accessibility",
            "Test your components",
          ],
        },
        {
          name: "Frontend System Design",
          description:
            "Design scalable frontend architectures and component systems. Tests system thinking and frontend architecture knowledge.",
          sampleProblems: [
            "Design a scalable news feed",
            "Design a component library",
            "Design a real-time chat interface",
            "Design a dashboard system",
          ],
          duration: "45-60 minutes",
          focusAreas: [
            "Architecture",
            "Scalability",
            "Performance",
            "Component Design",
          ],
          evaluationCriteria: [
            "System thinking",
            "Scalability considerations",
            "Performance optimization",
            "Technical communication",
          ],
          difficulty: "hard",
          tips: [
            "Start with requirements",
            "Consider scale",
            "Discuss trade-offs",
            "Draw diagrams",
          ],
        },
        {
          name: "JavaScript/TypeScript Theory",
          description:
            "Deep dive into JavaScript concepts, closures, promises, async/await, and TypeScript features.",
          sampleProblems: [
            "Explain event loop and callbacks",
            "Implement debounce function",
            "Explain prototypal inheritance",
            "TypeScript generics and interfaces",
          ],
          duration: "30-45 minutes",
          focusAreas: [
            "JavaScript",
            "TypeScript",
            "Async Programming",
            "Language Features",
          ],
          evaluationCriteria: [
            "Language knowledge",
            "Concept understanding",
            "Practical application",
            "Communication",
          ],
          difficulty: "medium",
          tips: [
            "Know fundamentals well",
            "Practice explaining concepts",
            "Understand async patterns",
            "Stay updated with ES6+",
          ],
        },
        {
          name: "Behavioral/Cultural Fit",
          description:
            "Assess cultural fit, communication skills, and past experiences. Tests soft skills and alignment with company values.",
          sampleProblems: [
            "Tell me about a challenging project",
            "How do you handle conflicts?",
            "Why do you want to join us?",
            "Describe a time you failed",
          ],
          duration: "30-45 minutes",
          focusAreas: [
            "Communication",
            "Leadership",
            "Problem Solving",
            "Cultural Fit",
          ],
          evaluationCriteria: [
            "Communication clarity",
            "Leadership potential",
            "Problem-solving approach",
            "Cultural alignment",
          ],
          difficulty: "easy",
          tips: [
            "Use STAR method",
            "Be authentic",
            "Research the company",
            "Prepare specific examples",
          ],
        },
      ],
      overallTips: [
        "Research the company's tech stack and culture thoroughly",
        "Practice coding problems in JavaScript/TypeScript",
        "Prepare system design questions with frontend focus",
        "Have specific examples ready for behavioral questions",
        "Understand the company's products and challenges",
      ],
      companySpecificNotes: `${companyName} typically conducts ${roleLevel} interviews with a strong focus on practical coding skills and system design. They value clean code, scalability thinking, and cultural fit.`,
    };
  }

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in Gemini response");
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);

    // Validate the response structure
    if (!parsedResponse.rounds || !Array.isArray(parsedResponse.rounds)) {
      throw new Error("Invalid response structure from Gemini API");
    }

    return parsedResponse as InterviewInsightsData;
  } catch (error) {
    console.error("Error generating interview insights:", error);
    throw new Error("Failed to generate interview insights");
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

    const insightsRef = collection(db, "interviewInsights");
    const q = query(
      insightsRef,
      where("companyName", "==", companyName),
      where("roleLevel", "==", roleLevel)
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
    console.warn("Error fetching cached insights (continuing without cache):", error);
    return null;
  }
}

/**
 * Save interview insights to Firestore cache
 */
async function saveInsightsToCache(
  insights: InterviewInsightsResponse
): Promise<void> {
  try {
    // Check if Firebase is properly initialized
    if (!db) {
      console.warn('Firebase not initialized, skipping cache save');
      return;
    }

    const insightsRef = collection(db, "interviewInsights");
    await addDoc(insightsRef, {
      ...insights,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.warn("Error saving insights to cache (continuing without cache):", error);
    // Don't throw error, just log it and continue
  }
}

/**
 * Main function to get interview insights (with caching)
 */
export async function getInterviewInsights(
  request: InterviewInsightsRequest
): Promise<InterviewInsightsResponse> {
  const { companyName, roleLevel } = request;

  if (!companyName || !roleLevel) {
    throw new Error("Company name and role level are required");
  }

  try {
    // First, check if we have cached data
    const cachedInsights = await getCachedInsights(companyName, roleLevel);

    if (cachedInsights) {
      console.log(
        "Returning cached interview insights for:",
        companyName,
        roleLevel
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
      "Generating new interview insights for:",
      companyName,
      roleLevel
    );
    const generatedData = await generateInterviewInsights(
      companyName,
      roleLevel
    );

    const insights: InterviewInsightsResponse = {
      companyName,
      roleLevel,
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
    console.error("Error in getInterviewInsights:", error);
    throw error;
  }
}

/**
 * Update cached insights (useful for refreshing data)
 */
export async function updateInterviewInsights(
  request: InterviewInsightsRequest
): Promise<InterviewInsightsResponse> {
  const { companyName, roleLevel } = request;

  try {
    // Generate fresh insights
    const generatedData = await generateInterviewInsights(
      companyName,
      roleLevel
    );

    const insights: InterviewInsightsResponse = {
      companyName,
      roleLevel,
      data: generatedData,
      updatedAt: Timestamp.now(),
    };

    // Check if document exists to update it
    const cachedInsights = await getCachedInsights(companyName, roleLevel);

    if (cachedInsights?.id) {
      // Update existing document
      const docRef = doc(db, "interviewInsights", cachedInsights.id);
      await setDoc(docRef, {
        ...insights,
        updatedAt: Timestamp.now(),
      });
    } else {
      // Create new document
      await saveInsightsToCache(insights);
    }

    return insights;
  } catch (error) {
    console.error("Error updating interview insights:", error);
    throw error;
  }
}
