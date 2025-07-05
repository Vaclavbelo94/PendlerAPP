import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import React from 'react';

interface PremiumGateOptions {
  returnPath?: string;
  featureKey?: string;
  onContinueWithAds?: () => void;
}

/**
 * Hook pro kontrolu premium přístupu a zobrazení Premium Gate stránky
 */
export const usePremiumGate = () => {
  const { isPremium, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const checkPremiumAccess = useCallback((options: PremiumGateOptions = {}) => {
    const { returnPath, featureKey, onContinueWithAds } = options;
    
    // Pokud uživatel už má premium, povolí přístup
    if (isPremium) {
      return true;
    }

    // Pokud nemá premium, přesměruje na Premium Gate
    const currentPath = window.location.pathname;
    const finalReturnPath = returnPath || currentPath;
    
    // Sestaví query parametry pro Premium Gate
    const searchParams = new URLSearchParams();
    if (finalReturnPath) {
      searchParams.set('returnPath', finalReturnPath);
    }
    if (featureKey) {
      searchParams.set('featureKey', featureKey);
    }
    
    const queryString = searchParams.toString();
    const gateUrl = `/premium-gate${queryString ? `?${queryString}` : ''}`;
    
    navigate(gateUrl, { 
      state: { 
        returnPath: finalReturnPath,
        featureKey,
        onContinueWithAds 
      } 
    });
    
    return false;
  }, [isPremium, navigate]);

  const createPremiumGuard = useCallback((options: PremiumGateOptions = {}) => {
    return () => checkPremiumAccess(options);
  }, [checkPremiumAccess]);

  return {
    isPremium,
    isLoading: authLoading,
    checkPremiumAccess,
    createPremiumGuard,
    requiresPremium: !isPremium
  };
};

/**
 * Higher-order component pro ochranu premium funkcí
 */
export const withPremiumGate = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: PremiumGateOptions = {}
): React.ComponentType<P> => {
  return (props: P) => {
    const { checkPremiumAccess } = usePremiumGate();
    
    // Kontrola premium přístupu při mount
    React.useEffect(() => {
      checkPremiumAccess(options);
    }, [checkPremiumAccess]);

    return React.createElement(WrappedComponent, props);
  };
};