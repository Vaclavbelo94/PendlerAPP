import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface OfflineCalculationsState {
  isLoading: boolean;
  lastSync: string | null;
  error: string | null;
}

export const useOfflineCalculations = () => {
  const { user } = useAuth();
  const [state, setState] = useState<OfflineCalculationsState>({
    isLoading: true,
    lastSync: null,
    error: null,
  });

  useEffect(() => {
    const loadLastSync = async () => {
      if (!user) return;

      setState(prevState => ({ ...prevState, isLoading: true, error: null }));

      try {
        const { data, error } = await supabase
          .from('offline_calculations_sync')
          .select('last_sync')
          .eq('user_id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setState(prevState => ({
          ...prevState,
          lastSync: data?.last_sync || null,
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

    setState(prevState => ({ ...prevState, isLoading: true, error: null }));

    try {
      // Simulate synchronization process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update last sync time
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('offline_calculations_sync')
        .upsert({
          user_id: user.id,
          last_sync: now,
        }, { onConflict: 'user_id' });

      if (error) {
        throw error;
      }

      setState(prevState => ({
        ...prevState,
        lastSync: now,
        isLoading: false,
      }));

      return true;
    } catch (error: any) {
      console.error('Error synchronizing calculations:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při synchronizaci výpočtů',
        isLoading: false,
      }));
      return false;
    }
  };

  return {
    ...state,
    syncCalculations,
  };
};
