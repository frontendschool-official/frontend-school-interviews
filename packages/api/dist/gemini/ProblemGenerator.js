var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { problemSchema } from '@workspace/schemas';
import { loadEnv } from '@workspace/config';
export class ProblemGenerator {
    constructor(env = process.env) {
        const parsed = loadEnv(env);
        this.apiKey = parsed.GEMINI_API_KEY;
    }
    generate(input) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const prompt = this.buildPrompt(input);
            const res = yield fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                }),
            });
            const data = yield res.json();
            const text = ((_e = (_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || '';
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch)
                throw new Error('AI response did not contain JSON');
            const parsed = JSON.parse(jsonMatch[0]);
            return problemSchema.parse(parsed);
        });
    }
    buildPrompt(input) {
        var _a, _b, _c, _d;
        return `Generate one ${input.kind} problem as JSON that conforms strictly to our schema (do not include markdown):\n- Include content.difficulty=${(_a = input.difficulty) !== null && _a !== void 0 ? _a : 'medium'}\n- Role: ${(_b = input.role) !== null && _b !== void 0 ? _b : ''}\n- Company: ${(_c = input.company) !== null && _c !== void 0 ? _c : ''}\n- Context: ${(_d = input.context) !== null && _d !== void 0 ? _d : ''}`;
    }
}
