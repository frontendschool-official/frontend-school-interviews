import {
  MockInterviewProblem,
  InterviewRound,
  InterviewInsightsResponse,
  SimulationProblem,
  SimulationRound,
  SimulationConfig,
} from "../types/problem";
import { generateMockInterviewProblem } from "./geminiApi";
import { saveProblemSet, saveInterviewProblemDocument } from "./firebase";

/**
 * Generate problems for interview simulation based on company, role, and round
 * Only generates problems for the first round initially
 */
export async function generateSimulationProblems(
  insights: InterviewInsightsResponse,
  companyName: string,
  roleLevel: string,
  startingRound: number = 1
): Promise<SimulationConfig> {
  // Validate insights data
  if (!insights?.data?.rounds || !insights.data.estimatedDuration) {
    throw new Error(
      "Invalid insights data: missing rounds or estimated duration"
    );
  }

  const rounds = insights.data.rounds;

  // Parse total duration with fallback
  let totalDuration = 120; // Default 2 hours
  try {
    const durationMatch = insights.data.estimatedDuration.match(
      /(\d+)-(\d+)\s*(hours?|minutes?)/i
    );
    if (durationMatch) {
      const maxValue = parseInt(durationMatch[2]);
      const unit = durationMatch[3].toLowerCase();
      totalDuration = unit.startsWith("hour") ? maxValue * 60 : maxValue;
    }
  } catch (error) {
    console.warn("Error parsing total duration, using default:", error);
  }

  const simulationRounds: SimulationRound[] = [];

  // Create rounds without generating problems - problems will be generated when rounds start
  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i];
    let roundDuration = 30; // Default 30 minutes
    try {
      const durationMatch = round.duration.match(
        /(\d+)-(\d+)\s*(hours?|minutes?)/i
      );
      if (durationMatch) {
        const maxValue = parseInt(durationMatch[2]);
        const unit = durationMatch[3].toLowerCase();
        roundDuration = unit.startsWith("hour") ? maxValue * 60 : maxValue;
      }
    } catch (error) {
      console.warn(
        `Error parsing duration for round ${round.name}, using default:`,
        error
      );
    }

    simulationRounds.push({
      round,
      problems: [], // Empty problems array - will be generated when round is accessed
      totalTime: roundDuration,
    });
  }

  return {
    companyName,
    roleLevel,
    startingRound,
    totalDuration,
    rounds: simulationRounds,
  };
}

/**
 * Map simulation problem type to InterviewType
 */
function mapSimulationTypeToInterviewType(
  type: "dsa" | "machine_coding" | "system_design" | "theory"
): "coding" | "design" | "dsa" | "theory" {
  switch (type) {
    case "dsa":
      return "dsa";
    case "machine_coding":
      return "coding";
    case "system_design":
      return "design";
    case "theory":
      return "theory";
    default:
      return "coding";
  }
}

/**
 * Validate if a problem has all required fields
 */
function validateProblem(problem: SimulationProblem): boolean {
  // Check for required basic fields
  if (!problem.title || !problem.title.trim()) {
    console.warn("Problem missing title:", problem.id);
    return false;
  }

  if (!problem.description || !problem.description.trim()) {
    console.warn("Problem missing description:", problem.id);
    return false;
  }

  if (
    !problem.difficulty ||
    !["easy", "medium", "hard"].includes(problem.difficulty)
  ) {
    console.warn("Problem missing or invalid difficulty:", problem.id);
    return false;
  }

  if (!problem.estimatedTime || !problem.estimatedTime.trim()) {
    console.warn("Problem missing estimated time:", problem.id);
    return false;
  }

  if (
    !problem.type ||
    !["dsa", "machine_coding", "system_design", "theory"].includes(problem.type)
  ) {
    console.warn("Problem missing or invalid type:", problem.id);
    return false;
  }

  // Check for required content based on type
  if (!problem.content) {
    console.warn("Problem missing content:", problem.id);
    return false;
  }

  // Type-specific validation
  switch (problem.type) {
    case "dsa":
      if (
        !problem.content.problemStatement ||
        !problem.content.inputFormat ||
        !problem.content.outputFormat ||
        !problem.content.constraints ||
        !problem.content.examples ||
        problem.content.examples.length === 0
      ) {
        console.warn("DSA problem missing required fields:", problem.id);
        return false;
      }
      break;

    case "machine_coding":
      if (
        !problem.content.requirements ||
        problem.content.requirements.length === 0 ||
        !problem.content.acceptanceCriteria ||
        problem.content.acceptanceCriteria.length === 0
      ) {
        console.warn(
          "Machine coding problem missing required fields:",
          problem.id
        );
        return false;
      }
      break;

    case "system_design":
      if (
        !problem.content.functionalRequirements ||
        problem.content.functionalRequirements.length === 0 ||
        !problem.content.nonFunctionalRequirements ||
        problem.content.nonFunctionalRequirements.length === 0
      ) {
        console.warn(
          "System design problem missing required fields:",
          problem.id
        );
        return false;
      }
      break;

    case "theory":
      if (!problem.content.question || !problem.content.expectedAnswer) {
        console.warn("Theory problem missing required fields:", problem.id);
        return false;
      }
      break;
  }

  return true;
}

