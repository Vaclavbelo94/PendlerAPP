
import { useState, useCallback, useEffect } from 'react';
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
      
      // Type conversion from database to proper Shift interface
      const typedShifts: Shift[] = (data || []).map(shift => ({
        ...shift,
        type: shift.type as 'morning' | 'afternoon' | 'night' // Ensure proper type casting
      }));
      
      setShifts(typedShifts);
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
      console.log('Adding new shift:', shiftData);
      
      // Check if shift already exists for this date
      const { data: existingShifts, error: checkError } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', userId)
        .eq('date', shiftData.date);

      if (checkError) throw checkError;

      let result;
      
      if (existingShifts && existingShifts.length > 0) {
        // Update existing shift
        const existingShift = existingShifts[0];
        console.log('Updating existing shift:', existingShift.id);
        
        const { data, error } = await supabase
          .from('shifts')
          .update({
            type: shiftData.type,
            notes: shiftData.notes || ''
          })
          .eq('id', existingShift.id)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        result = data;
        
        // Update local state
        setShifts(prev => prev.map(shift => 
          shift.id === result.id ? { ...result, type: result.type as 'morning' | 'afternoon' | 'night' } : shift
        ));
      } else {
        // Create new shift
        console.log('Creating new shift for user:', userId);
        
        const { data, error } = await supabase
          .from('shifts')
          .insert({
            ...shiftData,
            user_id: userId,
            notes: shiftData.notes || ''
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
        
        // Ensure proper type casting for the returned data
        const typedShift: Shift = {
          ...result,
          type: result.type as 'morning' | 'afternoon' | 'night'
        };
        
        setShifts(prev => [typedShift, ...prev]);
      }
      
      toast.success('Směna byla uložena');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add/update shift';
      toast.error(`Chyba při ukládání směny: ${errorMessage}`);
      console.error('Error adding/updating shift:', err);
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
          date: shiftData.date
        })
        .eq('id', shiftData.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      
      // Ensure proper type casting for the returned data
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
