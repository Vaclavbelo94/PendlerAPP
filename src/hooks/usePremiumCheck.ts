
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const usePremiumCheck = (featureKey: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPremiumFeature, setIsPremiumFeature] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const { user, isPremium } = useAuth();

  // Additional fallback for premium status
  const getPremiumStatusFromLocalStorage = () => {
    try {
      const userStr = localStorage.getItem("currentUser");
      if (!userStr) return false;
      const user = JSON.parse(userStr);
      return user.isPremium === true;
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
      
      console.log("Checking special user, email:", userEmail);
      return userEmail === 'uzivatel@pendlerapp.com';
    } catch (e) {
      console.error('Error in isSpecialUser check:', e);
      return false;
    }
  };

  // Initialize with localStorage value and special user check immediately
  useEffect(() => {
    // If localStorage shows user is premium, give immediate access while checking
    const localPremium = getPremiumStatusFromLocalStorage();
    const userIsSpecial = isSpecialUser();
    
    console.log("Initial premium check:", { localPremium, userIsSpecial });
    
    if (localPremium || userIsSpecial) {
      setCanAccess(true);
    }
  }, []);

  useEffect(() => {
    const checkPremiumAccess = async () => {
      setIsLoading(true);
      
      try {
        // Check if user is premium from any source or is our special user
        const userIsPremium = isPremium || getPremiumStatusFromLocalStorage();
        const userIsSpecial = isSpecialUser();
        
        console.log("Premium access check:", { 
          featureKey,
          isPremium, 
          localStoragePremium: getPremiumStatusFromLocalStorage(),
          isSpecialUser: userIsSpecial,
          email: user?.email
        });
        
        // If user is already known to be premium or is special, give access immediately
        if (userIsPremium || userIsSpecial) {
          setIsPremiumFeature(true); // Even if the feature is premium
          setCanAccess(true);
          setIsLoading(false);
          return;
        }
        
        // Otherwise check if the feature is premium
        const { data, error } = await supabase
          .from('premium_features')
          .select('is_enabled')
          .eq('key', featureKey)
          .single();
        
        if (error) {
          console.error('Chyba při kontrole premium funkce:', error);
          // V případě chyby dáme uživateli přístup (failsafe)
          setIsPremiumFeature(false);
          setCanAccess(true);
          return;
        }
        
        const isFeaturePremium = data?.is_enabled || false;
        setIsPremiumFeature(isFeaturePremium);
        
        // Check premium status from auth hook or localStorage again (to be sure)
        const confirmedUserIsPremium = isPremium || getPremiumStatusFromLocalStorage();
        const confirmedUserIsSpecial = isSpecialUser();
        
        console.log("Final access decision:", {
          isFeaturePremium,
          confirmedUserIsPremium,
          confirmedUserIsSpecial
        });
        
        // Uživatel může přistupovat k funkci, pokud:
        // - funkce není prémiová NEBO
        // - uživatel má premium NEBO
        // - uživatel je náš speciální uživatel
        setCanAccess(!isFeaturePremium || confirmedUserIsPremium || confirmedUserIsSpecial);
        
      } catch (error) {
        console.error('Chyba při kontrole premium přístupu:', error);
        // V případě chyby dáme uživateli přístup (failsafe)
        setCanAccess(true);
      } finally {
        setIsLoading(false);
      }
    };

    // If we already gave access based on localStorage or special user, still check in the background
    if (user || getPremiumStatusFromLocalStorage() || isSpecialUser()) {
      checkPremiumAccess();
    } else {
      setIsPremiumFeature(true);
      setCanAccess(false);
      setIsLoading(false);
    }
  }, [featureKey, user, isPremium]);

  return { isLoading, isPremiumFeature, canAccess };
};
