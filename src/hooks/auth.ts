
// Main auth hook - provides backward compatibility
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

/**
 * Main auth hook that provides unified authentication functionality
 * This is the primary hook that should be used throughout the application
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
    // Add missing methods that some components expect
    signInWithGoogle: authState.signUp, // Placeholder - should be implemented properly
  };
};

// Export everything from the auth hooks
export * from './auth';
export type { UnifiedUser, UserRole, UserStatus } from '@/contexts/UnifiedAuthContext';
