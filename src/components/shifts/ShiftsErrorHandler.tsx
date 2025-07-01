
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface ShiftsErrorHandlerProps {
  error: string;
  onRetry: () => void;
  isOnline?: boolean;
  isSlowConnection?: boolean;
}

const ShiftsErrorHandler: React.FC<ShiftsErrorHandlerProps> = ({
  error,
  onRetry,
  isOnline = true,
  isSlowConnection = false
}) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Chyba při načítání směn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>{error}</p>
        </div>
        
        {!isOnline && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm">Nejste připojeni k internetu</span>
          </div>
        )}
        
        {isSlowConnection && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
            <Wifi className="h-4 w-4" />
            <span className="text-sm">Pomalé připojení detekováno</span>
          </div>
        )}
        
        <Button onClick={onRetry} className="w-full flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Zkusit znovu
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShiftsErrorHandler;
