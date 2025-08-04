
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/errorHandler';
import { Shift } from './types';

interface UseShiftOperationsProps {
  userId: string | undefined;
  shifts: Shift[];
  selectedShift: Shift | null;
  setShifts: (shifts: Shift[] | ((prev: Shift[]) => Shift[])) => void;
  setSelectedShift: (shift: Shift | null) => void;
  setIsSaving: (saving: boolean) => void;
  setLastOperation: (operation: (() => Promise<void>) | null) => void;
}

export const useShiftOperations = ({
  userId,
  shifts,
  selectedShift,
  setShifts,
  setSelectedShift,
  setIsSaving,
  setLastOperation
}: UseShiftOperationsProps) => {
  const { success, error: showError } = useStandardizedToast();
  const { t } = useTranslation('shifts');

  // Add new shift
  const addShift = useCallback(async (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Shift | null> => {
    if (!userId) {
      showError(t('toasts.notLoggedIn'), t('toasts.notLoggedInDescription'));
      return null;
    }

    const operation = async (): Promise<void> => {
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
        
        // Auto-select new shift if it's the first one
        if (shifts.length === 0) {
          setSelectedShift(newShift);
        }

        success(t('toasts.shiftAdded'), t('toasts.shiftAddedDescription'));
      } catch (err) {
        errorHandler.handleError(err, { operation: 'addShift', shiftData });
        showError(t('toasts.errorCreating'), t('toasts.errorCreatingDescription'));
        throw err;
      } finally {
        setIsSaving(false);
      }
    };

    setLastOperation(operation);
    await operation();
    return null;
  }, [userId, shifts.length, success, showError, setShifts, setSelectedShift, setIsSaving, setLastOperation]);

  // Update shift
  const updateShift = useCallback(async (shiftData: Shift): Promise<Shift | null> => {
    if (!userId || !shiftData.id) {
      showError(t('toasts.notLoggedIn'), t('toasts.notLoggedInDescription'));
      return null;
    }

    const operation = async (): Promise<void> => {
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
        
        if (selectedShift?.id === updatedShift.id) {
          setSelectedShift(updatedShift);
        }

        success(t('toasts.shiftUpdated'), t('toasts.shiftUpdatedDescription'));
      } catch (err) {
        errorHandler.handleError(err, { operation: 'updateShift', shiftData });
        showError(t('toasts.errorUpdating'), t('toasts.errorUpdatingDescription'));
        throw err;
      } finally {
        setIsSaving(false);
      }
    };

    setLastOperation(operation);
    await operation();
    return null;
  }, [userId, selectedShift, success, showError, setShifts, setSelectedShift, setIsSaving, setLastOperation]);

  // Delete shift
  const deleteShift = useCallback(async (shiftId: string): Promise<void> => {
    if (!userId) {
      showError(t('toasts.notLoggedIn'), t('toasts.notLoggedInDescription'));
      return;
    }

    const operation = async (): Promise<void> => {
      setIsSaving(true);
      try {
        const { error: deleteError } = await supabase
          .from('shifts')
          .delete()
          .eq('id', shiftId)
          .eq('user_id', userId);

        if (deleteError) throw deleteError;

        setShifts(prev => prev.filter(shift => shift.id !== shiftId));
        
        if (selectedShift?.id === shiftId) {
          const remainingShifts = shifts.filter(shift => shift.id !== shiftId);
          setSelectedShift(remainingShifts.length > 0 ? remainingShifts[0] : null);
        }

        success(t('toasts.shiftDeleted'), t('toasts.shiftDeletedDescription'));
      } catch (err) {
        errorHandler.handleError(err, { operation: 'deleteShift', shiftId });
        showError(t('toasts.errorDeleting'), t('toasts.errorDeletingDescription'));
        throw err;
      } finally {
        setIsSaving(false);
      }
    };

    setLastOperation(operation);
    await operation();
  }, [userId, selectedShift, shifts, success, showError, setShifts, setSelectedShift, setIsSaving, setLastOperation]);

  return {
    addShift,
    updateShift,
    deleteShift
  };
};
