
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSimplifiedAuth } from '@/hooks/auth/useSimplifiedAuth';
import { useCachedPremiumManager } from '@/hooks/useCachedPremiumManager';
import { useShiftsManagement } from '@/hooks/useShiftsManagement';

interface UnifiedShiftsState {
  isLoading: boolean;
  isReady: boolean;
  showSkeleton: boolean;
  error: string | null;
  user: any;
  isPremium: boolean;
  shifts: any[];
  shiftsOperations: any;
}

export const useUnifiedShiftsState = (): UnifiedShiftsState => {
  const [isReady, setIsReady] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  
  // Cached auth state - no flickering
  const { user, isInitialized: authReady } = useSimplifiedAuth();
  
  // Cached premium state - no redundant checks
  const { isPremium, isVerified: premiumReady } = useCachedPremiumManager(user);
  
  // Shifts data with optimized loading
  const shiftsState = useShiftsManagement(user?.id);
  
  // Unified loading logic
  const isLoading = useMemo(() => {
    return !authReady || (user && !premiumReady) || (user && isPremium && shiftsState.isLoading);
  }, [authReady, user, premiumReady, isPremium, shiftsState.isLoading]);

  // Predictive skeleton display
  useEffect(() => {
    if (authReady && user) {
      // Start with skeleton immediately when user is ready
      setShowSkeleton(true);
      
      if (premiumReady && isPremium) {
        // Show skeleton for just 300ms for smooth transition
        const timer = setTimeout(() => {
          setShowSkeleton(false);
          setIsReady(true);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    } else if (authReady && !user) {
      // No user - ready immediately
      setShowSkeleton(false);
      setIsReady(true);
    }
  }, [authReady, user, premiumReady, isPremium]);

  // Error state priority
  const error = useMemo(() => {
    if (!authReady) return null;
    if (user && !premiumReady) return null;
    return shiftsState.error;
  }, [authReady, user, premiumReady, shiftsState.error]);

  return {
    isLoading,
    isReady,
    showSkeleton,
    error,
    user,
    isPremium,
    shifts: shiftsState.shifts,
    shiftsOperations: {
      addShift: shiftsState.addShift,
      updateShift: shiftsState.updateShift,
      deleteShift: shiftsState.deleteShift,
      refreshShifts: shiftsState.refreshShifts,
      isSaving: shiftsState.isSaving
    }
  };
};
