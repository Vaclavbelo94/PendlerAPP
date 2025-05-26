
import { useState, useEffect, useCallback, useMemo } from 'react';
import { VehicleData } from '@/types/vehicle';
import { fetchVehicles, fetchVehicleById, saveVehicle, deleteVehicle } from '@/services/vehicle/vehicleCore';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

export const useVehicleManagement = (userId: string | undefined) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { success, error: showError } = useStandardizedToast();

  // Memoized selected vehicle
  const selectedVehicle = useMemo(() => 
    vehicles.find(v => v.id === selectedVehicleId) || null, 
    [vehicles, selectedVehicleId]
  );

  // Retry mechanism with exponential backoff
  const retryOperation = useCallback(async (operation: () => Promise<any>, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (err) {
        console.error(`Attempt ${attempt} failed:`, err);
        
        if (attempt === maxRetries) {
          throw err;
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }, []);

  // Load vehicles with error handling and retry
  const loadVehicles = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      
      console.log("Loading vehicles for user:", userId);
      
      const data = await retryOperation(async () => {
        const vehicles = await fetchVehicles(userId);
        return vehicles;
      });
      
      setVehicles(data);
      setRetryCount(0);
      
      // Auto-select first vehicle if none selected and vehicles exist
      if (data.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(data[0].id!);
      } else if (data.length === 0) {
        setSelectedVehicleId(null);
      }
      
    } catch (err: any) {
      console.error("Error loading vehicles:", err);
      const errorMessage = err?.message || "Chyba při načítání vozidel";
      setError(errorMessage);
      showError(errorMessage);
      
      // Try to load from localStorage as fallback
      try {
        const cachedVehicles = localStorage.getItem(`vehicles_${userId}`);
        if (cachedVehicles) {
          const parsed = JSON.parse(cachedVehicles);
          setVehicles(parsed);
          console.log("Loaded vehicles from cache");
        }
      } catch (cacheErr) {
        console.error("Failed to load from cache:", cacheErr);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, retryOperation, showError]); // Removed selectedVehicleId from dependencies

  // Add vehicle with error handling
  const addVehicle = useCallback(async (formData: Omit<VehicleData, 'id' | 'user_id'>) => {
    if (!userId) return null;
    
    try {
      setIsSaving(true);
      setError(null);
      
      const newVehicle = await retryOperation(async () => {
        return await saveVehicle({ ...formData, user_id: userId });
      });
      
      if (newVehicle) {
        setVehicles(prev => {
          const updated = [newVehicle, ...prev];
          // Cache vehicles
          try {
            localStorage.setItem(`vehicles_${userId}`, JSON.stringify(updated));
          } catch (e) {
            console.warn("Failed to cache vehicles:", e);
          }
          return updated;
        });
        setSelectedVehicleId(newVehicle.id!);
        success("Vozidlo bylo úspěšně přidáno");
        return newVehicle;
      }
    } catch (err: any) {
      console.error("Error adding vehicle:", err);
      const errorMessage = err?.message || "Chyba při přidání vozidla";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSaving(false);
    }
    return null;
  }, [userId, retryOperation, success, showError]);

  // Update vehicle with error handling
  const updateVehicle = useCallback(async (vehicleData: VehicleData) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const updatedVehicle = await retryOperation(async () => {
        return await saveVehicle(vehicleData);
      });
      
      if (updatedVehicle) {
        setVehicles(prev => {
          const updated = prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v);
          // Cache vehicles
          try {
            localStorage.setItem(`vehicles_${userId}`, JSON.stringify(updated));
          } catch (e) {
            console.warn("Failed to cache vehicles:", e);
          }
          return updated;
        });
        success("Vozidlo bylo úspěšně aktualizováno");
        return updatedVehicle;
      }
    } catch (err: any) {
      console.error("Error updating vehicle:", err);
      const errorMessage = err?.message || "Chyba při aktualizaci vozidla";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSaving(false);
    }
    return null;
  }, [retryOperation, success, showError, userId]);

  // Remove vehicle with error handling
  const removeVehicle = useCallback(async (vehicleId: string) => {
    try {
      setError(null);
      
      const success_delete = await retryOperation(async () => {
        return await deleteVehicle(vehicleId);
      });
      
      if (success_delete) {
        setVehicles(prev => {
          const updated = prev.filter(v => v.id !== vehicleId);
          
          // Cache vehicles
          try {
            localStorage.setItem(`vehicles_${userId}`, JSON.stringify(updated));
          } catch (e) {
            console.warn("Failed to cache vehicles:", e);
          }
          
          return updated;
        });
        
        // Select different vehicle if current one was deleted
        if (selectedVehicleId === vehicleId) {
          const remaining = vehicles.filter(v => v.id !== vehicleId);
          setSelectedVehicleId(remaining.length > 0 ? remaining[0].id! : null);
        }
        
        success("Vozidlo bylo úspěšně odstraněno");
      }
    } catch (err: any) {
      console.error("Error removing vehicle:", err);
      const errorMessage = err?.message || "Chyba při odstraňování vozidla";
      setError(errorMessage);
      showError(errorMessage);
    }
  }, [vehicles, selectedVehicleId, retryOperation, success, showError, userId]);

  // Select vehicle
  const selectVehicle = useCallback((vehicleId: string) => {
    console.log("Selecting vehicle:", vehicleId);
    setSelectedVehicleId(vehicleId);
  }, []);

  // Retry failed operations
  const retryLastOperation = useCallback(() => {
    setRetryCount(prev => prev + 1);
    loadVehicles();
  }, [loadVehicles]);

  // Initialize only once
  useEffect(() => {
    loadVehicles();
  }, [userId]); // Only depend on userId

  return {
    vehicles,
    selectedVehicle,
    selectedVehicleId,
    isLoading,
    isSaving,
    error,
    retryCount,
    addVehicle,
    updateVehicle,
    removeVehicle,
    selectVehicle,
    refreshVehicles: loadVehicles,
    retryLastOperation
  };
};
