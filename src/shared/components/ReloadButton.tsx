import React from 'react';
import { RefreshCw } from 'lucide-react';

type Props = {
  onClick: () => void;
  isLoading: boolean;
}

export const ReloadButton = ({ onClick, isLoading }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center p-2 rounded-full 
        text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700
        hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      aria-label="Reload data"
      title="Recargar datos"
    >
      <RefreshCw 
        className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} 
      />
    </button>
  );
};
