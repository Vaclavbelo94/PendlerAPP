import { useState, useCallback } from 'react';
import { secureAuthManager } from '@/utils/secureAuthManager';
import { useAuth } from '@/hooks/auth';

/**
 * Enhanced authentication hook with security features
 */
export const useSecureAuth = () => {
  const { user, session, refreshUserStatus } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const secureSignIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await secureAuthManager.signIn(email, password);
      
      if (result.error) {
        setError(result.error.message);
        return { error: result.error };
      }

      // Refresh user status after successful login
      await refreshUserStatus();
      
      return { error: null, user: result.user };
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  }, [refreshUserStatus]);

  const secureSignOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await secureAuthManager.signOut();
      
      // Force page reload for complete cleanup
      window.location.href = '/';
    } catch (err: any) {
      console.error('Secure sign out error:', err);
      // Force cleanup even on error
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getSecurityStats = useCallback(() => {
    return secureAuthManager.getSecurityStats();
  }, []);

  return {
    user,
    session,
    isLoading,
    error,
    secureSignIn,
    secureSignOut,
    clearError,
    getSecurityStats
  };
};