
import { useOfflineShifts } from './useOfflineShifts';
import { useOfflineVehicles } from './useOfflineVehicles';
import { useOfflineCalculations } from './useOfflineCalculations';
import { useOfflineStatus } from './useOfflineStatus';
import { useSyncQueue } from './useSyncQueue';

export const useOfflineMaster = () => {
  const { isOffline } = useOfflineStatus();
  const { queueCount, isSyncing: isQueueSyncing, processQueue } = useSyncQueue();
  
  const shifts = useOfflineShifts();
  const vehicles = useOfflineVehicles();
  const calculations = useOfflineCalculations();

  // Calculate pending items based on available data
  const totalPendingItems = [
    shifts.shifts?.length || 0,
    vehicles.vehicles?.length || 0,
    calculations.calculations?.length || 0,
    queueCount
  ].reduce((sum, count) => sum + count, 0);

  const isSyncing = shifts.isSyncing || vehicles.isSyncing || calculations.isSyncing || isQueueSyncing;

  const syncAllPendingData = async () => {
    await Promise.allSettled([
      shifts.syncOfflineShifts(),
      vehicles.syncOfflineVehicles?.() || Promise.resolve(),
      calculations.syncOfflineCalculations?.() || Promise.resolve(),
      processQueue()
    ]);
  };

  return {
    isOffline,
    totalPendingItems,
    isSyncing,
    syncAllPendingData,
    shifts,
    vehicles,
    calculations,
    syncQueue: {
      queueCount,
      processQueue
    }
  };
};
