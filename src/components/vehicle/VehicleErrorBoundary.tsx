
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface VehicleErrorBoundaryProps {
  error: string;
  onRetry: () => void;
  retryCount: number;
}

const VehicleErrorBoundary: React.FC<VehicleErrorBoundaryProps> = ({ 
  error, 
  onRetry, 
  retryCount 
}) => {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <CardTitle className="text-red-700">Chyba při načítání vozidel</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground text-sm">
          {error}
        </p>
        
        {retryCount > 0 && (
          <p className="text-xs text-muted-foreground">
            Pokusů o opětovné načtení: {retryCount}
          </p>
        )}
        
        <div className="space-y-2">
          <Button onClick={onRetry} className="w-full" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Zkusit znovu
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Zkontrolujte připojení k internetu a zkuste to znovu
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleErrorBoundary;
