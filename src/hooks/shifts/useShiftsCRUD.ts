
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { Shift, ShiftFormData } from '@/types/shifts';
import { format } from 'date-fns';

export { Shift, ShiftFormData } from '@/types/shifts';

export const useShiftsCRUD = () => {
  const { user } = useAuth();
  const { success, error: showError } = useStandardizedToast();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load shifts
  const loadShifts = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setShifts(data || []);
    } catch (err) {
      console.error('Error loading shifts:', err);
      showError('Chyba při načítání', 'Nepodařilo se načíst směny');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, showError]);

  // Create shift
  const createShift = useCallback(async (date: Date, formData: ShiftFormData): Promise<boolean> => {
    if (!user?.id) {
      showError('Chyba', 'Nejste přihlášeni');
      return false;
    }

    try {
      setIsSaving(true);
      const shiftData = {
        user_id: user.id,
        date: format(date, 'yyyy-MM-dd'),
        type: formData.type,
        start_time: formData.start_time,
        end_time: formData.end_time,
        notes: formData.notes || null,
      };

      const { data, error } = await supabase
        .from('shifts')
        .insert([shiftData])
        .select()
        .single();

      if (error) throw error;

      setShifts(prev => [data, ...prev]);
      success('Směna přidána', 'Nová směna byla úspěšně vytvořena');
      return true;
    } catch (err) {
      console.error('Error creating shift:', err);
      showError('Chyba při vytváření', 'Nepodařilo se vytvořit směnu');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, success, showError]);

  // Update shift
  const updateShift = useCallback(async (shiftId: string, formData: ShiftFormData): Promise<boolean> => {
    if (!user?.id) {
      showError('Chyba', 'Nejste přihlášeni');
      return false;
    }

    try {
      setIsSaving(true);
      const updateData = {
        type: formData.type,
        start_time: formData.start_time,
        end_time: formData.end_time,
        notes: formData.notes || null,
      };

      const { data, error } = await supabase
        .from('shifts')
        .update(updateData)
        .eq('id', shiftId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setShifts(prev => prev.map(shift => 
        shift.id === shiftId ? data : shift
      ));
      
      success('Směna upravena', 'Změny byly úspěšně uloženy');
      return true;
    } catch (err) {
      console.error('Error updating shift:', err);
      showError('Chyba při úpravě', 'Nepodařilo se upravit směnu');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, success, showError]);

  // Delete shift
  const deleteShift = useCallback(async (shiftId: string): Promise<boolean> => {
    if (!user?.id) {
      showError('Chyba', 'Nejste přihlášeni');
      return false;
    }

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId)
        .eq('user_id', user.id);

      if (error) throw error;

      setShifts(prev => prev.filter(shift => shift.id !== shiftId));
      success('Směna smazána', 'Směna byla úspěšně odstraněna');
      return true;
    } catch (err) {
      console.error('Error deleting shift:', err);
      showError('Chyba při mazání', 'Nepodařilo se smazat směnu');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, success, showError]);

  // Load shifts on mount
  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  return {
    shifts,
    isLoading,
    isSaving,
    createShift,
    updateShift,
    deleteShift,
    refreshShifts: loadShifts,
  };
};
