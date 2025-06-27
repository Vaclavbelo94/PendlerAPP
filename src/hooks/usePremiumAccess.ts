
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
 * Nahrazuje všechny ostatní premium hooks
 */
export const usePremiumAccess = (featureKey?: string) => {
  const { user, isPremium, isAdmin } = useAuth();
  const [state, setState] = useState<PremiumAccessState>({
    isLoading: true,
    canAccess: false,
    isPremiumFeature: false,
    isSpecialUser: false
  });

  // Memoized special user check
  const isSpecialUser = useMemo(() => {
    if (!user?.email) return false;
    const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com'];
    return specialEmails.includes(user.email);
  }, [user?.email]);

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

  // Get premium status from localStorage as fallback
  const getLocalStoragePremium = useCallback(() => {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) return false;
      
      const userData = JSON.parse(userStr);
      if (userData.isPremium && userData.premiumUntil) {
        const premiumExpiry = new Date(userData.premiumUntil);
        return premiumExpiry > new Date();
      }
      
      return userData.isPremium === true;
    } catch (error) {
      console.warn('Error checking localStorage premium:', error);
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
          const localPremium = getLocalStoragePremium();
          const hasPremium = isPremium || localPremium;
          
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
        const localPremium = getLocalStoragePremium();
        const hasPremium = isPremium || localPremium;

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

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [user, isPremium, isAdmin, featureKey, isSpecialUser, checkFeaturePremiumStatus, getLocalStoragePremium]);

  return state;
};
