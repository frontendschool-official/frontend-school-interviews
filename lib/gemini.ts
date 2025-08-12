const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const makeGeminiRequest = async (body: any) => {
  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) {
      console.error('❌ Empty response from Gemini API');
      throw new Error('Empty response from AI service');
    }
    let parsedResponse: any;
    const jsonMatch = text?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    parsedResponse = JSON.parse(jsonMatch?.[0]);

    return parsedResponse;
  } catch (error) {
    console.error('Error making Gemini request:', error);
    throw error;
  }
};
