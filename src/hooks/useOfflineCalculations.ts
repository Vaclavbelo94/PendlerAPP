
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { saveData, getAllData, addToSyncQueue } from '@/utils/offlineStorage';
import { toast } from '@/components/ui/use-toast';

export interface OfflineCalculation {
  id: string;
  user_id: string;
  type: string;
  inputs: Record<string, any>;
  result: Record<string, any>;
  synced: boolean;
  created_at: string;
}

export const useOfflineCalculations = () => {
  const { user } = useAuth();
  const { isOffline } = useOfflineStatus();
  const [offlineCalculations, setOfflineCalculations] = useState<OfflineCalculation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load offline calculations
  const loadOfflineCalculations = useCallback(async () => {
    if (!user) return;
    
    try {
      const calculations = await getAllData<OfflineCalculation>('calculation_history');
      setOfflineCalculations(calculations.filter(calc => calc.user_id === user.id));
    } catch (error) {
      console.error('Error loading offline calculations:', error);
    }
  }, [user]);

  // Save calculation offline
  const saveCalculationOffline = useCallback(async (calculation: Omit<OfflineCalculation, 'synced' | 'user_id'>) => {
    if (!user) return;

    try {
      const offlineCalculation: OfflineCalculation = {
        ...calculation,
        synced: false,
        user_id: user.id
      };

      await saveData('calculation_history', offlineCalculation);
      
      // Add to sync queue
      await addToSyncQueue('calculation_history', calculation.id, 'INSERT', offlineCalculation);
      
      // Update local state
      setOfflineCalculations(prev => [offlineCalculation, ...prev]);
      
      if (isOffline) {
        toast({
          title: "Výpočet uložen offline",
          description: "Bude synchronizován při obnovení připojení"
        });
      }
      
      return offlineCalculation;
    } catch (error) {
      console.error('Error saving calculation offline:', error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit výpočet offline",
        variant: "destructive"
      });
    }
  }, [user, isOffline]);

  // Sync pending calculations
  const syncPendingCalculations = useCallback(async () => {
    if (!user || isOffline) return;

    setIsSyncing(true);
    try {
      const pendingCalculations = offlineCalculations.filter(calc => !calc.synced);
      
      for (const calculation of pendingCalculations) {
        // Mark as synced locally
        const syncedCalculation = { ...calculation, synced: true };
        await saveData('calculation_history', syncedCalculation);
      }
      
      setOfflineCalculations(prev => prev.map(calc => ({ ...calc, synced: true })));
      
      if (pendingCalculations.length > 0) {
        toast({
          title: "Výpočty synchronizovány",
          description: `Synchronizováno ${pendingCalculations.length} výpočtů`
        });
      }
    } catch (error) {
      console.error('Error syncing calculations:', error);
      toast({
        title: "Chyba při synchronizaci",
        description: "Nepodařilo se synchronizovat výpočty",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  }, [user, isOffline, offlineCalculations]);

  // Load calculations on mount
  useEffect(() => {
    loadOfflineCalculations();
  }, [loadOfflineCalculations]);

  // Auto-sync when coming online
  useEffect(() => {
    if (!isOffline && offlineCalculations.some(calc => !calc.synced)) {
      syncPendingCalculations();
    }
  }, [isOffline, syncPendingCalculations, offlineCalculations]);

  return {
    offlineCalculations,
    saveCalculationOffline,
    loadOfflineCalculations,
    syncPendingCalculations,
    isSyncing,
    hasPendingCalculations: offlineCalculations.some(calc => !calc.synced)
  };
};
