
import * as React from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { syncWithLocalStorage, loadFromLocalStorage } from '@/utils/offlineStorage';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

// Kontrola, zda je aplikace v nativním prostředí
const isNativeApp = () => {
  return (
    window.navigator.userAgent.includes('PendlerApp') ||
    document.URL.indexOf('http://') === -1 &&
    document.URL.indexOf('https://') === -1 ||
    window.matchMedia('(display-mode: standalone)').matches
  );
};

export const OfflineSyncManager = () => {
  const { isOffline } = useOfflineStatus();
  const { user, isPremium, refreshPremiumStatus } = useAuth();
  const [isCheckingStatus, setIsCheckingStatus] = React.useState(true);
  const [hasShownOnlineToast, setHasShownOnlineToast] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isNativeMode, setIsNativeMode] = React.useState(false);

  // Detekce nativního prostředí
  React.useEffect(() => {
    setIsNativeMode(isNativeApp());
  }, []);

  // Na začátku vždy aktualizujeme premium status z databáze
  React.useEffect(() => {
    if (user) {
      const checkPremiumDirectly = async () => {
        try {
          setIsCheckingStatus(true);
          await refreshPremiumStatus();
        } catch (error) {
          console.error('Chyba při kontrole premium statusu:', error);
        } finally {
          setIsCheckingStatus(false);
          setIsInitialized(true);
        }
      };
      
      checkPremiumDirectly();
    } else {
      setIsCheckingStatus(false);
      setIsInitialized(true);
    }
  }, [user, refreshPremiumStatus]);

  // Console.log pro ladící účely
  React.useEffect(() => {
    console.log('OfflineSyncManager stav:', { 
      isOffline, 
      user: user?.id, 
      isPremium,
      isCheckingStatus,
      hasShownOnlineToast,
      isInitialized,
      isNativeMode
    });
  }, [isOffline, user, isPremium, isCheckingStatus, hasShownOnlineToast, isInitialized, isNativeMode]);

  // Registrace na synchronizační události service workeru
  React.useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Pokud máme service worker, zaregistrujeme se na sync událost
      navigator.serviceWorker.ready.then(registration => {
        // Tady by byly další operace se service workerem
        console.log('Service Worker je připraven');
      });
    }
  }, []);

  // Load data to IndexedDB when app starts or when going offline
  React.useEffect(() => {
    if ((isOffline || isNativeMode) && user && isInitialized && !isCheckingStatus) {
      console.log('Offline/native mode activated, premium status:', isPremium);
      
      // V nativní aplikaci nepotřebujeme kontrolovat premium status pro offline funkcionalitu
      if (!isPremium && !isNativeMode) {
        toast({
          title: "Omezená offline funkcionalita",
          description: "Plná offline synchronizace je dostupná pouze pro prémiové uživatele",
        });
        return;
      }
      
      loadFromLocalStorage()
        .then(() => {
          toast({
            title: isNativeMode ? 'Aplikace připravena' : 'Offline režim aktivován',
            description: isNativeMode ? 
              'Data byla připravena pro použití v aplikaci.' : 
              'Data byla připravena pro offline použití.',
          });
        })
        .catch((error) => {
          console.error('Error preparing offline data:', error);
          toast({
            title: 'Chyba při přípravě dat',
            description: 'Zkontrolujte prosím připojení a zkuste to znovu.',
            variant: 'destructive'
          });
        });
      
      // Reset the flag when going offline
      setHasShownOnlineToast(false);
    }
  }, [isOffline, user, isPremium, isCheckingStatus, isInitialized, isNativeMode]);

  // Sync data back to server when coming online
  React.useEffect(() => {
    if (!isOffline && user && isInitialized && !isCheckingStatus) {
      console.log('Online mode activated, premium status:', isPremium);
      
      // Only show notification once per session
      if (hasShownOnlineToast) {
        return;
      }
      
      // V nativní aplikaci nepotřebujeme kontrolovat premium status pro synchronizaci
      if (!isPremium && !isNativeMode) {
        toast({
          title: "Omezená synchronizace",
          description: "Plná synchronizace je dostupná pouze pro prémiové uživatele",
        });
        setHasShownOnlineToast(true);
        return;
      }
      
      // Pokus o registraci na background sync v service workeru
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
          .then((registration) => {
            console.log('Registrace background sync');
            return registration.sync.register('sync-pendler-data');
          })
          .then(() => {
            console.log('Background sync zaregistrován');
          })
          .catch((error) => {
            console.error('Background sync chyba:', error);
            // Fallback na klasickou synchronizaci
            performSyncOperation();
          });
      } else {
        // Fallback pro prohlížeče bez podpory Background Sync API
        performSyncOperation();
      }
    }
  }, [isOffline, user, isPremium, isCheckingStatus, hasShownOnlineToast, isInitialized, isNativeMode]);

  // Pomocná funkce pro standardní synchronizaci
  const performSyncOperation = () => {
    syncWithLocalStorage()
      .then(() => {
        toast({
          title: 'Online opět',
          description: 'Vaše data byla synchronizována.',
        });
        // Mark that we've shown the toast
        setHasShownOnlineToast(true);
      })
      .catch((error) => {
        console.error('Error syncing data:', error);
        toast({
          title: 'Chyba při synchronizaci dat',
          description: 'Zkontrolujte prosím připojení a zkuste to znovu.',
          variant: 'destructive'
        });
        // Even on error, we don't want to show the toast again
        setHasShownOnlineToast(true);
      });
  };

  // Funkce pro ruční synchronizaci dat (může být exportována a použita v UI)
  const manualSync = async () => {
    if (!user) return;
    
    toast({
      title: 'Synchronizace',
      description: 'Probíhá synchronizace vašich dat...',
    });
    
    try {
      await syncWithLocalStorage();
      toast({
        title: 'Hotovo',
        description: 'Vaše data byla úspěšně synchronizována.',
      });
    } catch (error) {
      console.error('Error during manual sync:', error);
      toast({
        title: 'Chyba při synchronizaci',
        description: 'Zkontrolujte prosím připojení a zkuste to znovu.',
        variant: 'destructive'
      });
    }
  };

  return null; // This component doesn't render anything
};

export default OfflineSyncManager;
