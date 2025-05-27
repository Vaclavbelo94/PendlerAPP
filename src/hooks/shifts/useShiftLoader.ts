
import { useCallback, useEffect } from 'react';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/errorHandler';
import { Shift } from './types';

interface UseShiftLoaderProps {
  userId: string | undefined;
  selectedShift: Shift | null;
  setShifts: (shifts: Shift[]) => void;
  setSelectedShift: (shift: Shift | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useShiftLoader = ({
  userId,
  selectedShift,
  setShifts,
  setSelectedShift,
  setIsLoading,
  setError
}: UseShiftLoaderProps) => {
  const { error: showError } = useStandardizedToast();

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

      // Type conversion from database strings to proper types
      const typedShifts = (data || []).map(shift => ({
        ...shift,
        type: shift.type as 'morning' | 'afternoon' | 'night'
      }));

      setShifts(typedShifts);

      // Auto-select first shift if none selected
      if (!selectedShift && typedShifts && typedShifts.length > 0) {
        setSelectedShift(typedShifts[0]);
      }
    } catch (err) {
      const errorMessage = 'Nepodařilo se načíst směny';
      setError(errorMessage);
      errorHandler.handleError(err, { operation: 'loadShifts', userId });
      showError('Chyba při načítání', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId, selectedShift, showError, setShifts, setSelectedShift, setIsLoading, setError]);

  // Load shifts on mount and when userId changes
  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  return {
    loadShifts
  };
};
