import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
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

const SystemDesignCanvas = forwardRef<any>((props, ref) => {
  return (
    <Wrapper>
      <Excalidraw ref={ref} />
    </Wrapper>
  );
});

export default SystemDesignCanvas;