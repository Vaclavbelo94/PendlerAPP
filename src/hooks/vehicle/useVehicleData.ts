
import { useState, useEffect, useCallback } from 'react';
import { VehicleData } from '@/types/vehicle';
import { fetchVehicles, fetchVehicleById } from '@/services/vehicle/vehicleCore';

export const useVehicleData = (user: any) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load vehicles for user - memoized to prevent infinite loops
  const loadVehicles = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Loading vehicles for user:", user.id);
      const vehiclesData = await fetchVehicles(user.id);
      setVehicles(vehiclesData);
      
      // Pokud existují vozidla a není vybrané žádné, načteme první
      if (vehiclesData.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(vehiclesData[0].id!);
      } else if (vehiclesData.length === 0) {
        setSelectedVehicleId(null);
        setVehicleData(null);
      }
    } catch (error) {
      console.error("Chyba při načítání vozidel:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]); // Removed selectedVehicleId dependency to prevent infinite loop

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  // Load vehicle details when selected vehicle changes
  useEffect(() => {
    const loadVehicleDetails = async () => {
      if (!selectedVehicleId) {
        setVehicleData(null);
        return;
      }
      
      setIsLoading(true);
      try {
        console.log("Loading vehicle details for:", selectedVehicleId);
        const data = await fetchVehicleById(selectedVehicleId);
        setVehicleData(data);
      } catch (error) {
        console.error("Chyba při načítání dat o vozidle:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedVehicleId) {
      loadVehicleDetails();
    }
  }, [selectedVehicleId]);

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
    loadVehicles // Export loadVehicles for manual refresh if needed
  };
};
