import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'centered' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-full mx-4',
};

const variantClasses = {
  default: 'items-start justify-center pt-16',
  centered: 'items-center justify-center',
  fullscreen: 'items-stretch justify-stretch',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'centered',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`relative bg-bodyBg rounded-lg shadow-xl w-full mx-4 overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {/* Header */}
      {(title || showCloseButton) && (
        <div
          className={`flex items-center justify-between p-6 border-b border-border ${headerClassName}`}
        >
          {title && (
            <h2 className='text-xl font-semibold text-text'>{title}</h2>
          )}
          {showCloseButton && (
            <button
              onClick={onClose}
              className='p-2 hover:bg-secondary rounded-lg transition-colors'
              aria-label='Close modal'
            >
              <FiX className='text-text' />
            </button>
          )}
        </div>
      )}

      {/* Body */}
      <div className={`p-6 overflow-y-auto ${bodyClassName}`}>{children}</div>

      {/* Footer */}
      {footer && (
        <div
          className={`flex justify-end p-6 border-t border-border ${footerClassName}`}
        >
          {footer}
        </div>
      )}
    </div>
  );

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm ${variantClasses[variant]}`}
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal */}
      <div className={`relative z-10 ${variantClasses[variant]}`}>
        {variant === 'fullscreen' ? (
          <div className='w-full h-full bg-bodyBg'>{modalContent}</div>
        ) : (
          modalContent
        )}
      </div>
    </div>
  );
}

// Specialized Modal Components
export const FeedbackModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  feedback: string;
  score?: number;
  isLoading?: boolean;
}> = ({ isOpen, onClose, feedback, score, isLoading = false }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='AI Feedback'
      size='xl'
      footer={
        <button
          onClick={onClose}
          className='px-6 py-2 bg-primary text-bodyBg rounded-lg font-medium hover:bg-accent transition-colors'
        >
          Close
        </button>
      }
    >
      {isLoading ? (
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          <span className='ml-3 text-text'>Generating feedback...</span>
        </div>
      ) : (
        <div className='space-y-4'>
          {score !== undefined && (
            <div className='bg-secondary p-4 rounded-lg border border-border'>
              <div className='flex items-center gap-2 mb-2'>
                <div className='w-5 h-5 bg-green-500 rounded-full flex items-center justify-center'>
                  <div className='w-2 h-2 bg-white rounded-full'></div>
                </div>
                <span className='font-semibold text-text'>Score</span>
              </div>
              <div className='text-3xl font-bold text-primary'>{score}/100</div>
            </div>
          )}

          <div className='bg-secondary p-4 rounded-lg border border-border'>
            <div className='flex items-center gap-2 mb-3'>
              <div className='w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center'>
                <div className='w-2 h-2 bg-white rounded-full'></div>
              </div>
              <span className='font-semibold text-text'>Detailed Feedback</span>
            </div>
            <div className='text-text whitespace-pre-wrap leading-relaxed'>
              {feedback}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export const PromptModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'centered' | 'fullscreen';
}> = ({
  visible,
  onClose,
  onSubmit,
  title = 'Interview Details',
  children,
  variant = 'centered',
}) => {
  return (
    <Modal
      isOpen={visible}
      onClose={onClose}
      title={title}
      size='lg'
      variant={variant}
      className='bg-secondary border border-border shadow-2xl'
      headerClassName='border-b border-border/50'
      bodyClassName='p-10'
      footer={
        <div className='flex gap-4'>
          <button
            onClick={onClose}
            className='flex-1 p-4 border-2 border-border/50 rounded-xl bg-secondary text-text text-base font-semibold transition-all duration-300 hover:bg-bodyBg hover:border-border'
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className='flex-1 p-4 bg-primary text-white rounded-xl text-base font-semibold transition-all duration-300 hover:bg-accent hover:-translate-y-0.5'
          >
            Generate Interview
          </button>
        </div>
      }
    >
      {children}
    </Modal>
  );
};
