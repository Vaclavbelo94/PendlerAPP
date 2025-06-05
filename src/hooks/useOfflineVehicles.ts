
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { saveData, getAllData, addToSyncQueue, queryByIndex } from '@/utils/offlineStorage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface OfflineVehicle {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  year: string;
  license_plate: string;
  vin: string;
  fuel_type?: string;
  color?: string;
  mileage?: string;
  engine?: string;
  power?: string;
  transmission?: string;
  next_inspection?: string;
  last_service?: string;
  average_consumption?: string;
  purchase_price?: string;
  insurance_monthly?: string;
  tax_yearly?: string;
  last_repair_cost?: string;
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
      const vehicles = await queryByIndex<OfflineVehicle>('vehicles', 'user_id', user.id);
      setOfflineVehicles(vehicles);
    } catch (error) {
      console.error('Error loading offline vehicles:', error);
    }
  }, [user]);

  // Save vehicle offline
  const saveVehicleOffline = useCallback(async (vehicle: Omit<OfflineVehicle, 'synced' | 'user_id'>) => {
    if (!user) return;

    try {
      const offlineVehicle: OfflineVehicle = {
        ...vehicle,
        synced: false,
        user_id: user.id
      };

      await saveData('vehicles', offlineVehicle);
      
      // Add to sync queue
      await addToSyncQueue('vehicles', vehicle.id, 'INSERT', offlineVehicle);
      
      // Update local state
      setOfflineVehicles(prev => [offlineVehicle, ...prev.filter(v => v.id !== vehicle.id)]);
      
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

  // Update vehicle offline
  const updateVehicleOffline = useCallback(async (vehicleId: string, updates: Partial<OfflineVehicle>) => {
    if (!user) return;

    try {
      const existingVehicle = offlineVehicles.find(v => v.id === vehicleId);
      if (!existingVehicle) return;

      const updatedVehicle: OfflineVehicle = {
        ...existingVehicle,
        ...updates,
        synced: false,
        updated_at: new Date().toISOString()
      };

      await saveData('vehicles', updatedVehicle);
      await addToSyncQueue('vehicles', vehicleId, 'UPDATE', updatedVehicle);
      
      setOfflineVehicles(prev => prev.map(v => v.id === vehicleId ? updatedVehicle : v));
      
      if (isOffline) {
        toast({
          title: "Vozidlo aktualizováno offline",
          description: "Změny budou synchronizovány při obnovení připojení"
        });
      }
      
      return updatedVehicle;
    } catch (error) {
      console.error('Error updating vehicle offline:', error);
      toast({
        title: "Chyba při aktualizaci",
        description: "Nepodařilo se aktualizovat vozidlo offline",
        variant: "destructive"
      });
    }
  }, [user, isOffline, offlineVehicles]);

  // Sync pending vehicles
  const syncPendingVehicles = useCallback(async () => {
    if (!user || isOffline) return;

    setIsSyncing(true);
    try {
      const pendingVehicles = offlineVehicles.filter(vehicle => !vehicle.synced);
      
      for (const vehicle of pendingVehicles) {
        try {
          // Check if vehicle exists on server
          const { data: existingVehicle } = await supabase
            .from('vehicles')
            .select('id')
            .eq('id', vehicle.id)
            .eq('user_id', user.id)
            .maybeSingle();

          const vehicleData = {
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            license_plate: vehicle.license_plate,
            vin: vehicle.vin,
            fuel_type: vehicle.fuel_type,
            color: vehicle.color,
            mileage: vehicle.mileage,
            engine: vehicle.engine,
            power: vehicle.power,
            transmission: vehicle.transmission,
            next_inspection: vehicle.next_inspection,
            last_service: vehicle.last_service,
            average_consumption: vehicle.average_consumption,
            purchase_price: vehicle.purchase_price,
            insurance_monthly: vehicle.insurance_monthly,
            tax_yearly: vehicle.tax_yearly,
            last_repair_cost: vehicle.last_repair_cost,
            updated_at: vehicle.updated_at
          };

          if (existingVehicle) {
            // Update existing vehicle
            const { error } = await supabase
              .from('vehicles')
              .update(vehicleData)
              .eq('id', vehicle.id)
              .eq('user_id', user.id);

            if (error) throw error;
          } else {
            // Insert new vehicle
            const { error } = await supabase
              .from('vehicles')
              .insert({
                id: vehicle.id,
                user_id: vehicle.user_id,
                ...vehicleData,
                created_at: vehicle.created_at
              });

            if (error) throw error;
          }

          // Mark as synced locally
          const syncedVehicle = { ...vehicle, synced: true };
          await saveData('vehicles', syncedVehicle);
        } catch (error) {
          console.error('Error syncing vehicle:', vehicle.id, error);
        }
      }
      
      // Reload vehicles to get synced status
      await loadOfflineVehicles();
      
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
  }, [user, isOffline, offlineVehicles, loadOfflineVehicles]);

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
    updateVehicleOffline,
    loadOfflineVehicles,
    syncPendingVehicles,
    isSyncing,
    hasPendingVehicles: offlineVehicles.some(vehicle => !vehicle.synced)
  };
};
