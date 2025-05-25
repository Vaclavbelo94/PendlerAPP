
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorBoundaryFallback = ({ error, resetError }: ErrorBoundaryFallbackProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
    resetError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Něco se pokazilo</CardTitle>
          <CardDescription>
            Omlouváme se, ale nastala neočekávaná chyba. 
            Zkuste obnovit stránku nebo se vrátit na hlavní stránku.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-mono text-muted-foreground">
              {error.message}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={resetError}
              className="flex-1 gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Zkusit znovu
            </Button>
            <Button
              onClick={handleGoHome}
              className="flex-1 gap-2"
            >
              <Home className="h-4 w-4" />
              Hlavní stránka
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorBoundaryFallback;
