
import * as React from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { syncWithLocalStorage, loadFromLocalStorage } from '@/utils/offlineStorage';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSyncSettings } from '@/hooks/useSyncSettings';

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
  const { settings } = useSyncSettings();

  // Detekce nativního prostředí - pouze jednou při načtení
  React.useEffect(() => {
    const checkNative = () => {
      setIsNativeMode(isNativeApp());
    };
    
    // Použijeme requestAnimationFrame pro plynulejší spuštění
    requestAnimationFrame(() => {
      checkNative();
    });
  }, []);

  // Na začátku vždy aktualizujeme premium status z databáze - pouze jednou
  React.useEffect(() => {
    let isMounted = true;
    
    const checkPremiumDirectly = async () => {
      if (!user) {
        if (isMounted) {
          setIsCheckingStatus(false);
          setIsInitialized(true);
        }
        return;
      }
      
      try {
        setIsCheckingStatus(true);
        await refreshPremiumStatus();
      } catch (error) {
        console.error('Chyba při kontrole premium statusu:', error);
      } finally {
        if (isMounted) {
          setIsCheckingStatus(false);
          setIsInitialized(true);
        }
      }
    };
    
    // Použijeme setTimeout pro odložení těžkých operací
    setTimeout(() => {
      if (isMounted) {
        checkPremiumDirectly();
      }
    }, 1000);
    
    return () => {
      isMounted = false;
    };
  }, [user, refreshPremiumStatus]);

  // Console.log pro ladící účely - omezíme na důležité změny stavu
  React.useEffect(() => {
    if (isInitialized) {
      console.log('OfflineSyncManager stav:', { 
        isOffline, 
        user: user?.id, 
        isPremium,
        isCheckingStatus,
        hasShownOnlineToast,
        isNativeMode
      });
    }
  }, [isOffline, user, isPremium, isInitialized, isNativeMode]);

  // Registrace na synchronizační události service workeru - pouze jednou
  React.useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(() => {
        console.log('Service Worker je připraven');
      }).catch(err => {
        console.error('Service Worker není připraven:', err);
      });
    }
  }, []);

  // Load data to IndexedDB when app starts or when going offline
  React.useEffect(() => {
    let isMounted = true;
    
    const handleOfflineMode = async () => {
      if (!((isOffline || isNativeMode) && user && isInitialized && !isCheckingStatus)) {
        return;
      }
      
      console.log('Offline/native mode activated, premium status:', isPremium);
      
      // V nativní aplikaci nepotřebujeme kontrolovat premium status pro offline funkcionalitu
      if (!isPremium && !isNativeMode) {
        // Kontrola nastavení notifikací
        if (settings.showSyncNotifications) {
          // Kontrola, zda již byla notifikace zobrazena v této session
          const notificationShown = sessionStorage.getItem('syncNotificationShown');
          if (!notificationShown) {
            toast({
              title: "Omezená offline funkcionalita",
              description: "Plná offline synchronizace je dostupná pouze pro prémiové uživatele",
            });
            // Zapamatujeme si, že jsme notifikaci již zobrazili
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
      
      // Reset the flag when going offline
      if (isMounted) {
        setHasShownOnlineToast(false);
      }
    };
    
    // Použijeme requestIdleCallback pro spuštění méně důležitých operací když je prohlížeč volný
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => handleOfflineMode());
    } else {
      setTimeout(handleOfflineMode, 2000);
    }
    
    return () => {
      isMounted = false;
    };
  }, [isOffline, user, isPremium, isCheckingStatus, isInitialized, isNativeMode, settings]);

  // Sync data back to server when coming online
  React.useEffect(() => {
    let isMounted = true;
    
    const handleOnlineMode = async () => {
      if (!(!isOffline && user && isInitialized && !isCheckingStatus)) {
        return;
      }
      
      console.log('Online mode activated, premium status:', isPremium);
      
      // Only show notification once per session
      if (hasShownOnlineToast) {
        return;
      }
      
      // V nativní aplikaci nepotřebujeme kontrolovat premium status pro synchronizaci
      if (!isPremium && !isNativeMode) {
        if (settings.showSyncNotifications) {
          // Kontrola, zda již byla notifikace zobrazena v této session
          const notificationShown = sessionStorage.getItem('syncNotificationShown');
          if (!notificationShown) {
            toast({
              title: "Omezená synchronizace",
              description: "Plná synchronizace je dostupná pouze pro prémiové uživatele",
            });
            // Zapamatujeme si, že jsme notifikaci již zobrazili
            sessionStorage.setItem('syncNotificationShown', 'true');
          }
        }
        if (isMounted) {
          setHasShownOnlineToast(true);
        }
        return;
      }
      
      // Synchronizace pouze pokud je povolena v nastavení
      if (settings.enableBackgroundSync) {
        // Pokus o registraci na background sync v service workeru
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          try {
            const registration = await navigator.serviceWorker.ready;
            console.log('Registrace background sync');
            await registration.sync.register('sync-pendler-data');
            console.log('Background sync zaregistrován');
          } catch (error) {
            console.error('Background sync chyba:', error);
            // Fallback na klasickou synchronizaci
            performSyncOperation();
          }
        } else {
          // Fallback pro prohlížeče bez podpory Background Sync API
          performSyncOperation();
        }
      } else {
        console.log('Background synchronizace je vypnuta v nastavení');
        if (isMounted) {
          setHasShownOnlineToast(true);
        }
      }
    };
    
    // Odložíme synchronizaci pro zlepšení výkonu při načítání
    setTimeout(() => {
      if (isMounted) {
        handleOnlineMode();
      }
    }, 3000);
    
    return () => {
      isMounted = false;
    };
  }, [isOffline, user, isPremium, isCheckingStatus, hasShownOnlineToast, isInitialized, isNativeMode, settings]);

  // Pomocná funkce pro standardní synchronizaci
  const performSyncOperation = () => {
    syncWithLocalStorage()
      .then(() => {
        if (settings.showSyncNotifications) {
          toast({
            title: 'Online opět',
            description: 'Vaše data byla synchronizována.',
          });
        }
        // Mark that we've shown the toast
        setHasShownOnlineToast(true);
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
        // Even on error, we don't want to show the toast again
        setHasShownOnlineToast(true);
      });
  };

  // Funkce pro ruční synchronizaci dat (může být exportována a použita v UI)
  const manualSync = async () => {
    if (!user) return;
    
    if (settings.showSyncNotifications) {
      toast({
        title: 'Synchronizace',
        description: 'Probíhá synchronizace vašich dat...',
      });
    }
    
    try {
      await syncWithLocalStorage();
      if (settings.showSyncNotifications) {
        toast({
          title: 'Hotovo',
          description: 'Vaše data byla úspěšně synchronizována.',
        });
      }
    } catch (error) {
      console.error('Error during manual sync:', error);
      if (settings.showSyncNotifications) {
        toast({
          title: 'Chyba při synchronizaci',
          description: 'Zkontrolujte prosím připojení a zkuste to znovu.',
          variant: 'destructive'
        });
      }
    }
  };

  return null; // This component doesn't render anything
};

export default OfflineSyncManager;
