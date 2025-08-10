import {
  MockInterviewProblem,
  ParsedProblemData,
  parseProblemData,
  ProblemSchema,
  InterviewSimulationProblemResponse,
} from "../../types/problem";
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  writeBatch,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../../enums/collections";
import { GEMINI_ENDPOINT, getGeminiApiKey } from "../ai/gemini-config";

// Fetch all problems from the interview_problems collection
export const getAllProblems = async () => {
  try {
    const ref = collection(db, COLLECTIONS.INTERVIEW_PROBLEMS);
    const q = query(ref, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const problems: ParsedProblemData[] = [];
    querySnapshot?.forEach((doc) => {
      const data = doc.data();
      const parsedData = parseProblemData({ ...data, id: doc.id });
      problems.push(parsedData);
    });
    return problems;
  } catch (error) {
    console.error("Error getting all problems:", error);
    throw new Error("Failed to get problems");
  }
};

export const getAllProblemsByUserId = async (userId: string) => {
  try {
    const ref = collection(db, COLLECTIONS.INTERVIEW_PROBLEMS);
    const q = query(
      ref,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const problems: ParsedProblemData[] = [];
    querySnapshot?.forEach((doc) => {
      const data = doc.data();
      const parsedData = parseProblemData({ ...data, id: doc.id });
      problems.push(parsedData);
    });
    return problems;
  } catch (error) {
    console.error("Error getting all problems by user id:", error);
    throw new Error("Failed to get problems by user id");
  }
};

export const createProblems = async (problems: any) => {
  try {
    console.log(problems, "problems createProblems");
    const ref = collection(db, COLLECTIONS.INTERVIEW_PROBLEMS);
    const batch = writeBatch(db);
    problems?.forEach((problem: any) => {
      const docRef = doc(ref);
      batch.set(docRef, {
        ...problem,
        createdAt: serverTimestamp(),
      });
    });
    console.log(batch, "batch createProblems");
    const result = await batch.commit();
    console.log(result, "result createProblems");
    return result;
  } catch (error) {
    console.error("Error creating problems:", error);
    throw new Error("Failed to create problems");
  }
};

export const generateInterviewSimulationProblems = async (
  activeRoundInfo: any
) => {
  try {
    console.log(
      activeRoundInfo,
      "activeRoundInfo generateInterviewSimulationProblems"
    );
    const prompt = `
You are an expert interviewer for frontend developers.

Create MULTIPLE interview questions for a ${
      activeRoundInfo?.designation
    } candidate at ${activeRoundInfo?.companies} for the round "${
      activeRoundInfo?.name
    }".

Round Context:
- Company: ${activeRoundInfo?.companies}
- Role: ${activeRoundInfo?.designation}
- Round Name: ${activeRoundInfo?.name}
- Total Duration Minutes: ${activeRoundInfo?.durationMinutes}
- Difficulty: ${activeRoundInfo?.difficulty}
- Description: ${activeRoundInfo?.description}
- Tips: ${
      Array.isArray(activeRoundInfo?.tips)
        ? activeRoundInfo?.tips.join(", ")
        : ""
    }
- Focus Areas: ${
      Array.isArray(activeRoundInfo?.focusAreas)
        ? activeRoundInfo?.focusAreas.join(", ")
        : ""
    }
- Evaluation Criteria: ${
      Array.isArray(activeRoundInfo?.evaluationCriteria)
        ? activeRoundInfo?.evaluationCriteria.join(", ")
        : ""
    }
- Experience Level: ${activeRoundInfo?.experienceLevel}

Question Category to Generate: ${activeRoundInfo?.category}
- Allowed values: "dsa" | "js_fundamentals" | "html_css" | "system_design" | "behavioral"

IMPORTANT OUTPUT RULES:
- YOU decide how many questions to include so that the sum of all questions' estimatedTimeMinutes fits within ${
      activeRoundInfo?.durationMinutes
    } minutes (aim for 80–100% utilization).
- Respond with ONLY a valid JSON object. No extra text.
- If category = "dsa": include computational I/O, constraints, and examples with inputs/outputs.
- If category ≠ "dsa": set "inputFormat" and "outputFormat" to "N/A"; "constraints": [] unless truly needed; in "examples", use Q&A style (input=prompt, output=strong answer outline, explanation=why it's good).

SCHEMA (must match exactly):
{
  "company": "${activeRoundInfo?.companyName}",
  "role": "${activeRoundInfo?.designation}",
  "roundName": "${activeRoundInfo?.name}",
  "totalDurationMinutes": ${activeRoundInfo?.durationMinutes},
  "category": "${activeRoundInfo?.category}",
  "problems": [
    {
      "title": "Clear, concise title",
      "description": "Brief context and what is being assessed",
      "problemStatement": "Detailed question/task",
      "inputFormat": "For DSA: precise input format; otherwise 'N/A'",
      "outputFormat": "For DSA: precise output format; otherwise 'N/A'",
      "constraints": [],
      "examples": [
        {
          "input": "Example input or question variant",
          "output": "Expected output or strong answer outline",
          "explanation": "Why this is correct / key points"
        }
      ],
      "difficulty": "${activeRoundInfo?.difficulty}",
      "estimatedTimeMinutes": 10,
      "category": "${activeRoundInfo?.category}",
      "tags": ["${activeRoundInfo?.category}", "frontend", "${
      activeRoundInfo?.companies
    }"],
      "hints": [
        "Contextual hint",
        "Performance/clarity hint"
      ],
      "followUpQuestions": [
        "Refinement/optimization angle",
        "Trade-offs under different constraints"
      ]
    }
  ]
}

CONSTRAINTS:
- The array "problems" must have as many items as you judge appropriate for ${
      activeRoundInfo?.durationMinutes
    } minutes total.
- Each problem must include "estimatedTimeMinutes" (integer).
- Sum of all problems' "estimatedTimeMinutes" <= ${
      activeRoundInfo?.durationMinutes
    } and >= ${Math.max(1, Math.floor(activeRoundInfo?.durationMinutes * 0.8))}.
- All fields required by the schema must be present for each problem.
`;

    const body: any = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const apiKey = getGeminiApiKey();
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!text) {
      console.error("❌ Empty response from Gemini API");
      throw new Error("Empty response from AI service");
    }
    let parsedResponse: InterviewSimulationProblemResponse;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("❌ No JSON found in response:", text);
      throw new Error("No valid JSON found in response");
    }

    console.log("📋 JSON match found, length:", jsonMatch[0].length);
    parsedResponse = JSON.parse(jsonMatch[0]);

    console.log(data, "data generateInterviewSimulationProblems");
    return parsedResponse;
  } catch (error) {
    console.error(
      "Error generating interview simulation problems: generateInterviewSimulationProblems",
      error
    );
    throw new Error("Failed to generate interview simulation problems");
  }
}; 