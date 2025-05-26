
import { useState, useEffect, useCallback, useMemo } from 'react';
import { VehicleData } from '@/types/vehicle';
import { fetchVehicles, fetchVehicleById, saveVehicle, deleteVehicle } from '@/services/vehicle/vehicleCore';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

export const useVehicleManagement = (userId: string | undefined) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useStandardizedToast();

  // Memoized selected vehicle
  const selectedVehicle = useMemo(() => 
    vehicles.find(v => v.id === selectedVehicleId) || null, 
    [vehicles, selectedVehicleId]
  );

  // Load vehicles
  const loadVehicles = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await fetchVehicles(userId);
      setVehicles(data);
      
      // Auto-select first vehicle if none selected
      if (data.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(data[0].id!);
      }
    } catch (err) {
      console.error("Error loading vehicles:", err);
      error("Chyba při načítání vozidel");
    } finally {
      setIsLoading(false);
    }
  }, [userId, selectedVehicleId, error]);

  // Add vehicle
  const addVehicle = useCallback(async (formData: Omit<VehicleData, 'id' | 'user_id'>) => {
    if (!userId) return null;
    
    try {
      setIsSaving(true);
      const newVehicle = await saveVehicle({ ...formData, user_id: userId });
      
      if (newVehicle) {
        setVehicles(prev => [newVehicle, ...prev]);
        setSelectedVehicleId(newVehicle.id!);
        success("Vozidlo bylo úspěšně přidáno");
        return newVehicle;
      }
    } catch (err) {
      console.error("Error adding vehicle:", err);
      error("Chyba při přidání vozidla");
    } finally {
      setIsSaving(false);
    }
    return null;
  }, [userId, success, error]);

  // Update vehicle
  const updateVehicle = useCallback(async (vehicleData: VehicleData) => {
    try {
      setIsSaving(true);
      const updatedVehicle = await saveVehicle(vehicleData);
      
      if (updatedVehicle) {
        setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
        success("Vozidlo bylo úspěšně aktualizováno");
        return updatedVehicle;
      }
    } catch (err) {
      console.error("Error updating vehicle:", err);
      error("Chyba při aktualizaci vozidla");
    } finally {
      setIsSaving(false);
    }
    return null;
  }, [success, error]);

  // Remove vehicle
  const removeVehicle = useCallback(async (vehicleId: string) => {
    try {
      const success_delete = await deleteVehicle(vehicleId);
      
      if (success_delete) {
        setVehicles(prev => prev.filter(v => v.id !== vehicleId));
        
        // Select different vehicle if current one was deleted
        if (selectedVehicleId === vehicleId) {
          const remaining = vehicles.filter(v => v.id !== vehicleId);
          setSelectedVehicleId(remaining.length > 0 ? remaining[0].id! : null);
        }
        
        success("Vozidlo bylo úspěšně odstraněno");
      }
    } catch (err) {
      console.error("Error removing vehicle:", err);
      error("Chyba při odstraňování vozidla");
    }
  }, [vehicles, selectedVehicleId, success, error]);

  // Select vehicle
  const selectVehicle = useCallback((vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
  }, []);

  // Initialize
  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  return {
    vehicles,
    selectedVehicle,
    selectedVehicleId,
    isLoading,
    isSaving,
    addVehicle,
    updateVehicle,
    removeVehicle,
    selectVehicle,
    refreshVehicles: loadVehicles
  };
};
