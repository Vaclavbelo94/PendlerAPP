
import React from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';

interface ShiftsErrorHandlerProps {
  error: Error | string;
  onRetry?: () => void;
  isOnline?: boolean;
  isSlowConnection?: boolean;
}

const ShiftsErrorHandler: React.FC<ShiftsErrorHandlerProps> = ({
  error,
  onRetry,
  isOnline = true,
  isSlowConnection = false
}) => {
  const { t } = useTranslation('shifts');

  const errorMessage = typeof error === 'string' ? error : error.message;
  
  const getErrorTitle = () => {
    if (!isOnline) return 'Offline Mode';
    if (isSlowConnection) return 'Slow Connection';
    return 'Error Loading Shifts';
  };

  const getErrorDescription = () => {
    if (!isOnline) {
      return 'You are currently offline. Your changes will be saved locally and synced when you reconnect.';
    }
    if (isSlowConnection) {
      return 'Connection is slow. Some features may take longer to load.';
    }
    return errorMessage;
  };

  const getIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4" />;
    if (isSlowConnection) return <Wifi className="h-4 w-4 text-orange-500" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <div className="max-w-md w-full">
        <Alert variant={!isOnline ? "default" : "destructive"}>
          {getIcon()}
          <AlertTitle>{getErrorTitle()}</AlertTitle>
          <AlertDescription className="mt-2">
            {getErrorDescription()}
          </AlertDescription>
        </Alert>
        
        {onRetry && (
          <div className="mt-4 text-center">
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftsErrorHandler;
