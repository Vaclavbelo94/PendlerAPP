
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';

interface OfflineCalculation {
  id: string;
  type: string;
  data: any;
  synced: boolean;
  createdAt: string;
}

interface OfflineCalculationsState {
  isLoading: boolean;
  lastSync: string | null;
  error: string | null;
  offlineCalculations: OfflineCalculation[];
  hasPendingCalculations: boolean;
  isSyncing: boolean;
}

export const useOfflineCalculations = () => {
  const { user } = useAuth();
  const [state, setState] = useState<OfflineCalculationsState>({
    isLoading: true,
    lastSync: null,
    error: null,
    offlineCalculations: [],
    hasPendingCalculations: false,
    isSyncing: false,
  });

  useEffect(() => {
    const loadLastSync = async () => {
      if (!user) return;

      setState(prevState => ({ ...prevState, isLoading: true, error: null }));

      try {
        // Since offline_calculations_sync table doesn't exist, use mock data
        const mockCalculations: OfflineCalculation[] = [
          {
            id: '1',
            type: 'fuel_calculation',
            data: { distance: 100, consumption: 8 },
            synced: false,
            createdAt: new Date().toISOString()
          }
        ];

        setState(prevState => ({
          ...prevState,
          lastSync: new Date().toISOString(),
          offlineCalculations: mockCalculations,
          hasPendingCalculations: mockCalculations.some(calc => !calc.synced),
          isLoading: false,
        }));
      } catch (error: any) {
        console.error('Error loading last sync time:', error);
        setState(prevState => ({
          ...prevState,
          error: error.message || 'Chyba při načítání času poslední synchronizace',
          isLoading: false,
        }));
      }
    };

    loadLastSync();
  }, [user]);

  const syncCalculations = async () => {
    if (!user) return false;

    setState(prevState => ({ ...prevState, isSyncing: true, error: null }));

    try {
      // Simulate synchronization process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const now = new Date().toISOString();

      setState(prevState => ({
        ...prevState,
        lastSync: now,
        isSyncing: false,
        offlineCalculations: prevState.offlineCalculations.map(calc => ({ ...calc, synced: true })),
        hasPendingCalculations: false,
      }));

      return true;
    } catch (error: any) {
      console.error('Error synchronizing calculations:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při synchronizaci výpočtů',
        isSyncing: false,
      }));
      return false;
    }
  };

  const syncPendingCalculations = async () => {
    return await syncCalculations();
  };

  return {
    ...state,
    syncCalculations,
    syncPendingCalculations,
  };
};
