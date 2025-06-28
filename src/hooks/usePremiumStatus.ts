
import { useAuth } from '@/hooks/auth';

/**
 * @deprecated Use useAuth hook directly instead
 * This hook is kept for backward compatibility
 */
export const usePremiumStatus = () => {
  const { isPremium, refreshPremiumStatus } = useAuth();
  
  console.warn('⚠️ usePremiumStatus is deprecated. Use useAuth hook directly.');
  
  return {
    isPremium,
    setIsPremium: () => {
      console.warn('⚠️ Direct setIsPremium is deprecated. Use refreshPremiumStatus instead.');
    },
    refreshPremiumStatus
  };
};
