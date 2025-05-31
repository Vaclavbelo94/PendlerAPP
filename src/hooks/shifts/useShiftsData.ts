
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useOptimizedNetworkStatus } from '@/hooks/useOptimizedNetworkStatus';
import { optimizedErrorHandler } from '@/utils/optimizedErrorHandler';
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/errorHandler';
import { Shift } from './useShiftsCRUD';

interface UseShiftsDataOptions {
  userId: string | undefined;
}

export const useShiftsData = ({ userId }: UseShiftsDataOptions) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOnline } = useOptimizedNetworkStatus();
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const hasLoadedRef = useRef(false);

  const cacheKey = useMemo(() => userId ? `shifts_${userId}` : null, [userId]);

  const loadShifts = useCallback(async () => {
    if (!userId || !cacheKey || hasLoadedRef.current) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      loadingTimeoutRef.current = setTimeout(() => {
        setError('Načítání trvá příliš dlouho. Zkontrolujte připojení.');
        setIsLoading(false);
      }, 10000);

      if (!isOnline) {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setShifts(parsed.map((shift: any) => ({
            ...shift,
            type: shift.type as 'morning' | 'afternoon' | 'night'
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
        type: shift.type as 'morning' | 'afternoon' | 'night'
      }));

      setShifts(typedShifts);
      hasLoadedRef.current = true;
      
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

  const refreshShifts = useCallback(async () => {
    hasLoadedRef.current = false;
    optimizedErrorHandler.clearCache();
    await loadShifts();
  }, [loadShifts]);

  const updateShiftsState = useCallback((updater: (prev: Shift[]) => Shift[]) => {
    setShifts(updater);
  }, []);

  useEffect(() => {
    if (userId && !hasLoadedRef.current) {
      loadShifts();
    }
  }, [userId, loadShifts]);

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
    error,
    refreshShifts,
    updateShiftsState
  };
};
