
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface VehicleErrorBoundaryProps {
  error: Error;
  onRetry: () => void;
  retryCount: number;
}

const VehicleErrorBoundary: React.FC<VehicleErrorBoundaryProps> = ({
  error,
  onRetry,
  retryCount
}) => {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        <CardTitle className="text-red-600">Chyba při načítání vozidel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          {error.message || 'Došlo k neočekávané chybě při načítání dat vozidel.'}
        </p>
        
        {retryCount < 3 && (
          <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Zkusit znovu
          </Button>
        )}
        
        {retryCount >= 3 && (
          <p className="text-sm text-muted-foreground">
            Po několika pokusech se nepodařilo načíst data. Zkuste obnovit stránku.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleErrorBoundary;
