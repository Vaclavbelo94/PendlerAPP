
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
  offlineShifts: Shift[];
  hasPendingShifts: boolean;
  isSyncing: boolean;
}

interface OfflineShiftsWithActions extends OfflineShiftsState {
  addOfflineShift: (newShift: Omit<Shift, 'created_at' | 'id' | 'user_id'>) => Promise<void>;
  updateOfflineShift: (shiftId: string, updatedShiftData: Partial<Omit<Shift, 'created_at' | 'id' | 'user_id'>>) => Promise<void>;
  deleteOfflineShift: (shiftId: string) => Promise<void>;
  syncPendingShifts: () => Promise<void>;
}

export const useOfflineShifts = (): OfflineShiftsWithActions => {
  const { user } = useAuth();
  const [state, setState] = useState<OfflineShiftsState>({
    shifts: [],
    isLoading: true,
    error: null,
    offlineShifts: [],
    hasPendingShifts: false,
    isSyncing: false,
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

        // Map shifts and add synced property (defaulting to true for existing DB records)
        const shifts: Shift[] = (data || []).map(shift => ({
          id: shift.id,
          date: shift.date,
          type: shift.type,
          notes: shift.notes || '',
          synced: true // All DB records are considered synced
        }));
        
        const offlineShifts = shifts.filter(shift => !shift.synced);

        setState(prevState => ({
          ...prevState,
          shifts,
          offlineShifts,
          hasPendingShifts: offlineShifts.length > 0,
          isLoading: false,
          error: null,
        }));
      } catch (error: any) {
        console.error('Error fetching shifts:', error);
        setState(prevState => ({
          ...prevState,
          shifts: [],
          isLoading: false,
          error: error.message || 'Chyba při načítání směn',
        }));
      }
    };

    fetchShifts();
  }, [user]);

  const addOfflineShift = async (newShift: Omit<Shift, 'created_at' | 'id' | 'user_id'>) => {
    if (!user) return;

    setState(prevState => ({ ...prevState, isSyncing: true }));

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

      const newShiftWithSync: Shift = {
        ...data,
        synced: true
      };

      setState(prevState => ({
        ...prevState,
        shifts: [...prevState.shifts, newShiftWithSync],
        isSyncing: false,
      }));
    } catch (error: any) {
      console.error('Error adding shift:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při přidávání směny',
        isSyncing: false,
      }));
    }
  };

  const updateOfflineShift = async (shiftId: string, updatedShiftData: Partial<Omit<Shift, 'created_at' | 'id' | 'user_id'>>) => {
    if (!user) return;

    setState(prevState => ({ ...prevState, isSyncing: true }));

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
          shift.id === shiftId ? { ...shift, ...data, synced: true } : shift
        ),
        isSyncing: false,
      }));
    } catch (error: any) {
      console.error('Error updating shift:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při aktualizaci směny',
        isSyncing: false,
      }));
    }
  };

  const deleteOfflineShift = async (shiftId: string) => {
    if (!user) return;

    setState(prevState => ({ ...prevState, isSyncing: true }));

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
        isSyncing: false,
      }));
    } catch (error: any) {
      console.error('Error deleting shift:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při mazání směny',
        isSyncing: false,
      }));
    }
  };

  const syncPendingShifts = async () => {
    setState(prevState => ({ ...prevState, isSyncing: true }));
    
    // Mock sync process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setState(prevState => ({
      ...prevState,
      isSyncing: false,
      hasPendingShifts: false,
      offlineShifts: [],
    }));
  };

  return {
    ...state,
    addOfflineShift,
    updateOfflineShift,
    deleteOfflineShift,
    syncPendingShifts,
  };
};