/**
 * Save generated problems to the interview_problems collection
 * Only saves problems that have all required fields
 */
export async function saveGeneratedProblemsToCollection(
  userId: string,
  problems: SimulationProblem[],
  companyName: string,
  roleLevel: string,
  roundName: string,
  opts?: { interviewId?: string; roundNumber?: number }
): Promise<{ saved: number; skipped: number; errors: string[] }> {
  const result = { saved: 0, skipped: 0, errors: [] as string[] };

  try {
    for (const problem of problems) {
      // Validate the problem before saving
      if (!validateProblem(problem)) {
        result.skipped++;
        result.errors.push(
          `Problem ${
            problem.id || "unknown"
          } skipped due to missing required fields`
        );
        continue;
      }

      try {
        // Build unified schema from SimulationProblem
        let type: "machine_coding" | "dsa" | "system_design" | "js_concepts" =
          problem.type === "theory" ? "js_concepts" : (problem.type as any);

        const firstExample = Array.isArray(problem.content?.examples) && problem.content.examples.length > 0
          ? problem.content.examples[0]
          : undefined;

        await saveInterviewProblemDocument({
          title: problem.title,
          type,
          difficulty: problem.difficulty,
          company: companyName,
          role: roleLevel,
          userId,
          interviewId: opts?.interviewId,
          roundNumber: opts?.roundNumber,
          problem: {
            description: problem.description || "",
            input_format: (problem.content as any)?.inputFormat || "",
            output_format: (problem.content as any)?.outputFormat || "",
            constraints: Array.isArray((problem.content as any)?.constraints)
              ? ((problem.content as any).constraints as string[]).join("\n")
              : ((problem.content as any)?.constraints || ""),
            sample_input: firstExample?.input || "",
            sample_output: firstExample?.output || "",
            follow_up_questions: (problem.content as any)?.followUpQuestions || [],
          },
        });
        result.saved++;
        console.log(`Successfully saved problem: ${problem.title}`);
      } catch (saveError) {
        result.skipped++;
        const errorMsg = `Failed to save problem ${problem.id || "unknown"}: ${
          saveError instanceof Error ? saveError.message : "Unknown error"
        }`;
        result.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    console.log(
      `Problem save summary: ${result.saved} saved, ${result.skipped} skipped`
    );
    if (result.errors.length > 0) {
      console.warn("Errors during problem saving:", result.errors);
    }
  } catch (error) {
    console.error("Error in saveGeneratedProblemsToCollection:", error);
    result.errors.push(
      `General error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  return result;
}

/**
 * Determine round type based on round information
 */
function determineRoundType(
  round: InterviewRound
): "dsa" | "machine_coding" | "system_design" | "theory" {
  const roundNameLower = round.name.toLowerCase();
  const focusAreasLower = (round.focusAreas || []).map((area) =>
    area.toLowerCase()
  );

  if (
    roundNameLower.includes("dsa") ||
    roundNameLower.includes("algorithm") ||
    focusAreasLower.some(
      (area) => area.includes("algorithm") || area.includes("data structure")
    )
  ) {
    return "dsa";
  } else if (
    roundNameLower.includes("coding") ||
    roundNameLower.includes("machine") ||
    focusAreasLower.some(
      (area) => area.includes("react") || area.includes("component")
    )
  ) {
    return "machine_coding";
  } else if (
    roundNameLower.includes("design") ||
    roundNameLower.includes("system") ||
    focusAreasLower.some(
      (area) => area.includes("architecture") || area.includes("design")
    )
  ) {
    return "system_design";
  } else {
    return "theory";
  }
}

/**
 * Generate fallback problem when API fails
 */
function generateFallbackProblem(
  type: "dsa" | "machine_coding" | "system_design" | "theory",
  difficulty: "easy" | "medium" | "hard",
  roundName: string,
  problemNumber: number
): SimulationProblem {
  const baseProblem = {
    id: `fallback_${roundName}_${problemNumber}_${Date.now()}`,
    type,
    difficulty,
    estimatedTime: "15-20 minutes",
    roundName,
    roundType: type,
  };

  switch (type) {
    case "dsa":
      return {
        ...baseProblem,
        title: "Array Rotation Problem",
        description:
          "Given an array of integers and a number k, rotate the array by k positions to the right.",
        content: {
          problemStatement:
            "Implement a function that rotates an array by k positions to the right.",
          inputFormat: "Array of integers and integer k",
          outputFormat: "Rotated array",
          constraints: ["1 <= array.length <= 10^5", "0 <= k <= 10^5"],
          examples: [
            {
              input: "[1, 2, 3, 4, 5], k = 2",
              output: "[4, 5, 1, 2, 3]",
              explanation: "Rotate right by 2 positions",
            },
          ],
        },
      };

    case "machine_coding":
      return {
        ...baseProblem,
        title: "Todo List Component",
        description:
          "Build a React todo list component with add, complete, and delete functionality.",
        content: {
          requirements: [
            "Add new todos",
            "Mark todos as complete",
            "Delete todos",
            "Persist todos",
          ],
          acceptanceCriteria: [
            "Component renders correctly",
            "All CRUD operations work",
            "State management is clean",
          ],
          technologies: ["React", "TypeScript"],
          hints: [
            "Use useState for state management",
            "Consider using useCallback for performance",
          ],
        },
      };

    case "system_design":
      return {
        ...baseProblem,
        title: "Component Library Design",
        description:
          "Design a reusable component library for a large-scale frontend application.",
        content: {
          functionalRequirements: [
            "Theme support",
            "Accessibility compliance",
            "Responsive design",
            "TypeScript support",
          ],
          nonFunctionalRequirements: [
            "Performance",
            "Maintainability",
            "Documentation",
            "Bundle size optimization",
          ],
          scale: {
            users: "100K+ developers",
            requestsPerSecond: "100+ RPS",
            dataSize: "100MB+ bundle",
          },
          expectedDeliverables: [
            "Component architecture",
            "API design",
            "Documentation strategy",
            "Versioning strategy",
          ],
          followUpQuestions: [
            "How would you handle versioning?",
            "What about bundle size optimization?",
            "How would you ensure accessibility?",
          ],
        },
      };

    case "theory":
      return {
        ...baseProblem,
        title: "JavaScript Closures and Scope",
        description:
          "Explain closures in JavaScript and provide practical examples.",
        content: {
          question:
            "What are closures in JavaScript? Explain with examples and discuss their practical use cases in modern web development.",
          expectedAnswer:
            "A closure is a function that has access to variables in its outer scope even after the outer function has returned. It maintains access to the variables from its outer scope.",
          keyPoints: [
            "Lexical scoping",
            "Memory management",
            "Practical applications",
            "Common pitfalls",
          ],
          examples: [
            "Module pattern implementation",
            "Event handler with closure",
            "Currying and partial application",
          ],
        },
      };
  }
}

/**
 * Calculate time distribution for problems in a round
 */
export function calculateTimeDistribution(
  roundDuration: number,
  problemsCount: number
): number[] {
  if (problemsCount === 1) {
    return [roundDuration];
  }

  // Distribute time evenly with some variation
  const baseTime = Math.floor(roundDuration / problemsCount);
  const distribution: number[] = [];

  for (let i = 0; i < problemsCount; i++) {
    if (i === problemsCount - 1) {
      // Last problem gets remaining time
      const remainingTime =
        roundDuration - distribution.reduce((sum, time) => sum + time, 0);
      distribution.push(remainingTime);
    } else {
      // Add some variation (±2 minutes)
      const variation = Math.floor(Math.random() * 5) - 2;
      distribution.push(Math.max(10, baseTime + variation));
    }
  }

  return distribution;
}

/**
 * Get problem UI component type based on problem type
 */
export function getProblemUIType(problem: SimulationProblem): string {
  switch (problem.type) {
    case "dsa":
      return "dsa-editor";
    case "machine_coding":
      return "code-editor";
    case "system_design":
      return "system-design-canvas";
    case "theory":
      return "theory-editor";
    default:
      return "theory-editor";
  }
}
