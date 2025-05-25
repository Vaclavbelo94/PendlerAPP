
import React from 'react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ShiftsErrorBoundaryProps {
  children: React.ReactNode;
}

export const ShiftsErrorBoundary: React.FC<ShiftsErrorBoundaryProps> = ({ children }) => {
  const fallbackComponent = (
    <div className="container py-6 md:py-10 max-w-7xl mx-auto">
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Chyba v aplikaci směn</AlertTitle>
        <AlertDescription className="mt-2">
          Došlo k neočekávané chybě při načítání směn. Zkuste obnovit stránku nebo kontaktujte podporu.
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Obnovit stránku
        </Button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error, errorInfo) => {
        console.error('Shifts Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
