import { z } from 'zod';
declare const companySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    logo: z.ZodString;
    description: z.ZodString;
    difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
    industry: z.ZodOptional<z.ZodString>;
    founded: z.ZodOptional<z.ZodNumber>;
    headquarters: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    createdAt: number;
    description: string;
    id: string;
    updatedAt: number;
    difficulty: "easy" | "medium" | "hard";
    name: string;
    logo: string;
    industry?: string | undefined;
    founded?: number | undefined;
    headquarters?: string | undefined;
    website?: string | undefined;
}, {
    createdAt: number;
    description: string;
    id: string;
    updatedAt: number;
    difficulty: "easy" | "medium" | "hard";
    name: string;
    logo: string;
    industry?: string | undefined;
    founded?: number | undefined;
    headquarters?: string | undefined;
    website?: string | undefined;
}>;
export type Company = z.infer<typeof companySchema>;
export declare class CompaniesRepo {
    private readonly col;
    getAll(): Promise<Company[]>;
    search(query: string): Promise<Company[]>;
    getById(id: string): Promise<Company | null>;
    getDesignations(): Promise<string[]>;
}
export {};
