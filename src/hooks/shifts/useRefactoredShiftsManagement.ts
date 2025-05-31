
import { useCallback } from 'react';
import { useOptimizedNetworkStatus } from '@/hooks/useOptimizedNetworkStatus';
import { useShiftsCRUD, Shift } from './useShiftsCRUD';
import { useShiftsData } from './useShiftsData';

export interface UseRefactoredShiftsManagementReturn {
  shifts: Shift[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  addShift: (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Shift | null>;
  updateShift: (shiftData: Shift) => Promise<Shift | null>;
  deleteShift: (shiftId: string) => Promise<void>;
  refreshShifts: () => Promise<void>;
}

export const useRefactoredShiftsManagement = (userId: string | undefined): UseRefactoredShiftsManagementReturn => {
  const { isOnline } = useOptimizedNetworkStatus();
  
  const {
    shifts,
    isLoading,
    error,
    refreshShifts,
    updateShiftsState
  } = useShiftsData({ userId });

  const {
    addShift: addShiftCRUD,
    updateShift: updateShiftCRUD,
    deleteShift: deleteShiftCRUD,
    isSaving
  } = useShiftsCRUD({ 
    userId, 
    isOnline,
    onShiftChange: updateShiftsState 
  });

  const addShift = useCallback(async (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Shift | null> => {
    const newShift = await addShiftCRUD(shiftData);
    if (newShift) {
      updateShiftsState(prev => [newShift, ...prev.filter(s => s.id !== newShift.id)]);
    }
    return newShift;
  }, [addShiftCRUD, updateShiftsState]);

  const updateShift = useCallback(async (shiftData: Shift): Promise<Shift | null> => {
    const updatedShift = await updateShiftCRUD(shiftData);
    if (updatedShift) {
      updateShiftsState(prev => prev.map(shift => shift.id === updatedShift.id ? updatedShift : shift));
    }
    return updatedShift;
  }, [updateShiftCRUD, updateShiftsState]);

  const deleteShift = useCallback(async (shiftId: string): Promise<void> => {
    await deleteShiftCRUD(shiftId);
    updateShiftsState(prev => prev.filter(shift => shift.id !== shiftId));
  }, [deleteShiftCRUD, updateShiftsState]);

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
