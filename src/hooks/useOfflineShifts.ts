
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface Shift {
  id: string;
  date: string;
  type: string;
  notes?: string;
  synced?: boolean;
}

interface OfflineShiftsState {
  shifts: Shift[];
  isLoading: boolean;
  error: string | null;
}

interface OfflineShiftsWithActions extends OfflineShiftsState {
  addOfflineShift: (newShift: Omit<Shift, 'created_at' | 'id' | 'user_id'>) => Promise<void>;
  updateOfflineShift: (shiftId: string, updatedShiftData: Partial<Omit<Shift, 'created_at' | 'id' | 'user_id'>>) => Promise<void>;
  deleteOfflineShift: (shiftId: string) => Promise<void>;
}

export const useOfflineShifts = (): OfflineShiftsWithActions => {
  const { user } = useAuth();
  const [state, setState] = useState<OfflineShiftsState>({
    shifts: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchShifts = async () => {
      if (!user) return;

      setState(prevState => ({ ...prevState, isLoading: true, error: null }));

      try {
        const { data, error } = await supabase
          .from('shifts')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        setState({
          shifts: data || [],
          isLoading: false,
          error: null,
        });
      } catch (error: any) {
        console.error('Error fetching shifts:', error);
        setState({
          shifts: [],
          isLoading: false,
          error: error.message || 'Chyba při načítání směn',
        });
      }
    };

    fetchShifts();
  }, [user]);

  const addOfflineShift = async (newShift: Omit<Shift, 'created_at' | 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('shifts')
        .insert({
          ...newShift,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setState(prevState => ({
        ...prevState,
        shifts: [...prevState.shifts, data],
      }));
    } catch (error: any) {
      console.error('Error adding shift:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při přidávání směny',
      }));
    }
  };

  const updateOfflineShift = async (shiftId: string, updatedShiftData: Partial<Omit<Shift, 'created_at' | 'id' | 'user_id'>>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('shifts')
        .update(updatedShiftData)
        .eq('id', shiftId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setState(prevState => ({
        ...prevState,
        shifts: prevState.shifts.map(shift => 
          shift.id === shiftId ? { ...shift, ...data } : shift
        ),
      }));
    } catch (error: any) {
      console.error('Error updating shift:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při aktualizaci směny',
      }));
    }
  };

  const deleteOfflineShift = async (shiftId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId)
        .eq('user_id', user.id);

      if (error) throw error;

      setState(prevState => ({
        ...prevState,
        shifts: prevState.shifts.filter(shift => shift.id !== shiftId),
      }));
    } catch (error: any) {
      console.error('Error deleting shift:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při mazání směny',
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
