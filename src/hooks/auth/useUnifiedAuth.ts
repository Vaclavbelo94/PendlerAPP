
import { useUnifiedAuth as useUnifiedAuthContext } from '@/contexts/UnifiedAuthContext';

// Re-export for backward compatibility
export const useAuth = useUnifiedAuthContext;
export const useUnifiedAuth = useUnifiedAuthContext;
export { UnifiedAuthProvider } from '@/contexts/UnifiedAuthContext';
export type { UnifiedUser, UserRole, UserStatus } from '@/contexts/UnifiedAuthContext';
