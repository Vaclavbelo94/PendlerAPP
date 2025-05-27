
import { useEffect, useState, useCallback, useMemo } from 'react';
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
  const [isVerifying, setIsVerifying] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [isPremiumFeature, setIsPremiumFeature] = useState(false);
  
  // Use our dedicated verification hook for thorough premium checks
  const { 
    verifyPremiumStatus, 
    isSpecialUser,
    getPremiumStatusFromLocalStorage
  } = usePremiumVerification();

  // Memoize special user check to prevent unnecessary re-computations
  const isUserSpecial = useMemo(() => {
    return isSpecialUser();
  }, [user?.email]);

  // Memoize premium status from localStorage
  const localStoragePremium = useMemo(() => {
    return getPremiumStatusFromLocalStorage();
  }, []);

  // Optimized access check with proper dependency management
  const checkAccess = useCallback(async () => {
    // Quick exit for special users
    if (isUserSpecial) {
      setCanAccess(true);
      setIsVerifying(false);
      return;
    }

    // If no user, deny access
    if (!user) {
      setCanAccess(false);
      setIsVerifying(false);
      return;
    }

    setIsVerifying(true);
    
    try {
      // Set feature as premium if featureKey is provided
      if (featureKey) {
        setIsPremiumFeature(true);
      }
      
      // Check premium status with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Premium check timeout')), 2000)
      );
      
      const statusPromise = verifyPremiumStatus();
      
      const hasPremiumStatus = await Promise.race([
        statusPromise,
        timeoutPromise
      ]) as boolean;
      
      // User can access if:
      // 1. Feature is not premium, OR
      // 2. User has premium status from any verification source, OR
      // 3. User has premium from auth context
      const hasAccess = !isPremiumFeature || hasPremiumStatus || authIsPremium || localStoragePremium;
      
      setCanAccess(hasAccess);
    } catch (error) {
      console.error('Error in premium access check:', error);
      // Failsafe: allow access on error for better UX
      setCanAccess(true);
    } finally {
      setIsVerifying(false);
    }
  }, [featureKey, user, authIsPremium, isUserSpecial, localStoragePremium, verifyPremiumStatus, isPremiumFeature]);
  
  // Effect with proper cleanup and dependencies
  useEffect(() => {
    let isMounted = true;
    
    const runCheck = async () => {
      if (isMounted) {
        await checkAccess();
      }
    };
    
    runCheck();
    
    return () => {
      isMounted = false;
    };
  }, [checkAccess]);
  
  return {
    isVerifying,
    canAccess,
    isPremiumFeature,
    isSpecialUser: isUserSpecial,
    isPremiumFromLocalStorage: localStoragePremium
  };
};
