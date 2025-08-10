import {
  MockInterviewProblem,
  InterviewRound,
  InterviewInsightsResponse,
  SimulationProblem,
  SimulationRound,
  SimulationConfig,
  InterviewSimulationData,
  CreateSimulationParams,
} from "../../types/problem";
import { generateMockInterviewProblem } from "../ai/evaluation";
import {
  saveProblemSet,
  saveInterviewProblemDocument,
} from "../firebase/problems";
import { db } from "../firebase/config";
import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../../enums/collections";

/**
 * Validate a problem before saving to interview_problems collection
 */
export function validateProblem(problem: SimulationProblem): boolean {
  // Required fields for all problem types
  const requiredFields = ['title', 'description', 'difficulty', 'type'];
  
  for (const field of requiredFields) {
    if (!problem[field as keyof SimulationProblem]) {
      console.warn(`Problem validation failed: missing ${field}`);
      return false;
    }
  }

  // Basic content validation - just check if content exists
  if (!problem.content || typeof problem.content !== 'object') {
    console.warn('Problem validation failed: missing or invalid content');
    return false;
  }

  // Type-specific validation (more lenient)
  switch (problem.type) {
    case 'dsa':
      return validateDSAProblem(problem);
    case 'machine_coding':
      return validateMachineCodingProblem(problem);
    case 'system_design':
      return validateSystemDesignProblem(problem);
    case 'theory_and_debugging':
      return validateTheoryProblem(problem);
    default:
      console.warn(`Problem validation failed: unknown type ${problem.type}`);
      return false;
  }
}

/**
 * Validate DSA problem structure
 */
function validateDSAProblem(problem: SimulationProblem): boolean {
  const content = problem.content as any;
  
  // More lenient validation - just check if we have the basic structure
  const hasProblemStatement = content?.problemStatement && typeof content.problemStatement === 'string';
  const hasExamples = Array.isArray(content?.examples) && content.examples.length > 0;
  
  if (!hasProblemStatement) {
    console.warn('DSA problem validation failed: missing problemStatement');
    return false;
  }

  return true;
}

/**
 * Validate Machine Coding problem structure
 */
function validateMachineCodingProblem(problem: SimulationProblem): boolean {
  const content = problem.content as any;
  
  // More lenient validation - just check if we have some content
  const hasRequirements = Array.isArray(content?.requirements) && content.requirements.length > 0;
  const hasAcceptanceCriteria = Array.isArray(content?.acceptanceCriteria) && content.acceptanceCriteria.length > 0;
  const hasTechnologies = Array.isArray(content?.technologies) && content.technologies.length > 0;
  
  // At least one of these should be present
  if (!hasRequirements && !hasAcceptanceCriteria && !hasTechnologies) {
    console.warn('Machine coding problem validation failed: missing requirements, acceptanceCriteria, or technologies');
    return false;
  }

  return true;
}

/**
 * Validate System Design problem structure
 */
function validateSystemDesignProblem(problem: SimulationProblem): boolean {
  const content = problem.content as any;
  
  // More lenient validation - just check if we have some content
  const hasFunctionalRequirements = Array.isArray(content?.functionalRequirements) && content.functionalRequirements.length > 0;
  const hasNonFunctionalRequirements = Array.isArray(content?.nonFunctionalRequirements) && content.nonFunctionalRequirements.length > 0;
  const hasScale = content?.scale && typeof content.scale === 'object';
  const hasExpectedDeliverables = Array.isArray(content?.expectedDeliverables) && content.expectedDeliverables.length > 0;
  
  // At least two of these should be present
  const validFields = [hasFunctionalRequirements, hasNonFunctionalRequirements, hasScale, hasExpectedDeliverables].filter(Boolean);
  if (validFields.length < 2) {
    console.warn('System design problem validation failed: insufficient required fields');
    return false;
  }

  return true;
}

/**
 * Validate Theory problem structure
 */
function validateTheoryProblem(problem: SimulationProblem): boolean {
  const content = problem.content as any;
  
  // More lenient validation - just check if we have some content
  const hasQuestion = content?.question && typeof content.question === 'string' && content.question.trim().length > 0;
  const hasExpectedAnswer = content?.expectedAnswer && typeof content.expectedAnswer === 'string' && content.expectedAnswer.trim().length > 0;
  const hasKeyPoints = Array.isArray(content?.keyPoints) && content.keyPoints.length > 0;
  
  // At least two of these should be present
  const validFields = [hasQuestion, hasExpectedAnswer, hasKeyPoints].filter(Boolean);
  if (validFields.length < 2) {
    console.warn('Theory problem validation failed: insufficient required fields');
    return false;
  }

  return true;
}

/**
 * Transform SimulationProblem to interview_problems collection schema
 */
