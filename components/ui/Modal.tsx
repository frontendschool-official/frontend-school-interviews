import React, { useEffect, useRef } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
  variant?: "default" | "full" | "2xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  initialFocusRef,
  variant = "default",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      const toFocus =
        initialFocusRef?.current ||
        containerRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
      toFocus?.focus();
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, initialFocusRef]);

  if (!isOpen) return null;

  const VARIANTS = {
    default: "w-full max-w-lg",
    full: "w-full max-w-full",
    "2xl": "w-full max-w-2xl",
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
    >
      <div
        ref={containerRef}
        className={`w-full max-w-${VARIANTS[variant]} rounded-xl border border-border bg-bodyBg shadow-lg `}
      >
        {title && (
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text">{title}</h2>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
