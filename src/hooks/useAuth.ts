
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

/**
 * Backward compatibility hook
 * Re-exports unified auth for components that still use useAuth
 */
export const useAuth = () => {
  const authState = useUnifiedAuth();
  
  return {
    ...authState,
    // Backward compatibility aliases
    isPremium: authState.unifiedUser?.hasPremiumAccess || false,
    isAdmin: authState.unifiedUser?.hasAdminAccess || false,
    refreshUserStatus: authState.refreshUserData,
    refreshAdminStatus: authState.refreshUserData,
    refreshPremiumStatus: authState.refreshUserData,
  };
};
