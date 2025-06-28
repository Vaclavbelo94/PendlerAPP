
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Shift } from './useShiftsCRUD';
import { toast } from 'sonner';

export const useRefactoredShiftsManagement = (userId: string | null) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadShifts = useCallback(async () => {
    if (!userId) {
      setShifts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      setShifts(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load shifts';
      setError(errorMessage);
      console.error('Error loading shifts:', err);
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
      const { data, error } = await supabase
        .from('shifts')
        .insert({
          ...shiftData,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      
      setShifts(prev => [data, ...prev]);
      toast.success('Směna byla přidána');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add shift';
      toast.error(`Chyba při přidávání směny: ${errorMessage}`);
      console.error('Error adding shift:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId]);

  const updateShift = useCallback(async (shiftData: Shift) => {
    if (!userId) {
      toast.error('Musíte být přihlášeni pro úpravu směny');
      return null;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('shifts')
        .update(shiftData)
        .eq('id', shiftData.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      
      setShifts(prev => prev.map(shift => 
        shift.id === data.id ? data : shift
      ));
      toast.success('Směna byla upravena');
      return data;
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
    if (!userId) {
      toast.error('Musíte být přihlášeni pro smazání směny');
      return false;
    }

    setIsSaving(true);
    try {
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
