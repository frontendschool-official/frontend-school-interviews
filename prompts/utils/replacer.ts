/**
 * Utility functions for processing prompt templates with variable replacement
 */

/**
 * Interface for variable replacement values
 */
export interface VariableMap {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Configuration for prompt processing
 */
export interface PromptConfig {
  strict?: boolean; // If true, throws error for missing variables
  defaultValue?: string; // Default value for missing variables
  preserveUnknown?: boolean; // If true, keeps ${unknown} as-is
}

/**
 * Default configuration for prompt processing
 */
const DEFAULT_CONFIG: PromptConfig = {
  strict: false,
  defaultValue: '',
  preserveUnknown: false,
};

/**
 * Replaces ${identifier} placeholders in a template string with provided values
 * 
 * @param template - The template string containing ${variable} placeholders
 * @param variables - Object containing variable values
 * @param config - Configuration options for replacement behavior
 * @returns Processed template string with variables replaced
 * 
 * @example
 * ```typescript
 * const template = "Hello ${name}, you are applying for ${position} at ${company}";
 * const variables = { name: "John", position: "Frontend Developer", company: "Google" };
 * const result = replaceVariables(template, variables);
 * // Returns: "Hello John, you are applying for Frontend Developer at Google"
 * ```
 */
export function replaceVariables(
  template: string,
  variables: VariableMap,
  config: PromptConfig = {}
): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Regular expression to match ${variable} patterns
  const variableRegex = /\$\{([^}]+)\}/g;
  
  return template.replace(variableRegex, (match, variableName) => {
    const trimmedName = variableName.trim();
    
    // Check if variable exists in the provided map
    if (trimmedName in variables) {
      const value = variables[trimmedName];
      return value !== undefined ? String(value) : finalConfig.defaultValue!;
    }
    
    // Handle missing variables based on configuration
    if (finalConfig.strict) {
      throw new Error(`Missing required variable: ${trimmedName}`);
    }
    
    if (finalConfig.preserveUnknown) {
      return match; // Keep ${variable} as-is
    }
    
    return finalConfig.defaultValue!;
  });
}

/**
 * Validates that all required variables are present in the variable map
 * 
 * @param template - Template string to analyze
 * @param variables - Variable map to validate against
 * @returns Array of missing variable names
 */
export function validateRequiredVariables(
  template: string,
  variables: VariableMap
): string[] {
  const variableRegex = /\$\{([^}]+)\}/g;
  const requiredVariables = new Set<string>();
  const missingVariables: string[] = [];
  
  let match;
  while ((match = variableRegex.exec(template)) !== null) {
    const variableName = match[1].trim();
    requiredVariables.add(variableName);
  }
  
  requiredVariables.forEach(varName => {
    if (!(varName in variables) || variables[varName] === undefined) {
      missingVariables.push(varName);
    }
  });
  
  return missingVariables;
}

/**
 * Extracts all variable names from a template string
 * 
 * @param template - Template string to analyze
 * @returns Array of unique variable names found in the template
 */
export function extractVariableNames(template: string): string[] {
  const variableRegex = /\$\{([^}]+)\}/g;
  const variables = new Set<string>();
  
  let match;
  while ((match = variableRegex.exec(template)) !== null) {
    variables.add(match[1].trim());
  }
  
  return Array.from(variables);
}

/**
 * Creates a variable map with default values for common interview parameters
 * 
 * @param overrides - Values to override defaults
 * @returns Variable map with common defaults
 */
export function createDefaultVariableMap(overrides: Partial<VariableMap> = {}): VariableMap {
  const defaults: VariableMap = {
    designation: 'Frontend Developer',
    companies: 'Tech Company',
    round: '1',
    experienceLevel: 'mid-level',
    difficulty: 'medium',
    estimatedTime: '30-45 minutes',
    category: 'Frontend',
    primaryTechnology: 'React',
    secondaryTechnology: 'TypeScript',
    technologyStack: 'React, TypeScript, CSS',
    focusAreas: 'JavaScript, React, CSS',
    interviewType: 'technical',
    duration: '60 minutes',
    problemType: 'coding',
    technology: 'JavaScript',
    timeAllocated: '45 minutes',
    timeTaken: '40 minutes',
  };
  
  return { ...defaults, ...overrides };
}

