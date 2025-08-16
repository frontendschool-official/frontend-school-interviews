import { Problem, problemKindEnum } from '@workspace/schemas';
type GenerateInput = {
    kind: typeof problemKindEnum._type;
    role?: string;
    company?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    context?: string;
};
export declare class ProblemGenerator {
    private readonly apiKey;
    constructor(env?: NodeJS.ProcessEnv);
    generate(input: GenerateInput): Promise<Problem>;
    private buildPrompt;
}
export {};
