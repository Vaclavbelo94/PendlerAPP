
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedPremiumStatus } from '@/hooks/useUnifiedPremiumStatus';

/**
 * Hook for checking if a user can access a premium feature
 * @param featureKey The key identifier for the premium feature
 * @returns Object containing loading state, whether feature is premium, and if user can access it
 */
export const usePremiumCheck = (featureKey: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPremiumFeature, setIsPremiumFeature] = useState(false);
  
  // Use our unified premium status hook
  const { canAccess, isVerifying } = useUnifiedPremiumStatus(featureKey);

  useEffect(() => {
    const checkPremiumAccess = async () => {
      setIsLoading(true);
      
      try {
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
          return;
        }
        
        const isFeaturePremium = data?.is_enabled || false;
        setIsPremiumFeature(isFeaturePremium);
      } catch (error) {
        console.error('Error checking premium access:', error);
        // Failsafe: assume not premium
        setIsPremiumFeature(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumAccess();
  }, [featureKey]);

  return { 
    isLoading: isLoading || isVerifying, 
    isPremiumFeature, 
    canAccess 
  };
};
