
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

  // Early check for special users by email
  const isSpecialUserByEmail = useMemo(() => {
    const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com', 'zkouska@gmail.com'];
    return user?.email && specialEmails.includes(user.email);
  }, [user?.email]);

  // Memoized special user check with explicit email check
  const isSpecialUser = useMemo(() => {
    console.log('usePremiumAccess: Checking special user status', {
      email: user?.email,
      isSpecialUserByEmail,
      unifiedUserAdmin: unifiedUser?.isAdmin,
      unifiedUserPremium: unifiedUser?.isPremium
    });
    
    return isSpecialUserByEmail || unifiedUser?.isAdmin || unifiedUser?.isPremium || false;
  }, [unifiedUser, isSpecialUserByEmail]);

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
        console.log('usePremiumAccess: Starting access check', {
          email: user?.email,
          isSpecialUserByEmail,
          isSpecialUser,
          isPremium,
          isAdmin,
          featureKey
        });

        // Quick exit for special users - explicit email check first
        if (isSpecialUserByEmail) {
          console.log('usePremiumAccess: Special user detected by email, granting access:', user?.email);
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

        // Quick exit for other special users
        if (isSpecialUser || isAdmin) {
          console.log('usePremiumAccess: Special user detected by unified auth, granting access');
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
          
          console.log('usePremiumAccess: No feature key, checking general premium', { hasPremium });
          
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
        
        console.log('usePremiumAccess: Feature premium check result', { featureKey, isFeaturePremium });
        
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

        console.log('usePremiumAccess: Final access decision', { 
          featureKey, 
          isFeaturePremium, 
          hasPremium,
          finalAccess: hasPremium
        });

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
  }, [user, isPremium, isAdmin, featureKey, isSpecialUser, isSpecialUserByEmail, checkFeaturePremiumStatus, authLoading]);

  return {
    ...state,
    isLoading: state.isLoading || authLoading
  };
};
