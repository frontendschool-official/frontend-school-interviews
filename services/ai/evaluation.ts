import { NextJSPromptManager } from "../../prompts/loader";
import { makeGeminiRequest } from "../../lib/gemini";
import { getPromptVersion } from "./gemini-config";
import {
  EvaluateParams,
  MockInterviewProblem,
  MockInterviewSubmission,
  MockInterviewEvaluation,
} from "../../types/problem";

// Initialize prompt manager with latest version
const promptManager = new NextJSPromptManager(getPromptVersion());

export async function evaluateSubmission({
  designation,
  code,
  drawingImage,
}: EvaluateParams): Promise<string> {
  if (!designation) {
    throw new Error("Designation is required for evaluation");
  }

  let prompt = "";
  let body: any;

  try {
    // Common variables for evaluation
    const evaluationVariables = {
      designation,
      companies: "Technology Company", // Default since not provided in EvaluateParams
      problemType: "submission",
      technology: "JavaScript/React", // Default technology
      experienceLevel: "mid-level",
      timeAllocated: "N/A",
      timeTaken: "N/A",
      context: code || "System design diagram provided",
      codeQualityFocus: "JavaScript/React",
      frontendFocus: "User Experience",
      scalabilityContext: "production environment",
      companyTechStack: "JavaScript/React",
    };

    // Handle different evaluation strategies based on what's provided
    if (drawingImage && !code) {
      // System Design: Update context for system design evaluation
      evaluationVariables.problemType = "system-design";
      evaluationVariables.technology = "System Design";
      evaluationVariables.context =
        "System design diagram provided as image. Please evaluate the architectural decisions, scalability considerations, component relationships, design completeness, and provide improvement suggestions.";

      prompt = promptManager.processPrompt(
        "evaluateSubmission",
        evaluationVariables
      );

      body = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/png", data: drawingImage } },
            ],
          },
        ],
      };
    } else if (code && !drawingImage) {
      // DSA and Machine Coding: Evaluate based on the code
      const isDSA =
        code.includes("Problem Statement") || code.includes("Test Results");

      if (isDSA) {
        evaluationVariables.problemType = "dsa";
        evaluationVariables.technology = "Algorithms";
        evaluationVariables.context = `DSA Problem Solution:\n\n${code}\n\nPlease provide comprehensive feedback in structured format covering overall assessment, code quality analysis, algorithm analysis, and improvement suggestions.`;
      } else {
        evaluationVariables.problemType = "machine-coding";
        evaluationVariables.technology = "JavaScript/React";
        evaluationVariables.context = `Machine Coding Solution:\n\n${code}\n\nPlease evaluate problem understanding, code correctness, component design, best practices, and suggest improvements.`;
      }

      prompt = promptManager.processPrompt(
        "evaluateSubmission",
        evaluationVariables
      );

      body = {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      };
    } else if (code && drawingImage) {
      // Both code and design provided (rare case)
      evaluationVariables.problemType = "combined";
      evaluationVariables.technology = "Full Stack";
      evaluationVariables.context = `Combined Submission:\n\nCODE:\n${code}\n\nSYSTEM DESIGN: Diagram provided as image.\n\nPlease evaluate both the code implementation and the system design diagram comprehensively.`;

      prompt = promptManager.processPrompt(
        "evaluateSubmission",
        evaluationVariables
      );

      body = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/png", data: drawingImage } },
            ],
          },
        ],
      };
    } else {
      throw new Error("No code or design provided for evaluation");
    }
  } catch (error) {
    console.error("Error processing evaluation prompt:", error);
    // Fallback to basic evaluation prompt
    if (drawingImage && !code) {
      prompt = `You are evaluating a ${designation} candidate's system design submission. Please provide constructive feedback on the architectural decisions, scalability, and design completeness.`;
      body = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/png", data: drawingImage } },
            ],
          },
        ],
      };
    } else if (code) {
      prompt = `You are evaluating a ${designation} candidate's code submission. Please provide constructive feedback on code quality, correctness, and best practices.\n\n${code}`;
      body = {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      };
    } else {
      throw new Error("No code or design provided for evaluation");
    }
  }

  try {
    const res = await makeGeminiRequest(body);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.log("🔍 Error data:", errorData);
      if (res.status === 400) {
        throw new Error(
          "Invalid request to AI service. Please check your input and try again."
        );
      } else if (res.status === 401) {
        throw new Error(
          "AI service authentication failed. Please contact support."
        );
      } else if (res.status === 403) {
        throw new Error(
          "Access to AI service is restricted. Please try again later."
        );
      } else if (res.status === 429) {
        throw new Error(
          "AI service rate limit exceeded. Please wait a moment and try again."
        );
      } else if (res.status >= 500) {
        throw new Error(
          "AI service is temporarily unavailable. Please try again later."
        );
      } else {
        throw new Error(
          `AI service error: ${errorData.error?.message || "Unknown error"}`
        );
      }
    }

    const data = await res.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      throw new Error("Invalid response from AI service");
    }

    const feedback: string = data.candidates[0].content.parts?.[0]?.text || "";

    if (!feedback.trim()) {
      throw new Error("AI service returned empty feedback. Please try again.");
    }

    return feedback;
  } catch (error) {
    console.error("Evaluation error:", error);

    if (error instanceof Error) {
      // Re-throw our custom errors
      if (error.message.includes("AI service")) {
        throw error;
      }

      // Handle network errors
      if (
        error.message.includes("fetch") ||
        error.message.includes("network")
      ) {
        throw new Error(
          "Network error: Unable to connect to AI service. Please check your internet connection."
        );
      }

      // Handle JSON parsing errors
      if (error.message.includes("JSON")) {
        throw new Error("Invalid response from AI service. Please try again.");
      }

      // Generic error
      throw new Error(`AI evaluation failed: ${error.message}`);
    } else {
      throw new Error("An unexpected error occurred during AI evaluation");
    }
  }
}

