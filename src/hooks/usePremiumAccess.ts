
import { useAuth } from '@/hooks/auth';

export const usePremiumAccess = (featureKey?: string) => {
  const { unifiedUser, isLoading } = useAuth();
  
  const isPremiumFeature = featureKey ? true : false; // Simplified logic
  const canAccess = unifiedUser?.hasPremiumAccess || false;
  
  return {
    isLoading,
    isPremiumFeature,
    canAccess
  };
};
