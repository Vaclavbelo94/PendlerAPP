
import React from 'react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ShiftsErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ShiftsErrorFallback: React.FC<ShiftsErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div className="container py-6 md:py-10 max-w-7xl mx-auto">
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Chyba v aplikaci směn</AlertTitle>
        <AlertDescription className="mt-2">
          Došlo k neočekávané chybě při načítání směn.
          <details className="mt-2">
            <summary className="cursor-pointer text-sm">Technické detaily</summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-4">
        <Button onClick={resetErrorBoundary} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Zkusit znovu
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Obnovit stránku
        </Button>
      </div>
    </div>
  );
};

interface ShiftsErrorBoundaryProps {
  children: React.ReactNode;
}

export const ShiftsErrorBoundary: React.FC<ShiftsErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ShiftsErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Shifts Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
