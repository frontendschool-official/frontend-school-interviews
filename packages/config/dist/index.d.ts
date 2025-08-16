import { z } from 'zod';
declare const envSchema: z.ZodObject<{
    GEMINI_API_KEY: z.ZodString;
    FIREBASE_PROJECT_ID: z.ZodString;
    FIREBASE_CLIENT_EMAIL: z.ZodString;
    FIREBASE_PRIVATE_KEY: z.ZodString;
    NEXT_PUBLIC_FIREBASE_API_KEY: z.ZodString;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.ZodString;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.ZodString;
}, "strip", z.ZodTypeAny, {
    GEMINI_API_KEY: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
    NEXT_PUBLIC_FIREBASE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
}, {
    GEMINI_API_KEY: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
    NEXT_PUBLIC_FIREBASE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
}>;
export type Env = z.infer<typeof envSchema>;
export declare const loadEnv: (values?: NodeJS.ProcessEnv) => Env;
export {};
