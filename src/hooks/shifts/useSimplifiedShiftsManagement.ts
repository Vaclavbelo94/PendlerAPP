
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Shift } from './useShiftsCRUD';
import { toast } from 'sonner';

export const useSimplifiedShiftsManagement = (userId: string | null) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadShifts = useCallback(async () => {
    if (!userId) {
      setShifts([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
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
      
      // Type conversion with fallback
      const typedShifts: Shift[] = (data || []).map(shift => ({
        ...shift,
        type: (shift.type as 'morning' | 'afternoon' | 'night') || 'morning'
      }));
      
      setShifts(typedShifts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load shifts';
      setError(errorMessage);
      console.error('Error loading shifts:', err);
      
      // Don't show toast for auth errors to avoid spam
      if (!errorMessage.includes('JWT') && !errorMessage.includes('auth')) {
        toast.error(`Chyba při načítání směn: ${errorMessage}`);
      }
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
      
      const insertData = {
        user_id: userId,
        date: shiftData.date,
        type: shiftData.type,
        notes: shiftData.notes || ''
      };
      
      const { data, error } = await supabase
        .from('shifts')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating shift:', error);
        throw error;
      }
      
      // Refresh the shifts list
      await loadShifts();
      toast.success('Směna byla přidána');
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add shift';
      toast.error(`Chyba při ukládání směny: ${errorMessage}`);
      console.error('Error adding shift:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId, loadShifts]);

  const updateShift = useCallback(async (shiftData: Shift) => {
    if (!userId || !shiftData.id) {
      toast.error('Neplatná data směny');
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
          date: shiftData.date
        })
        .eq('id', shiftData.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      
      const typedShift: Shift = {
        ...data,
        type: data.type as 'morning' | 'afternoon' | 'night'
      };
      
      setShifts(prev => prev.map(shift => 
        shift.id === typedShift.id ? typedShift : shift
      ));
      toast.success('Směna byla upravena');
      return typedShift;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update shift';
      toast.error(`Chyba při úpravě směny: ${errorMessage}`);
      console.error('Error updating shift:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId]);

  const deleteShift = useCallback(async (shiftId: string) => {
    if (!userId || !shiftId) {
      toast.error('Neplatné ID směny');
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
      toast.error(`Chyba při mazání směny: ${errorMessage}`);
      console.error('Error deleting shift:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [userId]);

  const refreshShifts = useCallback(() => {
    loadShifts();
  }, [loadShifts]);

  // Load shifts when userId changes
  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

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
