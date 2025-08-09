/**
 * Service functions for interacting with the Gemini API. TypeScript
 * definitions are included to clarify expected inputs and outputs.
 */

import { 
  ProblemSchema, 
  GenerateParams, 
  GeneratedResult, 
  EvaluateParams,
  isValidProblemSchema,
  MockInterviewProblem,
  MockInterviewSubmission,
  MockInterviewEvaluation
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
  } else if (interviewType === 'theory') {
    jsonSchemaPrompt = `You are an expert interviewer for frontend developers. Create one theory problem for a candidate applying as a ${designation} at ${companies}. This is round ${round}.

IMPORTANT: You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanatory text before or after the JSON.

{
  "theoryProblem": {
    "title": "Clear, concise title for the theory question",
    "description": "Brief description of the concept being tested",
    "question": "Detailed question that tests understanding of frontend concepts",
    "expectedAnswer": "Expected answer points that should be covered",
    "keyPoints": [
      "Key point 1 that should be mentioned",
      "Key point 2 that should be mentioned",
      "Key point 3 that should be mentioned"
    ],
    "difficulty": "medium",
    "estimatedTime": "15-30 minutes",
    "category": "JavaScript/React/CSS/Web APIs",
    "tags": ["javascript", "react", "frontend"],
    "hints": [
      "Optional hint 1",
      "Optional hint 2"
    ],
    "followUpQuestions": [
      "How would you optimize this?",
      "What are the trade-offs?"
    ]
  }
}

Make sure the question is appropriate for a ${designation} role at ${companies} and suitable for round ${round}. Focus on JavaScript, React, CSS, Web APIs, or other frontend technologies. The difficulty should be challenging but achievable within the estimated time.`;
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
        dsaProblem: JSON.stringify(sampleDSAProblem.dsaProblem),
        theoryProblem: ''
      };
    } else if (interviewType === 'theory') {
      const sampleTheoryProblem = {
        theoryProblem: {
          title: "React Hooks and State Management",
          description: "Explain the concept of React hooks and how they improve state management in functional components.",
          question: "What are React hooks? Explain the useState and useEffect hooks with examples. How do they compare to class component lifecycle methods?",
          expectedAnswer: "React hooks are functions that allow you to use state and other React features in functional components. useState manages local state, useEffect handles side effects. They provide a cleaner alternative to class components.",
          keyPoints: [
            "Hooks are functions that start with 'use'",
            "useState returns current state and setter function",
            "useEffect replaces componentDidMount, componentDidUpdate, componentWillUnmount",
            "Hooks must be called at the top level",
            "Custom hooks can be created for reusable logic"
          ],
          difficulty: "medium",
          estimatedTime: "15-30 minutes",
          category: "React",
          tags: ["react", "hooks", "state-management"],
          hints: [
            "Think about how hooks solve the problem of sharing stateful logic",
            "Consider the rules of hooks"
          ],
          followUpQuestions: [
            "How would you optimize re-renders with hooks?",
            "What are the differences between useCallback and useMemo?"
          ]
        }
      };

      return {
        machineCodingProblem: '',
        systemDesignProblem: '',
        dsaProblem: '',
        theoryProblem: JSON.stringify(sampleTheoryProblem.theoryProblem)
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
        dsaProblem: JSON.stringify(parsedResponse.dsaProblem),
        theoryProblem: ''
      };
    } else if (interviewType === 'theory') {
      return {
        machineCodingProblem: '',
        systemDesignProblem: '',
        dsaProblem: '',
        theoryProblem: JSON.stringify(parsedResponse.theoryProblem)
      };
    } else {
      return {
        machineCodingProblem: JSON.stringify(parsedResponse.machineCodingProblem),
        systemDesignProblem: JSON.stringify(parsedResponse.systemDesignProblem),
        dsaProblem: '',
        theoryProblem: ''
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

  let prompt = '';
  let body: any;

  // Handle different evaluation strategies based on what's provided
  if (drawingImage && !code) {
    // System Design: Evaluate based on the drawing image
    prompt = `You are evaluating a ${designation} candidate's system design submission. The candidate has drawn a system design diagram which is attached as an image. Please provide constructive feedback on:
    
1. **Problem Understanding**: How well does the design address the problem requirements?
2. **Architecture decisions and patterns used**: Are appropriate architectural patterns chosen?
3. **Scalability considerations**: Does the design scale appropriately?
4. **Component relationships and data flow**: Are components properly connected and data flows logical?
5. **Design completeness and clarity**: Is the design complete and easy to understand?
6. **Potential improvements and optimizations**: What could be enhanced?
7. **Follow-up questions to test deeper understanding**: What questions would you ask to test knowledge?

Provide detailed, constructive feedback that would help the candidate improve their system design skills. Consider how well the design addresses the specific problem requirements.`;
    
    body = {
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/png', data: drawingImage } }
        ]
      }]
    };
  } else if (code && !drawingImage) {
    // DSA and Machine Coding: Evaluate based on the code
    const isDSA = code.includes('Problem Statement') || code.includes('Test Results');
    
    if (isDSA) {
      prompt = `You are evaluating a DSA (Data Structures and Algorithms) candidate's solution. The candidate has provided their solution along with the problem statement. Please provide comprehensive feedback in the following structured format:

💡 Overall Feedback
[Provide a high-level assessment of the solution considering the problem requirements]

🔍 Code Quality Analysis
[Analyze code readability, structure, and best practices]

⚡ Algorithm Analysis
[Analyze the algorithm's approach, efficiency, and correctness in relation to the problem]
- Time Complexity: [Provide time complexity analysis]
- Space Complexity: [Provide space complexity analysis]

🚀 Suggestions for Improvement
- [Specific suggestion 1]
- [Specific suggestion 2]
- [Specific suggestion 3]

🎯 Specific Improvements
- [Concrete improvement 1]
- [Concrete improvement 2]
- [Concrete improvement 3]

Candidate's submission:
${code}

Please provide detailed, constructive feedback that would help the candidate improve their DSA problem-solving skills. Consider how well the solution addresses the specific problem requirements.`;
    } else {
      prompt = `You are evaluating a ${designation} candidate's code submission. The candidate has provided their solution along with the problem statement. Please provide constructive feedback on:

1. **Problem Understanding**: How well does the solution address the problem requirements?
2. **Code correctness and logic**: Does the code work as intended?
3. **Code quality and readability**: Is the code well-structured and maintainable?
4. **Component design and structure**: Are components properly organized and reusable?
5. **Best practices and patterns**: Does the code follow industry best practices?
6. **Potential improvements and optimizations**: What could be improved?
7. **Edge case handling**: Are edge cases properly considered?
8. **Code organization and maintainability**: Is the code easy to understand and modify?

Candidate's submission:
${code}

Please provide detailed, constructive feedback that would help the candidate improve their coding skills. Consider how well the solution meets the specific problem requirements.`;
    }
    
    body = {
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }]
    };
  } else if (code && drawingImage) {
    // Both code and design provided (rare case)
    prompt = `You are evaluating a ${designation} candidate's submission that includes both code and a system design diagram. Please provide comprehensive feedback on both aspects:

CODE ANALYSIS:
\`\`\`
${code}
\`\`\`

Please evaluate:
1. **Problem Understanding**: How well does the code address the problem requirements?
2. **Code correctness and logic**: Does the code work as intended?
3. **Code quality and readability**: Is the code well-structured and maintainable?
4. **Algorithm efficiency**: Is the solution efficient?
5. **Best practices and patterns**: Does the code follow industry best practices?

SYSTEM DESIGN ANALYSIS:
The candidate has also provided a system design diagram (attached as image). Please evaluate:
1. **Problem Understanding**: How well does the design address the problem requirements?
2. **Architecture decisions and patterns**: Are appropriate patterns chosen?
3. **Scalability considerations**: Does the design scale appropriately?
4. **Component relationships**: Are components properly connected?
5. **Design completeness**: Is the design complete and clear?

Provide detailed, constructive feedback on both the code and design aspects. Consider how well the overall solution addresses the specific problem requirements.`;
    
    body = {
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/png', data: drawingImage } }
        ]
      }]
    };
  } else {
    throw new Error('No code or design provided for evaluation');
  }
  
  if (!apiKey) {
    return 'Your code works correctly but could be more modular. Consider separating concerns into smaller components. For the design, adding load balancers and caching would improve scalability.';
  }

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

