
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
  const [isCheckingStatus, setIsCheckingStatus] = React.useState(false);
  const [hasShownOnlineToast, setHasShownOnlineToast] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isNativeMode, setIsNativeMode] = React.useState(false);
  const { settings } = useSyncSettings();
  const initializeRef = React.useRef(false);

  // Detekce nativního prostředí - pouze jednou při načtení
  React.useEffect(() => {
    if (initializeRef.current) return;
    initializeRef.current = true;
    
    const checkNative = () => {
      setIsNativeMode(isNativeApp());
    };
    
    // Použijeme requestAnimationFrame pro plynulejší spuštění
    requestAnimationFrame(() => {
      checkNative();
      setIsInitialized(true);
    });
  }, []);

  // Na začátku vždy aktualizujeme premium status z databáze - pouze jednou a s omezením
  React.useEffect(() => {
    let isMounted = true;
    
    const checkPremiumDirectly = async () => {
      if (!user || !isInitialized) {
        if (isMounted) {
          setIsCheckingStatus(false);
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
        }
      }
    };
    
    // Použijeme setTimeout pro odložení těžkých operací a jen pokud je uživatel přihlášen
    if (user && isInitialized && !isCheckingStatus) {
      setTimeout(() => {
        if (isMounted) {
          checkPremiumDirectly();
        }
      }, 1000);
    } else if (isInitialized) {
      setIsCheckingStatus(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [user, refreshPremiumStatus, isInitialized]);

  // Load data to IndexedDB when app starts or when going offline
  React.useEffect(() => {
    let isMounted = true;
    
    const handleOfflineMode = async () => {
      if (!((isOffline || isNativeMode) && user && isInitialized && !isCheckingStatus)) {
        return;
      }
      
      // V nativní aplikaci nepotřebujeme kontrolovat premium status pro offline funkcionalitu
      if (!isPremium && !isNativeMode) {
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
    // a pouze pokud je uživatel přihlášený a stránka je inicializovaná
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
  }, [isOffline, user, isPremium, isCheckingStatus, isInitialized, isNativeMode, settings]);

  // Sync data back to server when coming online - optimalizováno
  React.useEffect(() => {
    let isMounted = true;
    
    const handleOnlineMode = async () => {
      if (!(!isOffline && user && isInitialized && !isCheckingStatus)) {
        return;
      }
      
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
        if ('serviceWorker' in navigator && 'SyncManager' in window && navigator.serviceWorker.controller) {
          try {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register('sync-pendler-data');
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
        if (isMounted) {
          setHasShownOnlineToast(true);
        }
      }
    };
    
    // Odložíme synchronizaci pro zlepšení výkonu při načítání
    // a pouze pokud je uživatel přihlášen a aplikace inicializována
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

export default React.memo(OfflineSyncManager);
