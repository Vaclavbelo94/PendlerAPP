
// Central auth hooks export
// This file provides a single entry point for all auth-related hooks

export { useUnifiedAuth } from './useUnifiedAuth';
export { useAuth } from './useUnifiedAuth';
export { useRouteProtection } from './useRouteProtection';
export { useAuthState } from './useAuthState';

// Re-export types for convenience
export type { UnifiedUser, UserRole, UserStatus } from '@/contexts/UnifiedAuthContext';

// Re-export the provider - this is the main AuthProvider that should be used
export { UnifiedAuthProvider as AuthProvider } from '@/contexts/UnifiedAuthContext';

// Backward compatibility - re-export the old useAuth hook
export { useAuth as useAuthLegacy } from '../useAuth';
