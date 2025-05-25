
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { 
  CloudOff, 
  Wifi, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  Clock
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

  const getStatusInfo = () => {
    if (isOffline) {
      return {
        icon: CloudOff,
        text: compact ? 'Offline' : 'Režim offline',
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
        {queueCount > 0 && (
          <Badge variant="outline" className="text-xs px-1 py-0">
            {queueCount}
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
      
      {showDetails && queueCount > 0 && !isOffline && (
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
    </div>
  );
};

export default SyncStatusIndicator;
