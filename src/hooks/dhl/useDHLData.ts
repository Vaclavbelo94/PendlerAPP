
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DHLPosition, DHLWorkGroup, UserDHLAssignment } from '@/types/dhl';
import { toast } from 'sonner';

interface UseDHLDataReturn {
  positions: DHLPosition[];
  workGroups: DHLWorkGroup[];
  userAssignment: UserDHLAssignment | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDHLData = (userId?: string): UseDHLDataReturn => {
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [workGroups, setWorkGroups] = useState<DHLWorkGroup[]>([]);
  const [userAssignment, setUserAssignment] = useState<UserDHLAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDHLData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching DHL data...');

      // Načtení pozic
      const { data: positionsData, error: positionsError } = await supabase
        .from('dhl_positions')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (positionsError) {
        console.error('Error fetching positions:', positionsError);
        throw positionsError;
      }

      console.log('Positions loaded:', positionsData);

      // Načtení pracovních skupin
      const { data: workGroupsData, error: workGroupsError } = await supabase
        .from('dhl_work_groups')
        .select('*')
        .eq('is_active', true)
        .order('week_number');

      if (workGroupsError) {
        console.error('Error fetching work groups:', workGroupsError);
        throw workGroupsError;
      }

      console.log('Work groups loaded:', workGroupsData);

      // Načtení uživatelského přiřazení (pokud je userId poskytnut)
      let assignmentData = null;
      if (userId) {
        console.log('Fetching user assignment for user:', userId);
        
        const { data, error: assignmentError } = await supabase
          .from('user_dhl_assignments')
          .select(`
            *,
            dhl_position:dhl_positions(*),
            dhl_work_group:dhl_work_groups(*)
          `)
          .eq('user_id', userId)
          .eq('is_active', true)
          .maybeSingle();

        if (assignmentError) {
          console.error('Error fetching assignment:', assignmentError);
          throw assignmentError;
        }
        
        console.log('User assignment loaded:', data);
        assignmentData = data;
      }

      setPositions(positionsData || []);
      setWorkGroups(workGroupsData || []);
      setUserAssignment(assignmentData);

      console.log('DHL Data loaded successfully:', {
        positions: positionsData?.length,
        workGroups: workGroupsData?.length,
        userAssignment: assignmentData
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nepodařilo se načíst DHL data';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching DHL data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDHLData();
  }, [userId]);

  return {
    positions,
    workGroups,
    userAssignment,
    isLoading,
    error,
    refetch: fetchDHLData
  };
};
