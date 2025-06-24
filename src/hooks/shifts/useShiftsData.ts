
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
      // Clear all cached shifts data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('shifts_')) {
          localStorage.removeItem(key);
          console.log('🗑️ Cleared cache:', key);
        }
      });
    }
    lastUserIdRef.current = userId;
  }, [userId]);

  const loadShifts = useCallback(async (force = false) => {
    if (!userId || !cacheKey) {
      console.log('❌ No userId or cacheKey, skipping load');
      setIsLoading(false);
      return;
    }

    console.log('🚀 Loading shifts for user:', userId, 'force:', force);

    try {
      setIsLoading(true);
      setError(null);

      loadingTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Loading timeout reached');
        setError('Načítání trvá příliš dlouho. Zkontrolujte připojení.');
        setIsLoading(false);
      }, 10000);

      if (!isOnline && !force) {
        console.log('📴 Offline mode, checking cache');
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          console.log('💾 Loaded from cache:', parsed.length, 'shifts');
          setShifts(parsed.map((shift: any) => ({
            ...shift,
            type: shift.type as 'morning' | 'afternoon' | 'night'
          })));
          return;
        }
      }

      console.log('🌐 Loading from database...');
      const data = await optimizedErrorHandler.executeWithRetry(
        async () => {
          const { data, error: fetchError } = await supabase
            .from('shifts')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

          if (fetchError) {
            console.error('❌ Database error:', fetchError);
            throw fetchError;
          }
          
          console.log('✅ Database query successful:', data?.length || 0, 'shifts found');
          return data;
        },
        `loadShifts_${userId}`,
        { maxRetries: isOnline ? 2 : 0 }
      );

      const typedShifts = (data || []).map(shift => ({
        ...shift,
        type: shift.type as 'morning' | 'afternoon' | 'night'
      }));

      console.log('📊 Processed shifts:', typedShifts.length);
      setShifts(typedShifts);
      
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify(typedShifts));
        console.log('💾 Cached to localStorage:', cacheKey);
      }

    } catch (err) {
      const errorMessage = !isOnline 
        ? 'Nejste připojeni. Zobrazuji uložená data.'
        : 'Nepodařilo se načíst směny';
      
      console.error('❌ Error loading shifts:', err);
      setError(errorMessage);
      errorHandler.handleError(err, { operation: 'loadShifts', userId });
      
      if (!isOnline && cacheKey) {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          console.log('💾 Fallback to cache after error:', parsed.length, 'shifts');
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
    console.log('🔄 Force refreshing shifts');
    optimizedErrorHandler.clearCache();
    await loadShifts(true);
  }, [loadShifts]);

  const updateShiftsState = useCallback((updater: (prev: Shift[]) => Shift[]) => {
    setShifts(updater);
  }, []);

  // Load shifts when userId changes or component mounts
  useEffect(() => {
    if (userId) {
      console.log('👤 User changed or component mounted, loading shifts for:', userId);
      loadShifts();
    } else {
      console.log('❌ No user, clearing shifts');
      setShifts([]);
      setIsLoading(false);
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
