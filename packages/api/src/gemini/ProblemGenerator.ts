import { problemSchema, Problem, problemKindEnum } from '@workspace/schemas';
import { loadEnv } from '@workspace/config';

type GenerateInput = {
  kind: typeof problemKindEnum._type;
  role?: string;
  company?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  context?: string;
};

export class ProblemGenerator {
  private readonly apiKey: string;

  constructor(env = process.env) {
    const parsed = loadEnv(env);
    this.apiKey = parsed.GEMINI_API_KEY;
  }

  async generate(input: GenerateInput): Promise<Problem> {
    const prompt = this.buildPrompt(input);
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        }),
      }
    );
    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI response did not contain JSON');
    const parsed = JSON.parse(jsonMatch[0]);
    return problemSchema.parse(parsed);
  }

  private buildPrompt(input: GenerateInput): string {
    return `Generate one ${input.kind} problem as JSON that conforms strictly to our schema (do not include markdown):\n- Include content.difficulty=${input.difficulty ?? 'medium'}\n- Role: ${input.role ?? ''}\n- Company: ${input.company ?? ''}\n- Context: ${input.context ?? ''}`;
  }
}
