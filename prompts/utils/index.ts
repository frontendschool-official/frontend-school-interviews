/**
 * Prompt utilities exports
 * Centralized access to all prompt-related utilities
 */

// Core replacement utilities
export {
  replaceVariables,
  validateRequiredVariables,
  extractVariableNames,
  createDefaultVariableMap,
  processAdvancedTemplate,
  batchProcessTemplates,
  debugVariableReplacement,
  PromptVariableBuilder,
  type VariableMap,
  type PromptConfig,
} from './replacer';

// Prompt management utilities
export {
  PromptManager,
  ServerPromptManager,
  ClientPromptManager,
  StaticPromptManager,
  createPromptManager,
  promptManager,
  type PromptTemplate,
  type PromptVersion,
  type PromptType,
} from './promptManager';

// Convenience functions for common use cases
export { createInterviewPromptProcessor } from './interviewHelpers';

// Additional import for the utility function
import { replaceVariables as replaceVars } from './replacer';

/**
 * Quick utility to process a template with variables
 * @deprecated Use promptManager.processPrompt() for better version control
 */
export function quickReplaceTemplate(template: string, variables: Record<string, any>): string {
  return replaceVars(template, variables);
}

/**
 * Version information for the prompt system
 */
export const PROMPT_SYSTEM_VERSION = '1.0.0';
export const SUPPORTED_PROMPT_VERSIONS = ['1.0.0', '1.1.0'];
export const DEFAULT_PROMPT_VERSION = '1.1.0';