
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface ShiftsErrorHandlerProps {
  isOnline: boolean;
  isSlowConnection: boolean;
  error: string | null;
  onRetry: () => void;
}

const ShiftsErrorHandler: React.FC<ShiftsErrorHandlerProps> = ({
  isOnline,
  isSlowConnection,
  error,
  onRetry
}) => {
  return (
    <>
      {/* Network status indicators */}
      {!isOnline && (
        <Alert className="mb-4 border-orange-200 bg-orange-50">
          <WifiOff className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            Offline režim - změny budou synchronizovány při obnovení připojení
          </AlertDescription>
        </Alert>
      )}

      {isSlowConnection && isOnline && (
        <Alert className="mb-4 border-yellow-200 bg-yellow-50">
          <Wifi className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Pomalé připojení detekováno - načítání může trvat déle
          </AlertDescription>
        </Alert>
      )}

      {/* Error state */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <div className="mt-2">
            <Button 
              onClick={onRetry} 
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Zkusit znovu
            </Button>
          </div>
        </Alert>
      )}
    </>
  );
};

export default ShiftsErrorHandler;
