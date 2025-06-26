
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Shift {
  id: string;
  user_id: string;
  date: string;
  type: 'morning' | 'afternoon' | 'night';
  notes?: string;
  created_at: string;
  updated_at: string;
  // DHL specific fields
  dhl_position_id?: string;
  dhl_work_group_id?: string;
  is_dhl_managed?: boolean;
  dhl_override?: boolean;
  original_dhl_data?: any;
}

export const useOptimizedShiftsManagement = (userId?: string) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadShifts = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { data, error: shiftsError } = await supabase
          .from('shifts')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (shiftsError) {
          throw shiftsError;
        }

        setShifts(data || []);
      } catch (err) {
        console.error('Error loading shifts:', err);
        setError('Nepodařilo se načíst směny');
      } finally {
        setIsLoading(false);
      }
    };

    loadShifts();
  }, [userId]);

  const addShift = async (shiftData: Omit<Shift, 'id' | 'created_at' | 'updated_at'>): Promise<Shift | null> => {
    if (!userId) return null;

    setIsSaving(true);
    try {
      const { data, error: insertError } = await supabase
        .from('shifts')
        .insert([shiftData])
        .select()
        .single();

      if (insertError) throw insertError;

      const newShift = data as Shift;
      setShifts(prev => [newShift, ...prev]);
      return newShift;
    } catch (err) {
      console.error('Error adding shift:', err);
      setError('Nepodařilo se přidat směnu');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const updateShift = async (shiftData: Shift): Promise<Shift | null> => {
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

      const updatedShift = data as Shift;
      setShifts(prev => prev.map(shift => shift.id === updatedShift.id ? updatedShift : shift));
      return updatedShift;
    } catch (err) {
      console.error('Error updating shift:', err);
      setError('Nepodařilo se upravit směnu');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteShift = async (shiftId: string): Promise<void> => {
    setIsSaving(true);
    try {
      const { error: deleteError } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      setShifts(prev => prev.filter(shift => shift.id !== shiftId));
    } catch (err) {
      console.error('Error deleting shift:', err);
      setError('Nepodařilo se smazat směnu');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    shifts,
    isLoading,
    isSaving,
    error,
    addShift,
    updateShift,
    deleteShift
  };
};
