
import React, { useEffect, useCallback } from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { useAuth } from '@/hooks/auth';
import { toast } from '@/hooks/use-toast';

interface AutoSyncManagerProps {
  syncInterval?: number; // in milliseconds
  enableToasts?: boolean;
}

export const AutoSyncManager: React.FC<AutoSyncManagerProps> = ({
  syncInterval = 30000, // 30 seconds default
  enableToasts = true
}) => {
  const { isOffline, lastOnlineAt } = useOfflineStatus();
  const { processQueue, queueCount, isSyncing } = useSyncQueue();
  const { user } = useAuth();

  // Handle automatic sync when coming online
  const handleOnlineSync = useCallback(async () => {
    if (!isOffline && queueCount > 0 && user) {
      if (enableToasts) {
        toast({
          title: "Připojení obnoveno",
          description: `Synchronizuji ${queueCount} nevyřízených změn...`
        });
      }
      
      await processQueue();
    }
  }, [isOffline, queueCount, user, processQueue, enableToasts]);

  // Periodic sync when online
  const handlePeriodicSync = useCallback(async () => {
    if (!isOffline && queueCount > 0 && user && !isSyncing) {
      await processQueue();
    }
  }, [isOffline, queueCount, user, isSyncing, processQueue]);

  // Effect for handling online/offline transitions
  useEffect(() => {
    if (!isOffline && lastOnlineAt) {
      // We just came online
      const timeOffline = Date.now() - lastOnlineAt.getTime();
      
      // If we were offline for more than 5 minutes, force sync
      if (timeOffline > 5 * 60 * 1000) {
        handleOnlineSync();
      }
    }
  }, [isOffline, lastOnlineAt, handleOnlineSync]);

  // Effect for periodic sync
  useEffect(() => {
    if (isOffline || !user) return;

    const interval = setInterval(handlePeriodicSync, syncInterval);
    return () => clearInterval(interval);
  }, [isOffline, user, syncInterval, handlePeriodicSync]);

  // This component doesn't render anything
  return null;
};

export default AutoSyncManager;
