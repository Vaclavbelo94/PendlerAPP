
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const usePremiumCheck = (featureKey: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPremiumFeature, setIsPremiumFeature] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const { user, isPremium } = useAuth();

  useEffect(() => {
    const checkPremiumAccess = async () => {
      setIsLoading(true);
      
      try {
        // 1. Zjištění, zda je daná funkce označena jako premium
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
        
        // 2. Uživatel může přistupovat k funkci, pokud:
        // - funkce není prémiová NEBO
        // - uživatel má premium
        setCanAccess(!isFeaturePremium || isPremium);
        
      } catch (error) {
        console.error('Chyba při kontrole premium přístupu:', error);
        // V případě chyby dáme uživateli přístup (failsafe)
        setCanAccess(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      checkPremiumAccess();
    } else {
      setIsPremiumFeature(true);
      setCanAccess(false);
      setIsLoading(false);
    }
  }, [featureKey, user, isPremium]);

  return { isLoading, isPremiumFeature, canAccess };
};
