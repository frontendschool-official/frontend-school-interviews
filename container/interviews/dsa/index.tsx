import { DSAProblem } from "../../../types/problem";
import {
  DifficultyBadge,
  TechnologyTag,
} from "../../../styles/SharedUI";
import {
  ProblemSection,
  TechnologyTags,
  ExampleBox,
} from "../interviews.styled";

interface DSAProblemRendererProps {
  problem: DSAProblem;
}

const DSAProblemRenderer = ({ problem }: DSAProblemRendererProps) => (
  <div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "1rem",
      }}
    >
      <DifficultyBadge difficulty={problem.difficulty}>
        {problem.difficulty}
      </DifficultyBadge>
      <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
        ⏱️ {problem.estimatedTime}
      </span>
    </div>

    <ProblemSection>
      <h4>Problem Statement</h4>
      <p>{problem.problemStatement}</p>
    </ProblemSection>

    <ProblemSection>
      <h4>Input Format</h4>
      <p>{problem.inputFormat}</p>
    </ProblemSection>

    <ProblemSection>
      <h4>Output Format</h4>
      <p>{problem.outputFormat}</p>
    </ProblemSection>

    <ProblemSection>
      <h4>Constraints</h4>
      <ul>
        {problem.constraints.map((constraint, index) => (
          <li key={index}>{constraint}</li>
        ))}
      </ul>
    </ProblemSection>

    <ProblemSection>
      <h4>📝 Examples</h4>
      {problem.examples.map((example, index) => (
        <ExampleBox key={index}>
          <p>
            <strong>Example {index + 1}:</strong>
          </p>
          <p>
            <strong>Input:</strong> {example.input}
          </p>
          <p>
            <strong>Output:</strong> {example.output}
          </p>
          {example.explanation && (
            <p>
              <strong>Explanation:</strong> {example.explanation}
            </p>
          )}
        </ExampleBox>
      ))}
    </ProblemSection>

    {problem.hints && problem.hints.length > 0 && (
      <ProblemSection>
        <h4>💡 Hints</h4>
        <ul>
          {problem.hints.map((hint, index) => (
            <li key={index}>{hint}</li>
          ))}
        </ul>
      </ProblemSection>
    )}

    <ProblemSection>
      <h4>Category</h4>
      <p>{problem.category}</p>
    </ProblemSection>

    <ProblemSection>
      <h4>Tags</h4>
      <TechnologyTags>
        {problem.tags.map((tag, index) => (
          <TechnologyTag key={index}>{tag}</TechnologyTag>
        ))}
      </TechnologyTags>
    </ProblemSection>
  </div>
);

export default DSAProblemRenderer; 