// Mock Interview Problem Generation
export async function generateMockInterviewProblem(
  roundType: "dsa" | "machine_coding" | "system_design" | "theory_and_debugging",
  companyName: string,
  roleLevel: string,
  difficulty: "easy" | "medium" | "hard" = "medium"
): Promise<MockInterviewProblem> {
  let prompt = "";

  try {
    // Map roleLevel to experience level
    const experienceLevel = roleLevel.toLowerCase().includes("senior")
      ? "senior"
      : roleLevel.toLowerCase().includes("junior")
      ? "junior"
      : "mid-level";

    const mockInterviewVariables = {
      designation: `${roleLevel} Frontend Engineer`,
      companies: companyName,
      round: "1",
      experienceLevel,
      interviewType: roundType,
      difficulty,
      duration:
        roundType === "dsa"
          ? "30 minutes"
          : roundType === "theory_and_debugging"
          ? "20 minutes"
          : "60 minutes",
      focusAreas:
        roundType === "dsa"
          ? "algorithms, data structures"
          : roundType === "theory_and_debugging"
          ? "frontend concepts, frameworks"
          : roundType === "machine_coding"
          ? "React, component design"
          : "system architecture",
      companyContext: `${companyName} is a leading technology company focusing on innovative frontend solutions and user experience.`,
      additionalContext: `This is a ${roundType} round for ${roleLevel} position. Focus on practical skills relevant to frontend development.`,
    };

    prompt = promptManager.processPrompt(
      "mockInterviewProblem",
      mockInterviewVariables
    );
  } catch (error) {
    console.error("Error generating mock interview prompt:", error);
    // Fallback to basic prompt structure
    switch (roundType) {
      case "dsa":
        prompt = `Generate a ${difficulty} DSA problem suitable for ${roleLevel} frontend engineers at ${companyName}. 
      Focus on problems that can be solved using JavaScript/TypeScript and are relevant to frontend development.
      Consider problems involving arrays, strings, objects, or common frontend data manipulation scenarios.`;
        break;

      case "machine_coding":
        prompt = `Generate a ${difficulty} machine coding problem suitable for ${roleLevel} frontend engineers at ${companyName}.
        Focus on building React/Vue/Angular components, state management, or common frontend features.`;
        break;

      case "system_design":
        prompt = `Generate a ${difficulty} system design problem suitable for ${roleLevel} frontend engineers at ${companyName}.
        Focus on frontend architecture, component design, state management patterns.`;
        break;

      case "theory_and_debugging":
        prompt = `Generate a ${difficulty} theory question suitable for ${roleLevel} frontend engineers at ${companyName}.
        Focus on JavaScript/TypeScript concepts, React fundamentals, web APIs.`;
        break;

      default:
        prompt = `Generate a ${difficulty} frontend interview problem for ${roleLevel} at ${companyName}.`;
    }
  }

  const fullPrompt = `${prompt}

Please return a structured JSON response appropriate for the ${roundType} interview type.
Make the problem specific to frontend development and ${companyName}'s technology stack.`;

  try {
    const body = {
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    };
    const res = await makeGeminiRequest(body);

    const problem = res as MockInterviewProblem;

    return problem as MockInterviewProblem;
  } catch (error) {
    console.error("Error generating mock interview problem:", error);
    throw new Error("Failed to generate mock interview problem");
  }
}

/**
 * Validate that a generated problem has all required fields
 */
export function validateGeneratedProblem(problem: any, roundType: string): boolean {
  // Basic validation
  if (!problem.title || !problem.title.trim()) {
    console.warn("Problem missing title");
    return false;
  }

  if (!problem.description || !problem.description.trim()) {
    console.warn("Problem missing description");
    return false;
  }

  if (
    !problem.difficulty ||
    !["easy", "medium", "hard"].includes(problem.difficulty)
  ) {
    console.warn("Problem missing or invalid difficulty");
    return false;
  }

  if (!problem.estimatedTime || !problem.estimatedTime.trim()) {
    console.warn("Problem missing estimated time");
    return false;
  }

  if (!problem.type || problem.type !== roundType) {
    console.warn("Problem type mismatch");
    return false;
  }

  // Type-specific validation
  switch (roundType) {
    case "dsa":
      if (
        !problem.problemStatement ||
        !problem.inputFormat ||
        !problem.outputFormat ||
        !problem.constraints ||
        !problem.examples ||
        problem.examples.length === 0
      ) {
        console.warn("DSA problem missing required fields");
        return false;
      }
      break;

    case "machine_coding":
      if (
        !problem.requirements ||
        problem.requirements.length === 0 ||
        !problem.acceptanceCriteria ||
        problem.acceptanceCriteria.length === 0
      ) {
        console.warn("Machine coding problem missing required fields");
        return false;
      }
      break;

    case "system_design":
      if (
        !problem.functionalRequirements ||
        problem.functionalRequirements.length === 0 ||
        !problem.nonFunctionalRequirements ||
        problem.nonFunctionalRequirements.length === 0
      ) {
        console.warn("System design problem missing required fields");
        return false;
      }
      break;

    case "theory":
      if (!problem.question || !problem.expectedAnswer) {
        console.warn("Theory problem missing required fields");
        return false;
      }
      break;
  }

  return true;
}

// Mock Interview Evaluation
export async function evaluateMockInterviewSubmission(
  problem: MockInterviewProblem,
  submission: MockInterviewSubmission
): Promise<MockInterviewEvaluation> {
  let prompt = "";
  let evaluationData = "";

  switch (problem.type) {
    case "dsa":
      evaluationData = `Problem: ${problem.title}\n${
        problem.problemStatement
      }\n\nCode: ${submission.code || "No code provided"}`;
      prompt = `Evaluate this DSA solution. Consider:
      - Correctness of the algorithm
      - Time and space complexity
      - Code quality and readability
      - Edge case handling
      
      Provide a score out of 100 and detailed feedback.`;
      break;

    case "machine_coding":
      evaluationData = `Problem: ${
        problem.title
      }\nRequirements: ${problem.requirements?.join(", ")}\n\nCode: ${
        submission.code || "No code provided"
      }`;
      prompt = `Evaluate this machine coding solution. Consider:
      - Implementation of requirements
      - Code structure and organization
      - Component design
      - State management
      - Code quality and best practices
      
      Provide a score out of 100 and detailed feedback.`;
      break;

    case "system_design":
      evaluationData = `Problem: ${
        problem.title
      }\nRequirements: ${problem.functionalRequirements?.join(
        ", "
      )}\n\nDesign: [Image provided]\nCode: ${
        submission.code || "No code provided"
      }`;
      prompt = `Evaluate this system design solution. Consider:
      - Architecture decisions
      - Scalability considerations
      - Component relationships
      - Design patterns used
      
      Provide a score out of 100 and detailed feedback.`;
      break;

    case "theory_and_debugging":
      evaluationData = `Question: ${problem.question}\nExpected: ${
        problem.expectedAnswer
      }\n\nAnswer: ${submission.answer || "No answer provided"}`;
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
  "strengths": ["Real strengths will be generated"],
  "areasForImprovement": ["Real areas for improvement will be generated"],
  "suggestions": ["Real suggestions will be generated"]
}`;

  try {
    const body: any = {
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    };

    // Add image for system design problems
    if (problem.type === "system_design" && submission.drawingImage) {
      body.contents[0].parts.push({
        inlineData: { mimeType: "image/png", data: submission.drawingImage },
      });
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is required for evaluation. Please configure NEXT_PUBLIC_GEMINI_API_KEY environment variable.');
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
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

    const evaluation = JSON.parse(jsonMatch[0]);

    // Validate the evaluation structure
    if (!evaluation.score || !evaluation.feedback) {
      throw new Error("Invalid evaluation structure from Gemini API");
    }

    return evaluation as MockInterviewEvaluation;
  } catch (error) {
    console.error("Error evaluating mock interview submission:", error);
    throw new Error('Gemini API key is required for evaluation. Please configure NEXT_PUBLIC_GEMINI_API_KEY environment variable.');
  }
} 