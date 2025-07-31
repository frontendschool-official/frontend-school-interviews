/**
 * Service functions for interacting with the Gemini API. TypeScript
 * definitions are included to clarify expected inputs and outputs.
 */

import { 
  ProblemSchema, 
  GenerateParams, 
  GeneratedResult, 
  EvaluateParams,
  isValidProblemSchema 
} from '../types/problem';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function generateInterviewQuestions({ designation, companies, round, interviewType }: GenerateParams): Promise<GeneratedResult> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  let jsonSchemaPrompt = '';
  
  if (interviewType === 'dsa') {
    jsonSchemaPrompt = `You are an expert interviewer for frontend developers. Create one DSA (Data Structures and Algorithms) problem for a candidate applying as a ${designation} at ${companies}. This is round ${round}.

IMPORTANT: You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanatory text before or after the JSON.

{
  "dsaProblem": {
    "title": "Clear, concise title for the DSA problem",
    "description": "Brief description of the problem context",
    "problemStatement": "Detailed problem statement explaining what needs to be solved",
    "inputFormat": "Description of input format and constraints",
    "outputFormat": "Description of expected output format",
    "constraints": [
      "Constraint 1 (e.g., 1 <= n <= 10^5)",
      "Constraint 2 (e.g., 1 <= arr[i] <= 10^9)"
    ],
    "examples": [
      {
        "input": "Example input 1",
        "output": "Expected output 1",
        "explanation": "Brief explanation of the example"
      },
      {
        "input": "Example input 2", 
        "output": "Expected output 2",
        "explanation": "Brief explanation of the example"
      }
    ],
    "difficulty": "medium",
    "estimatedTime": "30-45 minutes",
    "category": "Arrays",
    "tags": ["arrays", "two-pointers", "sorting"],
    "hints": [
      "Optional hint 1",
      "Optional hint 2"
    ],
    "followUpQuestions": [
      "How would you optimize this solution?",
      "What if the input size was much larger?"
    ]
  }
}

Make sure the problem is appropriate for a ${designation} role at ${companies} and suitable for round ${round}. The difficulty should be challenging but achievable within the estimated time. Focus on problems that test algorithmic thinking and data structure knowledge relevant to frontend development.`;
  } else {
    jsonSchemaPrompt = `You are an expert interviewer for frontend developers. Create one machine coding problem and one system design problem for a candidate applying as a ${designation} at ${companies}. This is round ${round}.

IMPORTANT: You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanatory text before or after the JSON.

{
  "machineCodingProblem": {
    "title": "Clear, concise title for the coding problem",
    "description": "Detailed problem description explaining what needs to be built",
    "requirements": [
      "Specific requirement 1",
      "Specific requirement 2",
      "Specific requirement 3"
    ],
    "constraints": [
      "Technical constraint 1",
      "Technical constraint 2"
    ],
    "acceptanceCriteria": [
      "Criterion 1 that must be met",
      "Criterion 2 that must be met"
    ],
    "difficulty": "medium",
    "estimatedTime": "45-60 minutes",
    "technologies": ["React", "TypeScript", "CSS"],
    "hints": [
      "Optional hint 1",
      "Optional hint 2"
    ]
  },
  "systemDesignProblem": {
    "title": "Clear, concise title for the system design problem",
    "description": "Detailed problem description explaining the system to be designed",
    "functionalRequirements": [
      "Functional requirement 1",
      "Functional requirement 2"
    ],
    "nonFunctionalRequirements": [
      "Non-functional requirement 1 (performance, scalability, etc.)",
      "Non-functional requirement 2"
    ],
    "constraints": [
      "System constraint 1",
      "System constraint 2"
    ],
    "scale": {
      "users": "1M daily active users",
      "requestsPerSecond": "10,000 RPS",
      "dataSize": "100TB of data"
    },
    "expectedDeliverables": [
      "High-level architecture diagram",
      "Database schema design",
      "API specifications"
    ],
    "difficulty": "medium",
    "estimatedTime": "60-90 minutes",
    "technologies": ["Microservices", "Redis", "PostgreSQL"],
    "followUpQuestions": [
      "How would you handle scaling?",
      "What about data consistency?"
    ]
  }
}

Make sure the problems are appropriate for a ${designation} role at ${companies} and suitable for round ${round}. The difficulty should be challenging but achievable within the estimated time.`;
  }

  if (!apiKey) {
    // Provide sample structured data if no API key is configured
    if (interviewType === 'dsa') {
      const sampleDSAProblem = {
        dsaProblem: {
          title: "Two Sum with Sorted Array",
          description: "Given a sorted array of integers and a target sum, find two numbers that add up to the target.",
          problemStatement: "You are given a sorted array of integers nums and an integer target. Return the indices of two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
          inputFormat: "nums: sorted array of integers, target: integer",
          outputFormat: "Array of two integers representing the indices",
          constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists"
          ],
          examples: [
            {
              input: "nums = [2, 7, 11, 15], target = 9",
              output: "[0, 1]",
              explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
              input: "nums = [3, 2, 4], target = 6",
              output: "[1, 2]",
              explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
            }
          ],
          difficulty: "medium",
          estimatedTime: "30-45 minutes",
          category: "Arrays",
          tags: ["arrays", "two-pointers", "sorting"],
          hints: [
            "Since the array is sorted, you can use two pointers",
            "Start with one pointer at the beginning and one at the end"
          ],
          followUpQuestions: [
            "How would you solve this if the array wasn't sorted?",
            "What if you needed to find all pairs that sum to the target?"
          ]
        }
      };

      return {
        machineCodingProblem: '',
        systemDesignProblem: '',
        dsaProblem: JSON.stringify(sampleDSAProblem.dsaProblem)
      };
    } else {
      const sampleProblem: ProblemSchema = {
        machineCodingProblem: {
          title: "Responsive Grid Layout Builder",
          description: "Build a dynamic grid layout system using CSS Grid and React that allows users to create, resize, and reorder grid items in real-time.",
          requirements: [
            "Implement a drag-and-drop interface for grid items",
            "Support dynamic resizing of grid items",
            "Allow reordering of items within the grid",
            "Make the layout responsive across different screen sizes",
            "Implement undo/redo functionality"
          ],
          constraints: [
            "Must use CSS Grid for layout",
            "No external drag-and-drop libraries",
            "Must be fully responsive",
            "Support minimum 2x2 grid, maximum 6x6 grid"
          ],
          acceptanceCriteria: [
            "Grid items can be dragged and dropped to new positions",
            "Items can be resized by dragging corners",
            "Layout adapts to different screen sizes",
            "Undo/redo works correctly",
            "Performance remains smooth with 20+ items"
          ],
          difficulty: "medium",
          estimatedTime: "45-60 minutes",
          technologies: ["React", "TypeScript", "CSS Grid", "HTML5 Drag API"],
          hints: [
            "Consider using CSS Grid's grid-template-areas for dynamic layouts",
            "Use ResizeObserver API for detecting size changes"
          ]
        },
        systemDesignProblem: {
          title: "Real-time Chat Application Architecture",
          description: "Design a scalable, real-time chat application that supports multiple channels, typing indicators, message read receipts, and file sharing.",
          functionalRequirements: [
            "Real-time messaging between users",
            "Multiple chat channels/rooms",
            "Typing indicators",
            "Message read receipts",
            "File sharing (images, documents)",
            "User presence indicators",
            "Message search functionality"
          ],
          nonFunctionalRequirements: [
            "Support 1M concurrent users",
            "Message delivery latency < 100ms",
            "99.9% uptime",
            "Handle 10,000 messages per second",
            "Support file uploads up to 50MB"
          ],
          constraints: [
            "Must be globally distributed",
            "Messages must be delivered in order",
            "Support message history for 1 year",
            "Comply with GDPR requirements"
          ],
          scale: {
            users: "1M daily active users",
            requestsPerSecond: "10,000 RPS",
            dataSize: "100TB of message data"
          },
          expectedDeliverables: [
            "High-level system architecture diagram",
            "Database schema design",
            "API specifications",
            "Scalability strategy",
            "Data consistency approach"
          ],
          difficulty: "medium",
          estimatedTime: "60-90 minutes",
          technologies: ["WebSockets", "Redis", "PostgreSQL", "CDN", "Load Balancers"],
          followUpQuestions: [
            "How would you handle message ordering across multiple servers?",
            "What's your strategy for handling offline users?",
            "How would you implement message encryption?"
          ]
        }
      };

      return {
        machineCodingProblem: JSON.stringify(sampleProblem.machineCodingProblem),
        systemDesignProblem: JSON.stringify(sampleProblem.systemDesignProblem)
      };
    }
  }

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: jsonSchemaPrompt }],
      },
    ],
  };

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse the JSON response
    let parsedResponse: ProblemSchema;
    try {
      // Extract JSON from the response (in case there's any extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      throw new Error('Invalid JSON response from AI service');
    }

    // Validate the parsed response has the expected structure
    if (!isValidProblemSchema(parsedResponse)) {
      throw new Error('Invalid problem structure in AI response');
    }

    if (interviewType === 'dsa') {
      return {
        machineCodingProblem: '',
        systemDesignProblem: '',
        dsaProblem: JSON.stringify(parsedResponse.dsaProblem)
      };
    } else {
      return {
        machineCodingProblem: JSON.stringify(parsedResponse.machineCodingProblem),
        systemDesignProblem: JSON.stringify(parsedResponse.systemDesignProblem)
      };
    }
  } catch (error) {
    console.error('Generate error', error);
    throw new Error('Failed to generate questions');
  }
}

