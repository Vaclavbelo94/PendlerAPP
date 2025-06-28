
import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from './useAuthContext';
import { AuthContextType, AuthError, UnifiedUser } from '@/types/auth';
import { createUnifiedUser, canAccess, hasRole } from '@/utils/authRoleUtils';
import { useAuthState } from './useAuthState';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';
import { useDHLData } from '@/hooks/dhl/useDHLData';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, isLoading: authStateLoading, error: authStateError } = useAuthState();
  const { isAdmin, isPremium, refreshAdminStatus, refreshPremiumStatus } = useAuthStatus(user?.id);
  const { userAssignment } = useDHLData(user?.id);
  
  const [unifiedUser, setUnifiedUser] = React.useState<UnifiedUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<AuthError | null>(null);
  const [premiumExpiry, setPremiumExpiry] = React.useState<string | undefined>();

  // Initialize user data when auth state changes
  React.useEffect(() => {
    if (authStateLoading) return;
    
    if (!user) {
      setUnifiedUser(null);
      setIsLoading(false);
      return;
    }

    const initializeUser = async () => {
      try {
        setIsLoading(true);
        
        // Force refresh premium status first
        const premiumResult = await refreshPremiumStatus();
        const premiumStatus = premiumResult?.isPremium || false;
        const expiry = premiumResult?.premiumExpiry;
        
        console.log('Premium status check result:', { 
          email: user.email, 
          isPremium: premiumStatus, 
          expiry 
        });
        
        setPremiumExpiry(expiry);
        
        // Then refresh admin status
        await refreshAdminStatus();
        
        // Create unified user with fresh data
        const unified = createUnifiedUser(
          user,
          premiumStatus,
          isAdmin,
          expiry,
          !!userAssignment
        );
        
        console.log('Created unified user:', unified);
        setUnifiedUser(unified);
        setError(null);
      } catch (err) {
        console.error('Error initializing user:', err);
        setError({
          message: 'Failed to load user data',
          code: 'initialization_error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [user, authStateLoading, refreshAdminStatus, refreshPremiumStatus, isAdmin, userAssignment]);

  // Auth methods
  const signIn = React.useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError({ message: errorMessage });
      return { error: errorMessage };
    }
  }, []);

  const signInWithGoogle = React.useCallback(async () => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return { error: null, url: data.url };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign in failed';
      setError({ message: errorMessage });
      return { error: errorMessage };
    }
  }, []);

  const signUp = React.useCallback(async (email: string, password: string, username?: string, promoCode?: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: username || email.split('@')[0],
            promo_code: promoCode
          }
        }
      });
      
      if (error) {
        return { error: error.message, user: null };
      }
      
      return { error: null, user: data.user };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError({ message: errorMessage });
      return { error: errorMessage, user: null };
    }
  }, []);

  const signOut = React.useCallback(async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      setUnifiedUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError({
        message: err instanceof Error ? err.message : 'Sign out failed'
      });
    }
  }, []);

  const refreshUserStatus = React.useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const [premiumResult] = await Promise.all([
        refreshPremiumStatus(),
        refreshAdminStatus()
      ]);
      
      const expiry = premiumResult?.premiumExpiry;
      setPremiumExpiry(expiry);
      
      // Update unified user
      const unified = createUnifiedUser(
        user,
        premiumResult?.isPremium || false,
        isAdmin,
        expiry,
        !!userAssignment
      );
      
      setUnifiedUser(unified);
      console.log('User status refreshed:', unified);
    } catch (err) {
      console.error('Error refreshing user status:', err);
    }
  }, [user, refreshPremiumStatus, refreshAdminStatus, isAdmin, userAssignment]);

  // Context value
  const contextValue: AuthContextType = {
    user,
    session,
    unifiedUser,
    isLoading: isLoading || authStateLoading,
    isPremium: unifiedUser?.isPremium || false,
    isAdmin: unifiedUser?.isAdmin || false,
    error: error || (authStateError ? { message: authStateError.message } : null),
    
    // Auth methods
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    
    // Status methods
    refreshUserStatus,
    refreshAdminStatus,
    refreshPremiumStatus,
    
    // Role methods
    hasRole: (role) => hasRole(unifiedUser, role),
    canAccess: (requiredRole) => canAccess(unifiedUser, requiredRole),
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
