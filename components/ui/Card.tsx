import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: "sm" | "md" | "lg" | "xl";
}

export default function Card({
  header,
  footer,
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  const paddingClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  return (
    <div
      className={`bg-bodyBg border border-border rounded-xl shadow-card overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      {header && (
        <div className="px-4 py-3 border-b border-border bg-secondary/60">
          {header}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
      {footer && (
        <div className="px-4 py-3 border-t border-border bg-secondary/60">
          {footer}
        </div>
      )}
    </div>
  );
}
