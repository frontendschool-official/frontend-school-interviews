import { useState, useEffect, useRef } from "react";

export const useInterviewUI = () => {
  const [isProblemPanelCollapsed, setIsProblemPanelCollapsed] = useState(false);
  const [problemPanelWidth, setProblemPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const problemPanelRef = useRef<HTMLDivElement>(null);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || !problemPanelRef.current) return;

    const newWidth = e.clientX;
    const minWidth = 300;
    const maxWidth = 600;

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setProblemPanelWidth(newWidth);
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  const toggleProblemPanel = () => {
    setIsProblemPanelCollapsed(!isProblemPanelCollapsed);
  };

  const setCanvasReady = (ready: boolean) => {
    setIsCanvasReady(ready);
  };

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
  }, [isResizing]);

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