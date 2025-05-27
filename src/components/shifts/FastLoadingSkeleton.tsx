
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useOptimizedNetworkStatus } from '@/hooks/useOptimizedNetworkStatus';

interface FastLoadingSkeletonProps {
  onRetry?: () => void;
  timeoutMs?: number;
}

const FastLoadingSkeleton: React.FC<FastLoadingSkeletonProps> = ({ 
  onRetry, 
  timeoutMs = 10000 
}) => {
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { isOnline, isSlowConnection, pingTime } = useOptimizedNetworkStatus();

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
      
      if (elapsed >= timeoutMs) {
        setHasTimedOut(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeoutMs]);

  const progress = Math.min((elapsedTime / timeoutMs) * 100, 100);

  if (hasTimedOut) {
    return (
      <Card className="border-dashed border-orange-200">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          {!isOnline ? (
            <WifiOff className="h-12 w-12 text-orange-500" />
          ) : (
            <RefreshCw className="h-12 w-12 text-orange-500" />
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-orange-700">
              {!isOnline ? 'Bez připojení' : 'Načítání trvá déle'}
            </h3>
            <p className="text-sm text-orange-600 mt-2">
              {!isOnline 
                ? 'Zkontrolujte připojení k internetu'
                : isSlowConnection 
                  ? 'Pomalé připojení detekováno'
                  : 'Server neodpovídá'
              }
            </p>
            
            {pingTime && (
              <p className="text-xs text-muted-foreground mt-1">
                Ping: {Math.round(pingTime)}ms
              </p>
            )}
          </div>

          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Zkusit znovu
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm text-muted-foreground">
            Načítání... {Math.round(elapsedTime / 1000)}s
          </span>
        </div>
        
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Simplified skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-6 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center p-3 border rounded">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FastLoadingSkeleton;
