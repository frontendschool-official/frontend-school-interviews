import React from 'react';
import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: string;
  score?: number;
  isLoading?: boolean;
}

export default function FeedbackModal({ 
  isOpen, 
  onClose, 
  feedback, 
  score, 
  isLoading = false 
}: FeedbackModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-bodyBg rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text">AI Feedback</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <FiX className="text-text" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-text">Generating feedback...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {score !== undefined && (
                <div className="bg-secondary p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCheck className="text-green-500" />
                    <span className="font-semibold text-text">Score</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">{score}/100</div>
                </div>
              )}

              <div className="bg-secondary p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <FiAlertCircle className="text-blue-500" />
                  <span className="font-semibold text-text">Detailed Feedback</span>
                </div>
                <div className="text-text whitespace-pre-wrap leading-relaxed">
                  {feedback}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-bodyBg rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 