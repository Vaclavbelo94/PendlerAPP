
import { useEffect } from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { syncWithLocalStorage, loadFromLocalStorage } from '@/utils/offlineStorage';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePremiumCheck } from '@/hooks/usePremiumCheck';

export const OfflineSyncManager = () => {
  const { isOffline } = useOfflineStatus();
  const { user } = useAuth();
  const { canAccess, isPremiumFeature } = usePremiumCheck('offline-sync');

  // Load data to IndexedDB when app starts or when going offline
  useEffect(() => {
    if (isOffline && user) {
      if (isPremiumFeature && !canAccess) {
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
  }, [isOffline, user, canAccess, isPremiumFeature]);

  // Sync data back to server when coming online
  useEffect(() => {
    if (!isOffline && user) {
      if (isPremiumFeature && !canAccess) {
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
  }, [isOffline, user, canAccess, isPremiumFeature]);

  return null; // This component doesn't render anything
};

export default OfflineSyncManager;
