
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from '@/utils/errorHandler';

export interface DHLUserAssignment {
  id: string;
  user_id: string;
  dhl_position_id: string;
  dhl_work_group_id: string;
  reference_date: string | null;
  reference_woche: number | null;
  is_active: boolean;
  dhl_position?: {
    id: string;
    name: string;
    description?: string;
    position_type: string;
    hourly_rate?: number;
  };
  dhl_work_group?: {
    id: string;
    name: string;
    description?: string;
    week_number: number;
  };
}

export interface DHLPosition {
  id: string;
  name: string;
  description?: string;
  position_type: string;
  hourly_rate?: number;
  cycle_weeks: number[];
  is_active: boolean;
}

export interface DHLWorkGroup {
  id: string;
  name: string;
  description?: string;
  week_number: number;
  is_active: boolean;
}

export const useDHLData = (userId?: string) => {
  const [userAssignment, setUserAssignment] = useState<DHLUserAssignment | null>(null);
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [workGroups, setWorkGroups] = useState<DHLWorkGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDHLData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load positions and work groups (always needed for admin)
        const [positionsResult, workGroupsResult] = await Promise.all([
          supabase.from('dhl_positions').select('*').eq('is_active', true),
          supabase.from('dhl_work_groups').select('*').eq('is_active', true)
        ]);

        if (positionsResult.error) throw positionsResult.error;
        if (workGroupsResult.error) throw workGroupsResult.error;

        setPositions(positionsResult.data || []);
        setWorkGroups(workGroupsResult.data || []);

        // Load user assignment if userId provided
        if (userId) {
          const { data: assignment, error: assignmentError } = await supabase
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
            throw assignmentError;
          }

          setUserAssignment(assignment);
        }
      } catch (err) {
        const errorMessage = 'Nepodařilo se načíst DHL data';
        setError(errorMessage);
        errorHandler.handleError(err, { operation: 'loadDHLData', userId });
      } finally {
        setIsLoading(false);
      }
    };

    loadDHLData();
  }, [userId]);

  return {
    userAssignment,
    positions,
    workGroups,
    isLoading,
    error,
    hasDHLAssignment: !!userAssignment
  };
};
