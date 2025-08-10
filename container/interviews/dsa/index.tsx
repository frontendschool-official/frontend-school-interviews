import { DSAProblem } from "@/types/problem";
import { DifficultyBadge, TechnologyTag } from "@/styles/SharedUI";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface DSAProblemRendererProps {
  problem: DSAProblem;
}

const DSAProblemRenderer = ({ problem }: DSAProblemRendererProps) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="border-b border-border pb-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <h1 className="text-2xl font-semibold text-text">
          {problem?.title || "DSA Problem"}
        </h1>
        <div className="flex items-center gap-3">
          <DifficultyBadge difficulty={problem?.difficulty}>
            {problem?.difficulty}
          </DifficultyBadge>
          <span className="text-sm text-neutral">{problem?.estimatedTime}</span>
        </div>
      </div>
      <MarkdownRenderer
        content={problem?.problemStatement || ""}
        className="text-neutral leading-relaxed"
      />
    </div>

    {/* Input Format */}
    {problem?.inputFormat && (
      <div>
        <h3 className="font-medium text-text mb-3">Input Format</h3>
        <MarkdownRenderer
          content={problem?.inputFormat}
          className="text-neutral text-sm leading-relaxed"
        />
      </div>
    )}

    {/* Output Format */}
    {problem?.outputFormat && (
      <div>
        <h3 className="font-medium text-text mb-3">Output Format</h3>
        <MarkdownRenderer
          content={problem?.outputFormat}
          className="text-neutral text-sm leading-relaxed"
        />
      </div>
    )}

    {/* Constraints */}
    {problem?.constraints && (
      <div>
        <h3 className="font-medium text-text mb-3">Constraints</h3>
        {Array.isArray(problem?.constraints) ? (
          <ul className="space-y-2">
            {problem?.constraints?.map((constraint, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-neutral text-sm"
              >
                <span className="text-amber-500 mt-1">•</span>
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        ) : (
          <MarkdownRenderer
            content={problem?.constraints}
            className="text-neutral text-sm leading-relaxed"
          />
        )}
      </div>
    )}

    {/* Examples */}
    {problem?.examples && problem?.examples?.length > 0 && (
      <div>
        <h3 className="font-medium text-text mb-3">Examples</h3>
        <div className="space-y-4">
          {problem?.examples?.map((example, index) => (
            <div
              key={index}
              className="bg-secondary border border-border rounded-lg p-4"
            >
              <p className="font-medium text-text mb-2">Example {index + 1}</p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-neutral">Input:</span>
                  <code className="ml-2 bg-border px-2 py-1 rounded text-text">
                    {example?.input}
                  </code>
                </div>
                <div>
                  <span className="font-medium text-neutral">Output:</span>
                  <code className="ml-2 bg-border px-2 py-1 rounded text-text">
                    {example?.output}
                  </code>
                </div>
                {example?.explanation && (
                  <div>
                    <span className="font-medium text-neutral mb-2 block">
                      Explanation:
                    </span>
                    <MarkdownRenderer
                      content={example?.explanation}
                      className="text-neutral text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Hints */}
    {problem?.hints && problem?.hints?.length > 0 && (
      <div>
        <h3 className="font-medium text-text mb-3">Hints</h3>
        <ul className="space-y-3">
          {problem?.hints?.map((hint, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-neutral text-sm"
            >
              <span className="text-primary mt-1">💡</span>
              <div className="flex-1">
                <MarkdownRenderer
                  content={hint}
                  className="text-neutral text-sm"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Category */}
    {problem?.category && (
      <div>
        <h3 className="font-medium text-text mb-3">Category</h3>
        <p className="text-neutral text-sm">{problem?.category}</p>
      </div>
    )}

    {/* Tags */}
    {problem?.tags && problem?.tags?.length > 0 && (
      <div>
        <h3 className="font-medium text-text mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {problem?.tags?.map((tag, index) => (
            <TechnologyTag key={index}>{tag}</TechnologyTag>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default DSAProblemRenderer;
