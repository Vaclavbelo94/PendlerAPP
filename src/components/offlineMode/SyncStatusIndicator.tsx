
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useSyncErrorHandler } from '@/hooks/useSyncErrorHandler';
import { 
  CloudOff, 
  Wifi, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyncStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  className,
  showDetails = false,
  compact = false
}) => {
  const { isOffline } = useOfflineStatus();
  const { queueCount, isSyncing, processQueue } = useSyncQueue();
  const { errors } = useSyncErrorHandler();

  const getStatusInfo = () => {
    if (isOffline) {
      return {
        icon: CloudOff,
        text: compact ? 'Offline' : 'Režim offline',
        variant: 'destructive' as const,
        color: 'text-red-500'
      };
    }

    if (errors.length > 0) {
      return {
        icon: XCircle,
        text: compact ? `${errors.length} chyb` : `${errors.length} chyb synchronizace`,
        variant: 'destructive' as const,
        color: 'text-red-500'
      };
    }

    if (isSyncing) {
      return {
        icon: RefreshCw,
        text: compact ? 'Sync...' : 'Synchronizuji...',
        variant: 'secondary' as const,
        color: 'text-blue-500',
        animate: true
      };
    }

    if (queueCount > 0) {
      return {
        icon: Clock,
        text: compact ? `${queueCount} čeká` : `${queueCount} změn čeká na synchronizaci`,
        variant: 'outline' as const,
        color: 'text-orange-500'
      };
    }

    return {
      icon: CheckCircle,
      text: compact ? 'Sync' : 'Vše synchronizováno',
      variant: 'default' as const,
      color: 'text-green-500'
    };
  };

  const status = getStatusInfo();
  const Icon = status.icon;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Icon 
          className={cn("h-3 w-3", status.color, status.animate && "animate-spin")} 
        />
        {(queueCount > 0 || errors.length > 0) && (
          <Badge variant="outline" className="text-xs px-1 py-0">
            {errors.length > 0 ? errors.length : queueCount}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge variant={status.variant} className="flex items-center gap-1">
        <Icon 
          className={cn("h-3 w-3", status.animate && "animate-spin")} 
        />
        {status.text}
      </Badge>
      
      {showDetails && queueCount > 0 && !isOffline && errors.length === 0 && (
        <Button
          size="sm"
          variant="outline"
          onClick={processQueue}
          disabled={isSyncing}
          className="h-6 px-2 text-xs"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              Sync...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3 mr-1" />
              Synchronizovat
            </>
          )}
        </Button>
      )}

      {showDetails && errors.length > 0 && (
        <Badge variant="destructive" className="text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          {errors.length} chyb
        </Badge>
      )}
    </div>
  );
};

export default SyncStatusIndicator;