// Mock Interview Problem Generation
export async function generateMockInterviewProblem(
  roundType: 'dsa' | 'machine_coding' | 'system_design' | 'theory',
  companyName: string,
  roleLevel: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<MockInterviewProblem> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  let prompt = '';
  let responseStructure = '';

  switch (roundType) {
    case 'dsa':
      prompt = `Generate a ${difficulty} DSA problem suitable for ${roleLevel} frontend engineers at ${companyName}. 
      Focus on problems that can be solved using JavaScript/TypeScript and are relevant to frontend development.
      Consider problems involving arrays, strings, objects, or common frontend data manipulation scenarios.`;
      responseStructure = `{
        "id": "unique_id",
        "type": "dsa",
        "title": "Problem Title",
        "description": "Brief description",
        "difficulty": "${difficulty}",
        "estimatedTime": "15-30 minutes",
        "problemStatement": "Detailed problem statement",
        "inputFormat": "Input format description",
        "outputFormat": "Output format description",
        "constraints": ["constraint1", "constraint2"],
        "examples": [
          {
            "input": "example input",
            "output": "expected output",
            "explanation": "explanation"
          }
        ],
        "category": "Arrays/Strings/Objects/etc",
        "tags": ["tag1", "tag2"]
      }`;
      break;

    case 'machine_coding':
      prompt = `Generate a ${difficulty} machine coding problem suitable for ${roleLevel} frontend engineers at ${companyName}.
      Focus on building React/Vue/Angular components, state management, or common frontend features.
      Consider problems like building a todo app, calculator, form validation, or component library.`;
      responseStructure = `{
        "id": "unique_id",
        "type": "machine_coding",
        "title": "Problem Title",
        "description": "Brief description",
        "difficulty": "${difficulty}",
        "estimatedTime": "45-90 minutes",
        "requirements": ["requirement1", "requirement2"],
        "acceptanceCriteria": ["criteria1", "criteria2"],
        "technologies": ["React", "TypeScript"],
        "hints": ["hint1", "hint2"]
      }`;
      break;

    case 'system_design':
      prompt = `Generate a ${difficulty} system design problem suitable for ${roleLevel} frontend engineers at ${companyName}.
      Focus on frontend architecture, component design, state management patterns, or frontend performance optimization.
      Consider problems like designing a component system, state management architecture, or frontend caching strategy.`;
      responseStructure = `{
        "id": "unique_id",
        "type": "system_design",
        "title": "Problem Title",
        "description": "Brief description",
        "difficulty": "${difficulty}",
        "estimatedTime": "30-60 minutes",
        "functionalRequirements": ["req1", "req2"],
        "nonFunctionalRequirements": ["req1", "req2"],
        "scale": {
          "users": "1M+ users",
          "requestsPerSecond": "1000+ RPS",
          "dataSize": "1GB+ data"
        },
        "expectedDeliverables": ["deliverable1", "deliverable2"],
        "followUpQuestions": ["question1", "question2"]
      }`;
      break;

    case 'theory':
      prompt = `Generate a ${difficulty} theory question suitable for ${roleLevel} frontend engineers at ${companyName}.
      Focus on JavaScript/TypeScript concepts, React/Vue/Angular fundamentals, web APIs, or frontend best practices.
      Consider questions about closures, promises, React hooks, browser APIs, or performance optimization.`;
      responseStructure = `{
        "id": "unique_id",
        "type": "theory",
        "title": "Question Title",
        "description": "Brief description",
        "difficulty": "${difficulty}",
        "estimatedTime": "10-20 minutes",
        "question": "Detailed question text",
        "expectedAnswer": "Expected answer points",
        "keyPoints": ["key point 1", "key point 2"]
      }`;
      break;
  }

  const fullPrompt = `${prompt}

Return ONLY a valid JSON object with this structure:
${responseStructure}

Make the problem specific to frontend development and ${companyName}'s technology stack.`;

  if (!apiKey) {
    // Return a fallback problem if no API key
    return generateFallbackProblem(roundType, difficulty);
  }

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      }),
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

    const problem = JSON.parse(jsonMatch[0]);
    
    // Enhanced validation to ensure all required fields are present
    if (!validateGeneratedProblem(problem, roundType)) {
      console.warn('Generated problem missing required fields, using fallback');
      return generateFallbackProblem(roundType, difficulty);
    }

    return problem as MockInterviewProblem;
  } catch (error) {
    console.error('Error generating mock interview problem:', error);
    return generateFallbackProblem(roundType, difficulty);
  }
}

