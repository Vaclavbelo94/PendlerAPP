
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
  const lastUserIdRef = useRef<string | undefined>();

  const cacheKey = useMemo(() => userId ? `shifts_${userId}` : null, [userId]);

  // Clear localStorage cache when switching users
  useEffect(() => {
    if (lastUserIdRef.current && lastUserIdRef.current !== userId) {
      console.log('🔄 User changed, clearing cache:', lastUserIdRef.current, '->', userId);
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('shifts_')) {
          localStorage.removeItem(key);
        }
      });
    }
    lastUserIdRef.current = userId;
  }, [userId]);

  const loadShifts = useCallback(async (force = false) => {
    if (!userId || !cacheKey) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Set loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      loadingTimeoutRef.current = setTimeout(() => {
        setError('Načítání trvá příliš dlouho. Zkontrolujte připojení.');
        setIsLoading(false);
      }, 10000);

      // Try cache first if offline
      if (!isOnline && !force) {
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

      // Load from database
      const data = await optimizedErrorHandler.executeWithRetry(
        async () => {
          const { data, error: fetchError } = await supabase
            .from('shifts')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

          if (fetchError) {
            throw fetchError;
          }
          
          return data;
        },
        `loadShifts_${userId}`,
        { maxRetries: isOnline ? 2 : 0 }
      );

      // Process and validate shifts
      const typedShifts = (data || []).map(shift => ({
        ...shift,
        type: shift.type as 'morning' | 'afternoon' | 'night'
      }));

      setShifts(typedShifts);
      
      // Cache the data
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify(typedShifts));
      }

    } catch (err) {
      const errorMessage = !isOnline 
        ? 'Nejste připojeni. Zobrazuji uložená data.'
        : 'Nepodařilo se načíst směny';
      
      setError(errorMessage);
      errorHandler.handleError(err, { operation: 'loadShifts', userId });
      
      // Try fallback to cache
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
    optimizedErrorHandler.clearCache();
    await loadShifts(true);
  }, [loadShifts]);

  const updateShiftsState = useCallback((updater: (prev: Shift[]) => Shift[]) => {
    setShifts(updater);
  }, []);

  // Load shifts when userId changes
  useEffect(() => {
    if (userId) {
      loadShifts();
    } else {
      setShifts([]);
      setIsLoading(false);
    }
  }, [userId, loadShifts]);

  // Cleanup on unmount
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
