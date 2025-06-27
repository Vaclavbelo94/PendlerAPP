
import { useState, useEffect } from 'react';
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
        // Using mock data since optimized_shifts table doesn't exist
        const mockShifts: OptimizedShift[] = [
          {
            id: '1',
            shift_name: 'Ranní směna',
            start_time: '06:00',
            end_time: '14:00',
            location: 'Praha'
          },
          {
            id: '2', 
            shift_name: 'Odpolední směna',
            start_time: '14:00',
            end_time: '22:00',
            location: 'Brno'
          }
        ];

        setState({
          shifts: mockShifts,
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
