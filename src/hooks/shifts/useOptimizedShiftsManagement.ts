
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Shift {
  id: string;
  user_id: string;
  date: string;
  type: string;
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

  return {
    shifts,
    isLoading,
    error
  };
};
