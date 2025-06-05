
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { saveData, getAllData, addToSyncQueue, queryByIndex } from '@/utils/offlineStorage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface OfflineShift {
  id: string;
  user_id: string;
  date: string;
  type: string;
  notes?: string;
  synced: boolean;
  created_at: string;
  updated_at: string;
}

export const useOfflineShifts = () => {
  const { user } = useAuth();
  const { isOffline } = useOfflineStatus();
  const [offlineShifts, setOfflineShifts] = useState<OfflineShift[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load offline shifts
  const loadOfflineShifts = useCallback(async () => {
    if (!user) return;
    
    try {
      const shifts = await queryByIndex<OfflineShift>('shifts', 'user_id', user.id);
      setOfflineShifts(shifts);
    } catch (error) {
      console.error('Error loading offline shifts:', error);
    }
  }, [user]);

  // Save shift offline
  const saveShiftOffline = useCallback(async (shift: Omit<OfflineShift, 'synced' | 'user_id'>) => {
    if (!user) return;

    try {
      const offlineShift: OfflineShift = {
        ...shift,
        synced: false,
        user_id: user.id
      };

      await saveData('shifts', offlineShift);
      
      // Add to sync queue
      await addToSyncQueue('shifts', shift.id, 'INSERT', offlineShift);
      
      // Update local state
      setOfflineShifts(prev => [offlineShift, ...prev.filter(s => s.id !== shift.id)]);
      
      if (isOffline) {
        toast({
          title: "Směna uložena offline",
          description: "Bude synchronizována při obnovení připojení"
        });
      }
      
      return offlineShift;
    } catch (error) {
      console.error('Error saving shift offline:', error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit směnu offline",
        variant: "destructive"
      });
    }
  }, [user, isOffline]);

  // Update shift offline
  const updateShiftOffline = useCallback(async (shiftId: string, updates: Partial<OfflineShift>) => {
    if (!user) return;

    try {
      const existingShift = offlineShifts.find(s => s.id === shiftId);
      if (!existingShift) return;

      const updatedShift: OfflineShift = {
        ...existingShift,
        ...updates,
        synced: false,
        updated_at: new Date().toISOString()
      };

      await saveData('shifts', updatedShift);
      await addToSyncQueue('shifts', shiftId, 'UPDATE', updatedShift);
      
      setOfflineShifts(prev => prev.map(s => s.id === shiftId ? updatedShift : s));
      
      if (isOffline) {
        toast({
          title: "Směna aktualizována offline",
          description: "Změny budou synchronizovány při obnovení připojení"
        });
      }
      
      return updatedShift;
    } catch (error) {
      console.error('Error updating shift offline:', error);
      toast({
        title: "Chyba při aktualizaci",
        description: "Nepodařilo se aktualizovat směnu offline",
        variant: "destructive"
      });
    }
  }, [user, isOffline, offlineShifts]);

  // Sync pending shifts
  const syncPendingShifts = useCallback(async () => {
    if (!user || isOffline) return;

    setIsSyncing(true);
    try {
      const pendingShifts = offlineShifts.filter(shift => !shift.synced);
      
      for (const shift of pendingShifts) {
        try {
          // Check if shift exists on server
          const { data: existingShift } = await supabase
            .from('shifts')
            .select('id')
            .eq('id', shift.id)
            .eq('user_id', user.id)
            .maybeSingle();

          if (existingShift) {
            // Update existing shift
            const { error } = await supabase
              .from('shifts')
              .update({
                date: shift.date,
                type: shift.type,
                notes: shift.notes,
                updated_at: shift.updated_at
              })
              .eq('id', shift.id)
              .eq('user_id', user.id);

            if (error) throw error;
          } else {
            // Insert new shift
            const { error } = await supabase
              .from('shifts')
              .insert({
                id: shift.id,
                user_id: shift.user_id,
                date: shift.date,
                type: shift.type,
                notes: shift.notes,
                created_at: shift.created_at,
                updated_at: shift.updated_at
              });

            if (error) throw error;
          }

          // Mark as synced locally
          const syncedShift = { ...shift, synced: true };
          await saveData('shifts', syncedShift);
        } catch (error) {
          console.error('Error syncing shift:', shift.id, error);
        }
      }
      
      // Reload shifts to get synced status
      await loadOfflineShifts();
      
      if (pendingShifts.length > 0) {
        toast({
          title: "Směny synchronizovány",
          description: `Synchronizováno ${pendingShifts.length} směn`
        });
      }
    } catch (error) {
      console.error('Error syncing shifts:', error);
      toast({
        title: "Chyba při synchronizaci",
        description: "Nepodařilo se synchronizovat směny",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  }, [user, isOffline, offlineShifts, loadOfflineShifts]);

  // Load shifts on mount
  useEffect(() => {
    loadOfflineShifts();
  }, [loadOfflineShifts]);

  // Auto-sync when coming online
  useEffect(() => {
    if (!isOffline && offlineShifts.some(shift => !shift.synced)) {
      syncPendingShifts();
    }
  }, [isOffline, syncPendingShifts, offlineShifts]);

  return {
    offlineShifts,
    saveShiftOffline,
    updateShiftOffline,
    loadOfflineShifts,
    syncPendingShifts,
    isSyncing,
    hasPendingShifts: offlineShifts.some(shift => !shift.synced)
  };
};
