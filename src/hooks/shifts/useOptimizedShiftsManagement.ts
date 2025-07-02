import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Shift, ShiftType } from '@/types/shifts';
import { toast } from 'sonner';

export const useOptimizedShiftsManagement = (userId: string | null) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    if (!userId) {
      setShifts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Loading shifts for user:', userId);

      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase error loading shifts:', error);
        throw error;
      }

      console.log('Loaded shifts from database:', data?.length || 0);

      // Type conversion from database to proper Shift interface
      const typedShifts: Shift[] = (data || []).map(shift => ({
        ...shift,
        type: shift.type as ShiftType
      }));

      setShifts(typedShifts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load shifts';
      console.error('Error loading shifts:', err);
      toast.error(`Chyba při načítání směn: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const addShift = useCallback(async (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) {
      toast.error('Musíte být přihlášeni pro přidání směny');
      return null;
    }

    setIsSaving(true);
    try {
      console.log('Adding new shift for user:', userId, 'Data:', shiftData);

      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Uživatel není přihlášen');
      }

      if (session.user.id !== userId) {
        throw new Error('Nesprávné ID uživatele');
      }

      // Check if shift already exists for this date
      const { data: existingShifts, error: checkError } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', userId)
        .eq('date', shiftData.date);

      if (checkError) {
        console.error('Error checking existing shifts:', checkError);
        throw checkError;
      }

      let result;

      if (existingShifts && existingShifts.length > 0) {
        // Update existing shift
        const existingShift = existingShifts[0];
        console.log('Updating existing shift:', existingShift.id);

        const { data, error } = await supabase
          .from('shifts')
          .update({
            type: shiftData.type,
            notes: shiftData.notes || '',
            start_time: shiftData.start_time,
            end_time: shiftData.end_time
          })
          .eq('id', existingShift.id)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          console.error('Error updating shift:', error);
          throw error;
        }
        result = data;

        // Update local state - ensure we refresh the list
        await loadShifts();
        toast.success('Směna byla upravena');
      } else {
        // Create new shift
        console.log('Creating new shift for user:', userId);

        const insertData = {
          user_id: userId,
          date: shiftData.date,
          type: shiftData.type,
          start_time: shiftData.start_time || getDefaultStartTime(shiftData.type),
          end_time: shiftData.end_time || getDefaultEndTime(shiftData.type),
          notes: shiftData.notes || ''
        };

        console.log('Insert data:', insertData);

        const { data, error } = await supabase
          .from('shifts')
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error('Error creating shift:', error);
          throw error;
        }
        result = data;

        // Refresh the shifts list to show the new shift
        await loadShifts();
        toast.success('Směna byla přidána');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add/update shift';
      console.error('Error adding/updating shift:', err);
      toast.error(`Chyba při ukládání směny: ${errorMessage}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId, loadShifts, getDefaultStartTime, getDefaultEndTime]);

  const updateShift = useCallback(async (shiftData: Shift) => {
    if (!userId) {
      toast.error('Musíte být přihlášeni pro úpravu směny');
      return null;
    }

    if (!shiftData.id) {
      console.error('Cannot update shift without ID:', shiftData);
      toast.error('Chyba: směna nemá platné ID');
      return null;
    }

    setIsSaving(true);
    try {
      console.log('Updating shift with ID:', shiftData.id);

      const { data, error } = await supabase
        .from('shifts')
        .update({
          type: shiftData.type,
          notes: shiftData.notes || '',
          date: shiftData.date,
          start_time: shiftData.start_time,
          end_time: shiftData.end_time
        })
        .eq('id', shiftData.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Ensure proper type casting for the returned data
      const typedShift: Shift = {
        ...data,
        type: data.type as ShiftType
      };

      setShifts(prev => prev.map(shift =>
        shift.id === typedShift.id ? typedShift : shift
      ));
      toast.success('Směna byla upravena');
      return typedShift;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update shift';
      console.error('Error updating shift:', err);
      toast.error(`Chyba při úpravě směny: ${errorMessage}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId]);

  const deleteShift = useCallback(async (shiftId: string) => {
    if (!userId) {
      toast.error('Musíte být přihlášeni pro smazání směny');
      return false;
    }

    if (!shiftId) {
      console.error('Cannot delete shift without ID');
      toast.error('Chyba: směna nemá platné ID');
      return false;
    }

    setIsSaving(true);
    try {
      console.log('Deleting shift with ID:', shiftId);

      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId)
        .eq('user_id', userId);

      if (error) throw error;

      setShifts(prev => prev.filter(shift => shift.id !== shiftId));
      toast.success('Směna byla smazána');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete shift';
      console.error('Error deleting shift:', err);
      toast.error(`Chyba při mazání směny: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [userId]);

  const refreshShifts = useCallback(() => {
    loadShifts();
  }, [loadShifts]);

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  return {
    shifts,
    isLoading,
    isSaving,
    addShift,
    updateShift,
    deleteShift,
    refreshShifts
  };
};
