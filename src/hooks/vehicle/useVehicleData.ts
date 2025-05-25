
import { useState, useEffect } from 'react';
import { VehicleData } from '@/types/vehicle';
import { fetchVehicles, fetchVehicleById } from '@/services/vehicle/vehicleCore';

export const useVehicleData = (user: any) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load vehicles for user
  useEffect(() => {
    const loadVehicles = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Loading vehicles for user:", user.id);
        const vehiclesData = await fetchVehicles(user.id);
        setVehicles(vehiclesData);
        
        // Pokud existují vozidla, načteme první
        if (vehiclesData.length > 0) {
          setSelectedVehicleId(vehiclesData[0].id!);
        }
      } catch (error) {
        console.error("Chyba při načítání vozidel:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, [user]);

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

  const handleVehicleSelect = (vehicleId: string) => {
    console.log("Selecting vehicle:", vehicleId);
    setSelectedVehicleId(vehicleId);
  };

  return {
    vehicles,
    setVehicles,
    selectedVehicleId,
    vehicleData,
    setVehicleData,
    isLoading,
    handleVehicleSelect
  };
};
