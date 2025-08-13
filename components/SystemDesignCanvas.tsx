import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useThemeContext } from '@/hooks/useTheme';
import dynamic from 'next/dynamic';

// Dynamically import Excalidraw to avoid SSR issues
const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then(mod => mod.Excalidraw),
  {
    ssr: false,
    loading: () => (
      <div className='w-full h-full border border-border rounded overflow-hidden flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2'></div>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Loading Excalidraw...
          </p>
        </div>
      </div>
    ),
  }
);

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
  console.log('SystemDesignCanvas: Initializing Excalidraw');
  const { theme, isInitialized } = useThemeContext();
  const excalidrawRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isInitialized || !isClient) {
      console.log(
        'SystemDesignCanvas: Waiting for theme initialization or client'
      );
      return;
    }

    if (excalidrawRef.current) {
      setError(null);
      console.log('SystemDesignCanvas: Excalidraw initialized successfully');
      onReady?.();
    }
  }, [isInitialized, isClient, onReady]);

  const getScene = (): CanvasData => {
    if (excalidrawRef.current) {
      return excalidrawRef.current.getScene();
    }
    return {
      elements: [],
      appState: {},
    };
  };

  const exportToCanvas = async (): Promise<HTMLCanvasElement> => {
    if (!excalidrawRef.current) {
      throw new Error('Excalidraw not ready');
    }
    return excalidrawRef.current.exportToCanvas();
  };

  useImperativeHandle(ref, () => ({
    getScene,
    exportToCanvas,
  }));

  if (error) {
    return (
      <div className='w-full h-full border border-border rounded overflow-hidden flex items-center justify-center bg-red-50 dark:bg-red-900/20'>
        <div className='text-center'>
          <p className='text-red-600 dark:text-red-400 mb-2'>
            Failed to load Excalidraw
          </p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>{error}</p>
        </div>
      </div>
    );
  }

  if (!isInitialized || !isClient) {
    return (
      <div className='w-full h-full border border-border rounded overflow-hidden flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2'></div>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Initializing Excalidraw...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className='w-full h-full border border-border rounded overflow-hidden'>
      <Excalidraw
        ref={excalidrawRef}
        theme={theme === 'light' ? 'light' : 'dark'}
        initialData={{
          elements: [],
          appState: {
            viewBackgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
            gridSize: 20,
          },
        }}
        UIOptions={{
          canvasActions: {
            saveToActiveFile: false,
            loadScene: false,
            export: false,
            saveAsImage: false,
            clearCanvas: true,
            changeViewBackgroundColor: true,
          },
          dockedSidebarBreakpoint: 0,
          welcomeScreen: false,
        }}
      />
    </div>
  );
});

SystemDesignCanvas.displayName = 'SystemDesignCanvas';

export default SystemDesignCanvas;
