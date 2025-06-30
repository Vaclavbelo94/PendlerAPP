
// Simplified auth exports - direct from UnifiedAuthContext
export { useUnifiedAuth, UnifiedAuthProvider } from '@/contexts/UnifiedAuthContext';
export type { UnifiedUser, UserRole, UserStatus } from '@/contexts/UnifiedAuthContext';

// Main auth hook for backward compatibility
export { useAuth } from './useAuth';

// Route protection hook
export { useRouteProtection } from './useRouteProtection';

// Auth state hook
export { useAuthState } from './useAuthState';

// Export the provider with clear name
export { UnifiedAuthProvider as AuthProvider } from '@/contexts/UnifiedAuthContext';
