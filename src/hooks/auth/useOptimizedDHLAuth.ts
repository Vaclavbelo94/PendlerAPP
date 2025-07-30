import { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { isDHLEmployeeSync } from '@/utils/dhlAuthUtils';
import { useOptimizedDHLData } from '@/hooks/dhl/useOptimizedDHLData';

interface OptimizedDHLAuthState {
  isDHLEmployee: boolean;
  profileData: any;
  userAssignment: any;
  isLoading: boolean;
  isInitialized: boolean;
}

// Cache for profile data to prevent repeated API calls
const profileCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Optimized DHL authentication hook that prevents repeated loading
 * Uses caching, memoization, and debouncing to minimize API calls
 */
export const useOptimizedDHLAuth = (user: User | null) => {
  const [state, setState] = useState<OptimizedDHLAuthState>({
    isDHLEmployee: false,
    profileData: null,
    userAssignment: null,
    isLoading: true,
    isInitialized: false
  });

  // Memoize user ID to prevent unnecessary re-renders
  const userId = useMemo(() => user?.id || null, [user?.id]);
  
  // Use optimized DHL data hook only for DHL employees
  const { userAssignment, isLoading: isDHLDataLoading } = useOptimizedDHLData(
    isDHLEmployeeSync(user) ? userId : null
  );

  // Memoized DHL employee check (sync)
  const isDHLEmployeeChecked = useMemo(() => {
    if (!user) return false;
    
    console.log('DHL Employee sync check (memoized):', user.email);
    return isDHLEmployeeSync(user);
  }, [user?.id, user?.email]);

  // Debounced profile loading with caching
  const loadProfileData = useCallback(async (currentUserId: string) => {
    // Check cache first
    const cached = profileCache.get(currentUserId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached profile data for:', currentUserId);
      return cached.data;
    }

    try {
      console.log('Loading fresh profile data for:', currentUserId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_dhl_employee, is_premium, is_admin, company')
        .eq('id', currentUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile data:', error);
        return null;
      }

      // Cache the result
      if (data) {
        profileCache.set(currentUserId, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (error) {
      console.error('Profile loading error:', error);
      return null;
    }
  }, []);

  // Main effect - only triggers when user changes
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeDHLAuth = async () => {
      if (!userId) {
        if (isMounted) {
          setState({
            isDHLEmployee: false,
            profileData: null,
            userAssignment: null,
            isLoading: false,
            isInitialized: true
          });
        }
        return;
      }

      // Debounce the operation to prevent rapid successive calls
      timeoutId = setTimeout(async () => {
        if (!isMounted) return;

        try {
          console.log('Optimized DHL Auth: Initializing for user:', user?.email);
          
          // Load profile data with caching
          const profileData = await loadProfileData(userId);
          
          // Use sync DHL check (already memoized)
          const dhlStatus = isDHLEmployeeChecked;
          
          if (isMounted) {
            setState({
              isDHLEmployee: dhlStatus,
              profileData,
              userAssignment: null, // Will be set by separate effect
              isLoading: false,
              isInitialized: true
            });
            
            console.log('Optimized DHL Auth: Initialization complete', {
              userId,
              email: user?.email,
              isDHLEmployee: dhlStatus,
              hasProfile: !!profileData
            });
          }
        } catch (error) {
          console.error('Optimized DHL Auth: Initialization error:', error);
          if (isMounted) {
            setState(prev => ({
              ...prev,
              isLoading: false,
              isInitialized: true
            }));
          }
        }
      }, 100); // Small debounce delay
    };

    initializeDHLAuth();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [userId, isDHLEmployeeChecked, loadProfileData, user?.email]);

  // Update user assignment when DHL data loads
  useEffect(() => {
    if (state.isInitialized && !isDHLDataLoading) {
      setState(prev => ({
        ...prev,
        userAssignment
      }));
    }
  }, [userAssignment, isDHLDataLoading, state.isInitialized]);

  // Clear cache when user logs out
  useEffect(() => {
    if (!user && profileCache.size > 0) {
      console.log('Clearing profile cache on logout');
      profileCache.clear();
    }
  }, [user]);

  return {
    ...state,
    // Combined loading state
    isLoading: state.isLoading || isDHLDataLoading,
    // Convenience methods
    clearCache: useCallback(() => {
      if (userId) {
        profileCache.delete(userId);
      }
    }, [userId])
  };
};