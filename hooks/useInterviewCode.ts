import { useState, useEffect } from "react";
import { ParsedProblemData } from "../types/problem";

export const useInterviewCode = (problem: ParsedProblemData | null) => {
  const [code, setCode] = useState("");

  // Generate initial code template for DSA problems
  useEffect(() => {
    if (problem && problem.interviewType === "dsa" && problem.dsaProblem) {
      const firstExample = problem.dsaProblem.examples?.[0];
      let template = `/**
 * @param {any} input
 * @return {any}
 */
function solution(input) {
    // Your solution here
    return 0;
}`;

      if (firstExample) {
        try {
          const inputType = typeof JSON.parse(firstExample.input);
          const outputType = typeof JSON.parse(firstExample.output);

          template = `/**
 * @param {${inputType === "object" ? "any" : inputType}} input
 * @return {${outputType === "object" ? "any" : outputType}}
 */
function solution(input) {
    // Your solution here
    return 0;
}`;
        } catch (e) {
          // Fallback to generic template
        }
      }

      setCode(template);
    }
  }, [problem]);

  const updateCode = (newCode: string) => {
    setCode(newCode);
  };

  const clearCode = () => {
    setCode("");
  };

  return {
    code,
    updateCode,
    clearCode,
  };
}; 