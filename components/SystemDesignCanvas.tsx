import dynamic from 'next/dynamic';
import { forwardRef, useState, useImperativeHandle, useCallback } from 'react';

const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then((mod) => mod.Excalidraw),
  { ssr: false }
);

interface SystemDesignCanvasProps {
  onSubmit?: (code: string, drawingImage: string) => Promise<void>;
  onReady?: () => void;
}

const SystemDesignCanvas = forwardRef<any, SystemDesignCanvasProps>(({ onSubmit, onReady }, ref) => {
  const [excalidrawRef, setExcalidrawRef] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleExcalidrawRef = useCallback((ref: any) => {
    setExcalidrawRef(ref);
    if (ref) {
      // Wait a bit for the component to be fully initialized
      setTimeout(() => {
        setIsReady(true);
        setIsLoading(false);
        onReady?.();
      }, 100);
    } else {
      setIsReady(false);
      setIsLoading(true);
    }
  }, [onReady]);

  useImperativeHandle(ref, () => ({
    getSceneElements: () => {
      if (excalidrawRef && isReady) {
        try {
          return excalidrawRef.getSceneElements();
        } catch (error) {
          console.error('Error getting scene elements:', error);
          return [];
        }
      }
      return [];
    },
    getAppState: () => {
      if (excalidrawRef && isReady) {
        try {
          return excalidrawRef.getAppState();
        } catch (error) {
          console.error('Error getting app state:', error);
          return {};
        }
      }
      return {};
    },
    getFiles: () => {
      if (excalidrawRef && isReady) {
        try {
          return excalidrawRef.getFiles();
        } catch (error) {
          console.error('Error getting files:', error);
          return {};
        }
      }
      return {};
    },
    getImage: async () => {
      if (excalidrawRef && isReady) {
        try {
          const elements = excalidrawRef.getSceneElements();
          // Convert scene elements to base64 image
          // This is a simplified version - you might need to implement proper image export
          return btoa(JSON.stringify(elements));
        } catch (error) {
          console.error('Error getting image:', error);
          return '';
        }
      }
      return '';
    }
  }), [excalidrawRef, isReady]);

  return (
    <div className="w-full h-full border border-border rounded overflow-hidden">
      {isLoading && (
        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
          Loading System Design Canvas...
        </div>
      )}
      
      <Excalidraw
        ref={handleExcalidrawRef}
        initialData={{
          elements: [],
          appState: {
            viewBackgroundColor: '#ffffff',
            gridSize: 20,
            zoom: { value: 1 as any },
            scrollX: 0,
            scrollY: 0,
          },
        }}
        theme="light"
        UIOptions={{
          canvasActions: {
            saveToActiveFile: false,
            loadScene: false,
            export: false,
            saveAsImage: false,
            clearCanvas: true,
            toggleTheme: false,
            changeViewBackgroundColor: false,
          },
          dockedSidebarBreakpoint: 0,
          welcomeScreen: false,
        }}
        langCode="en-US"
        gridModeEnabled={true}
        zenModeEnabled={false}
        viewModeEnabled={false}
        name="System Design Canvas"
      />
    </div>
  );
});

SystemDesignCanvas.displayName = 'SystemDesignCanvas';

export default SystemDesignCanvas;