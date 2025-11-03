import { createContext, useContext, useState, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  showLoading: () => {},
  hideLoading: () => {},
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const showLoading = (message?: string) => {
    setLoadingMessage(message ?? 'Cargando...');
  };

  const hideLoading = () => {
    setLoadingMessage(null);
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {loadingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner message={loadingMessage} />
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => useContext(LoadingContext);
