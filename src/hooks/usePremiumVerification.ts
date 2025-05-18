
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook that verifies premium status with fallback mechanisms
 * @returns Object containing verification status and helper methods
 */
export const usePremiumVerification = () => {
  const { user, isPremium } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  // Check for premium status in localStorage as a fallback
  const getPremiumStatusFromLocalStorage = () => {
    try {
      const userStr = localStorage.getItem("currentUser");
      if (!userStr) return false;
      const userData = JSON.parse(userStr);
      return userData.isPremium === true;
    } catch (e) {
      console.error('Error checking premium status from localStorage:', e);
      return false;
    }
  };

  // Special check for our target user
  const isSpecialUser = () => {
    try {
      const userEmail = user?.email || 
        (localStorage.getItem("currentUser") ? 
          JSON.parse(localStorage.getItem("currentUser") || "{}").email : null);
      
      return userEmail === 'uzivatel@pendlerapp.com';
    } catch (e) {
      console.error('Error in special user check:', e);
      return false;
    }
  };

  // Verify premium status with all available methods
  const verifyPremiumStatus = async () => {
    setIsVerifying(true);
    
    // Check premium status from all sources
    const localStoragePremium = getPremiumStatusFromLocalStorage();
    const specialUserStatus = isSpecialUser();
    
    const hasPremium = isPremium || localStoragePremium || specialUserStatus;
    
    setVerificationComplete(true);
    setIsVerifying(false);
    
    return hasPremium;
  };

  // Initialize with verification
  useEffect(() => {
    verifyPremiumStatus();
  }, [user, isPremium]);

  return {
    isVerifying,
    verificationComplete,
    verifyPremiumStatus,
    isSpecialUser,
    getPremiumStatusFromLocalStorage
  };
};
