import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { useOptimizedNetworkStatus } from '@/hooks/useOptimizedNetworkStatus';
import { optimizedErrorHandler } from '@/utils/optimizedErrorHandler';
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/errorHandler';
import { formatDateForDB } from '@/components/shifts/utils/dateUtils';
import { Shift, ShiftFormData } from '@/types/shifts';

// Re-export types for components that import from this file
export { Shift, ShiftFormData } from '@/types/shifts';

export interface UseOptimizedShiftsManagementReturn {
  shifts: Shift[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  addShift: (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Shift | null>;
  updateShift: (shiftData: Shift) => Promise<Shift | null>;
  deleteShift: (shiftId: string) => Promise<void>;
  refreshShifts: () => Promise<void>;
}

export const useOptimizedShiftsManagement = (userId: string | undefined): UseOptimizedShiftsManagementReturn => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOnline } = useOptimizedNetworkStatus();
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const hasLoadedRef = useRef(false);

  const { success, error: showError } = useStandardizedToast();

  // Memoize cache key to prevent recalculation
  const cacheKey = useMemo(() => userId ? `shifts_${userId}` : null, [userId]);

  // Load shifts with optimization and proper dependency management
  const loadShifts = useCallback(async () => {
    if (!userId || !cacheKey || hasLoadedRef.current) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Set loading timeout
      loadingTimeoutRef.current = setTimeout(() => {
        setError('Načítání trvá příliš dlouho. Zkontrolujte připojení.');
        setIsLoading(false);
      }, 10000);

      // Try to load from cache first if offline
      if (!isOnline) {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setShifts(parsed.map((shift: any) => ({
            ...shift,
            type: shift.type as 'morning' | 'afternoon' | 'night' | 'custom'
          })));
          hasLoadedRef.current = true;
          return;
        }
      }

      const data = await optimizedErrorHandler.executeWithRetry(
        async () => {
          const { data, error: fetchError } = await supabase
            .from('shifts')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

          if (fetchError) throw fetchError;
          return data;
        },
        `loadShifts_${userId}`,
        { maxRetries: isOnline ? 2 : 0 }
      );

      const typedShifts = (data || []).map(shift => ({
        ...shift,
        type: shift.type as 'morning' | 'afternoon' | 'night' | 'custom'
      }));

      setShifts(typedShifts);
      hasLoadedRef.current = true;
      
      // Cache data
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify(typedShifts));
      }

    } catch (err) {
      const errorMessage = !isOnline 
        ? 'Nejste připojeni. Zobrazuji uložená data.'
        : 'Nepodařilo se načíst směny';
      
      setError(errorMessage);
      errorHandler.handleError(err, { operation: 'loadShifts', userId });
      
      if (!isOnline && cacheKey) {
        // Try to load cached data
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setShifts(parsed);
        }
      }
    } finally {
      setIsLoading(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    }
  }, [userId, cacheKey, isOnline]);

  // Stabilized add shift function
  const addShift = useCallback(async (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Shift | null> => {
    if (!userId) {
      showError('Chyba', 'Uživatel není přihlášen');
      return null;
    }

    if (!isOnline) {
      // Offline mode - add to queue
      const tempShift: Shift = {
        id: `temp_${Date.now()}`,
        user_id: userId,
        ...shiftData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setShifts(prev => [tempShift, ...prev]);
      showError('Offline režim', 'Směna bude synchronizována při obnovení připojení');
      return tempShift;
    }

    setIsSaving(true);
    try {
      // Oprava: Zajistíme správné formátování dat
      const formattedShiftData = {
        ...shiftData,
        user_id: userId
      };

      console.log('Adding shift with data:', formattedShiftData);

      const data = await optimizedErrorHandler.executeWithRetry(
        async () => {
          const { data, error: insertError } = await supabase
            .from('shifts')
            .insert([formattedShiftData])
            .select()
            .single();

          if (insertError) throw insertError;
          return data;
        },
        `addShift_${userId}_${shiftData.date}`,
        { maxRetries: 2 }
      );

      const newShift: Shift = {
        ...data,
        type: data.type as 'morning' | 'afternoon' | 'night' | 'custom'
      };
      
      setShifts(prev => [newShift, ...prev.filter(s => s.id !== newShift.id)]);
      success('Směna přidána', 'Nová směna byla úspěšně vytvořena');
      
      return newShift;
    } catch (err) {
      errorHandler.handleError(err, { operation: 'addShift', shiftData });
      showError('Chyba při přidání', 'Nepodařilo se přidat směnu');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId, isOnline, success, showError]);

  // Stabilized update shift function
  const updateShift = useCallback(async (shiftData: Shift): Promise<Shift | null> => {
    if (!userId || !shiftData.id) {
      showError('Chyba', 'Neplatná data směny');
      return null;
    }

    setIsSaving(true);
    try {
      const data = await optimizedErrorHandler.executeWithRetry(
        async () => {
          const { data, error: updateError } = await supabase
            .from('shifts')
            .update({
              date: shiftData.date,
              type: shiftData.type,
              start_time: shiftData.start_time,
              end_time: shiftData.end_time,
              notes: shiftData.notes
            })
            .eq('id', shiftData.id)
            .eq('user_id', userId)
            .select()
            .single();

          if (updateError) throw updateError;
          return data;
        },
        `updateShift_${shiftData.id}`,
        { maxRetries: 2 }
      );

      const updatedShift: Shift = {
        ...data,
        type: data.type as 'morning' | 'afternoon' | 'night' | 'custom'
      };
      
      setShifts(prev => prev.map(shift => shift.id === updatedShift.id ? updatedShift : shift));
      success('Směna upravena', 'Změny byly úspěšně uloženy');
      
      return updatedShift;
    } catch (err) {
      errorHandler.handleError(err, { operation: 'updateShift', shiftData });
      showError('Chyba při úpravě', 'Nepodařilo se upravit směnu');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId, success, showError]);

  // Stabilized delete shift function
  const deleteShift = useCallback(async (shiftId: string): Promise<void> => {
    if (!userId) {
      showError('Chyba', 'Uživatel není přihlášen');
      return;
    }

    setIsSaving(true);
    try {
      await optimizedErrorHandler.executeWithRetry(
        async () => {
          const { error: deleteError } = await supabase
            .from('shifts')
            .delete()
            .eq('id', shiftId)
            .eq('user_id', userId);

          if (deleteError) throw deleteError;
        },
        `deleteShift_${shiftId}`,
        { maxRetries: 2 }
      );

      setShifts(prev => prev.filter(shift => shift.id !== shiftId));
      success('Směna smazána', 'Směna byla úspěšně odstraněna');
    } catch (err) {
      errorHandler.handleError(err, { operation: 'deleteShift', shiftId });
      showError('Chyba při mazání', 'Nepodařilo se smazat směnu');
    } finally {
      setIsSaving(false);
    }
  }, [userId, success, showError]);

  const refreshShifts = useCallback(async () => {
    hasLoadedRef.current = false;
    optimizedErrorHandler.clearCache();
    await loadShifts();
  }, [loadShifts]);

  // Load shifts only once when userId is available
  useEffect(() => {
    if (userId && !hasLoadedRef.current) {
      loadShifts();
    }
  }, [userId, loadShifts]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return {
    shifts,
    isLoading,
    isSaving,
    error,
    addShift,
    updateShift,
    deleteShift,
    refreshShifts
  };
};
