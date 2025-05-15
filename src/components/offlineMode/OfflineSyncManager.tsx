
import * as React from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { syncWithLocalStorage, loadFromLocalStorage } from '@/utils/offlineStorage';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const OfflineSyncManager = () => {
  const { isOffline } = useOfflineStatus();
  const { user, isPremium, refreshPremiumStatus } = useAuth();
  const [isCheckingStatus, setIsCheckingStatus] = React.useState(true);
  const [hasShownOnlineToast, setHasShownOnlineToast] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);

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
      isInitialized
    });
  }, [isOffline, user, isPremium, isCheckingStatus, hasShownOnlineToast, isInitialized]);

  // Load data to IndexedDB when app starts or when going offline
  React.useEffect(() => {
    if (isOffline && user && isInitialized && !isCheckingStatus) {
      console.log('Offline mode activated, premium status:', isPremium);
      
      if (!isPremium) {
        toast({
          title: "Omezená offline funkcionalita",
          description: "Plná offline synchronizace je dostupná pouze pro prémiové uživatele",
        });
        return;
      }
      
      loadFromLocalStorage()
        .then(() => {
          toast({
            title: 'Offline režim aktivován',
            description: 'Data byla připravena pro offline použití.',
          });
        })
        .catch((error) => {
          console.error('Error preparing offline data:', error);
          toast({
            title: 'Chyba při přípravě offline dat',
            description: 'Zkontrolujte prosím připojení a zkuste to znovu.',
            variant: 'destructive'
          });
        });
      
      // Reset the flag when going offline
      setHasShownOnlineToast(false);
    }
  }, [isOffline, user, isPremium, isCheckingStatus, isInitialized]);

  // Sync data back to server when coming online
  React.useEffect(() => {
    if (!isOffline && user && isInitialized && !isCheckingStatus) {
      console.log('Online mode activated, premium status:', isPremium);
      
      // Only show notification once per session
      if (hasShownOnlineToast) {
        return;
      }
      
      if (!isPremium) {
        toast({
          title: "Omezená synchronizace",
          description: "Plná synchronizace je dostupná pouze pro prémiové uživatele",
        });
        setHasShownOnlineToast(true);
        return;
      }
      
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
    }
  }, [isOffline, user, isPremium, isCheckingStatus, hasShownOnlineToast, isInitialized]);

  return null; // This component doesn't render anything
};

export default OfflineSyncManager;
