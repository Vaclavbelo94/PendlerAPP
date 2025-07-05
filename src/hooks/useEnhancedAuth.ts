
import { useUnifiedAuth } from '@/hooks/auth/useUnifiedAuth';

/**
 * Enhanced auth hook that handles DHL user redirection and profile loading
 * @deprecated Use useUnifiedAuth instead - this is kept for backward compatibility
 */
export const useEnhancedAuth = () => {
  console.warn('useEnhancedAuth is deprecated, use useUnifiedAuth instead');
  
  const unifiedAuth = useUnifiedAuth();
  
  // Return the same interface as before for backward compatibility
  return {
    user: unifiedAuth.user,
    userAssignment: unifiedAuth.userAssignment,
    isLoading: unifiedAuth.isLoading,
    isDHLEmployee: unifiedAuth.isDHLEmployee,
    profileData: unifiedAuth.profileData,
    isDHLEmployeeSync: unifiedAuth.isDHLEmployeeSync
  };
};
