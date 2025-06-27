
import * as React from 'react';
import { saveUserToLocalStorage } from '@/utils/authUtils';
import { User } from '@supabase/supabase-js';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';

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

  // Special check for our target user and DHL employees
  const isSpecialUser = React.useCallback(() => {
    const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com'];
    const isSpecial = user?.email ? specialEmails.includes(user.email) : false;
    const isDHL = isDHLEmployee(user);
    
    console.log("Premium status special user check:", { 
      email: user?.email, 
      isSpecial,
      isDHL,
      finalResult: isSpecial || isDHL
    });
    
    return isSpecial || isDHL;
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

  // NOVÝ KÓD: Automaticky načíst premium status z databáze při změně uživatele
  React.useEffect(() => {
    let isMounted = true;

    const loadPremiumStatus = async () => {
      if (!user) {
        console.log("No user - setting premium to false");
        setIsPremium(false);
        return;
      }

      console.log("=== LOADING PREMIUM STATUS FOR USER ===", user.email);

      // Speciální uživatelé a DHL zaměstnanci dostávají premium automaticky
      if (isSpecialUser()) {
        console.log("Setting premium status for special user or DHL employee");
        setIsPremium(true);
        
        if (user) {
          console.log("Updating localStorage for special user or DHL employee");
          const oneYearLater = new Date();
          oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
          saveUserToLocalStorage(user, true, oneYearLater.toISOString());
        }
        return;
      }

      // Pro všechny ostatní uživatele - kontrola databáze
      try {
        console.log("Checking database for premium status...");
        const result = await refreshPremiumStatus();
        
        if (!isMounted) return;
        
        console.log("Database premium check result:", result);
        setIsPremium(result.isPremium);
        
        // Uložit do localStorage pro rychlejší načítání příště
        if (result.isPremium && user) {
          saveUserToLocalStorage(user, true, result.premiumExpiry);
        }
      } catch (error) {
        console.error("Error loading premium status from database:", error);
        
        // Fallback na localStorage při chybě
        const localPremium = getPremiumStatusFromLocalStorage();
        console.log("Fallback to localStorage premium:", localPremium);
        if (isMounted) {
          setIsPremium(localPremium);
        }
      }
    };

    loadPremiumStatus();

    return () => {
      isMounted = false;
    };
  }, [user, refreshPremiumStatus, isSpecialUser, getPremiumStatusFromLocalStorage]);

  return {
    isPremium,
    setIsPremium,
    getPremiumStatusFromLocalStorage,
    isSpecialUser
  };
};
