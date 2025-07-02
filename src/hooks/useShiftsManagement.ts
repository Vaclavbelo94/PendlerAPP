
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';
import type { Shift, ShiftType } from '@/types/shifts';
import { format } from 'date-fns';

export type { Shift, ShiftType } from '@/types/shifts';

export const useShiftsManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

      setShifts(typedShifts);
    } catch (err) {
      console.error('Error loading shifts:', err);
      toast({
        title: "Chyba při načítání",
        description: "Nepodařilo se načíst směny",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  const createShift = useCallback(async (date: Date, type: ShiftType, startTime: string, endTime: string, notes?: string): Promise<boolean> => {
    if (!user?.id) {
      toast({
        title: "Chyba",
        description: "Nejste přihlášeni",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from('shifts')
        .insert([
          {
            user_id: user.id,
            date: format(date, 'yyyy-MM-dd'),
            type,
            start_time: startTime,
            end_time: endTime,
            notes: notes || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Convert to proper Shift type and add to state
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
      toast({
        title: "Směna přidána",
        description: "Nová směna byla úspěšně vytvořena",
      });
      return true;
    } catch (err) {
      console.error('Error creating shift:', err);
      toast({
        title: "Chyba při vytváření",
        description: "Nepodařilo se vytvořit směnu",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, toast]);

  const updateShift = useCallback(async (shiftId: string, type: ShiftType, startTime: string, endTime: string, notes?: string): Promise<boolean> => {
    if (!user?.id) {
      toast({
        title: "Chyba",
        description: "Nejste přihlášeni",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from('shifts')
        .update({
          type,
          start_time: startTime,
          end_time: endTime,
          notes: notes || null,
        })
        .eq('id', shiftId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Convert to proper Shift type and update state
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

      setShifts(prev => prev.map(shift => shift.id === shiftId ? typedShift : shift));
      toast({
        title: "Směna upravena",
        description: "Změny byly úspěšně uloženy",
      });
      return true;
    } catch (err) {
      console.error('Error updating shift:', err);
      toast({
        title: "Chyba při úpravě",
        description: "Nepodařilo se upravit směnu",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, toast]);

  const deleteShift = useCallback(async (shiftId: string): Promise<boolean> => {
    if (!user?.id) {
      toast({
        title: "Chyba",
        description: "Nejste přihlášeni",
        variant: "destructive",
      });
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
      toast({
        title: "Směna smazána",
        description: "Směna byla úspěšně odstraněna",
      });
      return true;
    } catch (err) {
      console.error('Error deleting shift:', err);
      toast({
        title: "Chyba při mazání",
        description: "Nepodařilo se smazat směnu",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, toast]);

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
