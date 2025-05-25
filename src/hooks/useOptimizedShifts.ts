
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { Shift, ShiftType } from '@/components/shifts/types';
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/errorHandler';
import { toast } from '@/hooks/use-toast';

interface UseOptimizedShiftsReturn {
  shifts: Shift[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  saveShift: (date: Date, type: ShiftType, notes: string) => Promise<void>;
  deleteShift: (shiftId: string) => Promise<void>;
  syncOfflineChanges: () => Promise<void>;
}

export const useOptimizedShifts = (): UseOptimizedShiftsReturn => {
  const { user } = useAuth();
  const { isOffline } = useOfflineStatus();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized shifts lookup for performance
  const shiftsLookup = useMemo(() => {
    const lookup = new Map<string, Shift>();
    shifts.forEach(shift => {
      const dateKey = shift.date.toISOString().split('T')[0];
      lookup.set(dateKey, shift);
    });
    return lookup;
  }, [shifts]);

  // Load shifts from database or localStorage
  const loadShifts = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      let shiftsData: Shift[] = [];

      if (isOffline) {
        // Load from localStorage when offline
        const cachedShifts = localStorage.getItem(`shifts_cache_${user.id}`);
        if (cachedShifts) {
          const parsed = JSON.parse(cachedShifts);
          shiftsData = parsed.map((shift: any) => ({
            ...shift,
            date: new Date(shift.date)
          }));
        }
      } else {
        // Load from Supabase when online
        const { data, error: fetchError } = await supabase
          .from('shifts')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (fetchError) throw fetchError;

        shiftsData = data?.map(shift => ({
          id: shift.id,
          userId: shift.user_id,
          user_id: shift.user_id,
          date: new Date(shift.date),
          type: shift.type as ShiftType,
          notes: shift.notes || '',
          created_at: shift.created_at,
          updated_at: shift.updated_at
        })) || [];

        // Cache data for offline use
        localStorage.setItem(`shifts_cache_${user.id}`, JSON.stringify(shiftsData));
      }

      setShifts(shiftsData);
    } catch (err) {
      const errorMessage = 'Nepodařilo se načíst směny';
      setError(errorMessage);
      errorHandler.handleError(err, { operation: 'loadShifts' });
      
      if (!isOffline) {
        toast({
          title: "Chyba při načítání",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, isOffline]);

  // Save shift with offline support
  const saveShift = useCallback(async (date: Date, type: ShiftType, notes: string) => {
    if (!user) throw new Error('Uživatel není přihlášen');

    const dateString = date.toISOString().split('T')[0];
    const existingShift = shiftsLookup.get(dateString);

    try {
      const shiftData = {
        user_id: user.id,
        date: dateString,
        type,
        notes: notes.trim()
      };

      let savedShift: Shift;

      if (isOffline) {
        // Save offline with queue
        const tempId = existingShift?.id || `temp_${Date.now()}`;
        savedShift = {
          id: tempId,
          userId: user.id,
          user_id: user.id,
          date,
          type,
          notes: notes.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Add to offline queue
        const offlineQueue = JSON.parse(localStorage.getItem('offline_shifts_queue') || '[]');
        offlineQueue.push({
          id: `shift_${Date.now()}`,
          action: existingShift ? 'UPDATE' : 'CREATE',
          data: { ...shiftData, id: tempId },
          timestamp: Date.now(),
          retries: 0
        });
        localStorage.setItem('offline_shifts_queue', JSON.stringify(offlineQueue));

        toast({
          title: "Směna uložena offline",
          description: "Bude synchronizována při obnovení připojení"
        });
      } else {
        // Save to Supabase when online
        if (existingShift) {
          const { data, error } = await supabase
            .from('shifts')
            .update(shiftData)
            .eq('id', existingShift.id)
            .eq('user_id', user.id)
            .select()
            .single();

          if (error) throw error;
          savedShift = {
            ...existingShift,
            type,
            notes: notes.trim(),
            updated_at: data.updated_at
          };
        } else {
          const { data, error } = await supabase
            .from('shifts')
            .insert(shiftData)
            .select()
            .single();

          if (error) throw error;
          savedShift = {
            id: data.id,
            userId: user.id,
            user_id: user.id,
            date,
            type,
            notes: notes.trim(),
            created_at: data.created_at,
            updated_at: data.updated_at
          };
        }

        toast({
          title: existingShift ? "Směna upravena" : "Směna vytvořena",
          description: `${type === 'morning' ? 'Ranní' : type === 'afternoon' ? 'Odpolední' : 'Noční'} směna byla uložena`
        });
      }

      // Update local state
      setShifts(prev => {
        const updated = prev.filter(s => s.id !== savedShift.id);
        return [...updated, savedShift].sort((a, b) => b.date.getTime() - a.date.getTime());
      });

      // Update cache
      const updatedShifts = shifts.filter(s => s.id !== savedShift.id);
      updatedShifts.push(savedShift);
      localStorage.setItem(`shifts_cache_${user.id}`, JSON.stringify(updatedShifts));

    } catch (err) {
      errorHandler.handleError(err, { operation: 'saveShift', date, type, notes });
      throw err;
    }
  }, [user, isOffline, shiftsLookup, shifts]);

  // Delete shift with offline support
  const deleteShift = useCallback(async (shiftId: string) => {
    if (!user) throw new Error('Uživatel není přihlášen');

    try {
      if (isOffline) {
        // Add to offline queue
        const offlineQueue = JSON.parse(localStorage.getItem('offline_shifts_queue') || '[]');
        offlineQueue.push({
          id: `delete_${Date.now()}`,
          action: 'DELETE',
          data: { id: shiftId },
          timestamp: Date.now(),
          retries: 0
        });
        localStorage.setItem('offline_shifts_queue', JSON.stringify(offlineQueue));

        toast({
          title: "Směna smazána offline",
          description: "Změna bude synchronizována při obnovení připojení"
        });
      } else {
        const { error } = await supabase
          .from('shifts')
          .delete()
          .eq('id', shiftId)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Směna smazána",
          description: "Směna byla úspěšně odstraněna"
        });
      }

      // Update local state
      setShifts(prev => prev.filter(s => s.id !== shiftId));

      // Update cache
      const updatedShifts = shifts.filter(s => s.id !== shiftId);
      localStorage.setItem(`shifts_cache_${user.id}`, JSON.stringify(updatedShifts));

    } catch (err) {
      errorHandler.handleError(err, { operation: 'deleteShift', shiftId });
      throw err;
    }
  }, [user, isOffline, shifts]);

  // Sync offline changes
  const syncOfflineChanges = useCallback(async () => {
    if (isOffline || !user) return;

    try {
      const offlineQueue = JSON.parse(localStorage.getItem('offline_shifts_queue') || '[]');
      if (offlineQueue.length === 0) return;

      let processed = 0;
      const updatedQueue = [];

      for (const item of offlineQueue) {
        try {
          switch (item.action) {
            case 'CREATE':
            case 'UPDATE':
              await supabase.from('shifts').upsert(item.data);
              processed++;
              break;
            case 'DELETE':
              await supabase.from('shifts').delete().eq('id', item.data.id);
              processed++;
              break;
          }
        } catch (error) {
          item.retries = (item.retries || 0) + 1;
          if (item.retries < 3) {
            updatedQueue.push(item);
          }
          errorHandler.handleError(error, { operation: 'syncOfflineItem', item });
        }
      }

      localStorage.setItem('offline_shifts_queue', JSON.stringify(updatedQueue));

      if (processed > 0) {
        toast({
          title: "Offline změny synchronizovány",
          description: `Zpracováno ${processed} změn`
        });
        
        // Refresh data after sync
        await loadShifts();
      }
    } catch (err) {
      errorHandler.handleError(err, { operation: 'syncOfflineChanges' });
    }
  }, [isOffline, user, loadShifts]);

  // Load shifts on mount and when user/online status changes
  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  // Auto-sync when coming online
  useEffect(() => {
    if (!isOffline) {
      syncOfflineChanges();
    }
  }, [isOffline, syncOfflineChanges]);

  const refresh = useCallback(async () => {
    await loadShifts();
  }, [loadShifts]);

  return {
    shifts,
    isLoading,
    error,
    refresh,
    saveShift,
    deleteShift,
    syncOfflineChanges
  };
};

export default useOptimizedShifts;
