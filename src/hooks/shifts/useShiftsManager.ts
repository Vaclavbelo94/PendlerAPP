import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { logger } from '@/utils/logger';
import { Shift, ShiftFormData, ShiftType } from '@/hooks/shifts/types';

interface UseShiftsManagerOptions {
  userId: string | null;
  enableRealtime?: boolean;
  enableCache?: boolean;
}

interface UseShiftsManagerReturn {
  shifts: Shift[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  addShift: (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Shift | null>;
  updateShift: (shiftData: Shift) => Promise<Shift | null>;
  deleteShift: (shiftId: string) => Promise<void>;
  refreshShifts: () => Promise<void>;
  optimisticUpdate: (shiftId: string, updates: Partial<Shift>) => void;
  getShiftsByDate: (date: Date) => Shift[];
  getShiftsByMonth: (date: Date) => Shift[];
  stats: {
    totalShifts: number;
    monthlyShifts: number;
    averageHours: number;
  };
}

// Unified, optimized shifts manager
export const useShiftsManager = (options: UseShiftsManagerOptions): UseShiftsManagerReturn => {
  const { userId, enableRealtime = true, enableCache = true } = options;
  const { success, error: showError } = useStandardizedToast();
  
  // Core state
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for cleanup and caching
  const realtimeChannelRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheKeyRef = useRef<string>('');

  // Cache key for localStorage
  const cacheKey = useMemo(() => {
    return userId ? `shifts_${userId}` : '';
  }, [userId]);

  // Load from cache first
  const loadFromCache = useCallback(() => {
    if (!enableCache || !cacheKey) return [];
    
    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      logger.warn('Failed to load shifts from cache', { error: error.message });
      return [];
    }
  }, [cacheKey, enableCache]);

  // Save to cache
  const saveToCache = useCallback((shiftsData: Shift[]) => {
    if (!enableCache || !cacheKey) return;
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(shiftsData));
      localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
    } catch (error) {
      logger.warn('Failed to save shifts to cache', { error: error.message });
    }
  }, [cacheKey, enableCache]);

  // Optimistic update function
  const optimisticUpdate = useCallback((shiftId: string, updates: Partial<Shift>) => {
    setShifts(prev => prev.map(shift => 
      shift.id === shiftId ? { ...shift, ...updates } : shift
    ));
  }, []);

  // Load shifts from database
  const loadShifts = useCallback(async () => {
    if (!userId) {
      setShifts([]);
      setIsLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      setError(null);

      // Load from cache first for immediate UI
      const cachedShifts = loadFromCache();
      if (cachedShifts.length > 0) {
        setShifts(cachedShifts);
        setIsLoading(false);
      }

      // Fetch fresh data
      const { data, error: dbError } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .abortSignal(abortControllerRef.current.signal);

      if (dbError) throw dbError;

      // Type-safe conversion of database data to Shift[]
      const shiftsData: Shift[] = (data || []).map(item => ({
        ...item,
        type: item.type as ShiftType, // Type assertion for database string to ShiftType
      }));
      
      setShifts(shiftsData);
      saveToCache(shiftsData);
      
      logger.info('Shifts loaded successfully', { 
        count: shiftsData.length,
        userId,
        cached: cachedShifts.length > 0
      });

    } catch (error: any) {
      if (error.name === 'AbortError') return;
      
      logger.error('Failed to load shifts', { 
        error: error.message,
        userId 
      });
      setError(error.message);
      showError('Chyba při načítání směn');
    } finally {
      setIsLoading(false);
    }
  }, [userId, loadFromCache, saveToCache, showError]);

  // Add shift
  const addShift = useCallback(async (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Shift | null> => {
    if (!userId) return null;

    const tempId = `temp_${Date.now()}`;
    const tempShift: Shift = {
      ...shiftData,
      id: tempId,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      setIsSaving(true);
      
      // Optimistic update
      setShifts(prev => [tempShift, ...prev]);

      const { data, error: dbError } = await supabase
        .from('shifts')
        .insert({
          user_id: userId,
          ...shiftData,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Type-safe conversion
      const newShift: Shift = {
        ...data,
        type: data.type as ShiftType,
      };

      // Replace temp shift with real one
      setShifts(prev => prev.map(shift => 
        shift.id === tempId ? newShift : shift
      ));
      
      // Update cache
      const updatedShifts = shifts.map(shift => 
        shift.id === tempId ? newShift : shift
      );
      saveToCache(updatedShifts);

      success('Směna byla úspěšně přidána');
      logger.info('Shift added successfully', { shiftId: newShift.id });
      
      return newShift;

    } catch (error: any) {
      // Revert optimistic update
      setShifts(prev => prev.filter(shift => shift.id !== tempId));
      
      logger.error('Failed to add shift', { error: error.message });
      showError('Chyba při přidávání směny');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId, shifts, saveToCache, success, showError]);

  // Update shift
  const updateShift = useCallback(async (shiftData: Shift): Promise<Shift | null> => {
    const originalShift = shifts.find(s => s.id === shiftData.id);
    if (!originalShift) return null;

    try {
      setIsSaving(true);
      
      // Optimistic update
      optimisticUpdate(shiftData.id, shiftData);

      const { data, error: dbError } = await supabase
        .from('shifts')
        .update({
          date: shiftData.date,
          start_time: shiftData.start_time,
          end_time: shiftData.end_time,
          type: shiftData.type,
          notes: shiftData.notes,
        })
        .eq('id', shiftData.id)
        .select()
        .single();

      if (dbError) throw dbError;

      // Type-safe conversion
      const updatedShift: Shift = {
        ...data,
        type: data.type as ShiftType,
      };

      // Update with real data
      setShifts(prev => prev.map(shift => 
        shift.id === shiftData.id ? updatedShift : shift
      ));
      
      // Update cache
      const updatedShifts = shifts.map(shift => 
        shift.id === shiftData.id ? updatedShift : shift
      );
      saveToCache(updatedShifts);

      success('Směna byla úspěšně aktualizována');
      logger.info('Shift updated successfully', { shiftId: updatedShift.id });
      
      return updatedShift;

    } catch (error: any) {
      // Revert optimistic update
      setShifts(prev => prev.map(shift => 
        shift.id === shiftData.id ? originalShift : shift
      ));
      
      logger.error('Failed to update shift', { error: error.message });
      showError('Chyba při aktualizaci směny');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [shifts, optimisticUpdate, saveToCache, success, showError]);

  // Delete shift
  const deleteShift = useCallback(async (shiftId: string): Promise<void> => {
    const originalShift = shifts.find(s => s.id === shiftId);
    if (!originalShift) return;

    try {
      setIsSaving(true);
      
      // Optimistic update
      setShifts(prev => prev.filter(shift => shift.id !== shiftId));

      const { error: dbError } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId);

      if (dbError) throw dbError;

      // Update cache
      const updatedShifts = shifts.filter(shift => shift.id !== shiftId);
      saveToCache(updatedShifts);

      success('Směna byla úspěšně smazána');
      logger.info('Shift deleted successfully', { shiftId });

    } catch (error: any) {
      // Revert optimistic update
      setShifts(prev => [...prev, originalShift]);
      
      logger.error('Failed to delete shift', { error: error.message });
      showError('Chyba při mazání směny');
    } finally {
      setIsSaving(false);
    }
  }, [shifts, saveToCache, success, showError]);

  // Refresh shifts
  const refreshShifts = useCallback(async () => {
    await loadShifts();
  }, [loadShifts]);

  // Helper functions
  const getShiftsByDate = useCallback((date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return shifts.filter(shift => shift.date === dateStr);
  }, [shifts]);

  const getShiftsByMonth = useCallback((date: Date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate.getMonth() === month && shiftDate.getFullYear() === year;
    });
  }, [shifts]);

  // Stats calculation
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = getShiftsByMonth(now);
    
    const totalShifts = shifts.length;
    const monthlyShifts = thisMonth.length;
    const averageHours = shifts.length > 0 
      ? shifts.reduce((acc, shift) => {
          const start = new Date(`2000-01-01T${shift.start_time}`);
          const end = new Date(`2000-01-01T${shift.end_time}`);
          if (end < start) end.setDate(end.getDate() + 1); // Handle overnight shifts
          return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }, 0) / shifts.length
      : 0;

    return {
      totalShifts,
      monthlyShifts,
      averageHours: Math.round(averageHours * 10) / 10,
    };
  }, [shifts, getShiftsByMonth]);

  // Setup realtime subscription
  useEffect(() => {
    if (!enableRealtime || !userId) return;

    const channel = supabase
      .channel('shifts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shifts',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          logger.info('Realtime shift change', { event: payload.eventType });
          refreshShifts();
        }
      )
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [enableRealtime, userId, refreshShifts]);

  // Load shifts on mount
  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
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
    refreshShifts,
    optimisticUpdate,
    getShiftsByDate,
    getShiftsByMonth,
    stats,
  };
};