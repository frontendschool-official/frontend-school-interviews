import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useThemeContext } from '@/hooks/useTheme';

interface SystemDesignCanvasProps {
  onReady?: () => void;
  onSave?: (data: string) => void;
}

interface CanvasData {
  elements: unknown[];
  appState: Record<string, unknown>;
}

export interface SystemDesignCanvasRef {
  getScene: () => CanvasData;
  exportToCanvas: () => Promise<HTMLCanvasElement>;
}

const SystemDesignCanvas = forwardRef<
  SystemDesignCanvasRef,
  SystemDesignCanvasProps
>(({ onReady }, ref) => {
  const { theme } = useThemeContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (canvasRef.current && !isReady) {
      // Initialize canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Set background
        ctx.fillStyle = theme === 'dark' ? '#1a1a1a' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        setIsReady(true);
        onReady?.();
      }
    }
  }, [theme, isReady, onReady]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw a simple shape on click
      ctx.fillStyle = theme === 'dark' ? '#3b82f6' : '#1d4ed8';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const getScene = (): CanvasData => {
    return {
      elements: [],
      appState: {},
    };
  };

  const exportToCanvas = async (): Promise<HTMLCanvasElement> => {
    if (!canvasRef.current) {
      throw new Error('Canvas not ready');
    }
    return canvasRef.current;
  };

  useImperativeHandle(ref, () => ({
    getScene,
    exportToCanvas,
  }));

  return (
    <div className='w-full h-full border border-border rounded overflow-hidden'>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className='w-full h-full cursor-crosshair'
        style={{
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        }}
      />
    </div>
  );
});

SystemDesignCanvas.displayName = 'SystemDesignCanvas';

export default SystemDesignCanvas;
