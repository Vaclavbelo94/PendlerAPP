
import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Application Error:', error, errorInfo);
    
    // Log to external service if needed
    // logErrorToService(error, errorInfo);
  };

  return (
    <ErrorBoundary 
      onError={handleError}
      fallback={<ErrorBoundaryFallback error={new Error('Application crashed')} resetError={() => window.location.reload()} />}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
