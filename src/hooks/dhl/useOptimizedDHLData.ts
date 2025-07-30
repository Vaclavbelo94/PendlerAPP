import { useState, useEffect, useCallback, useMemo } from 'react';
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
  dhl_work_group_id: string | null;
  assigned_at: string;
  created_at: string;
  updated_at: string;
  reference_date?: string;
  reference_woche?: number;
  current_woche?: number | null;
  is_active: boolean;
  dhl_position?: DHLPosition;
  dhl_work_group?: DHLWorkGroup;
}

// Global cache for DHL data to prevent repeated API calls
const dhlDataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Optimized DHL data hook that uses caching and prevents redundant API calls
 * Only loads data when needed and caches results globally
 */
export const useOptimizedDHLData = (userId: string | null) => {
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [workGroups, setWorkGroups] = useState<DHLWorkGroup[]>([]);
  const [userAssignment, setUserAssignment] = useState<DHLUserAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize user ID to prevent unnecessary re-renders
  const memoizedUserId = useMemo(() => userId, [userId]);

  // Load DHL data with caching
  const loadDHLData = useCallback(async () => {
    if (!memoizedUserId) {
      setPositions([]);
      setWorkGroups([]);
      setUserAssignment(null);
      setIsLoading(false);
      return;
    }

    // Check cache for this user
    const cacheKey = `dhl_data_${memoizedUserId}`;
    const cached = dhlDataCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached DHL data for user:', memoizedUserId);
      const { positions: cachedPositions, workGroups: cachedWorkGroups, userAssignment: cachedAssignment } = cached.data;
      setPositions(cachedPositions || []);
      setWorkGroups(cachedWorkGroups || []);
      setUserAssignment(cachedAssignment);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Loading fresh DHL data for user:', memoizedUserId);

      // Load positions and work groups in parallel (these don't change often)
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

      const positionsData = positionsResult.data || [];
      const workGroupsData = workGroupsResult.data || [];

      // Load user assignment
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('user_dhl_assignments')
        .select(`
          *,
          dhl_position:dhl_positions(*),
          dhl_work_group:dhl_work_groups(*)
        `)
        .eq('user_id', memoizedUserId)
        .eq('is_active', true)
        .maybeSingle();

      if (assignmentError) {
        console.error('Error loading user assignment:', assignmentError);
      }

      // Update state
      setPositions(positionsData);
      setWorkGroups(workGroupsData);
      setUserAssignment(assignmentData);

      // Cache the results
      dhlDataCache.set(cacheKey, {
        data: {
          positions: positionsData,
          workGroups: workGroupsData,
          userAssignment: assignmentData
        },
        timestamp: Date.now()
      });

      console.log('Optimized DHL Data loaded successfully:', {
        positions: positionsData.length,
        workGroups: workGroupsData.length,
        hasAssignment: !!assignmentData,
        cached: true
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load DHL data';
      setError(errorMessage);
      console.error('Error loading DHL data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [memoizedUserId]);

  // Effect with debouncing to prevent rapid successive calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadDHLData();
    }, 50); // Small debounce delay

    return () => clearTimeout(timeoutId);
  }, [loadDHLData]);

  // Clear cache when user logs out
  useEffect(() => {
    if (!memoizedUserId && dhlDataCache.size > 0) {
      console.log('Clearing DHL data cache on logout');
      dhlDataCache.clear();
    }
  }, [memoizedUserId]);

  return {
    positions,
    workGroups,
    userAssignment,
    isLoading,
    error,
    refreshData: loadDHLData,
    refetch: loadDHLData, // Compatibility alias
    clearCache: useCallback(() => {
      if (memoizedUserId) {
        const cacheKey = `dhl_data_${memoizedUserId}`;
        dhlDataCache.delete(cacheKey);
      }
    }, [memoizedUserId])
  };
};