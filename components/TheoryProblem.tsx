import React from "react";
import { TheoryProblem } from "@/types/problem";

const TheoryProblemRenderer = ({ problem }: { problem: TheoryProblem }) => {
  return (
    <div className="flex-1 flex flex-col gap-4 p-6 bg-secondary rounded-lg border border-border overflow-y-auto">
      <h2 className="text-2xl font-semibold text-primary mb-4">
        {problem?.title}
      </h2>

      <p className="text-base leading-relaxed text-neutral mb-4">
        {problem?.description}
      </p>

      <div className="bg-bodyBg p-6 rounded-md border-l-4 border-primary my-4">
        <h3 className="text-lg leading-relaxed font-medium mb-4">
          {problem?.question}
        </h3>
      </div>

      <div className="my-4">
        <h4 className="text-base font-semibold text-primary mb-2">
          Key Points to Cover:
        </h4>
        <ul className="list-none p-0 m-0">
          {problem?.keyPoints?.map((point, index) => (
            <li
              key={index}
              className="py-2 pl-6 relative before:content-['•'] before:text-primary before:font-bold before:absolute before:left-0"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>

      {problem?.hints && problem?.hints?.length > 0 && (
        <div className="my-4">
          <h4 className="text-base font-semibold text-primary mb-2">Hints:</h4>
          <ul className="list-none p-0 m-0">
            {problem?.hints?.map((hint, index) => (
              <li
                key={index}
                className="py-2 pl-6 relative before:content-['•'] before:text-primary before:font-bold before:absolute before:left-0"
              >
                {hint}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-4 my-4 flex-wrap">
        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
          {problem?.difficulty}
        </span>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm font-medium">
          {problem?.category}
        </span>
        <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">
          {problem?.estimatedTime}
        </span>
      </div>

      {problem?.tags && problem?.tags?.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {problem?.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TheoryProblemRenderer;
