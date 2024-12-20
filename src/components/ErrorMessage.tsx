import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

export function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-red-50 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
      <AlertCircle className="w-5 h-5" />
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 text-red-600 hover:text-red-800"
      >
        ×
      </button>
    </div>
  );
}