
import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('=== APPLICATION ERROR ===');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('========================');
  };

  const fallbackComponent = (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Chyba aplikace</h1>
        <p className="text-muted-foreground">
          Aplikace narazila na neočekávanou chybu. Zkuste obnovit stránku.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Obnovit stránku
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary 
      onError={handleError}
      fallback={fallbackComponent}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
