
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { saveData, getAllData, deleteItemById, addToSyncQueue } from '@/utils/offlineStorage';
import { toast } from '@/components/ui/use-toast';

export interface OfflineVehicle {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  year: string;
  license_plate: string;
  vin: string;
  fuel_type: string;
  color: string;
  mileage: string;
  synced: boolean;
  created_at: string;
  updated_at: string;
}

export const useOfflineVehicles = () => {
  const { user } = useAuth();
  const { isOffline } = useOfflineStatus();
  const [offlineVehicles, setOfflineVehicles] = useState<OfflineVehicle[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load offline vehicles
  const loadOfflineVehicles = useCallback(async () => {
    if (!user) return;
    
    try {
      const vehicles = await getAllData<OfflineVehicle>('vehicles');
      setOfflineVehicles(vehicles.filter(vehicle => vehicle.user_id === user.id));
    } catch (error) {
      console.error('Error loading offline vehicles:', error);
    }
  }, [user]);

  // Save vehicle offline
  const saveVehicleOffline = useCallback(async (vehicle: Omit<OfflineVehicle, 'synced'>) => {
    if (!user) return;

    try {
      const offlineVehicle: OfflineVehicle = {
        ...vehicle,
        synced: false,
        user_id: user.id
      };

      await saveData('vehicles', offlineVehicle);
      
      // Add to sync queue
      await addToSyncQueue('vehicles', vehicle.id, vehicle.id ? 'UPDATE' : 'INSERT', offlineVehicle);
      
      // Update local state
      setOfflineVehicles(prev => [...prev.filter(v => v.id !== vehicle.id), offlineVehicle]);
      
      if (isOffline) {
        toast({
          title: "Vozidlo uloženo offline",
          description: "Bude synchronizováno při obnovení připojení"
        });
      }
      
      return offlineVehicle;
    } catch (error) {
      console.error('Error saving vehicle offline:', error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit vozidlo offline",
        variant: "destructive"
      });
    }
  }, [user, isOffline]);

  // Delete vehicle offline
  const deleteVehicleOffline = useCallback(async (vehicleId: string) => {
    if (!user) return;

    try {
      await deleteItemById('vehicles', vehicleId);
      await addToSyncQueue('vehicles', vehicleId, 'DELETE', { id: vehicleId });
      
      setOfflineVehicles(prev => prev.filter(v => v.id !== vehicleId));
      
      if (isOffline) {
        toast({
          title: "Vozidlo smazáno offline",
          description: "Změna bude synchronizována při obnovení připojení"
        });
      }
    } catch (error) {
      console.error('Error deleting vehicle offline:', error);
    }
  }, [user, isOffline]);

  // Sync pending vehicles
  const syncPendingVehicles = useCallback(async () => {
    if (!user || isOffline) return;

    setIsSyncing(true);
    try {
      const pendingVehicles = offlineVehicles.filter(vehicle => !vehicle.synced);
      
      for (const vehicle of pendingVehicles) {
        // Mark as synced locally
        const syncedVehicle = { ...vehicle, synced: true };
        await saveData('vehicles', syncedVehicle);
      }
      
      setOfflineVehicles(prev => prev.map(vehicle => ({ ...vehicle, synced: true })));
      
      if (pendingVehicles.length > 0) {
        toast({
          title: "Vozidla synchronizována",
          description: `Synchronizováno ${pendingVehicles.length} vozidel`
        });
      }
    } catch (error) {
      console.error('Error syncing vehicles:', error);
      toast({
        title: "Chyba při synchronizaci",
        description: "Nepodařilo se synchronizovat vozidla",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  }, [user, isOffline, offlineVehicles]);

  // Load vehicles on mount
  useEffect(() => {
    loadOfflineVehicles();
  }, [loadOfflineVehicles]);

  // Auto-sync when coming online
  useEffect(() => {
    if (!isOffline && offlineVehicles.some(vehicle => !vehicle.synced)) {
      syncPendingVehicles();
    }
  }, [isOffline, syncPendingVehicles, offlineVehicles]);

  return {
    offlineVehicles,
    saveVehicleOffline,
    deleteVehicleOffline,
    loadOfflineVehicles,
    syncPendingVehicles,
    isSyncing,
    hasPendingVehicles: offlineVehicles.some(vehicle => !vehicle.synced)
  };
};
