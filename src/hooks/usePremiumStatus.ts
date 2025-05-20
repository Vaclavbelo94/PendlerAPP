
import * as React from 'react';
import { saveUserToLocalStorage } from '@/utils/authUtils';
import { User } from '@supabase/supabase-js';

/**
 * Hook for handling premium user status checks and local storage updates
 */
export const usePremiumStatus = (
  user: User | null, 
  refreshPremiumStatus: () => Promise<{ isPremium: boolean; premiumExpiry?: string }>,
  isAdmin: boolean
) => {
  const [isPremium, setIsPremium] = React.useState(false);
  
  // Check for premium status in localStorage as a fallback
  const getPremiumStatusFromLocalStorage = React.useCallback(() => {
    try {
      const userStr = localStorage.getItem("currentUser");
      if (!userStr) return false;
      const userData = JSON.parse(userStr);
      
      // Check if premium has expired
      if (userData.isPremium && userData.premiumUntil) {
        const premiumExpiry = new Date(userData.premiumUntil);
        const now = new Date();
        return premiumExpiry > now;
      }
      
      return userData.isPremium === true;
    } catch (e) {
      console.error('Error checking premium status from localStorage:', e);
      return false;
    }
  }, []);

  // Special check for our target user
  const isSpecialUser = React.useCallback(() => {
    const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com'];
    const isSpecial = user?.email ? specialEmails.includes(user.email) : false;
    console.log("Premium status special user check:", { email: user?.email, isSpecial });
    return isSpecial;
  }, [user?.email]);

  // Update premium status with localStorage as fallback
  React.useEffect(() => {
    if (!isPremium) {
      const localPremium = getPremiumStatusFromLocalStorage();
      const specialUser = isSpecialUser();
      if (localPremium || specialUser) {
        console.log("Setting premium status from localStorage or special user check");
        setIsPremium(true);
      }
    }
  }, [isPremium, getPremiumStatusFromLocalStorage, isSpecialUser]);

  // Update premium status when user changes
  React.useEffect(() => {
    if (isSpecialUser()) {
      console.log("Setting premium status for special user");
      setIsPremium(true);
      
      // Also update localStorage to make sure it's consistent
      if (user) {
        console.log("Updating localStorage for special user");
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
        saveUserToLocalStorage(user, true, threeMonthsLater.toISOString());
      }
    }
  }, [user, isSpecialUser]);

  return {
    isPremium,
    setIsPremium,
    getPremiumStatusFromLocalStorage,
    isSpecialUser
  };
};
