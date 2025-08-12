import { useEffect } from 'react';
import { useAppStore } from '@/store';

export const useModal = (initialState = false) => {
  // We keep a single prompt modal state in store to keep UI consistent across pages
  const promptModalOpen = useAppStore(s => s.promptModalOpen);
  const setPromptModalOpen = useAppStore(s => s.setPromptModalOpen);

  // Respect initial override on first use
  useEffect(() => {
    if (initialState && !promptModalOpen) {
      setPromptModalOpen(true);
    }
  }, [initialState]); // Remove promptModalOpen from dependencies to prevent infinite loop

  const open = () => setPromptModalOpen(true);
  const close = () => setPromptModalOpen(false);
  const toggle = () => setPromptModalOpen(!promptModalOpen);

  return {
    isOpen: promptModalOpen,
    open,
    close,
    toggle,
  };
};
