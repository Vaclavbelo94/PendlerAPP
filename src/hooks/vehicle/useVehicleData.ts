
import { useState, useEffect, useCallback } from 'react';
import { VehicleData } from '@/types/vehicle';
import { fetchVehicles, fetchVehicleById } from '@/services/vehicle/vehicleCore';

export const useVehicleData = (user: any) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Load vehicles for user - simplified to prevent infinite loops
  const loadVehicles = useCallback(async () => {
    if (!user?.id || hasInitialized) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Loading vehicles for user:", user.id);
      const vehiclesData = await fetchVehicles(user.id);
      setVehicles(vehiclesData);
      
      // Pokud existují vozidla a není vybrané žádné, načteme první
      if (vehiclesData.length > 0) {
        setSelectedVehicleId(vehiclesData[0].id!);
      } else {
        setSelectedVehicleId(null);
        setVehicleData(null);
      }
      
      setHasInitialized(true);
    } catch (error) {
      console.error("Chyba při načítání vozidel:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, hasInitialized]);

  // Load vehicle details when selected vehicle changes
  const loadVehicleDetails = useCallback(async (vehicleId: string) => {
    if (!vehicleId) {
      setVehicleData(null);
      return;
    }
    
    try {
      console.log("Loading vehicle details for:", vehicleId);
      const data = await fetchVehicleById(vehicleId);
      setVehicleData(data);
    } catch (error) {
      console.error("Chyba při načítání dat o vozidle:", error);
      setVehicleData(null);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (user?.id && !hasInitialized) {
      loadVehicles();
    }
  }, [user?.id, hasInitialized, loadVehicles]);

  // Load details when selected vehicle changes
  useEffect(() => {
    if (selectedVehicleId && hasInitialized) {
      loadVehicleDetails(selectedVehicleId);
    }
  }, [selectedVehicleId, hasInitialized, loadVehicleDetails]);

  const handleVehicleSelect = useCallback((vehicleId: string) => {
    console.log("Selecting vehicle:", vehicleId);
    setSelectedVehicleId(vehicleId);
  }, []);

  return {
    vehicles,
    setVehicles,
    selectedVehicleId,
    vehicleData,
    setVehicleData,
    isLoading,
    handleVehicleSelect,
    loadVehicles
  };
};
