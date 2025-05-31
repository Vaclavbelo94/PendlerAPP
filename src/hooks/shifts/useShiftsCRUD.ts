
import { useCallback, useState } from 'react';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { optimizedErrorHandler } from '@/utils/optimizedErrorHandler';
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/errorHandler';

export interface Shift {
  id?: string;
  user_id: string;
  date: string;
  type: 'morning' | 'afternoon' | 'night';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface UseShiftsCRUDOptions {
  userId: string | undefined;
  isOnline: boolean;
  onShiftChange?: (shifts: Shift[]) => void;
}

export const useShiftsCRUD = ({ userId, isOnline, onShiftChange }: UseShiftsCRUDOptions) => {
  const [isSaving, setIsSaving] = useState(false);
  const { success, error: showError } = useStandardizedToast();

  const addShift = useCallback(async (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Shift | null> => {
    if (!userId) {
      showError('Chyba', 'Uživatel není přihlášen');
      return null;
    }

    if (!isOnline) {
      const tempShift: Shift = {
        id: `temp_${Date.now()}`,
        user_id: userId,
        ...shiftData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      showError('Offline režim', 'Směna bude synchronizována při obnovení připojení');
      return tempShift;
    }

    setIsSaving(true);
    try {
      const formattedShiftData = {
        ...shiftData,
        user_id: userId
      };

      const data = await optimizedErrorHandler.executeWithRetry(
        async () => {
          const { data, error: insertError } = await supabase
            .from('shifts')
            .insert([formattedShiftData])
            .select()
            .single();

          if (insertError) throw insertError;
          return data;
        },
        `addShift_${userId}_${shiftData.date}`,
        { maxRetries: 2 }
      );

      const newShift: Shift = {
        ...data,
        type: data.type as 'morning' | 'afternoon' | 'night'
      };
      
      success('Směna přidána', 'Nová směna byla úspěšně vytvořena');
      return newShift;
    } catch (err) {
      errorHandler.handleError(err, { operation: 'addShift', shiftData });
      showError('Chyba při přidání', 'Nepodařilo se přidat směnu');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId, isOnline, success, showError]);

  const updateShift = useCallback(async (shiftData: Shift): Promise<Shift | null> => {
    if (!userId || !shiftData.id) {
      showError('Chyba', 'Neplatná data směny');
      return null;
    }

    setIsSaving(true);
    try {
      const data = await optimizedErrorHandler.executeWithRetry(
        async () => {
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
          return data;
        },
        `updateShift_${shiftData.id}`,
        { maxRetries: 2 }
      );

      const updatedShift: Shift = {
        ...data,
        type: data.type as 'morning' | 'afternoon' | 'night'
      };
      
      success('Směna upravena', 'Změny byly úspěšně uloženy');
      return updatedShift;
    } catch (err) {
      errorHandler.handleError(err, { operation: 'updateShift', shiftData });
      showError('Chyba při úpravě', 'Nepodařilo se upravit směnu');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId, success, showError]);

  const deleteShift = useCallback(async (shiftId: string): Promise<void> => {
    if (!userId) {
      showError('Chyba', 'Uživatel není přihlášen');
      return;
    }

    setIsSaving(true);
    try {
      await optimizedErrorHandler.executeWithRetry(
        async () => {
          const { error: deleteError } = await supabase
            .from('shifts')
            .delete()
            .eq('id', shiftId)
            .eq('user_id', userId);

          if (deleteError) throw deleteError;
        },
        `deleteShift_${shiftId}`,
        { maxRetries: 2 }
      );

      success('Směna smazána', 'Směna byla úspěšně odstraněna');
    } catch (err) {
      errorHandler.handleError(err, { operation: 'deleteShift', shiftId });
      showError('Chyba při mazání', 'Nepodařilo se smazat směnu');
    } finally {
      setIsSaving(false);
    }
  }, [userId, success, showError]);

  return {
    addShift,
    updateShift,
    deleteShift,
    isSaving
  };
};
