import { useState, useCallback, useEffect } from 'react';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/errorHandler';
import { Shift, ShiftFormData } from '@/types/shifts';

// Re-export types for components that import from this file
export { Shift, ShiftFormData } from '@/types/shifts';

export interface UseShiftsManagementReturn {
  shifts: Shift[];
  selectedShift: Shift | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  retryCount: number;
  addShift: (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Shift | null>;
  updateShift: (shiftData: Shift) => Promise<Shift | null>;
  deleteShift: (shiftId: string) => Promise<void>;
  selectShift: (shiftId: string) => void;
  retryLastOperation: () => Promise<void>;
  refreshShifts: () => Promise<void>;
}

export const useShiftsManagement = (userId: string | undefined): UseShiftsManagementReturn => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastOperation, setLastOperation] = useState<(() => Promise<void>) | null>(null);

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

      console.log('Loading shifts for user:', userId);

      const { data, error: fetchError } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw fetchError;
      }

      console.log('Loaded shifts:', data?.length || 0);

      // Type conversion from database strings to proper types
      const typedShifts = (data || []).map(shift => ({
        ...shift,
        type: shift.type as 'morning' | 'afternoon' | 'night' | 'custom'
      }));

      setShifts(typedShifts);

      // Auto-select first shift if none selected
      if (!selectedShift && typedShifts && typedShifts.length > 0) {
        setSelectedShift(typedShifts[0]);
      }
    } catch (err) {
      const errorMessage = 'Nepodařilo se načíst směny';
      console.error('Error loading shifts:', err);
      setError(errorMessage);
      errorHandler.handleError(err, { operation: 'loadShifts', userId });
      showError('Chyba při načítání', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId, selectedShift, showError]);

  // Add new shift
  const addShift = useCallback(async (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Shift | null> => {
    if (!userId) {
      showError('Chyba', 'Uživatel není přihlášen');
      return null;
    }

    const operation = async (): Promise<void> => {
      setIsSaving(true);
      try {
        const newShiftData = {
          ...shiftData,
          user_id: userId
        };

        console.log('Adding shift:', newShiftData);

        const { data, error: insertError } = await supabase
          .from('shifts')
          .insert([newShiftData])
          .select()
          .single();

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }

        const newShift: Shift = {
          ...data,
          type: data.type as 'morning' | 'afternoon' | 'night' | 'custom'
        };
        
        setShifts(prev => [newShift, ...prev]);
        
        // Auto-select new shift if it's the first one
        if (shifts.length === 0) {
          setSelectedShift(newShift);
        }

        success('Směna přidána', 'Nová směna byla úspěšně vytvořena');
        console.log('Shift added successfully:', newShift);
      } catch (err) {
        console.error('Error adding shift:', err);
        errorHandler.handleError(err, { operation: 'addShift', shiftData });
        showError('Chyba při přidání', 'Nepodařilo se přidat směnu');
        throw err;
      } finally {
        setIsSaving(false);
      }
    };

    setLastOperation(() => operation);
    try {
      await operation();
      return null;
    } catch (err) {
      return null;
    }
  }, [userId, shifts.length, success, showError]);

  // Update shift
  const updateShift = useCallback(async (shiftData: Shift): Promise<Shift | null> => {
    if (!userId || !shiftData.id) {
      showError('Chyba', 'Neplatná data směny');
      return null;
    }

    const operation = async (): Promise<void> => {
      setIsSaving(true);
      try {
        console.log('Updating shift:', shiftData);

        const { data, error: updateError } = await supabase
          .from('shifts')
          .update({
            date: shiftData.date,
            type: shiftData.type,
            start_time: shiftData.start_time,
            end_time: shiftData.end_time,
            notes: shiftData.notes
          })
          .eq('id', shiftData.id)
          .eq('user_id', userId)
          .select()
          .single();

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }

        const updatedShift: Shift = {
          ...data,
          type: data.type as 'morning' | 'afternoon' | 'night' | 'custom'
        };
        
        setShifts(prev => prev.map(shift => shift.id === updatedShift.id ? updatedShift : shift));
        
        if (selectedShift?.id === updatedShift.id) {
          setSelectedShift(updatedShift);
        }

        success('Směna upravena', 'Změny byly úspěšně uloženy');
        console.log('Shift updated successfully:', updatedShift);
      } catch (err) {
        console.error('Error updating shift:', err);
        errorHandler.handleError(err, { operation: 'updateShift', shiftData });
        showError('Chyba při úpravě', 'Nepodařilo se upravit směnu');
        throw err;
      } finally {
        setIsSaving(false);
      }
    };

    setLastOperation(() => operation);
    try {
      await operation();
      return null;
    } catch (err) {
      return null;
    }
  }, [userId, selectedShift, success, showError]);

  // Delete shift
  const deleteShift = useCallback(async (shiftId: string): Promise<void> => {
    if (!userId) {
      showError('Chyba', 'Uživatel není přihlášen');
      return;
    }

    const operation = async (): Promise<void> => {
      setIsSaving(true);
      try {
        console.log('Deleting shift:', shiftId);

        const { error: deleteError } = await supabase
          .from('shifts')
          .delete()
          .eq('id', shiftId)
          .eq('user_id', userId);

        if (deleteError) {
          console.error('Delete error:', deleteError);
          throw deleteError;
        }

        setShifts(prev => prev.filter(shift => shift.id !== shiftId));
        
        if (selectedShift?.id === shiftId) {
          const remainingShifts = shifts.filter(shift => shift.id !== shiftId);
          setSelectedShift(remainingShifts.length > 0 ? remainingShifts[0] : null);
        }

        success('Směna smazána', 'Směna byla úspěšně odstraněna');
        console.log('Shift deleted successfully');
      } catch (err) {
        console.error('Error deleting shift:', err);
        errorHandler.handleError(err, { operation: 'deleteShift', shiftId });
        showError('Chyba při mazání', 'Nepodařilo se smazat směnu');
        throw err;
      } finally {
        setIsSaving(false);
      }
    };

    setLastOperation(() => operation);
    await operation();
  }, [userId, selectedShift, shifts, success, showError]);

  // Select shift
  const selectShift = useCallback((shiftId: string) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (shift) {
      setSelectedShift(shift);
    }
  }, [shifts]);

  // Retry last operation
  const retryLastOperation = useCallback(async () => {
    if (lastOperation) {
      setRetryCount(prev => prev + 1);
      try {
        await lastOperation();
        setError(null);
      } catch (err) {
        console.error('Retry failed:', err);
      }
    }
  }, [lastOperation]);

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
    selectedShift,
    isLoading,
    isSaving,
    error,
    retryCount,
    addShift,
    updateShift,
    deleteShift,
    selectShift,
    retryLastOperation,
    refreshShifts
  };
};
