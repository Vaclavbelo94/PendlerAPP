
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';

interface PremiumAccessState {
  isLoading: boolean;
  canAccess: boolean;
  isPremiumFeature: boolean;
  isSpecialUser: boolean;
  errorMessage?: string;
}

/**
 * Sjednocený hook pro kontrolu premium přístupu
 * Uses unified auth system
 */
export const usePremiumAccess = (featureKey?: string) => {
  const { user, isPremium, isAdmin, unifiedUser, isLoading: authLoading } = useAuth();
  const [state, setState] = useState<PremiumAccessState>({
    isLoading: true,
    canAccess: false,
    isPremiumFeature: false,
    isSpecialUser: false
  });

  // Memoized special user check
  const isSpecialUser = useMemo(() => {
    return unifiedUser?.isAdmin || unifiedUser?.isPremium || false;
  }, [unifiedUser]);

  // Check if feature is premium
  const checkFeaturePremiumStatus = useCallback(async (key: string) => {
    try {
      const { data, error } = await supabase
        .from('premium_features')
        .select('is_enabled')
        .eq('key', key)
        .maybeSingle();
      
      if (error) {
        console.warn('Error checking premium feature:', error);
        return false;
      }
      
      return data?.is_enabled || false;
    } catch (error) {
      console.warn('Error in feature check:', error);
      return false;
    }
  }, []);

  // Main access check logic
  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      if (!isMounted) return;

      setState(prev => ({ ...prev, isLoading: true, errorMessage: undefined }));

      try {
        // Quick exit for special users
        if (isSpecialUser || isAdmin) {
          if (isMounted) {
            setState({
              isLoading: false,
              canAccess: true,
              isPremiumFeature: false,
              isSpecialUser: true
            });
          }
          return;
        }

        // If no feature key, just check user's premium status
        if (!featureKey) {
          const hasPremium = isPremium;
          
          if (isMounted) {
            setState({
              isLoading: false,
              canAccess: hasPremium,
              isPremiumFeature: false,
              isSpecialUser: false
            });
          }
          return;
        }

        // Check if feature is premium
        const isFeaturePremium = await checkFeaturePremiumStatus(featureKey);
        
        if (!isMounted) return;

        // If feature is not premium, allow access
        if (!isFeaturePremium) {
          setState({
            isLoading: false,
            canAccess: true,
            isPremiumFeature: false,
            isSpecialUser: false
          });
          return;
        }

        // Feature is premium, check user's access
        const hasPremium = isPremium;

        setState({
          isLoading: false,
          canAccess: hasPremium,
          isPremiumFeature: true,
          isSpecialUser: false
        });

      } catch (error) {
        console.error('Error in premium access check:', error);
        if (isMounted) {
          setState({
            isLoading: false,
            canAccess: false,
            isPremiumFeature: true,
            isSpecialUser: false,
            errorMessage: 'Chyba při ověřování přístupu'
          });
        }
      }
    };

    if (!authLoading) {
      checkAccess();
    }

    return () => {
      isMounted = false;
    };
  }, [user, isPremium, isAdmin, featureKey, isSpecialUser, checkFeaturePremiumStatus, authLoading]);

  return {
    ...state,
    isLoading: state.isLoading || authLoading
  };
};
