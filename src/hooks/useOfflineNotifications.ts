
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useOfflineStatus } from './useOfflineStatus';
import { useSyncSettings } from './useSyncSettings';
import { useAuth } from '@/hooks/auth';

export const useOfflineNotifications = () => {
  const { isOffline } = useOfflineStatus();
  const { settings } = useSyncSettings();
  const { user } = useAuth();
  const [offlineToastShown, setOfflineToastShown] = useState(false);
  const [onlineToastShown, setOnlineToastShown] = useState(false);

  useEffect(() => {
    if (isOffline && user && settings.showSyncNotifications && !offlineToastShown) {
      toast('Offline režim', {
        description: 'Aplikace je nyní v offline režimu.',
      });
      setOfflineToastShown(true);
      setOnlineToastShown(false);
    } else if (!isOffline && user && settings.showSyncNotifications && !onlineToastShown) {
      toast('Online režim', {
        description: 'Aplikace je nyní v online režimu.',
      });
      setOnlineToastShown(true);
      setOfflineToastShown(false);
    }
  }, [isOffline, user, settings.showSyncNotifications, offlineToastShown, onlineToastShown]);

  return { offlineToastShown, onlineToastShown };
};
