
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ShiftFormErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

interface ShiftFormErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ShiftFormErrorBoundary extends React.Component<
  ShiftFormErrorBoundaryProps,
  ShiftFormErrorBoundaryState
> {
  constructor(props: ShiftFormErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ShiftFormErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ShiftForm error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
        this.props.onRetry?.();
      };

      return (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Chyba při zobrazení formuláře</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">
              Došlo k chybě při zobrazení formuláře směny. Zkuste to znovu.
            </p>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Zkusit znovu
            </Button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm">Detaily chyby (pouze pro vývojáře)</summary>
                <pre className="text-xs mt-2 overflow-auto bg-muted p-2 rounded">
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ShiftFormErrorBoundary;
