
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  WifiOff,
  CloudOff,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SyncError {
  id: string;
  message: string;
  type: 'network' | 'validation' | 'server' | 'timeout' | 'unknown';
  timestamp: Date;
  retryCount: number;
  entityType?: string;
  entityId?: string;
}

export interface SyncFeedbackProps {
  isOffline: boolean;
  isSyncing: boolean;
  syncProgress: number;
  queueCount: number;
  errors: SyncError[];
  lastSyncTime?: Date;
  onRetryError: (errorId: string) => void;
  onDismissError: (errorId: string) => void;
  onRetryAll: () => void;
  className?: string;
}

export const SyncFeedback: React.FC<SyncFeedbackProps> = ({
  isOffline,
  isSyncing,
  syncProgress,
  queueCount,
  errors,
  lastSyncTime,
  onRetryError,
  onDismissError,
  onRetryAll,
  className
}) => {
  const activeErrors = errors.filter(error => error.retryCount < 3);
  const hasErrors = activeErrors.length > 0;

  const getErrorIcon = (type: SyncError['type']) => {
    switch (type) {
      case 'network':
        return WifiOff;
      case 'server':
        return CloudOff;
      case 'timeout':
        return Clock;
      case 'validation':
        return AlertTriangle;
      default:
        return XCircle;
    }
  };

  const getErrorColor = (type: SyncError['type']) => {
    switch (type) {
      case 'network':
        return 'text-orange-500';
      case 'server':
        return 'text-red-500';
      case 'timeout':
        return 'text-yellow-500';
      case 'validation':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusMessage = () => {
    if (isOffline) {
      return {
        icon: CloudOff,
        message: 'Pracujete offline',
        description: queueCount > 0 ? `${queueCount} změn čeká na synchronizaci` : 'Vše je uloženo lokálně',
        variant: 'default' as const
      };
    }

    if (isSyncing) {
      return {
        icon: RefreshCw,
        message: 'Synchronizace probíhá...',
        description: `${syncProgress}% dokončeno`,
        variant: 'default' as const
      };
    }

    if (hasErrors) {
      return {
        icon: AlertCircle,
        message: 'Chyby při synchronizaci',
        description: `${activeErrors.length} problémů vyžaduje pozornost`,
        variant: 'destructive' as const
      };
    }

    if (queueCount > 0) {
      return {
        icon: Clock,
        message: 'Čeká na synchronizaci',
        description: `${queueCount} změn bude synchronizováno`,
        variant: 'default' as const
      };
    }

    return {
      icon: CheckCircle,
      message: 'Vše synchronizováno',
      description: lastSyncTime ? `Poslední synchronizace: ${lastSyncTime.toLocaleTimeString()}` : 'Vše je aktuální',
      variant: 'default' as const
    };
  };

  const status = getStatusMessage();
  const StatusIcon = status.icon;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main status alert */}
      <Alert variant={status.variant}>
        <StatusIcon className={cn("h-4 w-4", isSyncing && "animate-spin")} />
        <AlertTitle>{status.message}</AlertTitle>
        <AlertDescription>{status.description}</AlertDescription>
      </Alert>

      {/* Sync progress */}
      {isSyncing && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Průběh synchronizace</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={syncProgress} className="mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Synchronizuji...</span>
              <span>{syncProgress}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error details */}
      {hasErrors && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Chyby synchronizace</CardTitle>
              {activeErrors.length > 1 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRetryAll}
                  className="h-6 px-2 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Opakovat vše
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeErrors.map((error) => {
                const ErrorIcon = getErrorIcon(error.type);
                const errorColor = getErrorColor(error.type);
                
                return (
                  <div key={error.id} className="flex items-start gap-2 p-2 rounded-md bg-muted/50">
                    <ErrorIcon className={cn("h-4 w-4 mt-0.5", errorColor)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {error.type}
                        </Badge>
                        {error.entityType && (
                          <Badge variant="secondary" className="text-xs">
                            {error.entityType}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {error.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{error.message}</p>
                      {error.retryCount > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Pokus #{error.retryCount + 1}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRetryError(error.id)}
                        className="h-6 w-6 p-0"
                        title="Opakovat"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDismissError(error.id)}
                        className="h-6 w-6 p-0"
                        title="Odmítnout"
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SyncFeedback;