/**
 * Validate that a generated problem has all required fields
 */
function validateGeneratedProblem(problem: any, roundType: string): boolean {
  // Basic validation
  if (!problem.title || !problem.title.trim()) {
    console.warn('Problem missing title');
    return false;
  }
  
  if (!problem.description || !problem.description.trim()) {
    console.warn('Problem missing description');
    return false;
  }
  
  if (!problem.difficulty || !['easy', 'medium', 'hard'].includes(problem.difficulty)) {
    console.warn('Problem missing or invalid difficulty');
    return false;
  }
  
  if (!problem.estimatedTime || !problem.estimatedTime.trim()) {
    console.warn('Problem missing estimated time');
    return false;
  }
  
  if (!problem.type || problem.type !== roundType) {
    console.warn('Problem type mismatch');
    return false;
  }
  
  // Type-specific validation
  switch (roundType) {
    case 'dsa':
      if (!problem.problemStatement || !problem.inputFormat || 
          !problem.outputFormat || !problem.constraints || 
          !problem.examples || problem.examples.length === 0) {
        console.warn('DSA problem missing required fields');
        return false;
      }
      break;
      
    case 'machine_coding':
      if (!problem.requirements || problem.requirements.length === 0 ||
          !problem.acceptanceCriteria || problem.acceptanceCriteria.length === 0) {
        console.warn('Machine coding problem missing required fields');
        return false;
      }
      break;
      
    case 'system_design':
      if (!problem.functionalRequirements || problem.functionalRequirements.length === 0 ||
          !problem.nonFunctionalRequirements || problem.nonFunctionalRequirements.length === 0) {
        console.warn('System design problem missing required fields');
        return false;
      }
      break;
      
    case 'theory':
      if (!problem.question || !problem.expectedAnswer) {
        console.warn('Theory problem missing required fields');
        return false;
      }
      break;
  }
  
  return true;
}

