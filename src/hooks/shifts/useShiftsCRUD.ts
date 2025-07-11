import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { Shift, ShiftFormData, ShiftType } from '@/types/shifts';
import { format } from 'date-fns';

export type { Shift, ShiftFormData } from '@/types/shifts';

export const useShiftsCRUD = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { success, error: showError } = useStandardizedToast();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Use refs to prevent infinite loops
  const userIdRef = useRef<string | null>(null);
  const isLoadingShiftsRef = useRef(false);

  // Memoized and stable loadShifts function
  const loadShifts = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (isLoadingShiftsRef.current) {
      return;
    }

    // Don't load if auth is still loading
    if (authLoading) {
      console.log('useShiftsCRUD - Skipping load, auth still loading');
      return;
    }

    const currentUserId = user?.id;
    
    // If no user after auth is loaded, clear shifts and stop loading
    if (!currentUserId) {
      console.log('useShiftsCRUD - No user, clearing shifts');
      setShifts([]);
      setIsLoading(false);
      userIdRef.current = null;
      return;
    }

    // Skip if we're already loading for the same user
    if (userIdRef.current === currentUserId && isLoadingShiftsRef.current) {
      return;
    }

    try {
      isLoadingShiftsRef.current = true;
      console.log('useShiftsCRUD - Loading shifts for user:', currentUserId);
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', currentUserId)
        .order('date', { ascending: false });

      if (error) throw error;

      // Convert database data to proper Shift interface
      const typedShifts: Shift[] = (data || []).map(shift => ({
        id: shift.id,
        user_id: shift.user_id,
        date: shift.date,
        type: shift.type as ShiftType,
        start_time: shift.start_time,
        end_time: shift.end_time,
        notes: shift.notes || '',
        created_at: shift.created_at,
        updated_at: shift.updated_at,
      }));

      console.log('useShiftsCRUD - Loaded shifts:', typedShifts.length);
      setShifts(typedShifts);
      userIdRef.current = currentUserId;
    } catch (err) {
      console.error('Error loading shifts:', err);
      showError('Chyba při načítání', 'Nepodařilo se načíst směny');
      setShifts([]);
    } finally {
      setIsLoading(false);
      isLoadingShiftsRef.current = false;
    }
  }, [user?.id, authLoading]); // Simplified dependencies

  // Create shift
  const createShift = useCallback(async (date: Date, formData: ShiftFormData): Promise<boolean> => {
    if (!user?.id) {
      console.error('createShift: User not authenticated', { user });
      showError('Chyba', 'Nejste přihlášeni');
      return false;
    }

    try {
      setIsSaving(true);
      console.log('useShiftsCRUD - Creating shift for user:', user.id);
      console.log('useShiftsCRUD - Form data received:', formData);
      console.log('useShiftsCRUD - Date:', date);
      
      const shiftData = {
        user_id: user.id,
        date: format(date, 'yyyy-MM-dd'),
        type: formData.type,
        start_time: formData.start_time,
        end_time: formData.end_time,
        notes: formData.notes || null,
      };

      console.log('useShiftsCRUD - Inserting shift data:', shiftData);

      const { data, error } = await supabase
        .from('shifts')
        .insert([shiftData])
        .select()
        .single();

      if (error) {
        console.error('useShiftsCRUD - Supabase error:', error);
        console.error('useShiftsCRUD - Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('useShiftsCRUD - Successfully created shift:', data);

      const typedShift: Shift = {
        id: data.id,
        user_id: data.user_id,
        date: data.date,
        type: data.type as ShiftType,
        start_time: data.start_time,
        end_time: data.end_time,
        notes: data.notes || '',
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setShifts(prev => [typedShift, ...prev]);
      success('Směna přidána', 'Nová směna byla úspěšně vytvořena');
      console.log('useShiftsCRUD - Shift created successfully');
      return true;
    } catch (err) {
      console.error('Error creating shift:', err);
      console.error('Error details:', {
        name: err?.name,
        message: err?.message,
        stack: err?.stack,
        cause: err?.cause
      });
      showError('Chyba při vytváření', `Nepodařilo se vytvořit směnu: ${err?.message || 'Neznámá chyba'}`);
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
      console.log('useShiftsCRUD - Updating shift:', shiftId);
      
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

      const typedShift: Shift = {
        id: data.id,
        user_id: data.user_id,
        date: data.date,
        type: data.type as ShiftType,
        start_time: data.start_time,
        end_time: data.end_time,
        notes: data.notes || '',
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setShifts(prev => prev.map(shift => 
        shift.id === shiftId ? typedShift : shift
      ));
      
      success('Směna upravena', 'Změny byly úspěšně uloženy');
      console.log('useShiftsCRUD - Shift updated successfully');
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
      showError('Chyba', 'Nejste přihlášení');
      return false;
    }

    try {
      setIsSaving(true);
      console.log('useShiftsCRUD - Deleting shift:', shiftId);
      
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId)
        .eq('user_id', user.id);

      if (error) throw error;

      setShifts(prev => prev.filter(shift => shift.id !== shiftId));
      success('Směna smazána', 'Směna byla úspěšně odstraněna');
      console.log('useShiftsCRUD - Shift deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting shift:', err);
      showError('Chyba při mazání', 'Nepodařilo se smazat směnu');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, success, showError]);

  // Load shifts when auth state is stable - with proper dependency management
  useEffect(() => {
    // Only trigger if auth is no longer loading and user state has changed
    if (!authLoading) {
      console.log('useShiftsCRUD - Auth stable, loading shifts for user:', user?.id || 'none');
      loadShifts();
    }
  }, [user?.id, authLoading, loadShifts]);

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
