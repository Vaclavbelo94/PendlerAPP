
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'standard' | 'premium' | 'dhl_employee' | 'dhl_admin' | 'admin';
export type UserStatus = 'active' | 'pending_setup' | 'suspended';

export interface UnifiedUser {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  status: UserStatus;
  hasPremiumAccess: boolean;
  hasAdminAccess: boolean;
  isDHLEmployee: boolean;
  premiumExpiry?: string;
  // Backward compatibility properties
  isPremium: boolean;
  isAdmin: boolean;
  // Unified naming
  isDHLUser: boolean;
}

interface UnifiedAuthContextType {
  user: User | null;
  session: Session | null;
  unifiedUser: UnifiedUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null; url?: string }>;
  signUp: (email: string, password: string, username?: string, promoCode?: string) => Promise<{ error: string | null; user?: User }>;
  signOut: () => Promise<void>;
  
  // Status methods
  refreshUserData: () => Promise<void>;
  refreshPremiumStatus: () => Promise<{ isPremium: boolean; premiumExpiry?: string }>;
  
  // Access methods
  canAccess: (feature: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (context === undefined) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};

export const UnifiedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [unifiedUser, setUnifiedUser] = useState<UnifiedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('UnifiedAuthContext state:', { isLoading, isInitialized, user: !!user, unifiedUser: !!unifiedUser });

  // Create unified user from auth user
  const createUnifiedUser = useCallback((authUser: User, isPremium = false, isAdmin = false, premiumExpiry?: string): UnifiedUser => {
    const role: UserRole = isAdmin ? 'admin' : isPremium ? 'premium' : 'standard';
    const isDHLEmployee = authUser.email?.endsWith('@dhl.com') || false;
    
    return {
      id: authUser.id,
      email: authUser.email || '',
      displayName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
      role,
      status: 'active',
      hasPremiumAccess: isPremium,
      hasAdminAccess: isAdmin,
      isDHLEmployee,
      premiumExpiry,
      // Backward compatibility
      isPremium,
      isAdmin,
      // Unified naming
      isDHLUser: isDHLEmployee,
    };
  }, []);

  // Role checking method
  const hasRole = useCallback((requiredRole: UserRole): boolean => {
    if (!unifiedUser) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      'standard': 1,
      'premium': 2,
      'dhl_employee': 2,
      'dhl_admin': 3,
      'admin': 4
    };
    
    return roleHierarchy[unifiedUser.role] >= roleHierarchy[requiredRole];
  }, [unifiedUser]);

  // Auth methods
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message || null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      return { error: errorMessage };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      return { 
        error: error?.message || null,
        url: data?.url 
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign in failed';
      setError(errorMessage);
      return { error: errorMessage };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, username?: string, promoCode?: string) => {
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
      
      return { 
        error: error?.message || null,
        user: data.user 
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      return { error: errorMessage };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      setUnifiedUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Sign out failed');
    }
  }, []);

  const refreshPremiumStatus = useCallback(async (): Promise<{ isPremium: boolean; premiumExpiry?: string }> => {
    if (!user?.id) {
      return { isPremium: false };
    }

    try {
      // Check for special users first
      const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com', 'zkouska@gmail.com'];
      if (user.email && specialEmails.includes(user.email)) {
        const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        return { isPremium: true, premiumExpiry: expiry };
      }

      // For other users, check the profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium, premium_expiry')
        .eq('id', user.id)
        .single();

      const isPremium = profile?.is_premium || false;
      const premiumExpiry = profile?.premium_expiry || undefined;

      return { isPremium, premiumExpiry };
    } catch (error) {
      console.error('Error refreshing premium status:', error);
      return { isPremium: false };
    }
  }, [user]);

  const refreshUserData = useCallback(async () => {
    if (!user) return;

    try {
      console.log('Refreshing user data for:', user.email);
      const premiumResult = await refreshPremiumStatus();
      
      // Check admin status
      let isAdmin = false;
      try {
        const { data: adminResult } = await supabase.rpc('get_current_user_admin_status');
        isAdmin = adminResult || false;
      } catch (err) {
        console.error('Error checking admin status:', err);
        // For special admin emails, set admin to true
        if (user.email === 'admin@pendlerapp.com') {
          isAdmin = true;
        }
      }

      const unified = createUnifiedUser(user, premiumResult.isPremium, isAdmin, premiumResult.premiumExpiry);
      console.log('Created unified user:', unified);
      setUnifiedUser(unified);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // Create a basic unified user even if there's an error
      const unified = createUnifiedUser(user, false, user.email === 'admin@pendlerapp.com');
      setUnifiedUser(unified);
    }
  }, [user, refreshPremiumStatus, createUnifiedUser]);

  const canAccess = useCallback((feature: string) => {
    if (!unifiedUser) return false;
    
    switch (feature) {
      case 'premium_features':
        return unifiedUser.hasPremiumAccess;
      case 'admin_features':
        return unifiedUser.hasAdminAccess;
      case 'dhl_features':
        return unifiedUser.isDHLEmployee;
      case 'dhl_admin':
        return unifiedUser.role === 'dhl_admin';
      case 'admin_panel':
        return unifiedUser.role === 'admin';
      default:
        return true;
    }
  }, [unifiedUser]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    let initTimeout: NodeJS.Timeout;

    console.log('UnifiedAuthContext: Starting initialization');

    const initializeAuth = async () => {
      try {
        // Set up the auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, !!session);
            if (mounted) {
              setSession(session);
              setUser(session?.user || null);
              
              if (session?.user) {
                // Refresh user data immediately for better UX
                setTimeout(async () => {
                  if (mounted) {
                    await refreshUserData();
                  }
                }, 100);
              } else {
                setUnifiedUser(null);
              }
            }
          }
        );

        // Then check for existing session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          console.log('Initial session:', !!initialSession);
          setSession(initialSession);
          setUser(initialSession?.user || null);
          setIsLoading(false);
          setIsInitialized(true);
          
          // If there's an initial session, refresh user data
          if (initialSession?.user) {
            setTimeout(async () => {
              if (mounted) {
                await refreshUserData();
              }
            }, 100);
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setError('Failed to initialize authentication');
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Emergency timeout - force initialization after 5 seconds
    initTimeout = setTimeout(() => {
      if (mounted && !isInitialized) {
        console.warn('Auth initialization timeout - forcing initialization');
        setIsLoading(false);
        setIsInitialized(true);
      }
    }, 5000);

    initializeAuth();

    return () => {
      mounted = false;
      if (initTimeout) clearTimeout(initTimeout);
    };
  }, []);

  const contextValue: UnifiedAuthContextType = {
    user,
    session,
    unifiedUser,
    isLoading,
    isInitialized,
    error,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    refreshUserData,
    refreshPremiumStatus,
    canAccess,
    hasRole,
  };

  return (
    <UnifiedAuthContext.Provider value={contextValue}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};
