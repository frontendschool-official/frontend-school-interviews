import { z } from 'zod';
const envSchema = z.object({
    GEMINI_API_KEY: z.string().min(1),
    FIREBASE_PROJECT_ID: z.string().min(1),
    FIREBASE_CLIENT_EMAIL: z.string().email(),
    FIREBASE_PRIVATE_KEY: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
});
export const loadEnv = (values = process.env) => {
    const parsed = envSchema.safeParse(values);
    if (!parsed.success) {
        const issues = parsed.error.issues
            .map(i => `${i.path.join('.')}: ${i.message}`)
            .join(', ');
        throw new Error(`Invalid environment configuration: ${issues}`);
    }
    return parsed.data;
};
