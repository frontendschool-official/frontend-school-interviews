/**
 * Prompt management system for loading and processing versioned prompts
 */

import { replaceVariables, VariableMap, PromptConfig } from './replacer';

/**
 * Structure of a prompt template
 */
export interface PromptTemplate {
  template: string;
  variables: string[];
  description: string;
}

/**
 * Structure of a prompt version file
 */
export interface PromptVersion {
  version: string;
  createdAt: string;
  description: string;
  prompts: Record<string, PromptTemplate>;
}

/**
 * Available prompt types
 */
export type PromptType = 
  | 'dsaProblem'
  | 'theoryProblem' 
  | 'machineCodingProblem'
  | 'systemDesignProblem'
  // | 'combinedProblem'
  | 'evaluateSubmission'
  | 'mockInterviewProblem'
  | 'mockInterviewEvaluation';

/**
 * Prompt manager class for handling versioned prompts
 */
export class PromptManager {
  private currentVersion: string = '1.1.0';
  private promptCache: Map<string, PromptVersion> = new Map();
  protected basePath: string;

  constructor(basePath: string = '/prompts') {
    this.basePath = basePath;
  }

  /**
   * Sets the current prompt version to use
   */
  setVersion(version: string): void {
    this.currentVersion = version;
  }

  /**
   * Gets the current prompt version
   */
  getCurrentVersion(): string {
    return this.currentVersion;
  }

  /**
   * Loads a specific prompt version from file
   */
  private async loadPromptVersion(version: string): Promise<PromptVersion> {
    if (this.promptCache.has(version)) {
      return this.promptCache.get(version)!;
    }

    try {
      // In Next.js, we need to import the JSON files differently
      // This will be handled by the integration layer
      const promptData = await this.fetchPromptData(version);
      this.promptCache.set(version, promptData);
      return promptData;
    } catch (error) {
      console.error(`Failed to load prompt version ${version}:`, error);
      throw new Error(`Prompt version ${version} not found`);
    }
  }

  /**
   * Fetches prompt data - to be implemented based on environment
   */
  protected async fetchPromptData(version: string): Promise<PromptVersion> {
    // This will be implemented by the specific environment (Node.js, browser, etc.)
    // For now, we'll throw an error to be overridden
    throw new Error('fetchPromptData must be implemented by the environment-specific manager');
  }

  /**
   * Gets a specific prompt template
   */
  async getPrompt(
    type: PromptType, 
    version?: string
  ): Promise<PromptTemplate> {
    const targetVersion = version || this.currentVersion;
    const promptVersion = await this.loadPromptVersion(targetVersion);
    
    if (!promptVersion.prompts[type]) {
      throw new Error(`Prompt type '${type}' not found in version ${targetVersion}`);
    }
    
    return promptVersion.prompts[type];
  }

  /**
   * Processes a prompt with variable replacement
   */
  async processPrompt(
    type: PromptType,
    variables: VariableMap,
    options: {
      version?: string;
      config?: PromptConfig;
    } = {}
  ): Promise<string> {
    const prompt = await this.getPrompt(type, options.version);
    return replaceVariables(prompt.template, variables, options.config);
  }

  /**
   * Gets all available prompt types for a version
   */
  async getAvailablePrompts(version?: string): Promise<string[]> {
    const targetVersion = version || this.currentVersion;
    const promptVersion = await this.loadPromptVersion(targetVersion);
    return Object.keys(promptVersion.prompts);
  }

  /**
   * Gets required variables for a specific prompt
   */
  async getRequiredVariables(
    type: PromptType, 
    version?: string
  ): Promise<string[]> {
    const prompt = await this.getPrompt(type, version);
    return prompt.variables;
  }

  /**
   * Lists all available versions
   */
  getAvailableVersions(): string[] {
    // This would typically scan the prompts directory
    // For now, return known versions
    return ['1.0.0', '1.1.0'];
  }

  /**
   * Gets metadata about a specific version
   */
  async getVersionInfo(version?: string): Promise<{
    version: string;
    createdAt: string;
    description: string;
    promptCount: number;
  }> {
    const targetVersion = version || this.currentVersion;
    const promptVersion = await this.loadPromptVersion(targetVersion);
    
    return {
      version: promptVersion.version,
      createdAt: promptVersion.createdAt,
      description: promptVersion.description,
      promptCount: Object.keys(promptVersion.prompts).length,
    };
  }