export function transformProblemToInterviewProblemsSchema(
  problem: SimulationProblem,
  companyName: string,
  roleLevel: string,
  userId: string,
  interviewId?: string,
  roundNumber?: number
) {
  // Map problem type to collection schema type
  let type: "machine_coding" | "dsa" | "system_design" | "js_concepts";
  
  switch (problem.type) {
    case "dsa":
      type = "dsa";
      break;
    case "machine_coding":
      type = "machine_coding";
      break;
    case "system_design":
      type = "system_design";
      break;
    case "theory_and_debugging":
      type = "js_concepts";
      break;
    default:
      throw new Error(`Unknown problem type: ${problem.type}`);
  }

  const content = problem.content as any;

  // Base problem structure
  const baseProblem = {
    title: problem.title,
    type,
    difficulty: problem.difficulty,
    company: companyName,
    role: roleLevel,
    userId,
    interviewId,
    roundNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Type-specific problem content
  switch (problem.type) {
    case "dsa":
      return {
        ...baseProblem,
        problem: {
          description: problem.description,
          input_format: content.inputFormat || "",
          output_format: content.outputFormat || "",
          constraints: Array.isArray(content.constraints) 
            ? content.constraints.join("\n") 
            : content.constraints || "",
          sample_input: content.examples?.[0]?.input || "",
          sample_output: content.examples?.[0]?.output || "",
          follow_up_questions: content.followUpQuestions || [],
        },
      };

    case "machine_coding":
      return {
        ...baseProblem,
        problem: {
          description: problem.description,
          input_format: "N/A",
          output_format: "N/A",
          constraints: Array.isArray(content.constraints) 
            ? content.constraints.join("\n") 
            : content.constraints || "",
          sample_input: content.examples?.[0]?.input || "",
          sample_output: content.examples?.[0]?.output || "",
          follow_up_questions: content.followUpQuestions || [],
        },
        // Additional machine coding specific fields
        requirements: content.requirements || [],
        acceptanceCriteria: content.acceptanceCriteria || [],
        technologies: content.technologies || [],
        hints: content.hints || [],
      };

    case "system_design":
      return {
        ...baseProblem,
        problem: {
          description: problem.description,
          input_format: "N/A",
          output_format: "N/A",
          constraints: Array.isArray(content.constraints) 
            ? content.constraints.join("\n") 
            : content.constraints || "",
          sample_input: content.examples?.[0]?.input || "",
          sample_output: content.examples?.[0]?.output || "",
          follow_up_questions: content.followUpQuestions || [],
        },
        // Additional system design specific fields
        functionalRequirements: content.functionalRequirements || [],
        nonFunctionalRequirements: content.nonFunctionalRequirements || [],
        scale: content.scale || {
          users: "1M daily active users",
          requestsPerSecond: "10,000 RPS",
          dataSize: "100TB",
        },
        expectedDeliverables: content.expectedDeliverables || [],
      };

    case "theory_and_debugging":
      return {
        ...baseProblem,
        problem: {
          description: problem.description,
          input_format: "N/A",
          output_format: "N/A",
          constraints: "",
          sample_input: content.examples?.[0]?.input || "",
          sample_output: content.examples?.[0]?.output || "",
          follow_up_questions: content.followUpQuestions || [],
        },
        // Additional theory specific fields
        question: content.question || "",
        expectedAnswer: content.expectedAnswer || "",
        keyPoints: content.keyPoints || [],
      };

    default:
      throw new Error(`Unsupported problem type: ${problem.type}`);
  }
}

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

  // Generate problems for each round
  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i];
    const roundDuration = Math.floor(totalDuration / rounds.length);
    
    // Generate problems for this round
    const problems: SimulationProblem[] = [];
    const problemsCount = Math.max(2, Math.floor(roundDuration / 20)); // At least 2 problems, 20 min each

    for (let j = 0; j < problemsCount; j++) {
      try {
        const problem = await generateMockInterviewProblem(
          round.type || "machine_coding",
          companyName,
          roleLevel,
          round.difficulty || "medium"
        );

        if (problem) {
          problems.push({
            id: `round_${i + 1}_problem_${j + 1}`,
            type: round.type || "machine_coding",
            title: problem.title,
            description: problem.description,
            difficulty: round.difficulty || "medium",
            estimatedTime: `${Math.floor(roundDuration / problemsCount)} minutes`,
            content: problem.content || {},
            roundName: round.name,
            roundType: round.type || "machine_coding",
          });
        }
      } catch (error) {
        console.error(`Error generating problem ${j + 1} for round ${i + 1}:`, error);
      }
    }

    simulationRounds.push({
      id: `round_${i + 1}`,
      name: round.name,
      type: round.type || "machine_coding",
      description: round.description,
      duration: `${roundDuration} minutes`,
      difficulty: round.difficulty || "medium",
      problems,
    });
  }

  return {
    rounds: simulationRounds,
    totalDuration: `${totalDuration} minutes`,
    totalRounds: rounds.length,
  };
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
        // Transform problem to interview_problems schema
        const transformedProblem = transformProblemToInterviewProblemsSchema(
          problem,
          companyName,
          roleLevel,
          userId,
          opts?.interviewId,
          opts?.roundNumber
        );

        await saveInterviewProblemDocument(transformedProblem);
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

    return result;
  } catch (error) {
    console.error("Error in saveGeneratedProblemsToCollection:", error);
    throw error;
  }
}

