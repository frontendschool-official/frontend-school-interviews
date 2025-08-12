import React from 'react';

export interface EditorShellProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  actions?: React.ReactNode;
}

export default function EditorShell({
  title,
  actions,
  className = '',
  children,
  ...props
}: EditorShellProps) {
  return (
    <div
      className={`flex flex-col border border-border rounded-xl overflow-hidden bg-bodyBg shadow-card ${className}`}
      {...props}
    >
      <div className='flex items-center justify-between px-4 py-2 bg-secondary border-b border-border'>
        <div className='flex items-center gap-2'>
          <span className='h-3 w-3 rounded-full bg-red-400' />
          <span className='h-3 w-3 rounded-full bg-amber-400' />
          <span className='h-3 w-3 rounded-full bg-green-400' />
          {title && <span className='ml-3 text-sm text-neutral'>{title}</span>}
        </div>
        <div className='flex items-center gap-2'>{actions}</div>
      </div>
      <div className='min-h-[320px]'>{children}</div>
    </div>
  );
}