// Fallback problems when API is not available
function generateFallbackProblem(
  roundType: 'dsa' | 'machine_coding' | 'system_design' | 'theory',
  difficulty: 'easy' | 'medium' | 'hard'
): MockInterviewProblem {
  const baseProblem = {
    id: `fallback_${roundType}_${Date.now()}`,
    type: roundType,
    difficulty,
    estimatedTime: '30 minutes',
  };

  switch (roundType) {
    case 'dsa':
      return {
        ...baseProblem,
        title: 'Array Rotation',
        description: 'Rotate an array by k positions',
        problemStatement: 'Given an array of integers and a number k, rotate the array by k positions to the right.',
        inputFormat: 'Array of integers and integer k',
        outputFormat: 'Rotated array',
        constraints: ['1 <= array.length <= 10^5', '0 <= k <= 10^5'],
        examples: [
          {
            input: '[1, 2, 3, 4, 5], k = 2',
            output: '[4, 5, 1, 2, 3]',
            explanation: 'Rotate right by 2 positions'
          }
        ],
        category: 'Arrays',
        tags: ['arrays', 'rotation', 'two-pointers']
      };

    case 'machine_coding':
      return {
        ...baseProblem,
        title: 'Todo List Component',
        description: 'Build a React todo list component',
        requirements: ['Add new todos', 'Mark todos as complete', 'Delete todos'],
        acceptanceCriteria: ['Component renders correctly', 'All CRUD operations work', 'State management is clean'],
        technologies: ['React', 'TypeScript'],
        hints: ['Use useState for state management', 'Consider using useCallback for performance']
      };

    case 'system_design':
      return {
        ...baseProblem,
        title: 'Component Library Design',
        description: 'Design a reusable component library',
        functionalRequirements: ['Theme support', 'Accessibility compliance', 'Responsive design'],
        nonFunctionalRequirements: ['Performance', 'Maintainability', 'Documentation'],
        scale: {
          users: '100K+ developers',
          requestsPerSecond: '100+ RPS',
          dataSize: '100MB+ bundle'
        },
        expectedDeliverables: ['Component architecture', 'API design', 'Documentation strategy'],
        followUpQuestions: ['How would you handle versioning?', 'What about bundle size optimization?']
      };

    case 'theory':
      return {
        ...baseProblem,
        title: 'JavaScript Closures',
        description: 'Explain closures in JavaScript',
        question: 'What are closures in JavaScript? Provide examples and explain their practical use cases.',
        expectedAnswer: 'A closure is a function that has access to variables in its outer scope even after the outer function has returned.',
        keyPoints: ['Lexical scoping', 'Memory management', 'Practical applications']
      };
  }
}

