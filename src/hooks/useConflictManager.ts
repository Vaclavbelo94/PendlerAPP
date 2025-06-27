import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface Conflict {
  id: string;
  table_name: string;
  record_id: string;
  user_id: string;
  created_at: string;
  resolved: boolean;
  resolution_data: any;
}

interface ConflictManagerState {
  conflicts: Conflict[] | null;
  isLoading: boolean;
  error: string | null;
}

export const useConflictManager = () => {
  const { user } = useAuth();
  const [state, setState] = useState<ConflictManagerState>({
    conflicts: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchConflicts = async () => {
      if (!user) return;

      setState(prevState => ({ ...prevState, isLoading: true, error: null }));

      try {
        const { data, error } = await supabase
          .from('conflicts')
          .select('*')
          .eq('user_id', user.id)
          .eq('resolved', false);

        if (error) {
          throw error;
        }

        setState(prevState => ({
          ...prevState,
          conflicts: data,
          isLoading: false,
        }));
      } catch (error: any) {
        console.error('Error fetching conflicts:', error);
        setState(prevState => ({
          ...prevState,
          error: error.message || 'Chyba při načítání konfliktů',
          isLoading: false,
        }));
      }
    };

    fetchConflicts();
  }, [user]);

  const resolveConflict = async (conflictId: string, resolutionData: any) => {
    if (!user) return false;

    setState(prevState => ({ ...prevState, isLoading: true, error: null }));

    try {
      const { error } = await supabase
        .from('conflicts')
        .update({
          resolved: true,
          resolution_data: resolutionData,
        })
        .eq('id', conflictId);

      if (error) {
        throw error;
      }

      // Update local state
      setState(prevState => ({
        ...prevState,
        conflicts: prevState.conflicts?.map(conflict =>
          conflict.id === conflictId ? { ...conflict, resolved: true, resolution_data: resolutionData } : conflict
        ) || null,
        isLoading: false,
      }));

      return true;
    } catch (error: any) {
      console.error('Error resolving conflict:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při řešení konfliktu',
        isLoading: false,
      }));
      return false;
    }
  };

  return {
    ...state,
    resolveConflict,
  };
};
