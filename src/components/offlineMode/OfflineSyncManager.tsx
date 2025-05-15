
import * as React from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { syncWithLocalStorage, loadFromLocalStorage } from '@/utils/offlineStorage';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePremiumCheck } from '@/hooks/usePremiumCheck';
import { supabase } from '@/integrations/supabase/client';

export const OfflineSyncManager = () => {
  const { isOffline } = useOfflineStatus();
  const { user, isPremium, refreshPremiumStatus } = useAuth();
  const [isCheckingStatus, setIsCheckingStatus] = React.useState(true);

  // Na začátku vždy aktualizujme premium status z databáze
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
        }
      };
      
      checkPremiumDirectly();
    } else {
      setIsCheckingStatus(false);
    }
  }, [user, refreshPremiumStatus]);

  // Load data to IndexedDB when app starts or when going offline
  React.useEffect(() => {
    if (isOffline && user && !isCheckingStatus) {
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
    }
  }, [isOffline, user, isPremium, isCheckingStatus]);

  // Sync data back to server when coming online
  React.useEffect(() => {
    if (!isOffline && user && !isCheckingStatus) {
      if (!isPremium) {
        toast({
          title: "Omezená synchronizace",
          description: "Plná synchronizace je dostupná pouze pro prémiové uživatele",
        });
        return;
      }
      
      syncWithLocalStorage()
        .then(() => {
          toast({
            title: 'Online opět',
            description: 'Vaše data byla synchronizována.',
          });
        })
        .catch((error) => {
          console.error('Error syncing data:', error);
          toast({
            title: 'Chyba při synchronizaci dat',
            description: 'Zkontrolujte prosím připojení a zkuste to znovu.',
            variant: 'destructive'
          });
        });
    }
  }, [isOffline, user, isPremium, isCheckingStatus]);

  return null; // This component doesn't render anything
};

export default OfflineSyncManager;