// Mock Interview Evaluation
export async function evaluateMockInterviewSubmission(
  problem: MockInterviewProblem,
  submission: MockInterviewSubmission
): Promise<MockInterviewEvaluation> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  let prompt = '';
  let evaluationData = '';

  switch (problem.type) {
    case 'dsa':
      evaluationData = `Problem: ${problem.title}\n${problem.problemStatement}\n\nCode: ${submission.code || 'No code provided'}`;
      prompt = `Evaluate this DSA solution. Consider:
      - Correctness of the algorithm
      - Time and space complexity
      - Code quality and readability
      - Edge case handling
      
      Provide a score out of 100 and detailed feedback.`;
      break;

    case 'machine_coding':
      evaluationData = `Problem: ${problem.title}\nRequirements: ${problem.requirements?.join(', ')}\n\nCode: ${submission.code || 'No code provided'}`;
      prompt = `Evaluate this machine coding solution. Consider:
      - Implementation of requirements
      - Code structure and organization
      - Component design
      - State management
      - Code quality and best practices
      
      Provide a score out of 100 and detailed feedback.`;
      break;

    case 'system_design':
      evaluationData = `Problem: ${problem.title}\nRequirements: ${problem.functionalRequirements?.join(', ')}\n\nDesign: [Image provided]\nCode: ${submission.code || 'No code provided'}`;
      prompt = `Evaluate this system design solution. Consider:
      - Architecture decisions
      - Scalability considerations
      - Component relationships
      - Design patterns used
      
      Provide a score out of 100 and detailed feedback.`;
      break;

    case 'theory':
      evaluationData = `Question: ${problem.question}\nExpected: ${problem.expectedAnswer}\n\nAnswer: ${submission.answer || 'No answer provided'}`;
      prompt = `Evaluate this theory answer. Consider:
      - Accuracy of the response
      - Depth of understanding
      - Clarity of explanation
      - Coverage of key points
      
      Provide a score out of 100 and detailed feedback.`;
      break;
  }

  const fullPrompt = `${prompt}

${evaluationData}

Return ONLY a valid JSON object with this structure:
{
  "problemId": "${problem.id}",
  "score": 85,
  "feedback": "Detailed feedback here",
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`;

  if (!apiKey) {
    return generateFallbackEvaluation(problem, submission);
  }

  try {
    const body: any = {
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    };

    // Add image for system design problems
    if (problem.type === 'system_design' && submission.drawingImage) {
      body.contents[0].parts.push({
        inlineData: { mimeType: 'image/png', data: submission.drawingImage }
      });
    }

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

    const evaluation = JSON.parse(jsonMatch[0]);
    
    // Validate the evaluation structure
    if (!evaluation.score || !evaluation.feedback) {
      throw new Error('Invalid evaluation structure from Gemini API');
    }

    return evaluation as MockInterviewEvaluation;
  } catch (error) {
    console.error('Error evaluating mock interview submission:', error);
    return generateFallbackEvaluation(problem, submission);
  }
}

// Fallback evaluation when API is not available
function generateFallbackEvaluation(
  problem: MockInterviewProblem,
  submission: MockInterviewSubmission
): MockInterviewEvaluation {
  const hasSubmission = submission.code || submission.answer || submission.drawingImage;
  
  return {
    problemId: problem.id,
    score: hasSubmission ? 75 : 0,
    feedback: hasSubmission 
      ? 'Good attempt! Consider reviewing the problem requirements and improving code organization.'
      : 'No submission provided. Please complete the problem to receive evaluation.',
    strengths: hasSubmission ? ['Attempted the problem', 'Basic understanding shown'] : [],
    areasForImprovement: hasSubmission ? ['Code organization', 'Edge case handling'] : ['Complete the problem'],
    suggestions: hasSubmission ? ['Practice similar problems', 'Review best practices'] : ['Start with the problem statement']
  };
}