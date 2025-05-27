
import { useState, useCallback, useEffect } from 'react';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/errorHandler';

export interface Shift {
  id?: string;
  user_id: string;
  date: string;
  type: 'morning' | 'afternoon' | 'night';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UseOptimizedShiftsManagementReturn {
  shifts: Shift[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  addShift: (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Shift | null>;
  updateShift: (shiftData: Shift) => Promise<Shift | null>;
  deleteShift: (shiftId: string) => Promise<void>;
  refreshShifts: () => Promise<void>;
}

export const useOptimizedShiftsManagement = (userId: string | undefined): UseOptimizedShiftsManagementReturn => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { success, error: showError } = useStandardizedToast();

  // Load shifts from database
  const loadShifts = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;

      const typedShifts = (data || []).map(shift => ({
        ...shift,
        type: shift.type as 'morning' | 'afternoon' | 'night'
      }));

      setShifts(typedShifts);
    } catch (err) {
      const errorMessage = 'Nepodařilo se načíst směny';
      console.error('Error loading shifts:', err);
      setError(errorMessage);
      errorHandler.handleError(err, { operation: 'loadShifts', userId });
      showError('Chyba při načítání', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId, showError]);

  // Add new shift
  const addShift = useCallback(async (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Shift | null> => {
    if (!userId) {
      showError('Chyba', 'Uživatel není přihlášen');
      return null;
    }

    setIsSaving(true);
    try {
      const newShiftData = {
        ...shiftData,
        user_id: userId
      };

      const { data, error: insertError } = await supabase
        .from('shifts')
        .insert([newShiftData])
        .select()
        .single();

      if (insertError) throw insertError;

      const newShift: Shift = {
        ...data,
        type: data.type as 'morning' | 'afternoon' | 'night'
      };
      
      setShifts(prev => [newShift, ...prev]);
      success('Směna přidána', 'Nová směna byla úspěšně vytvořena');
      
      return newShift;
    } catch (err) {
      console.error('Error adding shift:', err);
      errorHandler.handleError(err, { operation: 'addShift', shiftData });
      showError('Chyba při přidání', 'Nepodařilo se přidat směnu');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId, success, showError]);

  // Update shift
  const updateShift = useCallback(async (shiftData: Shift): Promise<Shift | null> => {
    if (!userId || !shiftData.id) {
      showError('Chyba', 'Neplatná data směny');
      return null;
    }

    setIsSaving(true);
    try {
      const { data, error: updateError } = await supabase
        .from('shifts')
        .update({
          date: shiftData.date,
          type: shiftData.type,
          notes: shiftData.notes
        })
        .eq('id', shiftData.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedShift: Shift = {
        ...data,
        type: data.type as 'morning' | 'afternoon' | 'night'
      };
      
      setShifts(prev => prev.map(shift => shift.id === updatedShift.id ? updatedShift : shift));
      success('Směna upravena', 'Změny byly úspěšně uloženy');
      
      return updatedShift;
    } catch (err) {
      console.error('Error updating shift:', err);
      errorHandler.handleError(err, { operation: 'updateShift', shiftData });
      showError('Chyba při úpravě', 'Nepodařilo se upravit směnu');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId, success, showError]);

  // Delete shift
  const deleteShift = useCallback(async (shiftId: string): Promise<void> => {
    if (!userId) {
      showError('Chyba', 'Uživatel není přihlášen');
      return;
    }

    setIsSaving(true);
    try {
      const { error: deleteError } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      setShifts(prev => prev.filter(shift => shift.id !== shiftId));
      success('Směna smazána', 'Směna byla úspěšně odstraněna');
    } catch (err) {
      console.error('Error deleting shift:', err);
      errorHandler.handleError(err, { operation: 'deleteShift', shiftId });
      showError('Chyba při mazání', 'Nepodařilo se smazat směnu');
    } finally {
      setIsSaving(false);
    }
  }, [userId, success, showError]);

  // Refresh shifts
  const refreshShifts = useCallback(async () => {
    await loadShifts();
  }, [loadShifts]);

  // Load shifts on mount and when userId changes
  useEffect(() => {
    if (userId) {
      loadShifts();
    }
  }, [loadShifts, userId]);

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
