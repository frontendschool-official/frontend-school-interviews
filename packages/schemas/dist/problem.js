import { z } from 'zod';
export const problemKindEnum = z.enum([
    'dsa',
    'system_design',
    'machine_coding',
    'theory',
]);
export const problemSourceEnum = z.enum([
    'simulation',
    'mock',
    'direct',
    'admin',
]);
export const visibilityEnum = z.enum(['private', 'admin', 'public']);
const codeFileSchema = z.object({
    path: z.string(),
    language: z.string(),
    content: z.string(),
});
const testCaseSchema = z.object({
    id: z.string(),
    input: z.string().optional(),
    output: z.string().optional(),
    description: z.string().optional(),
    hidden: z.boolean().default(false),
    timeoutMs: z.number().int().positive().default(2000),
});
const rubricItemSchema = z.object({
    criterion: z.string(),
    weight: z.number().min(0).max(1),
    notes: z.string().optional(),
});
const baseContentSchema = z.object({
    prompt: z.string(),
    requirements: z.array(z.string()).default([]),
    constraints: z.array(z.string()).default([]),
    hints: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    estimatedTimeMin: z.number().int().positive().optional(),
    starterCode: z.array(codeFileSchema).default([]),
    solution: z.array(codeFileSchema).default([]),
    evaluation: z
        .object({
        rubric: z.array(rubricItemSchema).default([]),
        testCases: z.array(testCaseSchema).default([]),
        manualGuidance: z.string().optional(),
    })
        .default({ rubric: [], testCases: [] }),
    references: z.array(z.string()).default([]),
});
const dsaContent = baseContentSchema.extend({
    inputFormat: z.string(),
    outputFormat: z.string(),
});
const machineCodingContent = baseContentSchema.extend({
    uiSpecs: z.array(z.string()).default([]),
    apiSpecs: z.array(z.string()).default([]),
});
const systemDesignContent = baseContentSchema.extend({
    diagramRequirements: z.array(z.string()).default([]),
    scoringDimensions: z
        .array(z.string())
        .default([
        'Requirements',
        'API design',
        'Data modeling',
        'Consistency/Availability',
        'Caching/Scaling',
        'Observability',
    ]),
});
const theoryContent = baseContentSchema.extend({
    questions: z
        .array(z.object({
        type: z.enum(['mcq', 'short', 'long']),
        question: z.string(),
        options: z.array(z.string()).optional(),
        answer: z.string().optional(),
    }))
        .default([]),
});
export const problemBodyByKind = z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('dsa'), content: dsaContent }),
    z.object({
        kind: z.literal('machine_coding'),
        content: machineCodingContent,
    }),
    z.object({ kind: z.literal('system_design'), content: systemDesignContent }),
    z.object({ kind: z.literal('theory'), content: theoryContent }),
]);
export const problemEnvelope = z.object({
    schemaVersion: z.literal('1.0.0'),
    id: z.string().uuid(),
    title: z.string(),
    company: z
        .object({ id: z.string().optional(), name: z.string().optional() })
        .optional(),
    role: z.string().optional(),
    round: z
        .object({
        index: z.number().int().min(1).optional(),
        type: problemKindEnum.optional(),
    })
        .optional(),
    source: problemSourceEnum,
    visibility: visibilityEnum.default('private'),
    ownerId: z.string().nullable(),
    createdAt: z.number(),
    updatedAt: z.number(),
});
export const problemSchema = problemEnvelope.and(problemBodyByKind);
export const schemasVersion = '1.0.0';
