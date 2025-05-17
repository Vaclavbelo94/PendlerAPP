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

  // Initialize with localStorage value immediately
  useEffect(() => {
    // If localStorage shows user is premium, give immediate access while checking
    const localPremium = getPremiumStatusFromLocalStorage();
    if (localPremium) {
      setCanAccess(true);
    }
  }, []);

  useEffect(() => {
    const checkPremiumAccess = async () => {
      setIsLoading(true);
      
      try {
        // Check if user is premium from any source
        const userIsPremium = isPremium || getPremiumStatusFromLocalStorage();
        
        // If user is already known to be premium, give access immediately
        if (userIsPremium) {
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
        
        // 2. Uživatel může přistupovat k funkci, pokud:
        // - funkce není prémiová NEBO
        // - uživatel má premium
        setCanAccess(!isFeaturePremium || confirmedUserIsPremium);
        
      } catch (error) {
        console.error('Chyba při kontrole premium přístupu:', error);
        // V případě chyby dáme uživateli přístup (failsafe)
        setCanAccess(true);
      } finally {
        setIsLoading(false);
      }
    };

    // If we already gave access based on localStorage, still check in the background
    if (user || getPremiumStatusFromLocalStorage()) {
      checkPremiumAccess();
    } else {
      setIsPremiumFeature(true);
      setCanAccess(false);
      setIsLoading(false);
    }
  }, [featureKey, user, isPremium]);

  return { isLoading, isPremiumFeature, canAccess };
};
