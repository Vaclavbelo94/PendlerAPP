
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
    
    console.log('Auth Provider: Auth state changed', { user: user?.email, authStateLoading });
    
    if (!user) {
      console.log('Auth Provider: No user, clearing state');
      setUnifiedUser(null);
      setIsLoading(false);
      return;
    }

    const initializeUser = async () => {
      try {
        setIsLoading(true);
        console.log('Auth Provider: Initializing user', user.email);
        
        // Special users get immediate premium status
        const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com', 'zkouska@gmail.com'];
        const isSpecialUser = user.email && specialEmails.includes(user.email);
        
        console.log('Auth Provider: Checking special user status', { email: user.email, isSpecialUser });
        
        let premiumStatus = false;
        let expiry: string | undefined;
        let adminStatus = false;
        
        if (isSpecialUser) {
          // Set premium immediately for special users
          premiumStatus = true;
          expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
          console.log('Auth Provider: Special user detected, setting premium', { email: user.email });
        } else {
          // For regular users, refresh premium status with error handling
          try {
            console.log('Auth Provider: Refreshing premium status for regular user');
            const premiumResult = await refreshPremiumStatus();
            premiumStatus = premiumResult?.isPremium || false;
            expiry = premiumResult?.premiumExpiry;
            console.log('Auth Provider: Premium refresh result', { isPremium: premiumStatus, expiry });
          } catch (err) {
            console.error('Auth Provider: Premium status refresh failed, continuing with defaults', err);
            premiumStatus = false;
          }
        }
        
        // Refresh admin status with error handling
        try {
          console.log('Auth Provider: Refreshing admin status');
          await refreshAdminStatus();
          adminStatus = isAdmin;
          console.log('Auth Provider: Admin status result', { isAdmin: adminStatus });
        } catch (err) {
          console.error('Auth Provider: Admin status refresh failed, continuing with defaults', err);
          adminStatus = isSpecialUser; // Special users are also admin
        }
        
        setPremiumExpiry(expiry);
        
        // Create unified user with determined statuses
        const unified = createUnifiedUser(
          user,
          premiumStatus,
          adminStatus || isSpecialUser,
          expiry,
          !!userAssignment
        );
        
        console.log('Auth Provider: Created unified user', unified);
        setUnifiedUser(unified);
        setError(null);
      } catch (err) {
        console.error('Auth Provider: Error initializing user:', err);
        setError({
          message: 'Failed to load user data',
          code: 'initialization_error'
        });
      } finally {
        setIsLoading(false);
        console.log('Auth Provider: User initialization complete');
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
    
    console.log('Auth Provider: Manual refresh user status called');
    
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
      console.log('Auth Provider: User status refreshed:', unified);
    } catch (err) {
      console.error('Auth Provider: Error refreshing user status:', err);
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

  console.log('Auth Provider: Rendering with context', {
    hasUser: !!user,
    email: user?.email,
    isPremium: contextValue.isPremium,
    isAdmin: contextValue.isAdmin,
    isLoading: contextValue.isLoading
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
