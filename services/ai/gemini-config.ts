export const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const getGeminiApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is required. Please configure NEXT_PUBLIC_GEMINI_API_KEY environment variable.');
  }
  return apiKey;
};

export const getPromptVersion = (): string => {
  return process.env.NEXT_PUBLIC_GEMINI_PROMPT_VERSION || "1.1.0";
}; 