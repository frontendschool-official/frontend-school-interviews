import { Difficulty, TheoryProblem } from '@/types/problem';
import React from 'react';

interface TheoryInterviewProps {
  problem: TheoryProblem;
  difficulty: Difficulty;
}

const TheoryInterview: React.FC<TheoryInterviewProps> = ({ problem, difficulty }) => {
  return (
    <div className="flex-1 flex flex-col gap-4 p-6 bg-secondary rounded-lg border border-border overflow-y-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-text">{problem.title}</h1>
        
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium text-text">Question</h2>
          <p className="text-text leading-relaxed">{problem.question}</p>
        </div>
        
        {problem.keyPoints && problem.keyPoints.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium text-text">Key Points to Consider</h3>
            <ul className="list-disc list-inside text-text space-y-1">
              {problem.keyPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
        
        {problem.hints && problem.hints.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium text-text">Hints</h3>
            <ul className="list-disc list-inside text-text space-y-1">
              {problem.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheoryInterview;