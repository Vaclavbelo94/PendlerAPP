
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { saveData, getAllData, deleteItemById, addToSyncQueue } from '@/utils/offlineStorage';
import { toast } from '@/components/ui/use-toast';

export interface OfflineShift {
  id: string;
  date: Date;
  type: string;
  notes: string;
  user_id: string;
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
      const shifts = await getAllData<OfflineShift>('shifts');
      setOfflineShifts(shifts.filter(shift => shift.user_id === user.id));
    } catch (error) {
      console.error('Error loading offline shifts:', error);
    }
  }, [user]);

  // Save shift offline
  const saveShiftOffline = useCallback(async (shift: Omit<OfflineShift, 'synced'>) => {
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
      setOfflineShifts(prev => [...prev.filter(s => s.id !== shift.id), offlineShift]);
      
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

  // Delete shift offline
  const deleteShiftOffline = useCallback(async (shiftId: string) => {
    if (!user) return;

    try {
      await deleteItemById('shifts', shiftId);
      await addToSyncQueue('shifts', shiftId, 'DELETE', { id: shiftId });
      
      setOfflineShifts(prev => prev.filter(s => s.id !== shiftId));
      
      if (isOffline) {
        toast({
          title: "Směna smazána offline",
          description: "Změna bude synchronizována při obnovení připojení"
        });
      }
    } catch (error) {
      console.error('Error deleting shift offline:', error);
    }
  }, [user, isOffline]);

  // Sync pending shifts
  const syncPendingShifts = useCallback(async () => {
    if (!user || isOffline) return;

    setIsSyncing(true);
    try {
      const pendingShifts = offlineShifts.filter(shift => !shift.synced);
      
      for (const shift of pendingShifts) {
        // Mark as synced locally
        const syncedShift = { ...shift, synced: true };
        await saveData('shifts', syncedShift);
      }
      
      setOfflineShifts(prev => prev.map(shift => ({ ...shift, synced: true })));
      
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
  }, [user, isOffline, offlineShifts]);

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
    deleteShiftOffline,
    loadOfflineShifts,
    syncPendingShifts,
    isSyncing,
    hasPendingShifts: offlineShifts.some(shift => !shift.synced)
  };
};
