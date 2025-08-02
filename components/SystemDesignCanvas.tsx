import dynamic from 'next/dynamic';
import { forwardRef, useState, useImperativeHandle, useCallback } from 'react';
import styled from 'styled-components';

const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then((mod) => mod.Excalidraw),
  { ssr: false }
);

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  overflow: hidden;
`;

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
    <Wrapper>
      {isLoading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#666',
          fontSize: '14px'
        }}>
          Loading system design canvas...
        </div>
      )}
      <Excalidraw 
        ref={handleExcalidrawRef}
        onChange={(elements, appState, files) => {
          // Handle changes if needed
        }}
      />
    </Wrapper>
  );
});

SystemDesignCanvas.displayName = 'SystemDesignCanvas';

export default SystemDesignCanvas;