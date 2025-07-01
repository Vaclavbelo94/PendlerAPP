
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

/**
 * Simplified auth hook for backward compatibility
 * This provides all the functionality components need
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
    // refreshPremiumStatus is already available from authState
  };
};
