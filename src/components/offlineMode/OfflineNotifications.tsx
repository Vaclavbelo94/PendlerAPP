
import React, { useEffect, useState } from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { toast } from '@/hooks/use-toast';
import { useSyncSettings } from '@/hooks/useSyncSettings';
import { useAuth } from '@/hooks/auth';

interface OfflineNotification {
  id: string;
  type: 'offline' | 'online' | 'sync-complete' | 'sync-error' | 'queue-full';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export const OfflineNotifications: React.FC = () => {
  const { isOffline, lastOnlineAt } = useOfflineStatus();
  const { queueCount, isSyncing } = useSyncQueue();
  const { settings } = useSyncSettings();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<OfflineNotification[]>([]);
  const [lastNotificationState, setLastNotificationState] = useState({
    wasOffline: false,
    lastQueueCount: 0,
    lastSyncState: false
  });

  // Show offline notification
  useEffect(() => {
    if (!user || !settings.showSyncNotifications) return;

    if (isOffline && !lastNotificationState.wasOffline) {
      const notification: OfflineNotification = {
        id: `offline-${Date.now()}`,
        type: 'offline',
        message: 'Přešli jste do offline režimu. Vaše změny budou uloženy lokálně.',
        timestamp: new Date(),
        acknowledged: false
      };

      setNotifications(prev => [notification, ...prev]);
      
      toast({
        title: "Offline režim",
        description: notification.message,
      });
    }

    setLastNotificationState(prev => ({ ...prev, wasOffline: isOffline }));
  }, [isOffline, lastNotificationState.wasOffline, user, settings.showSyncNotifications]);

  // Show online notification
  useEffect(() => {
    if (!user || !settings.showSyncNotifications) return;

    if (!isOffline && lastNotificationState.wasOffline && lastOnlineAt) {
      const offlineTime = Date.now() - lastOnlineAt.getTime();
      const offlineMinutes = Math.floor(offlineTime / (1000 * 60));
      
      const notification: OfflineNotification = {
        id: `online-${Date.now()}`,
        type: 'online',
        message: `Připojení obnoveno po ${offlineMinutes} minutách offline.`,
        timestamp: new Date(),
        acknowledged: false
      };

      setNotifications(prev => [notification, ...prev]);
      
      if (queueCount > 0) {
        toast({
          title: "Připojení obnoveno",
          description: `Synchronizuji ${queueCount} nevyřízených změn...`,
        });
      } else {
        toast({
          title: "Připojení obnoveno",
          description: notification.message,
        });
      }
    }
  }, [isOffline, lastNotificationState.wasOffline, lastOnlineAt, queueCount, user, settings.showSyncNotifications]);

  // Show sync completion notification
  useEffect(() => {
    if (!user || !settings.showSyncNotifications) return;

    if (!isSyncing && lastNotificationState.lastSyncState && lastNotificationState.lastQueueCount > 0 && queueCount === 0) {
      const notification: OfflineNotification = {
        id: `sync-complete-${Date.now()}`,
        type: 'sync-complete',
        message: `Synchronizace dokončena. ${lastNotificationState.lastQueueCount} změn bylo úspěšně synchronizováno.`,
        timestamp: new Date(),
        acknowledged: false
      };

      setNotifications(prev => [notification, ...prev]);
      
      toast({
        title: "Synchronizace dokončena",
        description: notification.message,
      });
    }

    setLastNotificationState(prev => ({ 
      ...prev, 
      lastSyncState: isSyncing,
      lastQueueCount: isSyncing ? queueCount : prev.lastQueueCount
    }));
  }, [isSyncing, queueCount, lastNotificationState.lastSyncState, lastNotificationState.lastQueueCount, user, settings.showSyncNotifications]);

  // Show queue full warning
  useEffect(() => {
    if (!user || !settings.showSyncNotifications) return;

    if (queueCount >= 50 && queueCount > lastNotificationState.lastQueueCount) {
      const notification: OfflineNotification = {
        id: `queue-full-${Date.now()}`,
        type: 'queue-full',
        message: 'Fronta synchronizace je téměř plná. Doporučujeme připojit se k internetu.',
        timestamp: new Date(),
        acknowledged: false
      };

      setNotifications(prev => [notification, ...prev]);
      
      toast({
        title: "Fronta synchronizace plná",
        description: notification.message,
        variant: "destructive"
      });
    }

    setLastNotificationState(prev => ({ ...prev, lastQueueCount: queueCount }));
  }, [queueCount, lastNotificationState.lastQueueCount, user, settings.showSyncNotifications]);

  // Clean up old notifications
  useEffect(() => {
    const cleanup = setInterval(() => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      setNotifications(prev => prev.filter(n => n.timestamp > twoHoursAgo));
    }, 60 * 1000); // Clean up every minute

    return () => clearInterval(cleanup);
  }, []);

  // This component doesn't render anything - it just manages notifications
  return null;
};

export default OfflineNotifications;
