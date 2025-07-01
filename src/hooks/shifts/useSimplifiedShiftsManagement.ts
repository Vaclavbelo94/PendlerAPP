
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Shift } from './useShiftsCRUD';
import { unifiedToastService } from '@/services/UnifiedToastService';
import { enhancedErrorHandler } from '@/services/EnhancedErrorHandler';

export const useSimplifiedShiftsManagement = (userId: string | null) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadShifts = useCallback(async () => {
    if (!userId) {
      setShifts([]);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;

      setShifts(data || []);
    } catch (error: any) {
      console.error('Error loading shifts:', error);
      const appError = enhancedErrorHandler.handleShiftError(error, 'load');
      setError(appError.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const addShift = useCallback(async (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    if (!userId) {
      unifiedToastService.showAuthRequired();
      return false;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('shifts')
        .insert([{
          ...shiftData,
          user_id: userId
        }])
        .select()
        .single();

      if (error) throw error;

      setShifts(prev => [data, ...prev]);
      unifiedToastService.showShiftSaved(false);
      return true;
    } catch (error: any) {
      console.error('Error adding shift:', error);
      enhancedErrorHandler.handleShiftError(error, 'save');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [userId]);

  const updateShift = useCallback(async (shift: Shift): Promise<boolean> => {
    if (!userId || !shift.id) {
      unifiedToastService.showAuthRequired();
      return false;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('shifts')
        .update({
          type: shift.type,
          notes: shift.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', shift.id)
        .eq('user_id', userId);

      if (error) throw error;

      setShifts(prev => prev.map(s => s.id === shift.id ? shift : s));
      unifiedToastService.showShiftSaved(true);
      return true;
    } catch (error: any) {
      console.error('Error updating shift:', error);
      enhancedErrorHandler.handleShiftError(error, 'save');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [userId]);

  const deleteShift = useCallback(async (shiftId: string): Promise<boolean> => {
    if (!userId) {
      unifiedToastService.showAuthRequired();
      return false;
    }

    try {
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId)
        .eq('user_id', userId);

      if (error) throw error;

      setShifts(prev => prev.filter(s => s.id !== shiftId));
      unifiedToastService.showShiftDeleted();
      return true;
    } catch (error: any) {
      console.error('Error deleting shift:', error);
      enhancedErrorHandler.handleShiftError(error, 'delete');
      return false;
    }
  }, [userId]);

  const refreshShifts = useCallback(async () => {
    setIsLoading(true);
    await loadShifts();
  }, [loadShifts]);

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  return {
    shifts,
    isLoading,
    isSaving,
    error,
    addShift,
    updateShift,
    deleteShift,
    refreshShifts
  };
};
