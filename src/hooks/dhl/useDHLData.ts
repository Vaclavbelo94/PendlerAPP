
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DHLPosition {
  id: string;
  name: string;
  position_type: string;
  description?: string;
  hourly_rate?: number;
  requirements?: string[];
  is_active: boolean;
  cycle_weeks: number[];
}

interface DHLWorkGroup {
  id: string;
  week_number: number;
  name: string;
  description?: string;
  shift_pattern?: any;
  is_active: boolean;
}

interface DHLUserAssignment {
  id: string;
  user_id: string;
  dhl_position_id: string;
  dhl_work_group_id: string;
  reference_date?: string;
  reference_woche?: number;
  is_active: boolean;
  dhl_position?: DHLPosition;
  dhl_work_group?: DHLWorkGroup;
}

export const useDHLData = (userId: string | null) => {
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [workGroups, setWorkGroups] = useState<DHLWorkGroup[]>([]);
  const [userAssignment, setUserAssignment] = useState<DHLUserAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDHLData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load positions and work groups in parallel
      const [positionsResult, workGroupsResult] = await Promise.all([
        supabase
          .from('dhl_positions')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true }),
        supabase
          .from('dhl_work_groups')
          .select('*')
          .eq('is_active', true)
          .order('week_number', { ascending: true })
      ]);

      if (positionsResult.error) throw positionsResult.error;
      if (workGroupsResult.error) throw workGroupsResult.error;

      setPositions(positionsResult.data || []);
      setWorkGroups(workGroupsResult.data || []);

      console.log('Positions loaded:', positionsResult.data?.length || 0);
      console.log('Work groups loaded:', workGroupsResult.data || []);

      // Load user assignment if userId is provided
      if (userId) {
        console.log('Fetching user assignment for user:', userId);
        
        const { data: assignmentData, error: assignmentError } = await supabase
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
          console.error('Error loading user assignment:', assignmentError);
        } else {
          setUserAssignment(assignmentData);
          console.log('User assignment loaded:', assignmentData);
        }
      } else {
        setUserAssignment(null);
      }

      console.log('DHL Data loaded successfully:', {
        positions: positionsResult.data?.length || 0,
        workGroups: workGroupsResult.data?.length || 0,
        userAssignment: userId ? 'attempted' : 'skipped'
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load DHL data';
      setError(errorMessage);
      console.error('Error loading DHL data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDHLData();
  }, [loadDHLData]);

  return {
    positions,
    workGroups,
    userAssignment,
    isLoading,
    error,
    refreshData: loadDHLData,
    refetch: loadDHLData // Adding refetch alias for compatibility
  };
};
