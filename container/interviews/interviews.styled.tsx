import React from 'react';

interface ProblemSectionProps {
  children: React.ReactNode;
}

interface TechnologyTagsProps {
  children: React.ReactNode;
}

interface ExampleBoxProps {
  children: React.ReactNode;
}

interface ScaleInfoProps {
  children: React.ReactNode;
}

interface MainContentProps {
  children: React.ReactNode;
}

interface ProblemPanelProps {
  children: React.ReactNode;
  isCollapsed: boolean;
  style?: React.CSSProperties;
}

interface ProblemHeaderProps {
  children: React.ReactNode;
}

interface ProblemContentProps {
  children: React.ReactNode;
}

interface ActionButtonsProps {
  children: React.ReactNode;
}

interface EditorContainerProps {
  children: React.ReactNode;
}

interface OutputPanelProps {
  children: React.ReactNode;
  isVisible?: boolean;
}

interface OutputHeaderProps {
  children: React.ReactNode;
}

interface OutputContentProps {
  children: React.ReactNode;
}

interface AuthMessageProps {
  children: React.ReactNode;
}

interface ResizerProps {
  children?: React.ReactNode;
  onResize?: (width: number) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}

interface CollapseButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

interface EditorPanelProps {
  children: React.ReactNode;
}

interface EditorHeaderProps {
  children: React.ReactNode;
}

interface EditorTabsProps {
  children: React.ReactNode;
}

interface TabProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const ProblemSection: React.FC<ProblemSectionProps> = ({ children }) => (
  <div className='mb-8'>{children}</div>
);

export const TechnologyTags: React.FC<TechnologyTagsProps> = ({ children }) => (
  <div className='flex flex-wrap gap-2 mt-2'>{children}</div>
);

export const ExampleBox: React.FC<ExampleBoxProps> = ({ children }) => (
  <div className='bg-secondary border border-border rounded-lg p-4 mb-4'>
    {children}
  </div>
);

export const ScaleInfo: React.FC<ScaleInfoProps> = ({ children }) => (
  <div className='bg-primary/10 border border-primary/30 rounded-lg p-4'>
    {children}
  </div>
);

export const MainContent: React.FC<MainContentProps> = ({ children }) => (
  <div className='flex h-screen overflow-hidden'>{children}</div>
);

export const ProblemPanel = React.forwardRef<HTMLDivElement, ProblemPanelProps>(
  ({ children, isCollapsed, style }, ref) => (
    <div
      ref={ref}
      className={`relative bg-secondary border-r border-border overflow-hidden transition-all duration-300 shadow-sm ${
        isCollapsed ? 'flex items-center justify-center' : 'flex flex-col'
      }`}
      style={style}
    >
      {children}
    </div>
  )
);

ProblemPanel.displayName = 'ProblemPanel';

export const ProblemHeader: React.FC<ProblemHeaderProps> = ({ children }) => (
  <div className='p-6 border-b border-border bg-bodyBg'>{children}</div>
);

export const ProblemContent: React.FC<ProblemContentProps> = ({ children }) => (
  <div className='p-6 bg-bodyBg overflow-y-auto'>{children}</div>
);

export const ActionButtons: React.FC<ActionButtonsProps> = ({ children }) => (
  <div className='flex gap-4 mt-4'>{children}</div>
);

export const EditorContainer: React.FC<EditorContainerProps> = ({
  children,
}) => <div className='flex-1 flex flex-col'>{children}</div>;

export const OutputPanel: React.FC<OutputPanelProps> = ({
  children,
  isVisible = true,
}) => (
  <div
    className={`bg-secondary border-t border-border h-48 overflow-y-auto transition-all duration-300 ${
      isVisible ? 'block' : 'hidden'
    }`}
  >
    {children}
  </div>
);

export const OutputHeader: React.FC<OutputHeaderProps> = ({ children }) => (
  <div className='px-4 py-3 bg-secondary border-b border-border font-semibold text-text'>
    {children}
  </div>
);

export const OutputContent: React.FC<OutputContentProps> = ({ children }) => (
  <div className='p-4 font-mono text-sm leading-relaxed text-text'>
    {children}
  </div>
);

export const AuthMessage: React.FC<AuthMessageProps> = ({ children }) => (
  <div className='bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-200'>
    {children}
  </div>
);

export const Resizer: React.FC<ResizerProps> = ({ children, onMouseDown }) => (
  <div
    className='absolute top-0 right-0 w-1 h-full bg-neutral hover:bg-primary cursor-col-resize transition-colors duration-200 z-10'
    onMouseDown={onMouseDown}
  >
    {children}
  </div>
);

export const CollapseButton: React.FC<CollapseButtonProps> = ({
  children,
  onClick,
}) => (
  <button
    onClick={onClick}
    className='p-2 bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-colors duration-200'
  >
    {children}
  </button>
);

export const EditorPanel: React.FC<EditorPanelProps> = ({ children }) => (
  <div className='flex-1 flex flex-col bg-bodyBg'>{children}</div>
);

export const EditorHeader: React.FC<EditorHeaderProps> = ({ children }) => (
  <div className='p-4 border-b border-border bg-secondary'>{children}</div>
);

export const EditorTabs: React.FC<EditorTabsProps> = ({ children }) => (
  <div className='flex border-b border-border bg-secondary'>{children}</div>
);

export const Tab: React.FC<TabProps> = ({
  children,
  active = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
      active
        ? 'text-primary border-primary bg-primary/10'
        : 'text-text border-transparent hover:text-primary hover:bg-secondary/50'
    }`}
  >
    {children}
  </button>
);