  /**
   * Validates if all required variables are provided for a prompt
   */
  async validatePromptVariables(
    type: PromptType,
    variables: VariableMap,
    version?: string
  ): Promise<{
    isValid: boolean;
    missingVariables: string[];
    extraVariables: string[];
  }> {
    const prompt = await this.getPrompt(type, version);
    const requiredVars = new Set(prompt.variables);
    const providedVars = new Set(Object.keys(variables));
    
    const missingVariables = prompt.variables.filter(v => !providedVars.has(v));
    const extraVariables = Object.keys(variables).filter(v => !requiredVars.has(v));
    
    return {
      isValid: missingVariables.length === 0,
      missingVariables,
      extraVariables,
    };
  }

  /**
   * Clears the prompt cache
   */
  clearCache(): void {
    this.promptCache.clear();
  }
}

/**
 * Server-side prompt manager for Node.js environments
 */
export class ServerPromptManager extends PromptManager {
  private fs: any;
  private path: any;

  constructor(basePath: string = './prompts') {
    super(basePath);
    // Dynamic import for Node.js modules
    this.initializeNodeModules();
  }

  private async initializeNodeModules() {
    try {
      this.fs = await import('fs');
      this.path = await import('path');
    } catch (error) {
      console.warn('Node.js modules not available, some features may not work');
    }
  }

  protected async fetchPromptData(version: string): Promise<PromptVersion> {
    if (!this.fs || !this.path) {
      throw new Error('File system access not available');
    }

    const filePath = this.path.join(process.cwd(), this.basePath, `v${version}.json`);
    
    try {
      const fileContent = await this.fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      throw new Error(`Failed to read prompt file: ${filePath}`);
    }
  }

  /**
   * Scans directory for available versions
   */
  async scanAvailableVersions(): Promise<string[]> {
    if (!this.fs || !this.path) {
      return super.getAvailableVersions();
    }

    try {
      const promptDir = this.path.join(process.cwd(), this.basePath);
      const files = await this.fs.promises.readdir(promptDir);
      
      return files
        .filter((file: string) => file.startsWith('v') && file.endsWith('.json'))
        .map((file: string) => file.slice(1, -5)) // Remove 'v' prefix and '.json' suffix
        .sort();
    } catch (error) {
      console.warn('Could not scan prompt directory:', error);
      return super.getAvailableVersions();
    }
  }
}

/**
 * Client-side prompt manager for browser environments
 */
export class ClientPromptManager extends PromptManager {
  constructor(basePath: string = '/prompts') {
    super(basePath);
  }

  protected async fetchPromptData(version: string): Promise<PromptVersion> {
    try {
      const response = await fetch(`${this.basePath}/v${version}.json`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch prompt version ${version}: ${error}`);
    }
  }
}

/**
 * Static prompt data for environments where file access is limited
 */
export class StaticPromptManager extends PromptManager {
  private staticPrompts: Map<string, PromptVersion> = new Map();

  constructor() {
    super('');
    this.initializeStaticPrompts();
  }

  private initializeStaticPrompts() {
    // These would be imported from the actual JSON files at build time
    // For now, we'll create minimal examples
    const v100: PromptVersion = {
      version: '1.0.0',
      createdAt: '2024-01-01',
      description: 'Initial version of interview prompts',
      prompts: {
        dsaProblem: {
          template: 'Generate a DSA problem for ${designation} at ${companies}, round ${round}',
          variables: ['designation', 'companies', 'round'],
          description: 'Basic DSA problem generator'
        }
      }
    };

    this.staticPrompts.set('1.0.0', v100);
  }

  protected async fetchPromptData(version: string): Promise<PromptVersion> {
    const promptData = this.staticPrompts.get(version);
    if (!promptData) {
      throw new Error(`Static prompt version ${version} not available`);
    }
    return promptData;
  }

  addStaticPrompt(version: string, promptData: PromptVersion): void {
    this.staticPrompts.set(version, promptData);
  }
}

/**
 * Factory function to create appropriate prompt manager based on environment
 */
export function createPromptManager(environment?: 'server' | 'client' | 'static'): PromptManager {
  if (environment === 'server') {
    return new ServerPromptManager();
  } else if (environment === 'client') {
    return new ClientPromptManager();
  } else if (environment === 'static') {
    return new StaticPromptManager();
  }

  // Auto-detect environment
  if (typeof window !== 'undefined') {
    return new ClientPromptManager();
  } else if (typeof process !== 'undefined' && process.versions?.node) {
    return new ServerPromptManager();
  } else {
    return new StaticPromptManager();
  }
}

// Default export - singleton instance
export const promptManager = createPromptManager();