
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useSyncSettings } from '@/hooks/useSyncSettings';
import { syncWithLocalStorage } from '@/utils/offlineStorage';
import { toast } from '@/hooks/use-toast';

interface OnlineSyncManagerProps {
  isInitialized: boolean;
  isNativeMode: boolean;
  isCheckingStatus: boolean;
  hasShownOnlineToast: boolean;
  onOnlineToastShown: () => void;
}

export const OnlineSyncManager: React.FC<OnlineSyncManagerProps> = ({
  isInitialized,
  isNativeMode,
  isCheckingStatus,
  hasShownOnlineToast,
  onOnlineToastShown
}) => {
  const { user, isPremium } = useAuth();
  const { isOffline } = useOfflineStatus();
  const { settings } = useSyncSettings();

  // Sync data back to server when coming online
  useEffect(() => {
    let isMounted = true;
    
    const handleOnlineMode = async () => {
      if (!(!isOffline && user && isInitialized && !isCheckingStatus)) {
        return;
      }
      
      if (hasShownOnlineToast) {
        return;
      }
      
      // In native app, we don't need to check premium status for sync
      if (!isPremium && !isNativeMode) {
        if (settings.showSyncNotifications) {
          const notificationShown = sessionStorage.getItem('syncNotificationShown');
          if (!notificationShown) {
            toast({
              title: "Omezená synchronizace",
              description: "Plná synchronizace je dostupná pouze pro prémiové uživatele",
            });
            sessionStorage.setItem('syncNotificationShown', 'true');
          }
        }
        if (isMounted) {
          onOnlineToastShown();
        }
        return;
      }
      
      if (settings.enableBackgroundSync) {
        if ('serviceWorker' in navigator && 'SyncManager' in window && navigator.serviceWorker.controller) {
          try {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register('sync-pendler-data');
          } catch (error) {
            console.error('Background sync chyba:', error);
            performSyncOperation();
          }
        } else {
          performSyncOperation();
        }
      } else {
        if (isMounted) {
          onOnlineToastShown();
        }
      }
    };
    
    const performSyncOperation = () => {
      syncWithLocalStorage()
        .then(() => {
          if (settings.showSyncNotifications) {
            toast({
              title: 'Online opět',
              description: 'Vaše data byla synchronizována.',
            });
          }
          onOnlineToastShown();
        })
        .catch((error) => {
          console.error('Error syncing data:', error);
          if (settings.showSyncNotifications) {
            toast({
              title: 'Chyba při synchronizaci dat',
              description: 'Zkontrolujte prosím připojení a zkuste to znovu.',
              variant: 'destructive'
            });
          }
          onOnlineToastShown();
        });
    };
    
    if (user && isInitialized && !isCheckingStatus && !isOffline && !hasShownOnlineToast) {
      setTimeout(() => {
        if (isMounted) {
          handleOnlineMode();
        }
      }, 3000);
    }
    
    return () => {
      isMounted = false;
    };
  }, [isOffline, user, isPremium, isCheckingStatus, hasShownOnlineToast, isInitialized, isNativeMode, settings, onOnlineToastShown]);

  return null;
};

export default OnlineSyncManager;
