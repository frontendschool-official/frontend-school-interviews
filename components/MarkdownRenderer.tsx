import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-text mb-4 mt-6 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-text mb-3 mt-5 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium text-text mb-2 mt-4 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium text-text mb-2 mt-3 first:mt-0">
              {children}
            </h4>
          ),
          
          // Paragraphs
          p: ({ children }) => (
            <p className="text-neutral leading-relaxed mb-4 last:mb-0">
              {children}
            </p>
          ),
          
          // Lists
          ul: ({ children }) => (
            <ul className="list-none space-y-2 mb-4 pl-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-neutral">
              {children}
            </ol>
          ),
          li: ({ children, ...props }: any) => (
            <li className={`flex items-start gap-2 text-neutral text-sm`}>
              {!props.ordered && <span className="text-amber-500 mt-1">•</span>}
              <span className="flex-1">{children}</span>
            </li>
          ),
          
          // Code
          code: ({ className, children, ...props }: any) => {
            if (props.inline) {
              return (
                <code className="bg-border px-2 py-1 rounded text-text font-mono text-sm">
                  {children}
                </code>
              );
            }
            return (
              <code className={`${className || ''} font-mono text-sm`}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-secondary border border-border rounded-lg p-4 overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 py-2 bg-secondary rounded-r-lg mb-4">
              {children}
            </blockquote>
          ),
          
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-border rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-secondary">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 text-left font-medium text-text">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2 text-neutral">
              {children}
            </td>
          ),
          
          // Links
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-primary hover:text-primary/80 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-text">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-text">
              {children}
            </em>
          ),
          
          // Horizontal rule
          hr: () => (
            <hr className="border-border my-6" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;