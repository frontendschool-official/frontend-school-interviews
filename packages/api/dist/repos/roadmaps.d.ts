import { z } from 'zod';
declare const roadmapSchema: z.ZodObject<{
    id: z.ZodString;
    ownerId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    duration: z.ZodNumber;
    companies: z.ZodArray<z.ZodString, "many">;
    designation: z.ZodString;
    overview: z.ZodObject<{
        totalProblems: z.ZodNumber;
        totalTime: z.ZodString;
        focusAreas: z.ZodArray<z.ZodString, "many">;
        learningObjectives: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        totalProblems: number;
        totalTime: string;
        focusAreas: string[];
        learningObjectives: string[];
    }, {
        totalProblems: number;
        totalTime: string;
        focusAreas: string[];
        learningObjectives: string[];
    }>;
    dailyPlan: z.ZodArray<z.ZodObject<{
        day: z.ZodNumber;
        title: z.ZodString;
        description: z.ZodString;
        problems: z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            type: z.ZodEnum<["dsa", "machine_coding", "system_design", "theory_and_debugging"]>;
            difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
            estimatedTime: z.ZodString;
            focusAreas: z.ZodArray<z.ZodString, "many">;
            learningObjectives: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            description: string;
            title: string;
            type: "dsa" | "machine_coding" | "system_design" | "theory_and_debugging";
            focusAreas: string[];
            learningObjectives: string[];
            difficulty: "easy" | "medium" | "hard";
            estimatedTime: string;
        }, {
            description: string;
            title: string;
            type: "dsa" | "machine_coding" | "system_design" | "theory_and_debugging";
            focusAreas: string[];
            learningObjectives: string[];
            difficulty: "easy" | "medium" | "hard";
            estimatedTime: string;
        }>, "many">;
        totalTime: z.ZodString;
        focusAreas: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        problems: {
            description: string;
            title: string;
            type: "dsa" | "machine_coding" | "system_design" | "theory_and_debugging";
            focusAreas: string[];
            learningObjectives: string[];
            difficulty: "easy" | "medium" | "hard";
            estimatedTime: string;
        }[];
        description: string;
        title: string;
        totalTime: string;
        focusAreas: string[];
        day: number;
    }, {
        problems: {
            description: string;
            title: string;
            type: "dsa" | "machine_coding" | "system_design" | "theory_and_debugging";
            focusAreas: string[];
            learningObjectives: string[];
            difficulty: "easy" | "medium" | "hard";
            estimatedTime: string;
        }[];
        description: string;
        title: string;
        totalTime: string;
        focusAreas: string[];
        day: number;
    }>, "many">;
    tips: z.ZodArray<z.ZodString, "many">;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    ownerId: string;
    createdAt: number;
    description: string;
    id: string;
    title: string;
    updatedAt: number;
    duration: number;
    companies: string[];
    designation: string;
    overview: {
        totalProblems: number;
        totalTime: string;
        focusAreas: string[];
        learningObjectives: string[];
    };
    dailyPlan: {
        problems: {
            description: string;
            title: string;
            type: "dsa" | "machine_coding" | "system_design" | "theory_and_debugging";
            focusAreas: string[];
            learningObjectives: string[];
            difficulty: "easy" | "medium" | "hard";
            estimatedTime: string;
        }[];
        description: string;
        title: string;
        totalTime: string;
        focusAreas: string[];
        day: number;
    }[];
    tips: string[];
}, {
    ownerId: string;
    createdAt: number;
    description: string;
    id: string;
    title: string;
    updatedAt: number;
    duration: number;
    companies: string[];
    designation: string;
    overview: {
        totalProblems: number;
        totalTime: string;
        focusAreas: string[];
        learningObjectives: string[];
    };
    dailyPlan: {
        problems: {
            description: string;
            title: string;
            type: "dsa" | "machine_coding" | "system_design" | "theory_and_debugging";
            focusAreas: string[];
            learningObjectives: string[];
            difficulty: "easy" | "medium" | "hard";
            estimatedTime: string;
        }[];
        description: string;
        title: string;
        totalTime: string;
        focusAreas: string[];
        day: number;
    }[];
    tips: string[];
}>;
export type Roadmap = z.infer<typeof roadmapSchema>;
export declare class RoadmapRepo {
    private readonly col;
    create(data: Omit<Roadmap, 'id' | 'createdAt' | 'updatedAt'>): Promise<Roadmap>;
    getById(requesterUid: string, id: string): Promise<Roadmap>;
    listForUser(uid: string): Promise<Roadmap[]>;
    update(requesterUid: string, id: string, patch: Partial<Roadmap>): Promise<Roadmap>;
}
export {};
