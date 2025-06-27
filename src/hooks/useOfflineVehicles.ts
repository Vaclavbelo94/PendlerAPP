import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  fuelConsumption: number;
  synced?: boolean;
}

interface VehicleWithSync extends Vehicle {
  synced?: boolean;
}

interface OfflineVehiclesState {
  vehicles: VehicleWithSync[];
  isLoading: boolean;
  error: string | null;
  offlineVehicles: VehicleWithSync[];
  hasPendingVehicles: boolean;
  isSyncing: boolean;
}

export const useOfflineVehicles = () => {
  const { user } = useAuth();
  const [state, setState] = useState<OfflineVehiclesState>({
    vehicles: [],
    isLoading: true,
    error: null,
    offlineVehicles: [],
    hasPendingVehicles: false,
    isSyncing: false,
  });

  useEffect(() => {
    const loadVehicles = async () => {
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));

      try {
        if (!user) {
          setState(prevState => ({ ...prevState, error: 'Uživatel není přihlášen', isLoading: false }));
          return;
        }

        // Fetch vehicles from Supabase
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          throw new Error(`Chyba při načítání vozidel: ${error.message}`);
        }

        if (data) {
          // Map the database structure to our Vehicle interface
          const mappedVehicles: VehicleWithSync[] = data.map(vehicle => ({
            id: vehicle.id,
            name: `${vehicle.brand} ${vehicle.model}`,
            type: vehicle.fuel_type || 'Unknown',
            fuelConsumption: parseFloat(vehicle.average_consumption || '0'),
            synced: true // Assume all vehicles from database are synced
          }));
          
          const offlineVehicles = mappedVehicles.filter(vehicle => !vehicle.synced);
          
          setState(prevState => ({
            ...prevState,
            vehicles: mappedVehicles,
            offlineVehicles,
            hasPendingVehicles: offlineVehicles.length > 0,
            isLoading: false,
          }));
        }
      } catch (err: any) {
        setState(prevState => ({
          ...prevState,
          error: err.message || 'Chyba při načítání vozidel',
          isLoading: false,
        }));
      }
    };

    loadVehicles();
  }, [user]);

  const syncPendingVehicles = async () => {
    setState(prevState => ({ ...prevState, isSyncing: true }));
    
    // Mock sync process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setState(prevState => ({
      ...prevState,
      isSyncing: false,
      hasPendingVehicles: false,
      offlineVehicles: [],
      vehicles: prevState.vehicles.map(vehicle => ({ ...vehicle, synced: true })),
    }));
  };

  return {
    ...state,
    syncPendingVehicles,
  };
};
