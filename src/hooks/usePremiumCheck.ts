
import { usePremiumAccess } from './usePremiumAccess';

/**
 * @deprecated Použijte usePremiumAccess místo usePremiumCheck
 * Tento hook je zachován pro zpětnou kompatibilitu
 */
export const usePremiumCheck = (featureKey: string) => {
  const { isLoading, canAccess, isPremiumFeature } = usePremiumAccess(featureKey);
  
  return { 
    isLoading, 
    isPremiumFeature, 
    canAccess 
  };
};
