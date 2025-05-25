
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useSyncSettings } from '@/hooks/useSyncSettings';
import { loadFromLocalStorage } from '@/utils/offlineStorage';
import { toast } from '@/hooks/use-toast';

interface OfflineDataManagerProps {
  isInitialized: boolean;
  isNativeMode: boolean;
  isCheckingStatus: boolean;
  onOfflineToastReset: () => void;
}

export const OfflineDataManager: React.FC<OfflineDataManagerProps> = ({
  isInitialized,
  isNativeMode,
  isCheckingStatus,
  onOfflineToastReset
}) => {
  const { user, isPremium } = useAuth();
  const { isOffline } = useOfflineStatus();
  const { settings } = useSyncSettings();

  // Load data to IndexedDB when app starts or when going offline
  useEffect(() => {
    let isMounted = true;
    
    const handleOfflineMode = async () => {
      if (!((isOffline || isNativeMode) && user && isInitialized && !isCheckingStatus)) {
        return;
      }
      
      // In native app, we don't need to check premium status for offline functionality
      if (!isPremium && !isNativeMode) {
        if (settings.showSyncNotifications) {
          const notificationShown = sessionStorage.getItem('syncNotificationShown');
          if (!notificationShown) {
            toast({
              title: "Omezená offline funkcionalita",
              description: "Plná offline synchronizace je dostupná pouze pro prémiové uživatele",
            });
            sessionStorage.setItem('syncNotificationShown', 'true');
          }
        }
        return;
      }
      
      try {
        await loadFromLocalStorage();
        
        if (settings.showSyncNotifications) {
          toast({
            title: isNativeMode ? 'Aplikace připravena' : 'Offline režim aktivován',
            description: isNativeMode ? 
              'Data byla připravena pro použití v aplikaci.' : 
              'Data byla připravena pro offline použití.',
          });
        }
      } catch (error) {
        console.error('Error preparing offline data:', error);
        if (settings.showSyncNotifications) {
          toast({
            title: 'Chyba při přípravě dat',
            description: 'Zkontrolujte prosím připojení a zkuste to znovu.',
            variant: 'destructive'
          });
        }
      }
      
      if (isMounted) {
        onOfflineToastReset();
      }
    };
    
    if (user && isInitialized && !isCheckingStatus) {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          if (isMounted) handleOfflineMode();
        });
      } else {
        setTimeout(() => {
          if (isMounted) handleOfflineMode();
        }, 2000);
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [isOffline, user, isPremium, isCheckingStatus, isInitialized, isNativeMode, settings, onOfflineToastReset]);

  return null;
};

export default OfflineDataManager;
