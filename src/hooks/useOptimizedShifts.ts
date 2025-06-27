import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface OptimizedShift {
  id: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  location: string;
}

interface OptimizedShiftsState {
  shifts: OptimizedShift[] | null;
  isLoading: boolean;
  error: string | null;
}

export const useOptimizedShifts = () => {
  const { user } = useAuth();
  const [state, setState] = useState<OptimizedShiftsState>({
    shifts: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchOptimizedShifts = async () => {
      if (!user) return;

      setState(prevState => ({ ...prevState, isLoading: true, error: null }));

      try {
        const { data, error } = await supabase
          .from('optimized_shifts')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        setState({
          shifts: data,
          isLoading: false,
          error: null,
        });
      } catch (error: any) {
        console.error('Error fetching optimized shifts:', error);
        setState({
          shifts: null,
          isLoading: false,
          error: error.message || 'Chyba při načítání optimalizovaných směn',
        });
      }
    };

    fetchOptimizedShifts();
  }, [user]);

  return state;
};
