
import { useAuth } from '@/hooks/auth';

/**
 * @deprecated Use useAuth hook directly instead
 * This hook is kept for backward compatibility only
 */
export const useCachedPremiumManager = () => {
  const { isPremium, isLoading } = useAuth();
  
  console.warn('⚠️ useCachedPremiumManager is deprecated. Use useAuth hook directly.');
  
  return {
    isPremium,
    isVerified: true,
    isLoading
  };
};
