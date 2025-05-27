
import { useShiftState } from './shifts/useShiftState';
import { useShiftOperations } from './shifts/useShiftOperations';
import { useShiftLoader } from './shifts/useShiftLoader';
import { UseShiftsManagementReturn } from './shifts/types';

export type { Shift } from './shifts/types';

export const useShiftsManagement = (userId: string | undefined): UseShiftsManagementReturn => {
  const {
    shifts,
    setShifts,
    selectedShift,
    setSelectedShift,
    isLoading,
    setIsLoading,
    isSaving,
    setIsSaving,
    error,
    setError,
    retryCount,
    setLastOperation,
    selectShift,
    retryLastOperation
  } = useShiftState();

  const { addShift, updateShift, deleteShift } = useShiftOperations({
    userId,
    shifts,
    selectedShift,
    setShifts,
    setSelectedShift,
    setIsSaving,
    setLastOperation
  });

  useShiftLoader({
    userId,
    selectedShift,
    setShifts,
    setSelectedShift,
    setIsLoading,
    setError
  });

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
    retryLastOperation
  };
};
