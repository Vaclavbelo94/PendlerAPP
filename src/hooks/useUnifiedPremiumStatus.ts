
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { usePremiumVerification } from './usePremiumVerification';

/**
 * A unified hook for checking premium status across the application
 * Combines all verification methods in one place
 * 
 * @param featureKey Optional feature key for specific premium feature checks
 * @returns Object with premium status and verification information
 */
export const useUnifiedPremiumStatus = (featureKey?: string) => {
  const { user, isPremium: authIsPremium } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const [isPremiumFeature, setIsPremiumFeature] = useState(false);
  
  // Use our dedicated verification hook for thorough premium checks
  const { 
    verifyPremiumStatus, 
    isSpecialUser,
    getPremiumStatusFromLocalStorage
  } = usePremiumVerification();
  
  useEffect(() => {
    const checkAccess = async () => {
      setIsVerifying(true);
      
      try {
        // First check if this is a premium feature (if featureKey provided)
        if (featureKey) {
          // For now we assume all features with keys are premium
          // This could be expanded to check against a database
          setIsPremiumFeature(true);
        }
        
        // Check premium status using all available methods
        const hasPremiumStatus = await verifyPremiumStatus();
        
        // User can access if:
        // 1. Feature is not premium, OR
        // 2. User has premium status from any verification source
        setCanAccess(!isPremiumFeature || hasPremiumStatus);
      } catch (error) {
        console.error('Error in premium access check:', error);
        // Failsafe: allow access on error
        setCanAccess(true);
      } finally {
        setIsVerifying(false);
      }
    };
    
    checkAccess();
  }, [featureKey, user, authIsPremium, verifyPremiumStatus, isPremiumFeature]);
  
  return {
    isVerifying,
    canAccess,
    isPremiumFeature,
    isSpecialUser: isSpecialUser(),
    isPremiumFromLocalStorage: getPremiumStatusFromLocalStorage()
  };
};