export async function evaluateSubmission({ designation, code, drawingImage }: EvaluateParams): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!designation) {
    throw new Error('Designation is required for evaluation');
  }

  const prompt = `You are evaluating a ${designation} candidate's submission. The candidate provided the following code:\n\n${code}\n\nThey also drew a system design which is attached as an image (base64-encoded). Please provide constructive feedback on both the code and the design. Suggest potential improvements or follow-up questions.`;
  
  if (!apiKey) {
    return 'Your code works correctly but could be more modular. Consider separating concerns into smaller components. For the design, adding load balancers and caching would improve scalability.';
  }

  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/png', data: drawingImage } },
        ],
      },
    ],
  };

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      
      if (res.status === 400) {
        throw new Error('Invalid request to AI service. Please check your input and try again.');
      } else if (res.status === 401) {
        throw new Error('AI service authentication failed. Please contact support.');
      } else if (res.status === 403) {
        throw new Error('Access to AI service is restricted. Please try again later.');
      } else if (res.status === 429) {
        throw new Error('AI service rate limit exceeded. Please wait a moment and try again.');
      } else if (res.status >= 500) {
        throw new Error('AI service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(`AI service error: ${errorData.error?.message || 'Unknown error'}`);
      }
    }

    const data = await res.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from AI service');
    }

    const feedback: string = data.candidates[0].content.parts?.[0]?.text || '';
    
    if (!feedback.trim()) {
      throw new Error('AI service returned empty feedback. Please try again.');
    }

    return feedback;
  } catch (error) {
    console.error('Evaluation error:', error);
    
    if (error instanceof Error) {
      // Re-throw our custom errors
      if (error.message.includes('AI service')) {
        throw error;
      }
      
      // Handle network errors
      if (error.message.includes('fetch') || error.message.includes('network')) {
        throw new Error('Network error: Unable to connect to AI service. Please check your internet connection.');
      }
      
      // Handle JSON parsing errors
      if (error.message.includes('JSON')) {
        throw new Error('Invalid response from AI service. Please try again.');
      }
      
      // Generic error
      throw new Error(`AI evaluation failed: ${error.message}`);
    } else {
      throw new Error('An unexpected error occurred during AI evaluation');
    }
  }
}