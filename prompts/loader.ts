/**
 * Server-side prompt loader for Next.js API routes
 * This file provides direct access to prompt data without file system calls
 */

import type { PromptVersion } from './utils/promptManager';

// Static prompt data store - inline to avoid JSON import issues
const PROMPT_DATA: Record<string, PromptVersion> = {
  '1.0.0': {
    version: '1.0.0',
    createdAt: '2024-01-01',
    description: 'Initial version of interview prompts with standardized templates',
    prompts: {
      dsaProblem: {
        template: 'You are an expert interviewer for frontend developers. Create one DSA (Data Structures and Algorithms) problem for a candidate applying as a ${designation} at ${companies}. This is round ${round}.\n\nIMPORTANT: You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanatory text before or after the JSON.\n\n{\n  "problem": {\n    "title": "Clear, concise title for the DSA problem",\n    "description": "Brief description of the problem context",\n    "problemStatement": "Detailed problem statement explaining what needs to be solved",\n    "inputFormat": "Description of input format and constraints",\n    "outputFormat": "Description of expected output format",\n    "constraints": [\n      "Constraint 1 (e.g., 1 <= n <= 10^5)",\n      "Constraint 2 (e.g., 1 <= arr[i] <= 10^9)"\n    ],\n    "examples": [\n      {\n        "input": "Example input 1",\n        "output": "Expected output 1",\n        "explanation": "Brief explanation of the example"\n      },\n      {\n        "input": "Example input 2", \n        "output": "Expected output 2",\n        "explanation": "Brief explanation of the example"\n      }\n    ],\n    "difficulty": "medium",\n    "estimatedTime": "30-45 minutes",\n    "category": "Arrays",\n    "tags": ["arrays", "two-pointers", "sorting"],\n    "hints": [\n      "Optional hint 1",\n      "Optional hint 2"\n    ],\n    "followUpQuestions": [\n      "How would you optimize this solution?",\n      "What if the input size was much larger?"\n    ]\n  }\n}\n\nMake sure the problem is appropriate for a ${designation} role at ${companies} and suitable for round ${round}. The difficulty should be challenging but achievable within the estimated time. Focus on problems that test algorithmic thinking and data structure knowledge relevant to frontend development.',
        variables: ['designation', 'companies', 'round'],
        description: 'Generates DSA problems for technical interviews'
      },
      theoryProblem: {
        template: 'You are an expert interviewer for frontend developers. Create one theory problem for a candidate applying as a ${designation} at ${companies}. This is round ${round}.\n\nIMPORTANT: You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanatory text before or after the JSON.\n\n{\n  "problem": {\n    "title": "Clear, concise title for the theory question",\n    "description": "Brief description of the concept being tested",\n    "question": "Detailed question that tests understanding of frontend concepts",\n    "expectedAnswer": "Expected answer points that should be covered",\n    "keyPoints": [\n      "Key point 1 that should be mentioned",\n      "Key point 2 that should be mentioned",\n      "Key point 3 that should be mentioned"\n    ],\n    "difficulty": "medium",\n    "estimatedTime": "15-30 minutes",\n    "category": "JavaScript/React/CSS/Web APIs",\n    "tags": ["javascript", "react", "frontend"],\n    "hints": [\n      "Optional hint 1",\n      "Optional hint 2"\n    ],\n    "followUpQuestions": [\n      "How would you optimize this?",\n      "What are the trade-offs?"\n    ]\n  }\n}\n\nMake sure the question is appropriate for a ${designation} role at ${companies} and suitable for round ${round}. Focus on JavaScript, React, CSS, Web APIs, or other frontend technologies.',
        variables: ['designation', 'companies', 'round'],
        description: 'Generates theory questions for frontend interviews'
      },
      machineCodingProblem: {
        template: 'You are an expert interviewer for frontend developers. Create one machine coding problem for a candidate applying as a ${designation} at ${companies}. This is round ${round}.\n\nIMPORTANT: You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanatory text before or after the JSON.\n\n{\n  "problem": {\n    "title": "Clear, concise title for the coding problem",\n    "description": "Detailed problem description explaining what needs to be built",\n    "requirements": [\n      "Specific requirement 1",\n      "Specific requirement 2",\n      "Specific requirement 3"\n    ],\n    "constraints": [\n      "Technical constraint 1",\n      "Technical constraint 2"\n    ],\n    "acceptanceCriteria": [\n      "Criterion 1 that must be met",\n      "Criterion 2 that must be met"\n    ],\n    "difficulty": "medium",\n    "estimatedTime": "45-60 minutes",\n    "technologies": ["React", "TypeScript", "CSS"],\n    "hints": [\n      "Optional hint 1",\n      "Optional hint 2"\n    ]\n  }\n}\n\nMake sure the problem is appropriate for a ${designation} role at ${companies} and suitable for round ${round}. Focus on building React components, state management, or common frontend features.',
        variables: ['designation', 'companies', 'round'],
        description: 'Generates machine coding problems for frontend interviews'
      },
      systemDesignProblem: {
        template: 'You are an expert interviewer for frontend developers. Create one system design problem for a candidate applying as a ${designation} at ${companies}. This is round ${round}.\n\nIMPORTANT: You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanatory text before or after the JSON.\n\n{\n  "problem": {\n    "title": "Clear, concise title for the system design problem",\n    "description": "Detailed problem description explaining the system to be designed",\n    "functionalRequirements": [\n      "Functional requirement 1",\n      "Functional requirement 2"\n    ],\n    "nonFunctionalRequirements": [\n      "Non-functional requirement 1 (performance, scalability, etc.)",\n      "Non-functional requirement 2"\n    ],\n    "constraints": [\n      "System constraint 1",\n      "System constraint 2"\n    ],\n    "scale": {\n      "users": "1M daily active users",\n      "requestsPerSecond": "10,000 RPS",\n      "dataSize": "100TB of data"\n    },\n    "expectedDeliverables": [\n      "High-level architecture diagram",\n      "Database schema design",\n      "API specifications"\n    ],\n    "difficulty": "medium",\n    "estimatedTime": "60-90 minutes",\n    "technologies": ["Microservices", "Redis", "PostgreSQL"],\n    "followUpQuestions": [\n      "How would you handle scaling?",\n      "What about data consistency?"\n    ]\n  }\n}\n\nMake sure the problem is appropriate for a ${designation} role at ${companies} and suitable for round ${round}. Focus on frontend architecture, component design, and state management patterns.',
        variables: ['designation', 'companies', 'round'],
        description: 'Generates system design problems for frontend interviews'
      },
      combinedProblem: {
        template: 'You are an expert interviewer for frontend developers. Create one machine coding problem and one system design problem for a candidate applying as a ${designation} at ${companies}. This is round ${round}.\n\nIMPORTANT: You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanatory text before or after the JSON.\n\n{\n  "problem": {\n    "title": "Clear, concise title for the combined problem",\n    "description": "Detailed problem description explaining what needs to be built and designed",\n    "requirements": [\n      "Specific requirement 1",\n      "Specific requirement 2",\n      "Specific requirement 3"\n    ],\n    "constraints": [\n      "Technical constraint 1",\n      "Technical constraint 2"\n    ],\n    "acceptanceCriteria": [\n      "Criterion 1 that must be met",\n      "Criterion 2 that must be met"\n    ],\n    "functionalRequirements": [\n      "Functional requirement 1",\n      "Functional requirement 2"\n    ],\n    "nonFunctionalRequirements": [\n      "Non-functional requirement 1 (performance, scalability, etc.)",\n      "Non-functional requirement 2"\n    ],\n    "scale": {\n      "users": "1M daily active users",\n      "requestsPerSecond": "10,000 RPS",\n      "dataSize": "100TB of data"\n    },\n    "expectedDeliverables": [\n      "High-level architecture diagram",\n      "Database schema design",\n      "API specifications"\n    ],\n    "difficulty": "medium",\n    "estimatedTime": "90-120 minutes",\n    "technologies": ["React", "TypeScript", "Microservices", "Redis", "PostgreSQL"],\n    "hints": [\n      "Optional hint 1",\n      "Optional hint 2"\n    ],\n    "followUpQuestions": [\n      "How would you handle scaling?",\n      "What about data consistency?"\n    ]\n  }\n}\n\nMake sure the problem is appropriate for a ${designation} role at ${companies} and suitable for round ${round}.',
        variables: ['designation', 'companies', 'round'],
        description: 'Generates combined machine coding and system design problems'
      },
      evaluateSubmission: {
        template: 'You are an expert technical interviewer evaluating a candidate\'s submission for a ${designation} position.\n\n${context}\n\nPlease provide a comprehensive evaluation covering:\n\n1. **Code Quality Assessment (30%)**\n   - Clean code principles\n   - Readability and maintainability\n   - Proper naming conventions\n   - Code organization and structure\n\n2. **Technical Implementation (40%)**\n   - Correctness of the solution\n   - Algorithm efficiency and optimization\n   - Use of appropriate data structures\n   - Error handling and edge cases\n   - Best practices for ${technology}\n\n3. **Problem-Solving Approach (20%)**\n   - Understanding of the problem\n   - Logical thinking process\n   - Creativity in solution approach\n   - Consideration of alternative solutions\n\n4. **Frontend-Specific Considerations (10%)**\n   - User experience considerations\n   - Performance implications\n   - Accessibility standards\n   - Modern frontend practices\n\nProvide specific feedback with examples from the code, suggest improvements, and give an overall score out of 10. Be constructive and detailed in your evaluation.',
        variables: ['designation', 'context', 'technology'],
        description: 'Evaluates candidate submissions with detailed feedback'
      }
    }
  },
  '1.1.0': {
    version: '1.1.0',
    createdAt: '2024-02-01',
    description: 'Enhanced version with improved templates and additional context variables',
    prompts: {
      dsaProblem: {
        template: 'You are an expert interviewer for frontend developers. Create one DSA (Data Structures and Algorithms) problem for a candidate applying as a ${designation} at ${companies}. This is round ${round}.\n\n**Interview Context:**\n- Position: ${designation}\n- Company: ${companies}\n- Round: ${round}\n- Experience Level: ${experienceLevel}\n- Focus Areas: ${focusAreas}\n\nIMPORTANT: You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanatory text before or after the JSON.\n\n{\n  "problem": {\n    "title": "Clear, concise title for the DSA problem",\n    "description": "Brief description of the problem context",\n    "problemStatement": "Detailed problem statement explaining what needs to be solved",\n    "inputFormat": "Description of input format and constraints",\n    "outputFormat": "Description of expected output format",\n    "constraints": [\n      "Constraint 1 (e.g., 1 <= n <= 10^5)",\n      "Constraint 2 (e.g., 1 <= arr[i] <= 10^9)"\n    ],\n    "examples": [\n      {\n        "input": "Example input 1",\n        "output": "Expected output 1",\n        "explanation": "Brief explanation of the example"\n      },\n      {\n        "input": "Example input 2", \n        "output": "Expected output 2",\n        "explanation": "Brief explanation of the example"\n      }\n    ],\n    "difficulty": "${difficulty}",\n    "estimatedTime": "${estimatedTime}",\n    "category": "${category}",\n    "tags": ["${primaryTag}", "${secondaryTag}", "${tertiaryTag}"],\n    "hints": [\n      "Contextual hint based on problem complexity",\n      "Performance optimization hint"\n    ],\n    "followUpQuestions": [\n      "How would you optimize this solution for ${optimizationFocus}?",\n      "What if the input constraints were different?"\n    ]\n  }\n}\n\nMake sure the problem is appropriate for a ${designation} role at ${companies} and suitable for round ${round}. Consider the candidate\'s ${experienceLevel} level when setting difficulty. Focus on ${focusAreas} relevant to frontend development.',
        variables: ['designation', 'companies', 'round', 'experienceLevel', 'focusAreas', 'difficulty', 'estimatedTime', 'category', 'primaryTag', 'secondaryTag', 'tertiaryTag', 'optimizationFocus'],
        description: 'Enhanced DSA problem generator with more context variables'
      },
      evaluateSubmission: {
        template: 'You are an expert technical interviewer evaluating a candidate\'s submission for a ${designation} position at ${companies}.\n\n**Submission Context:**\n- Position: ${designation}\n- Company: ${companies}\n- Problem Type: ${problemType}\n- Technology Used: ${technology}\n- Experience Level: ${experienceLevel}\n- Time Allocated: ${timeAllocated}\n- Time Taken: ${timeTaken}\n\n**Submission Details:**\n${context}\n\n**Evaluation Framework:**\n\nPlease provide a comprehensive evaluation using the following weighted criteria:\n\n1. **Code Quality Assessment (30%)**\n   - Clean code principles and SOLID principles\n   - Readability and maintainability\n   - Proper naming conventions and code organization\n   - Documentation and comments quality\n   - ${codeQualityFocus} specific standards\n\n2. **Technical Implementation (40%)**\n   - Correctness and completeness of the solution\n   - Algorithm efficiency (time and space complexity)\n   - Use of appropriate data structures and design patterns\n   - Error handling and edge case coverage\n   - ${technology} best practices and modern features\n   - Security considerations\n\n3. **Problem-Solving Approach (20%)**\n   - Understanding and interpretation of requirements\n   - Logical thinking process and solution strategy\n   - Creativity and innovation in approach\n   - Consideration of alternative solutions\n   - Debugging and troubleshooting skills\n\n4. **Frontend-Specific Excellence (10%)**\n   - User experience and interface design\n   - Performance optimization and bundle size\n   - Accessibility standards (WCAG 2.1)\n   - Cross-browser compatibility\n   - Mobile responsiveness\n   - ${frontendFocus} considerations\n\n**Scoring Guidelines:**\n- 9-10: Exceptional (Exceeds expectations for ${experienceLevel})\n- 7-8: Strong (Meets expectations with some excellence)\n- 5-6: Adequate (Basic requirements met)\n- 3-4: Below Average (Significant gaps)\n- 1-2: Poor (Major issues)\n\n**Output Format:**\nProvide specific feedback with code examples, suggest concrete improvements, and give an overall score out of 10. Include comparison to ${experienceLevel} standards and mention readiness for ${companies} standards.\n\n**Additional Considerations:**\n- Time efficiency (completed in ${timeTaken} vs allocated ${timeAllocated})\n- Code scalability for ${scalabilityContext}\n- Alignment with ${companyTechStack} technology stack',
        variables: ['designation', 'companies', 'problemType', 'technology', 'experienceLevel', 'timeAllocated', 'timeTaken', 'context', 'codeQualityFocus', 'frontendFocus', 'scalabilityContext', 'companyTechStack'],
        description: 'Comprehensive evaluation template with detailed scoring framework'
      },
      theoryProblem: {
        template: 'You are an expert interviewer for frontend developers. Create one theory problem for a candidate applying as a ${designation} at ${companies}. This is round ${round}.\n\n**Interview Context:**\n- Position: ${designation}\n- Company: ${companies}\n- Round: ${round}\n- Experience Level: ${experienceLevel}\n- Technology Stack: ${technologyStack}\n- Focus Areas: ${focusAreas}\n\nIMPORTANT: You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanatory text before or after the JSON.\n\n{\n  "problem": {\n    "title": "Clear, concise title for the theory question",\n    "description": "Brief description of the concept being tested",\n    "question": "Detailed question that tests understanding of ${primaryTechnology} concepts",\n    "expectedAnswer": "Expected answer points that should be covered for ${experienceLevel} level",\n    "keyPoints": [\n      "Key point 1 relevant to ${primaryTechnology}",\n      "Key point 2 about ${secondaryTechnology}",\n      "Key point 3 considering ${experienceLevel} expertise"\n    ],\n    "difficulty": "${difficulty}",\n    "estimatedTime": "${estimatedTime}",\n    "category": "${category}",\n    "tags": ["${primaryTechnology}", "${secondaryTechnology}", "frontend"],\n    "hints": [\n      "Consider ${primaryTechnology} best practices",\n      "Think about performance implications"\n    ],\n    "followUpQuestions": [\n      "How would you implement this in ${primaryTechnology}?",\n      "What are the trade-offs compared to ${alternativeTechnology}?"\n    ]\n  }\n}\n\nMake sure the question is appropriate for a ${designation} role at ${companies} and suitable for round ${round}. Focus on ${technologyStack} technologies and consider the candidate\'s ${experienceLevel} level.',
        variables: ['designation', 'companies', 'round', 'experienceLevel', 'technologyStack', 'focusAreas', 'primaryTechnology', 'secondaryTechnology', 'difficulty', 'estimatedTime', 'category', 'alternativeTechnology'],
        description: 'Enhanced theory problem generator with technology-specific focus'
      },
      machineCodingProblem: {
        template: 'You are an expert interviewer for frontend developers. Create one machine coding problem for a candidate applying as a ${designation} at ${companies}. This is round ${round}.\n\n**Interview Context:**\n- Position: ${designation}\n- Company: ${companies}\n- Round: ${round}\n- Experience Level: ${experienceLevel}\n- Technology Stack: ${technologyStack}\n- Domain Focus: ${domainFocus}\n\nIMPORTANT: You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanatory text before or after the JSON.\n\n{\n  "problem": {\n    "title": "${domainFocus}-focused coding challenge",\n    "description": "Build a ${applicationContext} using ${primaryTechnology}",\n    "requirements": [\n      "Implement core functionality using ${primaryTechnology}",\n      "Ensure responsive design with ${cssFramework}",\n      "Add ${interactivityFeature} features",\n      "Include proper error handling"\n    ],\n    "constraints": [\n      "Use ${primaryTechnology} and ${secondaryTechnology}",\n      "No external ${restrictedLibrary} libraries",\n      "Must be accessible (WCAG 2.1 AA)",\n      "Performance budget: ${performanceMetric}"\n    ],\n    "acceptanceCriteria": [\n      "All requirements implemented correctly",\n      "Code follows ${codingStandard} standards",\n      "Responsive across device sizes",\n      "Proper state management"\n    ],\n    "difficulty": "${difficulty}",\n    "estimatedTime": "${estimatedTime}",\n    "technologies": ["${primaryTechnology}", "${secondaryTechnology}", "${cssFramework}"],\n    "hints": [\n      "Consider using ${designPattern} pattern",\n      "Optimize for ${performanceFocus}"\n    ]\n  }\n}\n\nMake sure the problem is appropriate for a ${designation} role at ${companies} and suitable for round ${round}. Focus on building React components, state management, or common frontend features.',
        variables: ['designation', 'companies', 'round', 'experienceLevel', 'technologyStack', 'domainFocus', 'applicationContext', 'primaryTechnology', 'secondaryTechnology', 'cssFramework', 'interactivityFeature', 'restrictedLibrary', 'performanceMetric', 'codingStandard', 'difficulty', 'estimatedTime', 'designPattern', 'performanceFocus'],
        description: 'Enhanced machine coding problem generator with comprehensive context variables'
      },
      systemDesignProblem: {
        template: 'You are an expert interviewer for frontend developers. Create one system design problem for a candidate applying as a ${designation} at ${companies}. This is round ${round}.\n\n**Interview Context:**\n- Position: ${designation}\n- Company: ${companies}\n- Round: ${round}\n- Experience Level: ${experienceLevel}\n- Technology Stack: ${technologyStack}\n- Domain Focus: ${domainFocus}\n\nIMPORTANT: You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanatory text before or after the JSON.\n\n{\n  "problem": {\n    "title": "${systemType} Architecture Design",\n    "description": "Design a scalable ${systemType} for ${useCase}",\n    "functionalRequirements": [\n      "Support ${userScale} concurrent users",\n      "Handle ${dataVolume} of data",\n      "Provide ${keyFeature1} functionality",\n      "Enable ${keyFeature2} capabilities"\n    ],\n    "nonFunctionalRequirements": [\n      "${availabilityRequirement} availability",\n      "Response time < ${responseTime}",\n      "Support ${scalabilityRequirement} scaling",\n      "Ensure ${securityRequirement} security"\n    ],\n    "constraints": [\n      "Budget: ${budgetConstraint}",\n      "Technology: ${technologyConstraint}",\n      "Timeline: ${timelineConstraint}"\n    ],\n    "scale": {\n      "users": "${userScale}",\n      "requestsPerSecond": "${rpsScale}",\n      "dataSize": "${dataVolume}"\n    },\n    "expectedDeliverables": [\n      "High-level architecture diagram",\n      "Database design for ${dataModel}",\n      "API specifications for ${apiStyle}",\n      "Deployment strategy"\n    ],\n    "difficulty": "${difficulty}",\n    "estimatedTime": "${systemDesignTime}",\n    "technologies": ["${backendTech}", "${databaseTech}", "${cachingTech}"],\n    "followUpQuestions": [\n      "How would you handle ${scalingChallenge}?",\n      "What about ${reliabilityConcern}?"\n    ]\n  }\n}\n\nMake sure the problem is appropriate for a ${designation} role at ${companies} and suitable for round ${round}. Focus on frontend architecture, component design, and state management patterns.',
        variables: ['designation', 'companies', 'round', 'experienceLevel', 'technologyStack', 'domainFocus', 'systemType', 'useCase', 'userScale', 'dataVolume', 'keyFeature1', 'keyFeature2', 'availabilityRequirement', 'responseTime', 'scalabilityRequirement', 'securityRequirement', 'budgetConstraint', 'technologyConstraint', 'timelineConstraint', 'rpsScale', 'dataModel', 'apiStyle', 'systemDesignTime', 'backendTech', 'databaseTech', 'cachingTech', 'scalingChallenge', 'reliabilityConcern'],
        description: 'Enhanced system design problem generator with comprehensive context variables'
      },
      combinedProblem: {
        template: 'You are an expert interviewer for frontend developers. Create one combined machine coding and system design problem for a candidate applying as a ${designation} at ${companies}. This is round ${round}.\n\n**Interview Context:**\n- Position: ${designation}\n- Company: ${companies}\n- Round: ${round}\n- Experience Level: ${experienceLevel}\n- Technology Stack: ${technologyStack}\n- Domain Focus: ${domainFocus}\n\nIMPORTANT: You must respond with ONLY a valid JSON object that follows this exact schema structure. Do not include any explanatory text before or after the JSON.\n\n{\n  "problem": {\n    "title": "${domainFocus}-focused combined challenge",\n    "description": "Build a ${applicationContext} using ${primaryTechnology} and design its architecture",\n    "requirements": [\n      "Implement core functionality using ${primaryTechnology}",\n      "Ensure responsive design with ${cssFramework}",\n      "Add ${interactivityFeature} features",\n      "Include proper error handling"\n    ],\n    "constraints": [\n      "Use ${primaryTechnology} and ${secondaryTechnology}",\n      "No external ${restrictedLibrary} libraries",\n      "Must be accessible (WCAG 2.1 AA)",\n      "Performance budget: ${performanceMetric}"\n    ],\n    "acceptanceCriteria": [\n      "All requirements implemented correctly",\n      "Code follows ${codingStandard} standards",\n      "Responsive across device sizes",\n      "Proper state management"\n    ],\n    "functionalRequirements": [\n      "Support ${userScale} concurrent users",\n      "Handle ${dataVolume} of data",\n      "Provide ${keyFeature1} functionality",\n      "Enable ${keyFeature2} capabilities"\n    ],\n    "nonFunctionalRequirements": [\n      "${availabilityRequirement} availability",\n      "Response time < ${responseTime}",\n      "Support ${scalabilityRequirement} scaling",\n      "Ensure ${securityRequirement} security"\n    ],\n    "scale": {\n      "users": "${userScale}",\n      "requestsPerSecond": "${rpsScale}",\n      "dataSize": "${dataVolume}"\n    },\n    "expectedDeliverables": [\n      "High-level architecture diagram",\n      "Database design for ${dataModel}",\n      "API specifications for ${apiStyle}",\n      "Deployment strategy"\n    ],\n    "difficulty": "${difficulty}",\n    "estimatedTime": "90-120 minutes",\n    "technologies": ["${primaryTechnology}", "${secondaryTechnology}", "${cssFramework}", "${backendTech}", "${databaseTech}", "${cachingTech}"],\n    "hints": [\n      "Consider using ${designPattern} pattern",\n      "Optimize for ${performanceFocus}"\n    ],\n    "followUpQuestions": [\n      "How would you handle ${scalingChallenge}?",\n      "What about ${reliabilityConcern}?"\n    ]\n  }\n}\n\nEnsure the problem is appropriate for a ${designation} role at ${companies}, suitable for round ${round}, and match the ${experienceLevel} level. Focus on ${domainFocus} domain expertise.',
        variables: ['designation', 'companies', 'round', 'experienceLevel', 'technologyStack', 'domainFocus', 'applicationContext', 'primaryTechnology', 'secondaryTechnology', 'cssFramework', 'interactivityFeature', 'restrictedLibrary', 'performanceMetric', 'codingStandard', 'difficulty', 'estimatedTime', 'designPattern', 'performanceFocus', 'systemType', 'useCase', 'userScale', 'dataVolume', 'keyFeature1', 'keyFeature2', 'availabilityRequirement', 'responseTime', 'scalabilityRequirement', 'securityRequirement', 'budgetConstraint', 'technologyConstraint', 'timelineConstraint', 'rpsScale', 'dataModel', 'apiStyle', 'systemDesignTime', 'backendTech', 'databaseTech', 'cachingTech', 'scalingChallenge', 'reliabilityConcern'],
        description: 'Enhanced combined problem generator with comprehensive context variables'
      },
      mockInterviewProblem: {
        template: 'You are creating a realistic mock interview problem for a ${designation} applying to ${companies}. This is a ${interviewType} question designed for ${difficulty} difficulty level.\n\n**Mock Interview Setup:**\n- Position: ${designation}\n- Target Company: ${companies}\n- Interview Type: ${interviewType}\n- Difficulty Level: ${difficulty}\n- Experience Level: ${experienceLevel}\n- Duration: ${duration}\n- Focus Areas: ${focusAreas}\n\n**Company Context:**\n${companyContext}\n\n**Additional Context:**\n${additionalContext}\n\nGenerate a realistic interview problem that matches ${companies} standards and tests ${focusAreas} skills appropriate for ${experienceLevel} candidates.',
        variables: ['designation', 'companies', 'interviewType', 'difficulty', 'experienceLevel', 'duration', 'focusAreas', 'companyContext', 'additionalContext'],
        description: 'Realistic mock interview problem generator with company-specific context'
      },
      mockInterviewEvaluation: {
        template: 'You are evaluating a mock interview submission for a ${designation} position at ${companies}.\n\n**Interview Session Details:**\n- Position: ${designation}\n- Target Company: ${companies}\n- Problem: ${problemTitle}\n- Interview Type: ${interviewType}\n- Duration: ${duration}\n- Candidate Experience: ${experienceLevel}\n\n**Problem Statement:**\n${problemStatement}\n\n**Candidate\'s Complete Response:**\n${candidateResponse}\n\n**Performance Observations:**\n- Time Management: ${timeManagement}\n- Communication Style: ${communicationStyle}\n- Problem-Solving Process: ${problemSolvingProcess}\n\n**Evaluation Criteria:**\n${evaluationCriteria}\n\nProvide detailed feedback structured as follows:\n1. Technical Excellence (40%)\n2. Problem-Solving Skills (25%)\n3. Communication & Collaboration (20%)\n4. ${companies}-Specific Readiness (15%)\n\nInclude specific examples, actionable feedback, and an overall score out of 10.',
        variables: ['designation', 'companies', 'problemTitle', 'interviewType', 'duration', 'experienceLevel', 'problemStatement', 'candidateResponse', 'timeManagement', 'communicationStyle', 'problemSolvingProcess', 'evaluationCriteria'],
        description: 'Comprehensive mock interview evaluation with company-specific readiness assessment'
      }
    }
  }
};

