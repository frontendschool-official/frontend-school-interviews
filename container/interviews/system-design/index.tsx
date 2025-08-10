import { DifficultyBadge, TechnologyTag } from "@/styles/SharedUI";
import { ISystemDesignProblem } from "../interviews.types";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface SystemDesignProblemProps {
  problem: ISystemDesignProblem;
}

const SystemDesignProblem = ({ problem }: SystemDesignProblemProps) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="border-b border-border pb-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <h1 className="text-2xl font-semibold text-text">
          {problem?.title || "System Design Problem"}
        </h1>
        <div className="flex items-center gap-3">
          <DifficultyBadge difficulty={problem?.difficulty}>
            {problem?.difficulty}
          </DifficultyBadge>
          <span className="text-sm text-neutral">{problem?.estimatedTime}</span>
        </div>
      </div>
      <MarkdownRenderer 
        content={problem?.description || ""} 
        className="text-neutral leading-relaxed"
      />
    </div>

    {/* Requirements */}
    <div>
      <h3 className="font-medium text-text mb-3">Functional Requirements</h3>
      <ul className="space-y-3 text-left">
        {problem?.functionalRequirements?.map((req, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-neutral text-sm align-baseline"
          >
            <span className="text-primary mt-1">•</span>
            <div className="flex-1">
              <MarkdownRenderer 
                content={req} 
                className="text-neutral text-sm"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h3 className="font-medium text-text mb-3">
        Non-Functional Requirements
      </h3>
      <ul className="space-y-3">
        {problem?.nonFunctionalRequirements?.map((req, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-neutral text-sm"
          >
            <span className="text-primary mt-1">•</span>
            <div className="flex-1">
              <MarkdownRenderer 
                content={req} 
                className="text-neutral text-sm"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
    {/* Constraints */}
    {problem?.constraints && problem.constraints.length > 0 && (
      <div>
        <h3 className="font-medium text-text mb-3">Constraints</h3>
        <ul className="space-y-3">
          {problem.constraints.map((constraint, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-neutral text-sm"
            >
              <span className="text-amber-500 mt-1">•</span>
              <div className="flex-1">
                <MarkdownRenderer 
                  content={constraint} 
                  className="text-neutral text-sm"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Scale */}
    {problem?.scale && (
      <div>
        <h3 className="font-medium text-text mb-3">Scale Requirements</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-neutral">Users:</span>
            <p className="font-medium text-text">{problem.scale?.users}</p>
          </div>
          <div>
            <span className="text-neutral">Requests/sec:</span>
            <p className="font-medium text-text">
              {problem.scale?.requestsPerSecond}
            </p>
          </div>
          <div>
            <span className="text-neutral">Data Size:</span>
            <p className="font-medium text-text">{problem.scale?.dataSize}</p>
          </div>
        </div>
      </div>
    )}

    {/* Expected Deliverables */}
    {problem?.expectedDeliverables &&
      problem.expectedDeliverables.length > 0 && (
        <div>
          <h3 className="font-medium text-text mb-3">Expected Deliverables</h3>
          <ol className="space-y-3">
            {problem.expectedDeliverables.map((deliverable, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-neutral text-sm"
              >
                <span className="text-primary mt-1 font-medium">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <MarkdownRenderer 
                    content={deliverable} 
                    className="text-neutral text-sm"
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

    {/* Technologies */}
    {problem?.technologies && problem.technologies.length > 0 && (
      <div>
        <h3 className="font-medium text-text mb-3">Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {problem.technologies.map((tech, index) => (
            <TechnologyTag key={index}>{tech}</TechnologyTag>
          ))}
        </div>
      </div>
    )}

    {/* Follow-up Questions */}
    {problem?.followUpQuestions && problem.followUpQuestions.length > 0 && (
      <div>
        <h3 className="font-medium text-text mb-3">Follow-up Questions</h3>
        <ul className="space-y-3">
          {problem.followUpQuestions.map((question, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-neutral text-sm"
            >
              <span className="text-primary mt-1">•</span>
              <div className="flex-1">
                <MarkdownRenderer 
                  content={question} 
                  className="text-neutral text-sm"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default SystemDesignProblem;
