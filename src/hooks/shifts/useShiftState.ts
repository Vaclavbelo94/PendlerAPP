
import { useState, useCallback } from 'react';
import { Shift } from './types';

export const useShiftState = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastOperation, setLastOperation] = useState<(() => Promise<void>) | null>(null);

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
        // Error is already handled in the operation
      }
    }
  }, [lastOperation]);

  return {
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
    setRetryCount,
    lastOperation,
    setLastOperation,
    selectShift,
    retryLastOperation
  };
};
