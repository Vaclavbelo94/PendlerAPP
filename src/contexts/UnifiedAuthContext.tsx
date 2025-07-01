import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { createUnifiedUser } from '@/utils/authRoleUtils';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useAuthMethods } from '@/hooks/auth/useAuthMethods';

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
  isDHLUser: boolean;
  premiumExpiry?: string;
  setupRequired?: boolean;
  // Backward compatibility
  isPremium: boolean;
  isAdmin: boolean;
}

interface UnifiedAuthContextType {
  user: User | null;
  session: Session | null;
  unifiedUser: UnifiedUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error?: string | null;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<{error: string | null}>;
  signInWithGoogle: () => Promise<{error: string | null, url?: string}>;
  signUp: (email: string, password: string, username?: string, promoCode?: string) => Promise<{error: string | null, user: User | null}>;
  signOut: () => Promise<void>;
  
  // Methods
  refreshUserData: () => Promise<void>;
  refreshPremiumStatus: () => Promise<{ isPremium: boolean; premiumExpiry?: string }>;
  hasRole: (role: UserRole) => boolean;
  canAccess: (feature: string) => boolean;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

export const UnifiedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [unifiedUser, setUnifiedUser] = useState<UnifiedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isPremium, isAdmin, refreshPremiumStatus, refreshAdminStatus } = useAuthStatus(user?.id);
  
  // Get authentication methods
  const { signIn, signInWithGoogle, signUp, signOut } = useAuthMethods();

  const refreshUserData = useCallback(async () => {
    if (!user) {
      console.log('No user, clearing unified user data');
      setUnifiedUser(null);
      return;
    }

    console.log('Refreshing user data for:', user.email);
    
    try {
      // Force refresh both statuses
      const [premiumResult] = await Promise.all([
        refreshPremiumStatus(),
        refreshAdminStatus()
      ]);
      
      console.log('Premium refresh result:', premiumResult);
      
      // Create unified user with latest data
      const unified = createUnifiedUser(
        user,
        premiumResult?.isPremium || isPremium,
        isAdmin,
        premiumResult?.premiumExpiry,
        false
      );
      
      console.log('Setting unified user:', unified);
      setUnifiedUser(unified);
    } catch (err) {
      console.error('Error refreshing user data:', err);
      setError('Failed to refresh user data');
    }
  }, [user, isPremium, isAdmin, refreshPremiumStatus, refreshAdminStatus]);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
    console.log('UnifiedAuthContext: Starting FAST initialization');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, !!session);
        
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Set initialized immediately for faster UX
        console.log('Setting isInitialized to true and isLoading to false IMMEDIATELY');
        setIsInitialized(true);
        setIsLoading(false);
        
        // Refresh user data if we have a user
        if (session?.user) {
          setTimeout(() => {
            if (isMounted) {
              refreshUserData();
            }
          }, 0);
        } else {
          setUnifiedUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!isMounted) return;
      console.log('Existing session check:', !!existingSession);
      // Auth state change will handle this
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [refreshUserData]);

  // Auto-refresh when auth status changes
  useEffect(() => {
    if (user && isInitialized) {
      console.log('Auth status changed, refreshing user data');
      refreshUserData();
    }
  }, [isPremium, isAdmin, user, isInitialized, refreshUserData]);

  const hasRole = useCallback((role: UserRole): boolean => {
    return unifiedUser?.role === role || unifiedUser?.role === 'admin';
  }, [unifiedUser]);

  const canAccess = useCallback((feature: string): boolean => {
    if (!unifiedUser) return false;
    
    switch (feature) {
      case 'premium_features':
        return unifiedUser.hasPremiumAccess || unifiedUser.hasAdminAccess;
      case 'admin_panel':
        return unifiedUser.hasAdminAccess;
      case 'dhl_features':
        return unifiedUser.isDHLEmployee || unifiedUser.hasAdminAccess;
      case 'dhl_admin':
        return unifiedUser.role === 'dhl_admin' || unifiedUser.hasAdminAccess;
      default:
        return true;
    }
  }, [unifiedUser]);

  const contextValue: UnifiedAuthContextType = {
    user,
    session,
    unifiedUser,
    isLoading,
    isInitialized,
    error,
    // Authentication methods
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    // Other methods
    refreshUserData,
    refreshPremiumStatus,
    hasRole,
    canAccess,
  };

  console.log('UnifiedAuthContext state:', {
    isLoading,
    isInitialized,
    user: !!user,
    unifiedUser: !!unifiedUser
  });

  return (
    <UnifiedAuthContext.Provider value={contextValue}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (context === undefined) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};
