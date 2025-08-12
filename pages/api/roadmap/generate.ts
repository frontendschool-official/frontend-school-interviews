import { NextApiResponse } from 'next';
import { GEMINI_ENDPOINT, getGeminiApiKey } from '@/services/ai/gemini-config';
import { saveRoadmap } from '@/services/firebase/roadmaps';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

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

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract variables at function level so they're accessible in catch block
  let companies: string[] = [];
  let designation: string = '';
  let duration: number = 7;

  try {
    const requestData: RoadmapRequest = req.body;
    companies = requestData.companies;
    designation = requestData.designation;
    duration = requestData.duration;

    if (!companies || !designation || !duration) {
      return res.status(400).json({
        error:
          'Missing required fields: companies, designation, and duration are required',
      });
    }

    if (!Array.isArray(companies) || companies.length === 0) {
      return res
        .status(400)
        .json({ error: 'At least one company must be selected' });
    }

    if (![7, 15, 30, 90].includes(duration)) {
      return res
        .status(400)
        .json({ error: 'Duration must be 7, 15, 30, or 90 days' });
    }

    console.log('🚀 Generating roadmap for:', {
      companies,
      designation,
      duration,
    });

    const prompt = `You are an expert frontend interview coach and curriculum designer.

Create a comprehensive ${duration}-day learning roadmap for a ${designation} preparing for interviews at ${companies.join(', ')}.

The roadmap should be specifically tailored for frontend engineering interviews and include:
- Daily structured learning plans
- Mix of DSA, Machine Coding, System Design, and Theory problems
- Progressive difficulty (start easy, build up to hard)
- Focus on frontend-specific technologies and concepts
- Realistic time estimates for each day
- Clear learning objectives

IMPORTANT: You must respond with ONLY valid JSON. Do not include any explanations, markdown formatting, or additional text outside the JSON object.

Return a JSON object with this exact structure:
{
  "title": "Roadmap title",
  "description": "Brief description of the roadmap",
  "duration": ${duration},
  "companies": ${JSON.stringify(companies)},
  "designation": "${designation}",
  "overview": {
    "totalProblems": number,
    "totalTime": "X hours",
    "focusAreas": ["React", "TypeScript", "JavaScript", "CSS", "System Design"],
    "learningObjectives": ["Objective 1", "Objective 2", "Objective 3"]
  },
  "dailyPlan": [
    {
      "day": 1,
      "title": "Day 1: Getting Started",
      "description": "Introduction to the roadmap and basic concepts",
      "problems": [
        {
          "title": "Problem title",
          "description": "Problem description",
          "type": "dsa",
          "difficulty": "easy",
          "estimatedTime": "30-45 minutes",
          "focusAreas": ["React", "JavaScript"],
          "learningObjectives": ["Understand basic concepts", "Practice fundamentals"]
        }
      ],
      "totalTime": "2-3 hours",
      "focusAreas": ["React", "JavaScript"]
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}

Guidelines:
- Each day should have 2-4 problems depending on difficulty
- Mix problem types throughout the week (dsa, machine_coding, system_design, theory_and_debugging)
- Start with easier problems and gradually increase difficulty
- Include frontend-specific problems (React components, CSS challenges, etc.)
- Ensure realistic time estimates
- Focus on practical, interview-relevant skills
- Include both technical and soft skills preparation
- Make it specific to ${companies.join(', ')} interview style for ${designation} roles
- Generate exactly ${duration} days of content
- Use only the exact type values: "dsa", "machine_coding", "system_design", "theory_and_debugging"
- Use only the exact difficulty values: "easy", "medium", "hard"

Respond with ONLY the JSON object, no additional text.`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    };

    const apiKey = getGeminiApiKey();
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📦 Raw Gemini API response:', JSON.stringify(data, null, 2));

    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      console.error('❌ Empty text response from Gemini API');
      throw new Error('Empty response from AI service');
    }

    console.log('📝 Raw text response:', text);

    // Try to extract JSON from the response
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Try alternative JSON extraction patterns
      jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        jsonMatch = [jsonMatch[1]];
      } else {
        // Try to find JSON without code blocks
        jsonMatch = text.match(/\{[\s\S]*?\}/g);
        if (jsonMatch && jsonMatch.length > 0) {
          // Use the longest match as it's likely the main JSON
          jsonMatch = [
            jsonMatch.reduce((a, b) => (a.length > b.length ? a : b)),
          ];
        }
      }
    }

    if (!jsonMatch) {
      console.error('❌ No JSON found in response. Full text:', text);
      throw new Error('No valid JSON found in response');
    }

    console.log('🔍 Extracted JSON string:', jsonMatch[0]);

    let roadmap: RoadmapResponse;
    try {
      roadmap = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('❌ JSON string that failed to parse:', jsonMatch[0]);
      throw new Error(
        `Invalid JSON format: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`
      );
    }

    // Validate the roadmap structure
    if (!roadmap.dailyPlan || !Array.isArray(roadmap.dailyPlan)) {
      throw new Error('Invalid roadmap structure: missing dailyPlan');
    }

    if (roadmap.dailyPlan.length !== duration) {
      throw new Error(
        `Invalid roadmap: expected ${duration} days, got ${roadmap.dailyPlan.length}`
      );
    }

    console.log('✅ Roadmap generated successfully');

    // Save roadmap to database
    console.log('💾 Saving roadmap to database...');
    const savedRoadmap = await saveRoadmap({
      userId: req.userId!,
      title: roadmap.title,
      description: roadmap.description,
      duration: roadmap.duration,
      companies: roadmap.companies,
      designation: roadmap.designation,
      overview: roadmap.overview,
      dailyPlan: roadmap.dailyPlan,
      tips: roadmap.tips,
      status: 'active',
    });

    if (!savedRoadmap) {
      return res
        .status(500)
        .json({ error: 'Failed to save roadmap to database' });
    }

    console.log('✅ Roadmap saved to database with ID:', savedRoadmap.id);

    return res.status(200).json({
      success: true,
      roadmap: { ...roadmap, id: savedRoadmap.id },
      message: 'Roadmap generated and saved successfully',
    });
  } catch (error) {
    console.error('❌ Error generating roadmap:', error);

    // If AI generation fails, provide a fallback roadmap
    if (
      error instanceof Error &&
      (error.message.includes('Gemini API') ||
        error.message.includes('No valid JSON') ||
        error.message.includes('Invalid JSON format'))
    ) {
      console.log('🔄 Providing fallback roadmap due to AI service issues');

      const fallbackRoadmap: RoadmapResponse = {
        title: `${duration}-Day Frontend Interview Prep Roadmap`,
        description: `A structured learning plan for ${designation} preparing for interviews at ${companies.join(', ')}`,
        duration,
        companies,
        designation,
        overview: {
          totalProblems: duration * 3,
          totalTime: `${duration * 2}-${duration * 3} hours`,
          focusAreas: [
            'React',
            'TypeScript',
            'JavaScript',
            'CSS',
            'System Design',
          ],
          learningObjectives: [
            'Master frontend fundamentals',
            'Practice coding problems',
            'Understand system design concepts',
            'Improve problem-solving skills',
          ],
        },
        dailyPlan: Array.from({ length: duration }, (_, i) => ({
          day: i + 1,
          title: `Day ${i + 1}: ${i === 0 ? 'Getting Started' : i < duration / 3 ? 'Building Foundations' : i < (2 * duration) / 3 ? 'Intermediate Practice' : 'Advanced Concepts'}`,
          description: `Day ${i + 1} focuses on ${i < duration / 3 ? 'basic concepts and fundamentals' : i < (2 * duration) / 3 ? 'intermediate problem solving' : 'advanced topics and optimization'}`,
          problems: [
            {
              title: `Problem ${i * 3 + 1}`,
              description: 'Practice problem to improve your skills',
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
              learningObjectives: [
                'Practice fundamentals',
                'Improve problem solving',
              ],
            },
            {
              title: `Problem ${i * 3 + 2}`,
              description: 'Another practice problem to build your skills',
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
              estimatedTime: '30-45 minutes',
              focusAreas: ['TypeScript', 'CSS'],
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
              learningObjectives: [
                'Think systematically',
                'Optimize solutions',
              ],
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

      // Save fallback roadmap to database
      console.log('💾 Saving fallback roadmap to database...');
      const savedRoadmap = await saveRoadmap({
        userId: req.userId!,
        title: fallbackRoadmap.title,
        description: fallbackRoadmap.description,
        duration: fallbackRoadmap.duration,
        companies: fallbackRoadmap.companies,
        designation: fallbackRoadmap.designation,
        overview: fallbackRoadmap.overview,
        dailyPlan: fallbackRoadmap.dailyPlan,
        tips: fallbackRoadmap.tips,
        status: 'active',
      });

      if (!savedRoadmap) {
        return res
          .status(500)
          .json({ error: 'Failed to save fallback roadmap to database' });
      }

      console.log(
        '✅ Fallback roadmap saved to database with ID:',
        savedRoadmap.id
      );

      return res.status(200).json({
        success: true,
        roadmap: { ...fallbackRoadmap, id: savedRoadmap.id },
        message:
          'Fallback roadmap generated and saved (AI service temporarily unavailable)',
      });
    }

    let errorMessage = 'Failed to generate roadmap';
    if (error instanceof Error) {
      errorMessage = error.message;

      if (error.message.includes('Invalid roadmap structure')) {
        errorMessage =
          'Invalid roadmap structure from AI service. Please try again.';
      } else if (
        error.message.includes('expected') &&
        error.message.includes('days')
      ) {
        errorMessage = 'Incomplete roadmap generated. Please try again.';
      }
    }

    return res.status(500).json({
      error: errorMessage,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
