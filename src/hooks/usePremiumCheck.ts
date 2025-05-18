
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook for checking if a user can access a premium feature
 * @param featureKey The key identifier for the premium feature
 * @returns Object containing loading state, whether feature is premium, and if user can access it
 */
export const usePremiumCheck = (featureKey: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPremiumFeature, setIsPremiumFeature] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const { user, isPremium } = useAuth();

  useEffect(() => {
    const checkPremiumAccess = async () => {
      setIsLoading(true);
      
      try {
        // If user is already premium, give immediate access
        if (isPremium) {
          setCanAccess(true);
          setIsLoading(false);
          return;
        }
        
        // Check if the feature is marked as premium in the database
        const { data, error } = await supabase
          .from('premium_features')
          .select('is_enabled')
          .eq('key', featureKey)
          .single();
        
        if (error) {
          console.error('Error checking premium feature:', error);
          // In case of error, allow access (failsafe)
          setIsPremiumFeature(false);
          setCanAccess(true);
          return;
        }
        
        const isFeaturePremium = data?.is_enabled || false;
        setIsPremiumFeature(isFeaturePremium);
        
        // User can access the feature if:
        // - The feature is not premium, OR
        // - The user has premium status
        setCanAccess(!isFeaturePremium || isPremium);
        
      } catch (error) {
        console.error('Error checking premium access:', error);
        // Failsafe: allow access
        setCanAccess(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumAccess();
  }, [featureKey, isPremium, user]);

  return { isLoading, isPremiumFeature, canAccess };
};
