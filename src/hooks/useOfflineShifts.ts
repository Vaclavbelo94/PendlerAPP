import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { Shift, ShiftType } from '@/types/shifts';

export const useOfflineShifts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Helper functions for default times
  const getDefaultStartTime = (type: ShiftType): string => {
    switch (type) {
      case 'morning': return '06:00';
      case 'afternoon': return '14:00';
      case 'night': return '22:00';
      case 'custom': return '08:00';
      default: return '08:00';
    }
  };

  const getDefaultEndTime = (type: ShiftType): string => {
    switch (type) {
      case 'morning': return '14:00';
      case 'afternoon': return '22:00';
      case 'night': return '06:00';
      case 'custom': return '16:00';
      default: return '16:00';
    }
  };

  const loadShifts = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      // Ensure all shifts have required properties
      const typedShifts: Shift[] = (data || []).map(shift => ({
        id: shift.id,
        user_id: shift.user_id,
        date: shift.date,
        type: shift.type as ShiftType,
        start_time: shift.start_time || getDefaultStartTime(shift.type as ShiftType),
        end_time: shift.end_time || getDefaultEndTime(shift.type as ShiftType),
        notes: shift.notes || '',
        created_at: shift.created_at,
        updated_at: shift.updated_at,
      }));

      setShifts(typedShifts);
    } catch (error) {
      console.error('Error loading shifts:', error);
      toast({
        title: "Chyba při načítání",
        description: "Nepodařilo se načíst směny",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast, getDefaultStartTime, getDefaultEndTime]);

  const addShift = useCallback(async (date: string, type: ShiftType, notes: string) => {
    if (!user?.id) {
      toast({
        title: "Chyba",
        description: "Nejste přihlášeni",
        variant: "destructive",
      });
      return;
    }

    const newShift = {
      user_id: user.id,
      type: type,
      date: date,
      notes: notes,
      start_time: getDefaultStartTime(type),
      end_time: getDefaultEndTime(type),
    };

    if (navigator.onLine) {
      try {
        const { error } = await supabase
          .from('shifts')
          .insert([newShift]);

        if (error) throw error;

        toast({
          title: "Směna přidána",
          description: "Směna byla úspěšně přidána",
        });
      } catch (error) {
        console.error('Error adding shift:', error);
        toast({
          title: "Chyba při přidávání",
          description: "Nepodařilo se přidat směnu",
          variant: "destructive",
        });
      }
    } else {
      // Save shift offline
      let offlineShifts = JSON.parse(localStorage.getItem('offline_shifts') || '[]');
      offlineShifts.push(newShift);
      localStorage.setItem('offline_shifts', JSON.stringify(offlineShifts));

      toast({
        title: "Směna uložena offline",
        description: "Směna bude synchronizována, až budete online",
      });
    }

    // Reload all shifts
    await loadShifts();
  }, [user?.id, toast, loadShifts, getDefaultStartTime, getDefaultEndTime]);

  const updateShift = useCallback(async (shiftId: string, type: ShiftType, notes: string) => {
    if (!user?.id) {
      toast({
        title: "Chyba",
        description: "Nejste přihlášeni",
        variant: "destructive",
      });
      return;
    }

    if (navigator.onLine) {
      try {
        const { error } = await supabase
          .from('shifts')
          .update({ type: type, notes: notes })
          .eq('id', shiftId)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Směna upravena",
          description: "Směna byla úspěšně upravena",
        });
      } catch (error) {
        console.error('Error updating shift:', error);
        toast({
          title: "Chyba při úpravě",
          description: "Nepodařilo se upravit směnu",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Nelze upravit offline",
        description: "Úpravy směn jsou možné pouze v online režimu",
        variant: "destructive",
      });
    }

    // Reload all shifts
    await loadShifts();
  }, [user?.id, toast, loadShifts]);

  const deleteShift = useCallback(async (shiftId: string) => {
    if (!user?.id) {
      toast({
        title: "Chyba",
        description: "Nejste přihlášeni",
        variant: "destructive",
      });
      return;
    }

    if (navigator.onLine) {
      try {
        const { error } = await supabase
          .from('shifts')
          .delete()
          .eq('id', shiftId)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Směna smazána",
          description: "Směna byla úspěšně smazána",
        });
      } catch (error) {
        console.error('Error deleting shift:', error);
        toast({
          title: "Chyba při mazání",
          description: "Nepodařilo se smazat směnu",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Nelze smazat offline",
        description: "Mazání směn je možné pouze v online režimu",
        variant: "destructive",
      });
    }

    // Reload all shifts
    await loadShifts();
  }, [user?.id, toast, loadShifts]);

  const syncOfflineShifts = useCallback(async () => {
    if (!user?.id || !navigator.onLine) return;

    setIsSyncing(true);
    try {
      const offlineShifts = JSON.parse(localStorage.getItem('offline_shifts') || '[]');
      
      for (const shift of offlineShifts) {
        try {
          const shiftData = {
            user_id: user.id,
            date: shift.date,
            type: shift.type,
            start_time: shift.start_time || getDefaultStartTime(shift.type as ShiftType),
            end_time: shift.end_time || getDefaultEndTime(shift.type as ShiftType),
            notes: shift.notes || null,
          };

          const { error } = await supabase
            .from('shifts')
            .insert([shiftData]);

          if (error) throw error;
        } catch (error) {
          console.error('Error syncing shift:', shift, error);
        }
      }

      // Clear offline shifts after successful sync
      localStorage.removeItem('offline_shifts');
      
      // Reload all shifts
      await loadShifts();
      
      if (offlineShifts.length > 0) {
        toast({
          title: "Synchronizace dokončena",
          description: `Synchronizováno ${offlineShifts.length} směn`,
        });
      }
    } catch (error) {
      console.error('Error syncing offline shifts:', error);
      toast({
        title: "Chyba synchronizace",
        description: "Nepodařilo se synchronizovat offline směny",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [user?.id, toast, loadShifts, getDefaultStartTime, getDefaultEndTime]);

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  return {
    shifts,
    isLoading,
    isSyncing,
    addShift,
    updateShift,
    deleteShift,
    syncOfflineShifts,
  };
};
