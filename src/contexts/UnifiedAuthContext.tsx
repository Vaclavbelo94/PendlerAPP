
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
}

interface UnifiedAuthContextType {
  user: User | null;
  session: Session | null;
  unifiedUser: UnifiedUser | null;
  isLoading: boolean;
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
  const [error, setError] = useState<string | null>(null);

  // Create unified user from auth user
  const createUnifiedUser = useCallback((authUser: User, isPremium = false, isAdmin = false, premiumExpiry?: string): UnifiedUser => {
    const role: UserRole = isAdmin ? 'admin' : isPremium ? 'premium' : 'standard';
    
    return {
      id: authUser.id,
      email: authUser.email || '',
      displayName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
      role,
      status: 'active',
      hasPremiumAccess: isPremium,
      hasAdminAccess: isAdmin,
      isDHLEmployee: false,
      premiumExpiry,
      // Backward compatibility
      isPremium,
      isAdmin,
    };
  }, []);

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
      const premiumResult = await refreshPremiumStatus();
      
      // Check admin status
      let isAdmin = false;
      try {
        const { data: adminResult } = await supabase.rpc('get_current_user_admin_status');
        isAdmin = adminResult || false;
      } catch (err) {
        console.error('Error checking admin status:', err);
      }

      const unified = createUnifiedUser(user, premiumResult.isPremium, isAdmin, premiumResult.premiumExpiry);
      setUnifiedUser(unified);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  }, [user, refreshPremiumStatus, createUnifiedUser]);

  const canAccess = useCallback((feature: string) => {
    if (!unifiedUser) return false;
    
    switch (feature) {
      case 'premium_features':
        return unifiedUser.hasPremiumAccess;
      case 'admin_features':
        return unifiedUser.hasAdminAccess;
      default:
        return true;
    }
  }, [unifiedUser]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setError('Failed to initialize authentication');
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user || null);
          
          if (session?.user) {
            // Defer user data refresh to avoid deadlocks
            setTimeout(() => {
              if (mounted) {
                refreshUserData();
              }
            }, 100);
          } else {
            setUnifiedUser(null);
          }
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshUserData]);

  const contextValue: UnifiedAuthContextType = {
    user,
    session,
    unifiedUser,
    isLoading,
    error,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    refreshUserData,
    refreshPremiumStatus,
    canAccess,
  };

  return (
    <UnifiedAuthContext.Provider value={contextValue}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};
