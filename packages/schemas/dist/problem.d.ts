import { z } from 'zod';
export declare const problemKindEnum: z.ZodEnum<["dsa", "system_design", "machine_coding", "theory"]>;
export declare const problemSourceEnum: z.ZodEnum<["simulation", "mock", "direct", "admin"]>;
export declare const visibilityEnum: z.ZodEnum<["private", "admin", "public"]>;
export declare const problemBodyByKind: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"dsa">;
    content: z.ZodObject<{
        prompt: z.ZodString;
        requirements: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        constraints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        hints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
        estimatedTimeMin: z.ZodOptional<z.ZodNumber>;
        starterCode: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        solution: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        evaluation: z.ZodDefault<z.ZodObject<{
            rubric: z.ZodDefault<z.ZodArray<z.ZodObject<{
                criterion: z.ZodString;
                weight: z.ZodNumber;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }>, "many">>;
            testCases: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                input: z.ZodOptional<z.ZodString>;
                output: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                hidden: z.ZodDefault<z.ZodBoolean>;
                timeoutMs: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }, {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }>, "many">>;
            manualGuidance: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        }, {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        }>>;
        references: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    } & {
        inputFormat: z.ZodString;
        outputFormat: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        inputFormat: string;
        outputFormat: string;
        estimatedTimeMin?: number | undefined;
    }, {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        inputFormat: string;
        outputFormat: string;
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    content: {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        inputFormat: string;
        outputFormat: string;
        estimatedTimeMin?: number | undefined;
    };
    kind: "dsa";
}, {
    content: {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        inputFormat: string;
        outputFormat: string;
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
    };
    kind: "dsa";
}>, z.ZodObject<{
    kind: z.ZodLiteral<"machine_coding">;
    content: z.ZodObject<{
        prompt: z.ZodString;
        requirements: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        constraints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        hints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
        estimatedTimeMin: z.ZodOptional<z.ZodNumber>;
        starterCode: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        solution: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        evaluation: z.ZodDefault<z.ZodObject<{
            rubric: z.ZodDefault<z.ZodArray<z.ZodObject<{
                criterion: z.ZodString;
                weight: z.ZodNumber;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }>, "many">>;
            testCases: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                input: z.ZodOptional<z.ZodString>;
                output: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                hidden: z.ZodDefault<z.ZodBoolean>;
                timeoutMs: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }, {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }>, "many">>;
            manualGuidance: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        }, {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        }>>;
        references: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    } & {
        uiSpecs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        apiSpecs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        uiSpecs: string[];
        apiSpecs: string[];
        estimatedTimeMin?: number | undefined;
    }, {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
        uiSpecs?: string[] | undefined;
        apiSpecs?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    content: {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        uiSpecs: string[];
        apiSpecs: string[];
        estimatedTimeMin?: number | undefined;
    };
    kind: "machine_coding";
}, {
    content: {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
        uiSpecs?: string[] | undefined;
        apiSpecs?: string[] | undefined;
    };
    kind: "machine_coding";
}>, z.ZodObject<{
    kind: z.ZodLiteral<"system_design">;
    content: z.ZodObject<{
        prompt: z.ZodString;
        requirements: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        constraints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        hints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
        estimatedTimeMin: z.ZodOptional<z.ZodNumber>;
        starterCode: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        solution: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        evaluation: z.ZodDefault<z.ZodObject<{
            rubric: z.ZodDefault<z.ZodArray<z.ZodObject<{
                criterion: z.ZodString;
                weight: z.ZodNumber;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }>, "many">>;
            testCases: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                input: z.ZodOptional<z.ZodString>;
                output: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                hidden: z.ZodDefault<z.ZodBoolean>;
                timeoutMs: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }, {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }>, "many">>;
            manualGuidance: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        }, {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        }>>;
        references: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    } & {
        diagramRequirements: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        scoringDimensions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        diagramRequirements: string[];
        scoringDimensions: string[];
        estimatedTimeMin?: number | undefined;
    }, {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
        diagramRequirements?: string[] | undefined;
        scoringDimensions?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    content: {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        diagramRequirements: string[];
        scoringDimensions: string[];
        estimatedTimeMin?: number | undefined;
    };
    kind: "system_design";
}, {
    content: {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
        diagramRequirements?: string[] | undefined;
        scoringDimensions?: string[] | undefined;
    };
    kind: "system_design";
}>, z.ZodObject<{
    kind: z.ZodLiteral<"theory">;
    content: z.ZodObject<{
        prompt: z.ZodString;
        requirements: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        constraints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        hints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
        estimatedTimeMin: z.ZodOptional<z.ZodNumber>;
        starterCode: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        solution: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        evaluation: z.ZodDefault<z.ZodObject<{
            rubric: z.ZodDefault<z.ZodArray<z.ZodObject<{
                criterion: z.ZodString;
                weight: z.ZodNumber;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }>, "many">>;
            testCases: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                input: z.ZodOptional<z.ZodString>;
                output: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                hidden: z.ZodDefault<z.ZodBoolean>;
                timeoutMs: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }, {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }>, "many">>;
            manualGuidance: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        }, {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        }>>;
        references: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    } & {
        questions: z.ZodDefault<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["mcq", "short", "long"]>;
            question: z.ZodString;
            options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            answer: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "mcq" | "short" | "long";
            question: string;
            options?: string[] | undefined;
            answer?: string | undefined;
        }, {
            type: "mcq" | "short" | "long";
            question: string;
            options?: string[] | undefined;
            answer?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        questions: {
            type: "mcq" | "short" | "long";
            question: string;
            options?: string[] | undefined;
            answer?: string | undefined;
        }[];
        estimatedTimeMin?: number | undefined;
    }, {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
        questions?: {
            type: "mcq" | "short" | "long";
            question: string;
            options?: string[] | undefined;
            answer?: string | undefined;
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    content: {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        questions: {
            type: "mcq" | "short" | "long";
            question: string;
            options?: string[] | undefined;
            answer?: string | undefined;
        }[];
        estimatedTimeMin?: number | undefined;
    };
    kind: "theory";
}, {
    content: {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
        questions?: {
            type: "mcq" | "short" | "long";
            question: string;
            options?: string[] | undefined;
            answer?: string | undefined;
        }[] | undefined;
    };
    kind: "theory";
}>]>;
export declare const problemEnvelope: z.ZodObject<{
    schemaVersion: z.ZodLiteral<"1.0.0">;
    id: z.ZodString;
    title: z.ZodString;
    company: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id?: string | undefined;
        name?: string | undefined;
    }, {
        id?: string | undefined;
        name?: string | undefined;
    }>>;
    role: z.ZodOptional<z.ZodString>;
    round: z.ZodOptional<z.ZodObject<{
        index: z.ZodOptional<z.ZodNumber>;
        type: z.ZodOptional<z.ZodEnum<["dsa", "system_design", "machine_coding", "theory"]>>;
    }, "strip", z.ZodTypeAny, {
        type?: "dsa" | "system_design" | "machine_coding" | "theory" | undefined;
        index?: number | undefined;
    }, {
        type?: "dsa" | "system_design" | "machine_coding" | "theory" | undefined;
        index?: number | undefined;
    }>>;
    source: z.ZodEnum<["simulation", "mock", "direct", "admin"]>;
    visibility: z.ZodDefault<z.ZodEnum<["private", "admin", "public"]>>;
    ownerId: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    schemaVersion: "1.0.0";
    title: string;
    source: "simulation" | "mock" | "direct" | "admin";
    visibility: "admin" | "private" | "public";
    ownerId: string | null;
    createdAt: number;
    updatedAt: number;
    company?: {
        id?: string | undefined;
        name?: string | undefined;
    } | undefined;
    role?: string | undefined;
    round?: {
        type?: "dsa" | "system_design" | "machine_coding" | "theory" | undefined;
        index?: number | undefined;
    } | undefined;
}, {
    id: string;
    schemaVersion: "1.0.0";
    title: string;
    source: "simulation" | "mock" | "direct" | "admin";
    ownerId: string | null;
    createdAt: number;
    updatedAt: number;
    company?: {
        id?: string | undefined;
        name?: string | undefined;
    } | undefined;
    role?: string | undefined;
    round?: {
        type?: "dsa" | "system_design" | "machine_coding" | "theory" | undefined;
        index?: number | undefined;
    } | undefined;
    visibility?: "admin" | "private" | "public" | undefined;
}>;
export declare const problemSchema: z.ZodIntersection<z.ZodObject<{
    schemaVersion: z.ZodLiteral<"1.0.0">;
    id: z.ZodString;
    title: z.ZodString;
    company: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id?: string | undefined;
        name?: string | undefined;
    }, {
        id?: string | undefined;
        name?: string | undefined;
    }>>;
    role: z.ZodOptional<z.ZodString>;
    round: z.ZodOptional<z.ZodObject<{
        index: z.ZodOptional<z.ZodNumber>;
        type: z.ZodOptional<z.ZodEnum<["dsa", "system_design", "machine_coding", "theory"]>>;
    }, "strip", z.ZodTypeAny, {
        type?: "dsa" | "system_design" | "machine_coding" | "theory" | undefined;
        index?: number | undefined;
    }, {
        type?: "dsa" | "system_design" | "machine_coding" | "theory" | undefined;
        index?: number | undefined;
    }>>;
    source: z.ZodEnum<["simulation", "mock", "direct", "admin"]>;
    visibility: z.ZodDefault<z.ZodEnum<["private", "admin", "public"]>>;
    ownerId: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    schemaVersion: "1.0.0";
    title: string;
    source: "simulation" | "mock" | "direct" | "admin";
    visibility: "admin" | "private" | "public";
    ownerId: string | null;
    createdAt: number;
    updatedAt: number;
    company?: {
        id?: string | undefined;
        name?: string | undefined;
    } | undefined;
    role?: string | undefined;
    round?: {
        type?: "dsa" | "system_design" | "machine_coding" | "theory" | undefined;
        index?: number | undefined;
    } | undefined;
}, {
    id: string;
    schemaVersion: "1.0.0";
    title: string;
    source: "simulation" | "mock" | "direct" | "admin";
    ownerId: string | null;
    createdAt: number;
    updatedAt: number;
    company?: {
        id?: string | undefined;
        name?: string | undefined;
    } | undefined;
    role?: string | undefined;
    round?: {
        type?: "dsa" | "system_design" | "machine_coding" | "theory" | undefined;
        index?: number | undefined;
    } | undefined;
    visibility?: "admin" | "private" | "public" | undefined;
}>, z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"dsa">;
    content: z.ZodObject<{
        prompt: z.ZodString;
        requirements: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        constraints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        hints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
        estimatedTimeMin: z.ZodOptional<z.ZodNumber>;
        starterCode: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        solution: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        evaluation: z.ZodDefault<z.ZodObject<{
            rubric: z.ZodDefault<z.ZodArray<z.ZodObject<{
                criterion: z.ZodString;
                weight: z.ZodNumber;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }>, "many">>;
            testCases: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                input: z.ZodOptional<z.ZodString>;
                output: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                hidden: z.ZodDefault<z.ZodBoolean>;
                timeoutMs: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }, {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }>, "many">>;
            manualGuidance: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        }, {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        }>>;
        references: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    } & {
        inputFormat: z.ZodString;
        outputFormat: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        inputFormat: string;
        outputFormat: string;
        estimatedTimeMin?: number | undefined;
    }, {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        inputFormat: string;
        outputFormat: string;
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    content: {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        inputFormat: string;
        outputFormat: string;
        estimatedTimeMin?: number | undefined;
    };
    kind: "dsa";
}, {
    content: {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        inputFormat: string;
        outputFormat: string;
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
    };
    kind: "dsa";
}>, z.ZodObject<{
    kind: z.ZodLiteral<"machine_coding">;
    content: z.ZodObject<{
        prompt: z.ZodString;
        requirements: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        constraints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        hints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
        estimatedTimeMin: z.ZodOptional<z.ZodNumber>;
        starterCode: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        solution: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        evaluation: z.ZodDefault<z.ZodObject<{
            rubric: z.ZodDefault<z.ZodArray<z.ZodObject<{
                criterion: z.ZodString;
                weight: z.ZodNumber;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }>, "many">>;
            testCases: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                input: z.ZodOptional<z.ZodString>;
                output: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                hidden: z.ZodDefault<z.ZodBoolean>;
                timeoutMs: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }, {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }>, "many">>;
            manualGuidance: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        }, {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        }>>;
        references: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    } & {
        uiSpecs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        apiSpecs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        uiSpecs: string[];
        apiSpecs: string[];
        estimatedTimeMin?: number | undefined;
    }, {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
        uiSpecs?: string[] | undefined;
        apiSpecs?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    content: {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        uiSpecs: string[];
        apiSpecs: string[];
        estimatedTimeMin?: number | undefined;
    };
    kind: "machine_coding";
}, {
    content: {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
        uiSpecs?: string[] | undefined;
        apiSpecs?: string[] | undefined;
    };
    kind: "machine_coding";
}>, z.ZodObject<{
    kind: z.ZodLiteral<"system_design">;
    content: z.ZodObject<{
        prompt: z.ZodString;
        requirements: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        constraints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        hints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
        estimatedTimeMin: z.ZodOptional<z.ZodNumber>;
        starterCode: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        solution: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        evaluation: z.ZodDefault<z.ZodObject<{
            rubric: z.ZodDefault<z.ZodArray<z.ZodObject<{
                criterion: z.ZodString;
                weight: z.ZodNumber;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }>, "many">>;
            testCases: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                input: z.ZodOptional<z.ZodString>;
                output: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                hidden: z.ZodDefault<z.ZodBoolean>;
                timeoutMs: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }, {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }>, "many">>;
            manualGuidance: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        }, {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        }>>;
        references: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    } & {
        diagramRequirements: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        scoringDimensions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        diagramRequirements: string[];
        scoringDimensions: string[];
        estimatedTimeMin?: number | undefined;
    }, {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
        diagramRequirements?: string[] | undefined;
        scoringDimensions?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    content: {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        diagramRequirements: string[];
        scoringDimensions: string[];
        estimatedTimeMin?: number | undefined;
    };
    kind: "system_design";
}, {
    content: {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
        diagramRequirements?: string[] | undefined;
        scoringDimensions?: string[] | undefined;
    };
    kind: "system_design";
}>, z.ZodObject<{
    kind: z.ZodLiteral<"theory">;
    content: z.ZodObject<{
        prompt: z.ZodString;
        requirements: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        constraints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        hints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
        estimatedTimeMin: z.ZodOptional<z.ZodNumber>;
        starterCode: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        solution: z.ZodDefault<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            language: z.ZodString;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            language: string;
            content: string;
        }, {
            path: string;
            language: string;
            content: string;
        }>, "many">>;
        evaluation: z.ZodDefault<z.ZodObject<{
            rubric: z.ZodDefault<z.ZodArray<z.ZodObject<{
                criterion: z.ZodString;
                weight: z.ZodNumber;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }, {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }>, "many">>;
            testCases: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                input: z.ZodOptional<z.ZodString>;
                output: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                hidden: z.ZodDefault<z.ZodBoolean>;
                timeoutMs: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }, {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }>, "many">>;
            manualGuidance: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        }, {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        }>>;
        references: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    } & {
        questions: z.ZodDefault<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["mcq", "short", "long"]>;
            question: z.ZodString;
            options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            answer: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "mcq" | "short" | "long";
            question: string;
            options?: string[] | undefined;
            answer?: string | undefined;
        }, {
            type: "mcq" | "short" | "long";
            question: string;
            options?: string[] | undefined;
            answer?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        questions: {
            type: "mcq" | "short" | "long";
            question: string;
            options?: string[] | undefined;
            answer?: string | undefined;
        }[];
        estimatedTimeMin?: number | undefined;
    }, {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
        questions?: {
            type: "mcq" | "short" | "long";
            question: string;
            options?: string[] | undefined;
            answer?: string | undefined;
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    content: {
        prompt: string;
        requirements: string[];
        constraints: string[];
        hints: string[];
        tags: string[];
        difficulty: "easy" | "medium" | "hard";
        starterCode: {
            path: string;
            language: string;
            content: string;
        }[];
        solution: {
            path: string;
            language: string;
            content: string;
        }[];
        evaluation: {
            rubric: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[];
            testCases: {
                id: string;
                hidden: boolean;
                timeoutMs: number;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
            }[];
            manualGuidance?: string | undefined;
        };
        references: string[];
        questions: {
            type: "mcq" | "short" | "long";
            question: string;
            options?: string[] | undefined;
            answer?: string | undefined;
        }[];
        estimatedTimeMin?: number | undefined;
    };
    kind: "theory";
}, {
    content: {
        prompt: string;
        difficulty: "easy" | "medium" | "hard";
        requirements?: string[] | undefined;
        constraints?: string[] | undefined;
        hints?: string[] | undefined;
        tags?: string[] | undefined;
        estimatedTimeMin?: number | undefined;
        starterCode?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        solution?: {
            path: string;
            language: string;
            content: string;
        }[] | undefined;
        evaluation?: {
            rubric?: {
                criterion: string;
                weight: number;
                notes?: string | undefined;
            }[] | undefined;
            testCases?: {
                id: string;
                input?: string | undefined;
                output?: string | undefined;
                description?: string | undefined;
                hidden?: boolean | undefined;
                timeoutMs?: number | undefined;
            }[] | undefined;
            manualGuidance?: string | undefined;
        } | undefined;
        references?: string[] | undefined;
        questions?: {
            type: "mcq" | "short" | "long";
            question: string;
            options?: string[] | undefined;
            answer?: string | undefined;
        }[] | undefined;
    };
    kind: "theory";
}>]>>;
export type Problem = z.infer<typeof problemSchema>;
export declare const schemasVersion: "1.0.0";
