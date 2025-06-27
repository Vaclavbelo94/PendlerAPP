import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface Shift {
  id: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  hourly_rate: number;
  vehicle_id: string | null;
  created_at: string;
  user_id: string;
}

interface OfflineShiftsState {
  shifts: Shift[];
  isLoading: boolean;
  error: string | null;
}

export const useOfflineShifts = () => {
  const { user } = useAuth();
  const [state, setState] = useState<OfflineShiftsState>({
    shifts: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadOfflineShifts = async () => {
      if (!user) return;

      setState(prevState => ({ ...prevState, isLoading: true, error: null }));

      try {
        // Fetch shifts from local storage
        const storedShifts = localStorage.getItem(`offline_shifts_${user.id}`);
        const parsedShifts: Shift[] = storedShifts ? JSON.parse(storedShifts) : [];

        setState(prevState => ({
          ...prevState,
          shifts: parsedShifts,
          isLoading: false,
        }));
      } catch (error: any) {
        console.error('Error loading offline shifts:', error);
        setState(prevState => ({
          ...prevState,
          error: error.message || 'Chyba při načítání směn z lokálního úložiště',
          isLoading: false,
        }));
      }
    };

    loadOfflineShifts();
  }, [user]);

  const addOfflineShift = async (newShift: Omit<Shift, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return;

    try {
      // Generate a unique ID for the new shift
      const id = Math.random().toString(36).substring(2, 15);
      const created_at = new Date().toISOString();

      const shiftToAdd: Shift = {
        id,
        created_at,
        user_id: user.id,
        ...newShift,
      };

      // Get existing shifts from local storage
      const storedShifts = localStorage.getItem(`offline_shifts_${user.id}`);
      const parsedShifts: Shift[] = storedShifts ? JSON.parse(storedShifts) : [];

      // Add the new shift to the array
      const updatedShifts = [...parsedShifts, shiftToAdd];

      // Store the updated shifts array back in local storage
      localStorage.setItem(`offline_shifts_${user.id}`, JSON.stringify(updatedShifts));

      // Update the state with the new shift
      setState(prevState => ({
        ...prevState,
        shifts: updatedShifts,
        error: null,
      }));
    } catch (error: any) {
      console.error('Error adding offline shift:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při ukládání směny do lokálního úložiště',
      }));
    }
  };

  const updateOfflineShift = async (shiftId: string, updatedShiftData: Partial<Omit<Shift, 'id' | 'created_at' | 'user_id'>>) => {
    if (!user) return;

    try {
      // Get existing shifts from local storage
      const storedShifts = localStorage.getItem(`offline_shifts_${user.id}`);
      const parsedShifts: Shift[] = storedShifts ? JSON.parse(storedShifts) : [];

      // Find the shift to update
      const shiftIndex = parsedShifts.findIndex(shift => shift.id === shiftId);

      if (shiftIndex === -1) {
        throw new Error('Směna nenalezena v lokálním úložišti');
      }

      // Update the shift with the new data
      const updatedShift = {
        ...parsedShifts[shiftIndex],
        ...updatedShiftData,
      };

      // Replace the old shift with the updated shift in the array
      const updatedShifts = [
        ...parsedShifts.slice(0, shiftIndex),
        updatedShift as Shift,
        ...parsedShifts.slice(shiftIndex + 1),
      ];

      // Store the updated shifts array back in local storage
      localStorage.setItem(`offline_shifts_${user.id}`, JSON.stringify(updatedShifts));

      // Update the state with the updated shift
      setState(prevState => ({
        ...prevState,
        shifts: updatedShifts,
        error: null,
      }));
    } catch (error: any) {
      console.error('Error updating offline shift:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při aktualizaci směny v lokálním úložišti',
      }));
    }
  };

  const deleteOfflineShift = async (shiftId: string) => {
    if (!user) return;

    try {
      // Get existing shifts from local storage
      const storedShifts = localStorage.getItem(`offline_shifts_${user.id}`);
      const parsedShifts: Shift[] = storedShifts ? JSON.parse(storedShifts) : [];

      // Filter out the shift to delete
      const updatedShifts = parsedShifts.filter(shift => shift.id !== shiftId);

      // Store the updated shifts array back in local storage
      localStorage.setItem(`offline_shifts_${user.id}`, JSON.stringify(updatedShifts));

      // Update the state with the updated shifts
      setState(prevState => ({
        ...prevState,
        shifts: updatedShifts,
        error: null,
      }));
    } catch (error: any) {
      console.error('Error deleting offline shift:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při mazání směny z lokálního úložiště',
      }));
    }
  };

  return {
    ...state,
    addOfflineShift,
    updateOfflineShift,
    deleteOfflineShift,
  };
};
