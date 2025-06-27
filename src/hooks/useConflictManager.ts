
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface Conflict {
  id: string;
  type: string;
  description: string;
  data: any;
  resolved: boolean;
  createdAt: string;
}

interface ConflictManagerState {
  conflicts: Conflict[];
  isLoading: boolean;
  error: string | null;
}

export const useConflictManager = () => {
  const { user } = useAuth();
  const [state, setState] = useState<ConflictManagerState>({
    conflicts: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadConflicts = async () => {
      if (!user) return;

      setState(prevState => ({ ...prevState, isLoading: true, error: null }));

      try {
        // Since conflicts table doesn't exist, use mock data
        const mockConflicts: Conflict[] = [
          {
            id: '1',
            type: 'schedule_conflict',
            description: 'Překrývající se směny detected',
            data: { date: '2024-01-15', shifts: ['morning', 'afternoon'] },
            resolved: false,
            createdAt: new Date().toISOString()
          }
        ];

        setState(prevState => ({
          ...prevState,
          conflicts: mockConflicts,
          isLoading: false,
        }));
      } catch (error: any) {
        console.error('Error loading conflicts:', error);
        setState(prevState => ({
          ...prevState,
          error: error.message || 'Chyba při načítání konfliktů',
          isLoading: false,
        }));
      }
    };

    loadConflicts();
  }, [user]);

  const resolveConflict = async (conflictId: string) => {
    setState(prevState => ({
      ...prevState,
      conflicts: prevState.conflicts.map(conflict =>
        conflict.id === conflictId
          ? { ...conflict, resolved: true }
          : conflict
      ),
    }));
  };

  return {
    ...state,
    resolveConflict,
  };
};
