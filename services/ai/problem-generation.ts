import { NextJSPromptManager } from '../../prompts/loader';
import { INTERVIEW_TYPE } from '../../enums';
import {
  GEMINI_ENDPOINT,
  getGeminiApiKey,
  getPromptVersion,
} from './gemini-config';
import {
  GenerateParams,
  GeneratedResult,
  isValidDSAProblem,
  isValidTheoryProblem,
  isValidMachineCodingProblem,
  isValidSystemDesignProblem,
} from '../../types/problem';

// Initialize prompt manager with latest version
const promptManager = new NextJSPromptManager(getPromptVersion());

export async function generateInterviewQuestions({
  designation,
  companies,
  round,
  interviewType,
}: GenerateParams): Promise<GeneratedResult> {
  let jsonSchemaPrompt = '';

  try {
    // Common variables for all prompt types
    const baseVariables = {
      designation,
      companies,
      round: String(round),
      experienceLevel: 'mid-level', // Default, could be parameterized
      difficulty: 'medium',
      estimatedTime: '30-45 minutes',
      category: 'Frontend',
      primaryTechnology: 'React',
      secondaryTechnology: 'TypeScript',
      technologyStack: 'React, TypeScript, CSS',
      focusAreas: 'JavaScript, React, CSS',
      primaryTag: 'frontend',
      secondaryTag: 'javascript',
      tertiaryTag: 'problem-solving',
      optimizationFocus: 'performance',
    };

    console.log('📋 Base variables prepared:', baseVariables);

    if (interviewType === INTERVIEW_TYPE.DSA) {
      console.log('🧮 Processing DSA problem prompt...');
      jsonSchemaPrompt = promptManager.processPrompt(
        'dsaProblem',
        baseVariables
      );
    } else if (interviewType === INTERVIEW_TYPE.THEORY) {
      console.log('📖 Processing theory problem prompt...');
      const theoryVariables = {
        ...baseVariables,
        estimatedTime: '15-30 minutes',
        alternativeTechnology: 'Vue.js',
      };
      jsonSchemaPrompt = promptManager.processPrompt(
        'theoryProblem',
        theoryVariables
      );
    } else if (interviewType === INTERVIEW_TYPE.MACHINE_CODING) {
      console.log('💻 Processing machine coding problem prompt...');
      const machineCodingVariables = {
        ...baseVariables,
        estimatedTime: '45-60 minutes',
        domainFocus: 'Frontend Development',
        applicationContext: 'web application',
        cssFramework: 'Tailwind CSS',
        interactivityFeature: 'real-time',
        restrictedLibrary: 'jQuery',
        performanceMetric: 'loading time < 3s',
        codingStandard: 'ESLint + Prettier',
        designPattern: 'Component composition',
        performanceFocus: 'render optimization',
      };
      jsonSchemaPrompt = promptManager.processPrompt(
        'machineCodingProblem',
        machineCodingVariables
      );
    } else if (interviewType === INTERVIEW_TYPE.SYSTEM_DESIGN) {
      console.log('🏗️ Processing system design problem prompt...');
      const systemDesignVariables = {
        ...baseVariables,
        estimatedTime: '60-90 minutes',
        systemType: 'web platform',
        useCase: 'user management',
        userScale: '100K users',
        dataVolume: '1TB',
        keyFeature1: 'authentication',
        keyFeature2: 'data visualization',
        availabilityRequirement: '99.9%',
        responseTime: '200ms',
        scalabilityRequirement: 'horizontal',
        securityRequirement: 'GDPR compliant',
        budgetConstraint: '$50K/month',
        technologyConstraint: 'Cloud-native',
        timelineConstraint: '6 months',
        rpsScale: '1000 RPS',
        dataModel: 'user profiles',
        apiStyle: 'REST API',
        backendTech: 'Node.js',
        databaseTech: 'PostgreSQL',
        cachingTech: 'Redis',
        scalingChallenge: 'database sharding',
        reliabilityConcern: 'data consistency',
      };
      jsonSchemaPrompt = promptManager.processPrompt(
        'systemDesignProblem',
        systemDesignVariables
      );
    } else {
      console.log('💻 Processing combined problem prompt...');
      // Combined machine coding and system design (fallback)
      const combinedVariables = {
        ...baseVariables,
        estimatedTime: '45-60 minutes',
        domainFocus: 'Frontend Development',
        applicationContext: 'web application',
        cssFramework: 'Tailwind CSS',
        interactivityFeature: 'real-time',
        restrictedLibrary: 'jQuery',
        performanceMetric: 'loading time < 3s',
        codingStandard: 'ESLint + Prettier',
        designPattern: 'Component composition',
        performanceFocus: 'render optimization',
        systemType: 'web platform',
        useCase: 'user management',
        userScale: '100K users',
        dataVolume: '1TB',
        keyFeature1: 'authentication',
        keyFeature2: 'data visualization',
        availabilityRequirement: '99.9%',
        responseTime: '200ms',
        scalabilityRequirement: 'horizontal',
        securityRequirement: 'GDPR compliant',
        budgetConstraint: '$50K/month',
        technologyConstraint: 'Cloud-native',
        timelineConstraint: '6 months',
        rpsScale: '1000 RPS',
        dataModel: 'user profiles',
        apiStyle: 'REST API',
        systemDesignTime: '60-90 minutes',
        backendTech: 'Node.js',
        databaseTech: 'PostgreSQL',
        cachingTech: 'Redis',
        scalingChallenge: 'database sharding',
        reliabilityConcern: 'data consistency',
      };
      jsonSchemaPrompt = promptManager.processPrompt(
        'combinedProblem',
        combinedVariables
      );
    }

    if (!jsonSchemaPrompt || jsonSchemaPrompt.length < 100) {
      throw new Error('Generated prompt is too short or empty');
    }
  } catch {
    // Fallback to a basic prompt if the prompt system fails
    jsonSchemaPrompt = `You are an expert interviewer for frontend developers. Create interview problems for a ${designation} at ${companies}, round ${round}. Focus on ${interviewType} type questions. Return only valid JSON.`;
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
    const apiKey = getGeminiApiKey();
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gemini API error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    console.log('📦 Raw API response structure:', {
      hasCandidates: !!data?.candidates,
      candidatesLength: data?.candidates?.length,
      hasContent: !!data?.candidates?.[0]?.content,
      hasParts: !!data?.candidates?.[0]?.content?.parts,
      partsLength: data?.candidates?.[0]?.content?.parts?.length,
    });

    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) {
      console.error('❌ Empty response from Gemini API');
      throw new Error('Empty response from AI service');
    }

    // Parse the JSON response
    let parsedResponse: ProblemSchema;
    try {
      // Extract JSON from the response (in case there's any extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('❌ No JSON found in response:', text);
        throw new Error('No valid JSON found in response');
      }

      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      throw new Error(
        `Invalid JSON response from AI service: ${
          parseError instanceof Error
            ? parseError.message
            : 'Unknown parsing error'
        }`
      );
    }

    // Validate only the specific problem type requested
    let validationPassed = true;
    let validationErrors: string[] = [];

    if (!parsedResponse.problem) {
      validationPassed = false;
      validationErrors.push('No problem field found in response');
      console.error('❌ No problem field in parsed response:', parsedResponse);
    } else {
      // Validate based on interview type
      switch (interviewType) {
        case INTERVIEW_TYPE.DSA:
          const isValidDSA = isValidDSAProblem(parsedResponse.problem);
          if (!isValidDSA) {
            validationPassed = false;
            validationErrors.push('DSA problem validation failed');
            console.error(
              '❌ DSA problem validation failed:',
              parsedResponse.problem
            );
          }
          break;

        case INTERVIEW_TYPE.THEORY:
          const isValidTheory = isValidTheoryProblem(parsedResponse.problem);
          if (!isValidTheory) {
            validationPassed = false;
            validationErrors.push('Theory problem validation failed');
            console.error(
              '❌ Theory problem validation failed:',
              parsedResponse.problem
            );
          }
          break;

        case INTERVIEW_TYPE.MACHINE_CODING:
          const isValidMachine = isValidMachineCodingProblem(
            parsedResponse.problem
          );
          if (!isValidMachine) {
            validationPassed = false;
            validationErrors.push('Machine coding problem validation failed');
            console.error(
              '❌ Machine coding problem validation failed:',
              parsedResponse.problem
            );
          }
          break;

        case INTERVIEW_TYPE.SYSTEM_DESIGN:
          const isValidSystem = isValidSystemDesignProblem(
            parsedResponse.problem
          );
          console.log('🏗️ System design problem validation:', isValidSystem);
          if (!isValidSystem) {
            validationPassed = false;
            validationErrors.push('System design problem validation failed');
            console.error(
              '❌ System design problem validation failed:',
              parsedResponse.problem
            );
          }
          break;

        default:
          // For combined problems, try to validate as any type
          const isValidAny =
            isValidDSAProblem(parsedResponse.problem) ||
            isValidTheoryProblem(parsedResponse.problem) ||
            isValidMachineCodingProblem(parsedResponse.problem) ||
            isValidSystemDesignProblem(parsedResponse.problem);
          if (!isValidAny) {
            validationPassed = false;
            validationErrors.push(
              'Combined problem validation failed - no valid problem type detected'
            );
            console.error(
              '❌ Combined problem validation failed:',
              parsedResponse.problem
            );
          }
          break;
      }
    }

    if (!validationPassed) {
      throw new Error(
        `Invalid problem structure in AI response: ${validationErrors.join(
          ', '
        )}`
      );
    }

    // Return unified problem structure for all interview types
    return {
      problem: JSON.stringify(parsedResponse.problem),
    };
  } catch (error) {
    console.error('Generate error', error);
    throw new Error('Failed to generate questions');
  }
}
