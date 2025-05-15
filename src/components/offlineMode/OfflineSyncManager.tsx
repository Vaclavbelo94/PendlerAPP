
import { useEffect } from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { syncWithLocalStorage, loadFromLocalStorage } from '@/utils/offlineStorage';
import { useToast } from '@/components/ui/use-toast';

export const OfflineSyncManager = () => {
  const { isOffline } = useOfflineStatus();
  const { toast } = useToast();

  // Load data to IndexedDB when app starts or when going offline
  useEffect(() => {
    if (isOffline) {
      loadFromLocalStorage()
        .then(() => {
          toast({
            title: 'Offline režim aktivován',
            description: 'Data byla připravena pro offline použití.',
          });
        })
        .catch((error) => {
          console.error('Error preparing offline data:', error);
        });
    }
  }, [isOffline, toast]);

  // Sync data back to localStorage when coming online
  useEffect(() => {
    if (!isOffline) {
      syncWithLocalStorage()
        .then(() => {
          toast({
            title: 'Online opět',
            description: 'Vaše data byla synchronizována.',
          });
        })
        .catch((error) => {
          console.error('Error syncing data:', error);
        });
    }
  }, [isOffline, toast]);

  return null; // This component doesn't render anything
};

export default OfflineSyncManager;
