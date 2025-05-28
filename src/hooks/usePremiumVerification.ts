import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook that verifies premium status with fallback mechanisms
 * @returns Object containing verification status and helper methods
 */
export const usePremiumVerification = () => {
  const { user, isPremium } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  // Memoize special user check to prevent unnecessary re-computation
  const isSpecialUser = useCallback(() => {
    try {
      const userEmail = user?.email || 
        (localStorage.getItem("currentUser") ? 
          JSON.parse(localStorage.getItem("currentUser") || "{}").email : null);
      
      const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com'];
      return specialEmails.includes(userEmail);
    } catch (e) {
      console.error('Error in special user check:', e);
      return false;
    }
  }, [user?.email]);

  // Memoize localStorage check for better performance
  const getPremiumStatusFromLocalStorage = useCallback(() => {
    try {
      const userStr = localStorage.getItem("currentUser");
      if (!userStr) return false;
      const userData = JSON.parse(userStr);
      
      if (userData.isPremium && userData.premiumUntil) {
        const premiumExpiry = new Date(userData.premiumUntil);
        return premiumExpiry > new Date();
      }
      
      return userData.isPremium === true;
    } catch (e) {
      console.error('Error checking premium status from localStorage:', e);
      return false;
    }
  }, []);

  // Optimized verification with timeout and error handling
  const verifyPremiumStatus = useCallback(async (): Promise<boolean> => {
    // Quick check for special users
    if (isSpecialUser()) {
      return true;
    }

    setIsVerifying(true);
    
    try {
      // Check premium status from all sources with timeout
      const timeoutPromise = new Promise<boolean>((_, reject) => 
        setTimeout(() => reject(new Error('Verification timeout')), 1500)
      );
      
      const verificationPromise = new Promise<boolean>((resolve) => {
        // Check localStorage first (fastest)
        const localStoragePremium = getPremiumStatusFromLocalStorage();
        
        // Check auth context
        const authPremium = isPremium;
        
        // Return true if any source indicates premium
        const hasPremium = authPremium || localStoragePremium;
        resolve(hasPremium);
      });
      
      const result = await Promise.race([verificationPromise, timeoutPromise]);
      
      setVerificationComplete(true);
      return result;
    } catch (error) {
      console.error('Premium verification error:', error);
      // Fallback to auth context on error
      setVerificationComplete(true);
      return isPremium;
    } finally {
      setIsVerifying(false);
    }
  }, [isPremium, isSpecialUser, getPremiumStatusFromLocalStorage]);

  // Initialize verification state
  useEffect(() => {
    if (user) {
      setVerificationComplete(false);
    }
  }, [user]);

  return {
    isVerifying,
    verificationComplete,
    verifyPremiumStatus,
    isSpecialUser,
    getPremiumStatusFromLocalStorage
  };
};
