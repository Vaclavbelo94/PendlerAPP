
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

/**
 * Hook to check unified premium status
 * Provides backward compatibility for components using the old premium status check
 */
export const useUnifiedPremiumStatus = () => {
  const { unifiedUser, isLoading } = useUnifiedAuth();
  
  return {
    isPremium: unifiedUser?.hasPremiumAccess || false,
    isLoading,
    hasPremiumAccess: unifiedUser?.hasPremiumAccess || false,
    user: unifiedUser,
  };
};