/**
 * Synchronously gets prompt data for a specific version
 * This is safe to use in serverless environments
 */
export function getPromptData(version: string): PromptVersion | null {
  return PROMPT_DATA[version] || null;
}

/**
 * Gets all available prompt versions
 */
export function getAvailableVersions(): string[] {
  return Object.keys(PROMPT_DATA);
}

/**
 * Gets the latest prompt version
 */
export function getLatestVersion(): string {
  const versions = getAvailableVersions();
  return versions[versions.length - 1] || '1.1.0';
}

/**
 * Server-optimized prompt manager for Next.js
 */
export class NextJSPromptManager {
  private currentVersion: string;

  constructor(version?: string) {
    this.currentVersion = version || getLatestVersion();
  }

  setVersion(version: string): void {
    if (!PROMPT_DATA[version]) {
      throw new Error(`Prompt version ${version} not available`);
    }
    this.currentVersion = version;
  }

  getCurrentVersion(): string {
    return this.currentVersion;
  }

  getPrompt(type: string, version?: string): any {
    const targetVersion = version || this.currentVersion;
    const promptData = getPromptData(targetVersion);
    
    if (!promptData) {
      throw new Error(`Prompt version ${targetVersion} not found`);
    }

    if (!promptData.prompts[type]) {
      throw new Error(`Prompt type '${type}' not found in version ${targetVersion}`);
    }

    return promptData.prompts[type];
  }

  processPrompt(type: string, variables: Record<string, any>, version?: string): string {
    const prompt = this.getPrompt(type, version);
    return this.replaceVariables(prompt.template, variables);
  }

  private replaceVariables(template: string, variables: Record<string, any>): string {
    return template.replace(/\$\{([^}]+)\}/g, (match, varName) => {
      const trimmedName = varName.trim();
      return variables[trimmedName] !== undefined ? String(variables[trimmedName]) : match;
    });
  }

  getRequiredVariables(type: string, version?: string): string[] {
    const prompt = this.getPrompt(type, version);
    return prompt.variables || [];
  }
}