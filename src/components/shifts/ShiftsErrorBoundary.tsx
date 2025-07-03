
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorBoundaryWithFallback';

interface ShiftsErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

const ShiftsErrorFallback: React.FC<{ error: Error; resetError: () => void; onRetry?: () => void }> = ({
  error,
  resetError,
  onRetry
}) => {
  const { t } = useTranslation('shifts');

  const handleRetry = () => {
    resetError();
    onRetry?.();
  };

  return (
    <Alert variant="destructive" className="m-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t('errorTitle') || 'Chyba při zobrazení směn'}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-4">
          {t('errorMessage') || 'Došlo k neočekávané chybě při zobrazení směn. Zkuste stránku obnovit.'}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('retry') || 'Zkusit znovu'}
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm">Detaily chyby (pouze pro vývojáře)</summary>
            <pre className="text-xs mt-2 overflow-auto bg-muted p-2 rounded">
              {error.message}
              {'\n'}
              {error.stack}
            </pre>
          </details>
        )}
      </AlertDescription>
    </Alert>
  );
};

const ShiftsErrorBoundary: React.FC<ShiftsErrorBoundaryProps> = ({ children, onRetry }) => {
  return (
    <ErrorBoundaryWithFallback
      fallbackComponent={null}
      onError={(error, errorInfo) => {
        console.error('Shifts component error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundaryWithFallback>
  );
};

export default ShiftsErrorBoundary;
