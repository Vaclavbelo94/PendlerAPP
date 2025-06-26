
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

export const useDHLData = (userId?: string) => {
  const [userAssignment, setUserAssignment] = useState<DHLUserAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDHLData = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

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
    isLoading,
    error,
    hasDHLAssignment: !!userAssignment
  };
};
