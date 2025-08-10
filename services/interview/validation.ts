import { SimulationProblem } from "../../types/problem";

/**
 * Validate that a problem has all required fields for the interview_problems collection
 */
export function validateInterviewProblem(problem: any): boolean {
  // Basic required fields
  const requiredFields = ['title', 'type', 'difficulty', 'company', 'role', 'userId'];
  
  for (const field of requiredFields) {
    if (!problem[field]) {
      console.warn(`Interview problem validation failed: missing ${field}`);
      return false;
    }
  }

  // Validate type
  const validTypes = ['machine_coding', 'dsa', 'system_design', 'js_concepts'];
  if (!validTypes.includes(problem.type)) {
    console.warn(`Interview problem validation failed: invalid type ${problem.type}`);
    return false;
  }

  // Validate difficulty
  const validDifficulties = ['easy', 'medium', 'hard'];
  if (!validDifficulties.includes(problem.difficulty)) {
    console.warn(`Interview problem validation failed: invalid difficulty ${problem.difficulty}`);
    return false;
  }

  // Validate problem object structure
  if (!problem.problem || typeof problem.problem !== 'object') {
    console.warn('Interview problem validation failed: missing or invalid problem object');
    return false;
  }

  const problemObj = problem.problem;
  const requiredProblemFields = ['description', 'input_format', 'output_format', 'constraints', 'sample_input', 'sample_output'];
  
  for (const field of requiredProblemFields) {
    if (problemObj[field] === undefined || problemObj[field] === null) {
      console.warn(`Interview problem validation failed: missing problem.${field}`);
      return false;
    }
  }

  return true;
}

/**
 * Validate SimulationProblem before transformation
 */
export function validateSimulationProblem(problem: SimulationProblem): boolean {
  // Required fields for all problem types
  const requiredFields = ['id', 'title', 'description', 'difficulty', 'type', 'estimatedTime', 'content'];
  
  for (const field of requiredFields) {
    if (!problem[field as keyof SimulationProblem]) {
      console.warn(`Simulation problem validation failed: missing ${field}`);
      return false;
    }
  }

  // Validate type
  const validTypes = ['dsa', 'machine_coding', 'system_design', 'theory_and_debugging'];
  if (!validTypes.includes(problem.type)) {
    console.warn(`Simulation problem validation failed: invalid type ${problem.type}`);
    return false;
  }

  // Validate difficulty
  const validDifficulties = ['easy', 'medium', 'hard'];
  if (!validDifficulties.includes(problem.difficulty)) {
    console.warn(`Simulation problem validation failed: invalid difficulty ${problem.difficulty}`);
    return false;
  }

  // Type-specific validation
  return validateSimulationProblemContent(problem);
}

/**
 * Validate SimulationProblem content based on type
 */
function validateSimulationProblemContent(problem: SimulationProblem): boolean {
  const content = problem.content as any;

  switch (problem.type) {
    case 'dsa':
      return validateDSAContent(content);
    case 'machine_coding':
      return validateMachineCodingContent(content);
    case 'system_design':
      return validateSystemDesignContent(content);
    case 'theory_and_debugging':
      return validateTheoryContent(content);
    default:
      console.warn(`Simulation problem validation failed: unknown type ${problem.type}`);
      return false;
  }
}

function validateDSAContent(content: any): boolean {
  const required = ['problemStatement', 'inputFormat', 'outputFormat', 'examples'];
  
  for (const field of required) {
    if (!content?.[field]) {
      console.warn(`DSA content validation failed: missing ${field}`);
      return false;
    }
  }

  if (!Array.isArray(content.examples) || content.examples.length === 0) {
    console.warn('DSA content validation failed: examples must be a non-empty array');
    return false;
  }

  return true;
}

function validateMachineCodingContent(content: any): boolean {
  // For machine coding, we'll be more lenient since the generated content might use different field names
  const hasRequirements = Array.isArray(content?.requirements) && content.requirements.length > 0;
  const hasAcceptanceCriteria = Array.isArray(content?.acceptanceCriteria) && content.acceptanceCriteria.length > 0;
  const hasTechnologies = Array.isArray(content?.technologies) && content.technologies.length > 0;
  
  // At least one of these should be present
  if (!hasRequirements && !hasAcceptanceCriteria && !hasTechnologies) {
    console.warn('Machine coding content validation failed: missing requirements, acceptanceCriteria, or technologies');
    return false;
  }

  return true;
}

function validateSystemDesignContent(content: any): boolean {
  // For system design, we'll be more lenient since the generated content might use different field names
  const hasFunctionalRequirements = Array.isArray(content?.functionalRequirements) && content.functionalRequirements.length > 0;
  const hasNonFunctionalRequirements = Array.isArray(content?.nonFunctionalRequirements) && content.nonFunctionalRequirements.length > 0;
  const hasScale = content?.scale && typeof content.scale === 'object';
  const hasExpectedDeliverables = Array.isArray(content?.expectedDeliverables) && content.expectedDeliverables.length > 0;
  
  // At least two of these should be present
  const validFields = [hasFunctionalRequirements, hasNonFunctionalRequirements, hasScale, hasExpectedDeliverables].filter(Boolean);
  if (validFields.length < 2) {
    console.warn('System design content validation failed: insufficient required fields');
    return false;
  }

  return true;
}

function validateTheoryContent(content: any): boolean {
  // For theory problems, we'll be more lenient since the generated content might use different field names
  const hasQuestion = content?.question && typeof content.question === 'string' && content.question.trim().length > 0;
  const hasExpectedAnswer = content?.expectedAnswer && typeof content.expectedAnswer === 'string' && content.expectedAnswer.trim().length > 0;
  const hasKeyPoints = Array.isArray(content?.keyPoints) && content.keyPoints.length > 0;
  
  // At least two of these should be present
  const validFields = [hasQuestion, hasExpectedAnswer, hasKeyPoints].filter(Boolean);
  if (validFields.length < 2) {
    console.warn('Theory content validation failed: insufficient required fields');
    return false;
  }

  return true;
}

/**
 * Log validation results for debugging
 */
export function logValidationResults(problems: any[], validationFunction: (problem: any) => boolean, context: string) {
  console.log(`\n=== ${context} Validation Results ===`);
  console.log(`Total problems: ${problems.length}`);
  
  const validProblems = problems.filter(validationFunction);
  const invalidProblems = problems.filter(p => !validationFunction(p));
  
  console.log(`Valid problems: ${validProblems.length}`);
  console.log(`Invalid problems: ${invalidProblems.length}`);
  
  if (invalidProblems.length > 0) {
    console.log('Invalid problems:');
    invalidProblems.forEach((problem, index) => {
      console.log(`  ${index + 1}. ${problem.title || 'Untitled'} (${problem.type || 'unknown type'})`);
    });
  }
  
  console.log('================================\n');
  
  return {
    total: problems.length,
    valid: validProblems.length,
    invalid: invalidProblems.length,
    validProblems,
    invalidProblems,
  };
} 