/**
 * Get existing interview session for user
 */
export async function getExistingInterviewSession(
  userId: string
): Promise<any | null> {
  try {
    const sessionsRef = collection(db, COLLECTIONS.INTERVIEW_SIMULATIONS);
    const q = query(
      sessionsRef,
      where("userId", "==", userId),
      where("status", "==", "active")
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    return null;
  } catch (error) {
    console.error("Error getting existing interview session:", error);
    return null;
  }
}

/**
 * Get existing simulation session by interview ID
 */
export async function getExistingSimulationSessionByInterviewId(
  userId: string,
  interviewId: string
): Promise<any | null> {
  try {
    const sessionsRef = collection(db, COLLECTIONS.INTERVIEW_SIMULATION_SESSIONS);
    const q = query(
      sessionsRef,
      where("simulationId", "==", interviewId),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    return null;
  } catch (error) {
    console.error("Error getting existing simulation session:", error);
    return null;
  }
}

/**
 * Calculate time distribution for problems
 */
export function calculateTimeDistribution(
  totalMinutes: number,
  problemsCount: number
): number[] {
  const baseTime = Math.floor(totalMinutes / problemsCount);
  const remainder = totalMinutes % problemsCount;
  
  const distribution = Array(problemsCount).fill(baseTime);
  
  // Distribute remainder to first few problems
  for (let i = 0; i < remainder; i++) {
    distribution[i]++;
  }
  
  return distribution;
}

/**
 * Map simulation problem type to InterviewType
 */
export function mapSimulationTypeToInterviewType(
  type: "dsa" | "machine_coding" | "system_design" | "theory_and_debugging"
): "coding" | "design" | "dsa" | "theory" {
  switch (type) {
    case "dsa":
      return "dsa";
    case "machine_coding":
      return "coding";
    case "system_design":
      return "design";
    case "theory_and_debugging":
      return "theory";
    default:
      return "coding";
  }
}

/**
 * Determine round type based on round information
 */
export function determineRoundType(
  round: InterviewRound
): "dsa" | "machine_coding" | "system_design" | "theory_and_debugging" {
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
    return "theory_and_debugging";
  }
}

/**
 * Create interview simulation
 */
export const createInterviewSimulation = async (
  params: CreateSimulationParams
): Promise<string> => {
  const { userId, companyName, roleLevel, insights, customRounds } = params;
  try {
    const ref = collection(db, COLLECTIONS.INTERVIEW_SIMULATIONS);

    // Use custom rounds if provided, otherwise use insights rounds
    const roundsToUse = customRounds || insights.rounds;
    console.log(roundsToUse, "roundsToUse");
    // Enrich rounds for UI: add stable id, initial status, and empty problems array
    const enrichedRounds = roundsToUse?.map((r: any, index: number) => ({
      id: r?.id || `round_${index + 1}`,
      status: index === 0 ? "active" : "pending",
      problems: [],
      name: r?.name,
      type: r?.type || "unknown",
      description: r?.description,
      duration: r?.duration,
      // Include additional properties from insights.rounds if available
      focusAreas: r?.focusAreas || [],
      difficulty: r?.difficulty || "medium",
      evaluationCriteria: r?.evaluationCriteria || [],
      sampleProblems: r?.sampleProblems || [],
      tips: r?.tips || [],
    }));
    const payload: Partial<InterviewSimulationData> & { rounds: any[] } = {
      userId,
      companyName,
      roleLevel,
      rounds: enrichedRounds,
      currentRound: 0,
      completedRounds: [],
      status: "active",
      createdAt: Timestamp.now(),
      simulationConfig: {
        estimatedDuration: insights?.estimatedDuration,
        totalRounds: customRounds?.length || insights?.totalRounds,
      },
    };
    console.log(payload, "payload");
    const docRef = await addDoc(ref, payload as any);
    return docRef.id;
  } catch (error) {
    console.error("Error creating interview simulation:", error);
    throw new Error("Failed to create interview simulation");
  }
}; 