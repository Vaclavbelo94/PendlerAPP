
import { useOfflineShifts } from './useOfflineShifts';
import { useOfflineVehicles } from './useOfflineVehicles';
import { useOfflineCalculations } from './useOfflineCalculations';
import { useOfflineStatus } from './useOfflineStatus';

export const useOfflineMaster = () => {
  const { isOffline } = useOfflineStatus();
  
  const shifts = useOfflineShifts();
  const vehicles = useOfflineVehicles();
  const calculations = useOfflineCalculations();

  const totalPendingItems = [
    shifts.hasPendingShifts ? shifts.offlineShifts.filter(s => !s.synced).length : 0,
    vehicles.hasPendingVehicles ? vehicles.offlineVehicles.filter(v => !v.synced).length : 0,
    calculations.hasPendingCalculations ? calculations.offlineCalculations.filter(c => !c.synced).length : 0
  ].reduce((sum, count) => sum + count, 0);

  const isSyncing = shifts.isSyncing || vehicles.isSyncing || calculations.isSyncing;

  const syncAllPendingData = async () => {
    await Promise.allSettled([
      shifts.syncPendingShifts(),
      vehicles.syncPendingVehicles(),
      calculations.syncPendingCalculations()
    ]);
  };

  return {
    isOffline,
    totalPendingItems,
    isSyncing,
    syncAllPendingData,
    shifts,
    vehicles,
    calculations
  };
};
