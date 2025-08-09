import { useState, useEffect, useRef, useCallback } from "react";

export const useInterviewUI = () => {
  const [isProblemPanelCollapsed, setIsProblemPanelCollapsed] = useState(false);
  const [problemPanelWidth, setProblemPanelWidth] = useState("30%");
  const [isResizing, setIsResizing] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const problemPanelRef = useRef<HTMLDivElement>(null);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    // Prevent text selection during resize
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  }, []);

  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      const minWidth = "30%";
      const maxWidth = window.innerWidth * 0.6; // Max 60% of screen width

      if (newWidth >= parseInt(minWidth) && newWidth <= maxWidth) {
        setProblemPanelWidth(newWidth.toString());
      }
    },
    [isResizing]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    // Restore normal cursor and text selection
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, []);

  const toggleProblemPanel = useCallback(() => {
    setIsProblemPanelCollapsed(!isProblemPanelCollapsed);
  }, [isProblemPanelCollapsed]);

  const setCanvasReady = useCallback((ready: boolean) => {
    setIsCanvasReady(ready);
  }, []);

  // Add resize event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", handleResizeEnd);

      return () => {
        document.removeEventListener("mousemove", handleResize);
        document.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isResizing, handleResize, handleResizeEnd]);

  return {
    isProblemPanelCollapsed,
    problemPanelWidth,
    isResizing,
    isCanvasReady,
    problemPanelRef,
    handleResizeStart,
    toggleProblemPanel,
    setCanvasReady,
  };
};
