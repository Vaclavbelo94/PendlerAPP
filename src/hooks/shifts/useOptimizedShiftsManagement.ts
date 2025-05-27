
import { useState, useCallback, useEffect, useRef } from 'react';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { useOptimizedNetworkStatus } from '@/hooks/useOptimizedNetworkStatus';
import { optimizedErrorHandler } from '@/utils/optimizedErrorHandler';
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/errorHandler';

export interface Shift {
  id?: string;
  user_id: string;
  date: string;
  type: 'morning' | 'afternoon' | 'night';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

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

  const { success, error: showError } = useStandardizedToast();

  // Load shifts with optimization
  const loadShifts = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Set loading timeout
      loadingTimeoutRef.current = setTimeout(() => {
        setError('Načítání trvá příliš dlouho. Zkontrolujte připojení.');
      }, 15000);

      // Try to load from cache first if offline
      const cacheKey = `shifts_${userId}`;
      if (!isOnline) {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setShifts(parsed.map((shift: any) => ({
            ...shift,
            type: shift.type as 'morning' | 'afternoon' | 'night'
          })));
          setIsLoading(false);
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
        { maxRetries: isOnline ? 3 : 0 }
      );

      const typedShifts = (data || []).map(shift => ({
        ...shift,
        type: shift.type as 'morning' | 'afternoon' | 'night'
      }));

      setShifts(typedShifts);
      
      // Cache data
      localStorage.setItem(cacheKey, JSON.stringify(typedShifts));

    } catch (err) {
      const errorMessage = !isOnline 
        ? 'Nejste připojeni. Zobrazuji uložená data.'
        : 'Nepodařilo se načíst směny';
      
      setError(errorMessage);
      errorHandler.handleError(err, { operation: 'loadShifts', userId });
      
      if (!isOnline) {
        // Try to load cached data
        const cachedData = localStorage.getItem(`shifts_${userId}`);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setShifts(parsed);
        }
      } else {
        showError('Chyba při načítání', errorMessage);
      }
    } finally {
      setIsLoading(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    }
  }, [userId, isOnline, showError]);

  // Add new shift with deduplication
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
      
      // Add to offline queue
      const queue = JSON.parse(localStorage.getItem('offline_shifts_queue') || '[]');
      queue.push({ action: 'CREATE', data: tempShift });
      localStorage.setItem('offline_shifts_queue', JSON.stringify(queue));

      showError('Offline režim', 'Směna bude synchronizována při obnovení připojení');
      return tempShift;
    }

    setIsSaving(true);
    try {
      const data = await optimizedErrorHandler.executeWithRetry(
        async () => {
          const { data, error: insertError } = await supabase
            .from('shifts')
            .insert([{ ...shiftData, user_id: userId }])
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
        type: data.type as 'morning' | 'afternoon' | 'night'
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

  // Update shift with optimization
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
        type: data.type as 'morning' | 'afternoon' | 'night'
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

  // Delete shift with optimization
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
    optimizedErrorHandler.clearCache();
    await loadShifts();
  }, [loadShifts]);

  // Load shifts on mount and when userId changes
  useEffect(() => {
    if (userId) {
      loadShifts();
    }
  }, [loadShifts, userId]);

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
