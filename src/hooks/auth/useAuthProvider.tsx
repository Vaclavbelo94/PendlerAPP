
import * as React from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from './useAuthContext';
import { AuthError, UserRole, UnifiedUser, AuthProviderProps } from '@/types/auth';
import { useAuthStatus } from './useAuthStatus';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { createUnifiedUser, getRedirectPath, hasRole, canAccess } from '@/utils/authRoleUtils';
import { isDHLPromoCode } from '@/utils/dhlAuthUtils';
import { activatePromoCode } from '@/services/promoCodeService';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [unifiedUser, setUnifiedUser] = React.useState<UnifiedUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<AuthError | null>(null);

  const { 
    isAdmin, 
    isPremium: premiumStatus, 
    setIsAdmin, 
    setIsPremium, 
    refreshAdminStatus, 
    refreshPremiumStatus 
  } = useAuthStatus(user?.id);

  const { 
    isPremium: premiumFromHook,
    setIsPremium: setPremiumFromHook 
  } = usePremiumStatus(user, refreshPremiumStatus, isAdmin);

  const isPremium = premiumFromHook || premiumStatus;

  // Create unified user when user data changes
  React.useEffect(() => {
    if (user) {
      const unified = createUnifiedUser(user, isPremium, isAdmin);
      setUnifiedUser(unified);
      console.log('Unified user created:', unified);
    } else {
      setUnifiedUser(null);
    }
  }, [user, isPremium, isAdmin]);

  React.useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session?.user?.email);
            
            if (isMounted) {
              setSession(session);
              setUser(session?.user ?? null);
              setIsLoading(false);
              setError(null);

              if (event === 'SIGNED_IN' && session?.user) {
                // Defer heavy operations to prevent deadlocks
                setTimeout(() => {
                  refreshAdminStatus();
                  refreshPremiumStatus();
                }, 0);
              }

              if (event === 'SIGNED_OUT') {
                setIsAdmin(false);
                setIsPremium(false);
                setPremiumFromHook(false);
                setUnifiedUser(null);
              }
            }
          }
        );

        // Then check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (isMounted) {
            setError({ message: sessionError.message, code: sessionError.name });
          }
        }
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setError({ message: 'Failed to initialize authentication' });
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [refreshAdminStatus, refreshPremiumStatus, setIsAdmin, setIsPremium, setPremiumFromHook]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        const authError: AuthError = { message: error.message, code: error.name };
        setError(authError);
        return { error: authError.message };
      }
      
      return { error: null };
    } catch (error) {
      const authError: AuthError = { message: 'Neočekávaná chyba při přihlášení' };
      setError(authError);
      return { error: authError.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        const authError: AuthError = { message: error.message, code: error.name };
        setError(authError);
        return { error: authError.message };
      }
      
      return { error: null, url: data.url };
    } catch (error) {
      const authError: AuthError = { message: 'Neočekávaná chyba při přihlášení přes Google' };
      setError(authError);
      return { error: authError.message };
    }
  };

  const signUp = async (email: string, password: string, username?: string, promoCode?: string) => {
    try {
      setError(null);
      console.log('=== ENHANCED REGISTRATION START ===');
      console.log('Email:', email, 'Promo Code:', promoCode);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            username: username || email.split('@')[0]
          }
        }
      });
      
      if (error) {
        const authError: AuthError = { message: error.message, code: error.name };
        setError(authError);
        return { error: authError.message, user: null };
      }
      
      // Handle promo code if provided
      if (data.user && promoCode?.trim()) {
        console.log('Activating promo code:', promoCode);
        
        // Wait for profile creation
        setTimeout(async () => {
          const result = await activatePromoCode(data.user!.id, promoCode.trim());
          console.log('Promo code activation result:', result);
          
          if (result.success && isDHLPromoCode(promoCode)) {
            localStorage.setItem('dhl-from-registration', 'true');
            localStorage.setItem('dhl-promo-activated', 'true');
          }
        }, 5000);
      }
      
      return { error: null, user: data.user };
    } catch (error) {
      const authError: AuthError = { message: 'Neočekávaná chyba při registraci' };
      setError(authError);
      return { error: authError.message, user: null };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        setError({ message: error.message, code: error.name });
      }
      
      // Clear all state immediately
      setUser(null);
      setSession(null);
      setUnifiedUser(null);
      setIsAdmin(false);
      setIsPremium(false);
      setPremiumFromHook(false);
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      setError({ message: 'Chyba při odhlášení' });
    }
  };

  const refreshUserStatus = async () => {
    await Promise.all([
      refreshAdminStatus(),
      refreshPremiumStatus()
    ]);
  };

  // Role checking methods that use the unified user
  const hasRoleMethod = (role: UserRole): boolean => {
    return hasRole(unifiedUser, role);
  };

  const canAccessMethod = (requiredRole: UserRole): boolean => {
    return canAccess(unifiedUser, requiredRole);
  };

  const value = {
    user,
    session,
    unifiedUser,
    isLoading,
    error,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    refreshUserStatus,
    refreshAdminStatus,
    refreshPremiumStatus,
    hasRole: hasRoleMethod,
    canAccess: canAccessMethod,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