/**
 * Advanced template processor with conditional logic support
 * Supports basic conditional statements like ${condition ? value1 : value2}
 * 
 * @param template - Template with potential conditional logic
 * @param variables - Variable map
 * @returns Processed template
 */
export function processAdvancedTemplate(
  template: string,
  variables: VariableMap
): string {
  // First, handle simple variable replacement
  let processed = replaceVariables(template, variables);
  
  // Handle conditional expressions ${condition ? value1 : value2}
  const conditionalRegex = /\$\{([^}]+)\s*\?\s*([^:}]+)\s*:\s*([^}]+)\}/g;
  
  processed = processed.replace(conditionalRegex, (match, condition, trueValue, falseValue) => {
    const conditionKey = condition.trim();
    const conditionValue = variables[conditionKey];
    
    // Simple boolean evaluation
    if (conditionValue && String(conditionValue).toLowerCase() !== 'false') {
      return trueValue.trim();
    } else {
      return falseValue.trim();
    }
  });
  
  return processed;
}

/**
 * Batch processes multiple templates with the same variable set
 * 
 * @param templates - Object with template names as keys and template strings as values
 * @param variables - Variable map to apply to all templates
 * @param config - Configuration for processing
 * @returns Object with processed templates
 */
export function batchProcessTemplates(
  templates: Record<string, string>,
  variables: VariableMap,
  config: PromptConfig = {}
): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, template] of Object.entries(templates)) {
    result[key] = replaceVariables(template, variables, config);
  }
  
  return result;
}

/**
 * Type-safe variable builder for common prompt scenarios
 */
export class PromptVariableBuilder {
  private variables: VariableMap = {};
  
  /**
   * Sets interview context variables
   */
  setInterviewContext(context: {
    designation: string;
    companies: string;
    round: number;
    experienceLevel?: string;
  }): this {
    this.variables.designation = context.designation;
    this.variables.companies = context.companies;
    this.variables.round = String(context.round);
    this.variables.experienceLevel = context.experienceLevel || 'mid-level';
    return this;
  }
  
  /**
   * Sets technology-related variables
   */
  setTechnology(tech: {
    primaryTechnology: string;
    secondaryTechnology?: string;
    technologyStack?: string;
    cssFramework?: string;
  }): this {
    this.variables.primaryTechnology = tech.primaryTechnology;
    if (tech.secondaryTechnology) this.variables.secondaryTechnology = tech.secondaryTechnology;
    if (tech.technologyStack) this.variables.technologyStack = tech.technologyStack;
    if (tech.cssFramework) this.variables.cssFramework = tech.cssFramework;
    return this;
  }
  
  /**
   * Sets problem configuration variables
   */
  setProblemConfig(config: {
    difficulty?: string;
    estimatedTime?: string;
    category?: string;
    interviewType?: string;
  }): this {
    if (config.difficulty) this.variables.difficulty = config.difficulty;
    if (config.estimatedTime) this.variables.estimatedTime = config.estimatedTime;
    if (config.category) this.variables.category = config.category;
    if (config.interviewType) this.variables.interviewType = config.interviewType;
    return this;
  }
  
  /**
   * Sets custom variables
   */
  setCustom(customVars: VariableMap): this {
    Object.assign(this.variables, customVars);
    return this;
  }
  
  /**
   * Builds and returns the final variable map
   */
  build(): VariableMap {
    return { ...this.variables };
  }
}

/**
 * Utility for logging variable replacements during development
 */
export function debugVariableReplacement(
  template: string,
  variables: VariableMap,
  enableLogging = false
): string {
  if (!enableLogging) {
    return replaceVariables(template, variables);
  }
  
  const extractedVars = extractVariableNames(template);
  const missingVars = validateRequiredVariables(template, variables);
  
  console.log('🔧 Template Variable Debug:');
  console.log('📝 Extracted variables:', extractedVars);
  console.log('✅ Provided variables:', Object.keys(variables));
  console.log('❌ Missing variables:', missingVars);
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Some variables are missing and will use default values');
  }
  
  const result = replaceVariables(template, variables);
  console.log('🎯 Template processing complete');
  
  return result;
}