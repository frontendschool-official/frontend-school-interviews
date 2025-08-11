import {
  getExistingInterviewSession,
  getExistingSimulationSessionByInterviewId,
  calculateTimeDistribution,
  validateProblem,
  transformProblemToInterviewProblemsSchema,
  saveGeneratedProblemsToCollection,
} from "@/services/interview/simulation";
import { generateInterviewSimulationProblems } from "@/services/problems";
import { SimulationProblem } from "@/types/problem";
import { validateSimulationProblem, logValidationResults } from "@/services/interview/validation";
import { NextApiResponse } from "next";
import { withRequiredAuth, AuthenticatedRequest } from "@/lib/auth";

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  try {
    const { simulationId } = req.query;

    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    console.log(userId, simulationId, "userId, simulationId");
    if (!simulationId) {
      return res.status(400).json({ error: "Missing simulationId" });
    }

    // Check for existing simulation session
    const simulationSession = await getExistingSimulationSessionByInterviewId(
      userId,
      simulationId as string
    );
    console.log(simulationSession, "simulationSession");
    
    if (simulationSession) {
      return res.status(200).json(simulationSession);
    }

    // Get existing interview session
    const existingInterviewSession = await getExistingInterviewSession(
      userId
    );

    if (!existingInterviewSession) {
      return res.status(404).json({ error: "Interview session not found" });
    }

    // Get the current round from the session
    const currentRound = existingInterviewSession?.currentRound || 0;
    const roleLevel = existingInterviewSession?.roleLevel;
    const activeRoundInfo = existingInterviewSession?.rounds?.[currentRound];
    const activeRoundDuration = activeRoundInfo?.duration || "60 Minutes";
    const sampleProblems = activeRoundInfo?.sampleProblems;
    
    console.log(existingInterviewSession, "existingInterviewSession");
    console.log(currentRound, "currentRound", activeRoundDuration);
    console.log(sampleProblems?.length, "sampleProblems");
    
    const problemsCount = sampleProblems?.length || 3;

    const timeDistribution = calculateTimeDistribution(
      Number(activeRoundDuration?.split(" ")?.[0]),
      problemsCount
    );

    // Generate problems for this round
    const problemsResponse = await generateInterviewSimulationProblems({
      ...activeRoundInfo,
      durationMinutes: Number(activeRoundDuration?.split(" ")?.[0]),
      experienceLevel: roleLevel,
    });

    if (!problemsResponse || !problemsResponse.problems) {
      return res.status(500).json({ error: "Failed to generate problems" });
    }

    console.log("Generated problems response:", {
      category: problemsResponse.category,
      problemsCount: problemsResponse.problems.length,
      firstProblem: problemsResponse.problems[0]
    });

    // Helper function to map category to type
    const mapCategoryToType = (category: string): "dsa" | "machine_coding" | "system_design" | "theory_and_debugging" => {
      switch (category) {
        case "dsa":
          return "dsa";
        case "system_design":
          return "system_design";
        case "js_fundamentals":
        case "html_css":
        case "behavioral":
          return "theory_and_debugging";
        default:
          return "machine_coding"; // Default fallback
      }
    };

    // Transform InterviewSimulationProblemResponse to SimulationProblem format
    const transformedProblems: SimulationProblem[] = problemsResponse.problems.map((problem, index) => {
      const problemType = mapCategoryToType(problemsResponse.category);
      
      return {
        id: `problem_${index + 1}`,
        type: problemType,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty as "easy" | "medium" | "hard",
        estimatedTime: `${problem.estimatedTimeMinutes} minutes`,
        content: {
          problemStatement: problem.problemStatement,
          inputFormat: problem.inputFormat,
          outputFormat: problem.outputFormat,
          constraints: problem.constraints,
          examples: problem.examples,
          followUpQuestions: problem.followUpQuestions,
          hints: problem.hints,
          // Additional fields based on type
          ...(problemType === 'dsa' && {
            category: problem.category,
            tags: problem.tags,
          }),
          ...(problemType === 'machine_coding' && {
            requirements: problem.hints, // Use hints as requirements for now
            acceptanceCriteria: problem.followUpQuestions, // Use followUpQuestions as acceptance criteria
            technologies: problem.tags,
          }),
          ...(problemType === 'system_design' && {
            functionalRequirements: problem.hints,
            nonFunctionalRequirements: problem.followUpQuestions,
            scale: {
              users: "1M daily active users",
              requestsPerSecond: "10,000 RPS",
              dataSize: "100TB",
            },
            expectedDeliverables: problem.tags,
          }),
          ...(problemType === 'theory_and_debugging' && {
            question: problem.problemStatement,
            expectedAnswer: problem.examples?.[0]?.output || "",
            keyPoints: problem.hints,
          }),
        },
        roundName: activeRoundInfo.name,
        roundType: problemsResponse.category,
      };
    });

    // Validate transformed problems with detailed logging
    console.log("Transformed problems sample:", transformedProblems[0]);
    const validationResults = logValidationResults(transformedProblems, validateSimulationProblem, "Problem Generation");
    const validatedProblems = validationResults.validProblems;

    if (validatedProblems.length === 0) {
      console.warn("No problems passed validation, using fallback problems");
      
      // Create fallback problems with basic structure
      const fallbackProblems: SimulationProblem[] = problemsResponse.problems.map((problem, index) => ({
        id: `fallback_problem_${index + 1}`,
        type: "machine_coding" as const,
        title: problem.title || `Problem ${index + 1}`,
        description: problem.description || "A coding problem to solve",
        difficulty: "medium" as const,
        estimatedTime: `${problem.estimatedTimeMinutes || 15} minutes`,
        content: {
          problemStatement: problem.problemStatement || problem.description || "Solve this problem",
          inputFormat: problem.inputFormat || "N/A",
          outputFormat: problem.outputFormat || "N/A",
          constraints: problem.constraints || [],
          examples: problem.examples || [],
          followUpQuestions: problem.followUpQuestions || [],
          hints: problem.hints || [],
          requirements: problem.hints || ["Implement the required functionality"],
          acceptanceCriteria: problem.followUpQuestions || ["Code should work correctly"],
          technologies: problem.tags || ["JavaScript", "React"],
        },
        roundName: activeRoundInfo.name,
        roundType: problemsResponse.category,
      }));
      
      console.log("Using fallback problems:", fallbackProblems.length);
      validatedProblems.push(...fallbackProblems);
    }

    // Save problems to interview_problems collection with proper schema
    const saveResult = await saveGeneratedProblemsToCollection(
      userId,
      validatedProblems,
      existingInterviewSession.companyName,
      roleLevel,
      activeRoundInfo.name,
      {
        interviewId: simulationId as string,
        roundNumber: currentRound + 1,
      }
    );

    console.log("Problem save result:", saveResult);

    if (saveResult.saved === 0) {
      return res.status(500).json({ 
        error: "Failed to save any problems",
        details: saveResult.errors 
      });
    }

    // Return the generated problems with save status
    return res.status(200).json({
      ...problemsResponse,
      saveResult,
      message: `Successfully generated and saved ${saveResult.saved} problems`,
    });

  } catch (error) {
    console.error("Error in start-interview:", error);
    return res.status(500).json({ 
      error: "Failed to start interview", 
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default withRequiredAuth(handler);
