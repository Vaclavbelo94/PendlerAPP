
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'standard' | 'premium' | 'dhl_employee' | 'dhl_admin' | 'admin';
export type UserStatus = 'active' | 'pending_setup' | 'suspended';

export interface UnifiedUser {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  displayName?: string;
  isDHLUser: boolean;
  hasAdminAccess: boolean;
  hasPremiumAccess: boolean;
  metadata?: Record<string, any>;
}

interface UnifiedAuthState {
  user: User | null;
  session: Session | null;
  unifiedUser: UnifiedUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface UnifiedAuthContextType extends UnifiedAuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  canAccess: (feature: string) => boolean;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | null>(null);

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within UnifiedAuthProvider');
  }
  return context;
};

export const UnifiedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UnifiedAuthState>({
    user: null,
    session: null,
    unifiedUser: null,
    isLoading: true,
    isInitialized: false,
    error: null
  });

  // Optimized role determination
  const determineUserRole = useCallback((user: User, profileData?: any): UserRole => {
    if (!user.email) return 'standard';
    
    const email = user.email.toLowerCase();
    
    // Special admin users
    const adminEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com'];
    if (adminEmails.includes(email)) return 'admin';
    
    // DHL admin detection
    if (email.includes('admin_dhl') || email === 'admin_dhl@pendlerapp.com') return 'dhl_admin';
    
    // DHL employee detection (simplified)
    if (email.includes('dhl.') || email.includes('@dhl') || email.endsWith('dhl.com')) {
      return 'dhl_employee';
    }
    
    // Premium users (from database or special emails)
    if (profileData?.is_premium || email === 'zkouska@gmail.com') return 'premium';
    
    return 'standard';
  }, []);

  // Create unified user object
  const createUnifiedUser = useCallback((user: User, profileData?: any): UnifiedUser => {
    const role = determineUserRole(user, profileData);
    const isDHLUser = role === 'dhl_employee' || role === 'dhl_admin';
    
    return {
      id: user.id,
      email: user.email || '',
      role,
      status: 'active', // Can be enhanced based on setup requirements
      displayName: profileData?.username || user.email?.split('@')[0],
      isDHLUser,
      hasAdminAccess: role === 'admin' || role === 'dhl_admin',
      hasPremiumAccess: role !== 'standard',
      metadata: user.user_metadata
    };
  }, [determineUserRole]);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Not found is ok
        console.warn('Profile fetch error:', error);
      }
      
      return data;
    } catch (err) {
      console.warn('Profile fetch exception:', err);
      return null;
    }
  }, []);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      if (session?.user) {
        // Fetch profile data
        const profileData = await fetchUserProfile(session.user.id);
        const unifiedUser = createUnifiedUser(session.user, profileData);
        
        setState(prev => ({
          ...prev,
          user: session.user,
          session,
          unifiedUser,
          isLoading: false,
          isInitialized: true
        }));
      } else {
        setState(prev => ({
          ...prev,
          user: null,
          session: null,
          unifiedUser: null,
          isLoading: false,
          isInitialized: true
        }));
      }
    } catch (error: any) {
      console.error('Auth initialization error:', error);
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
        isInitialized: true
      }));
    }
  }, [fetchUserProfile, createUnifiedUser]);

  // Auth state change handler (optimized to prevent flickering)
  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    console.log('Auth state change:', event, session?.user?.email);
    
    if (event === 'SIGNED_OUT' || !session) {
      setState(prev => ({
        ...prev,
        user: null,
        session: null,
        unifiedUser: null,
        isLoading: false
      }));
      return;
    }

    if (event === 'SIGNED_IN' && session?.user) {
      // Defer profile fetching to prevent race conditions
      setTimeout(async () => {
        try {
          const profileData = await fetchUserProfile(session.user.id);
          const unifiedUser = createUnifiedUser(session.user, profileData);
          
          setState(prev => ({
            ...prev,
            user: session.user,
            session,
            unifiedUser,
            isLoading: false,
            error: null
          }));
        } catch (err: any) {
          console.error('Profile update error:', err);
          setState(prev => ({
            ...prev,
            error: err.message,
            isLoading: false
          }));
        }
      }, 100);
    }
  }, [fetchUserProfile, createUnifiedUser]);

  // Set up auth listener
  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    
    // Initialize auth state
    if (mounted) {
      initializeAuth();
    }
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange, initializeAuth]);

  // Auth methods
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message, isLoading: false }));
        return { error: error.message };
      }
      
      return { error: null };
    } catch (err: any) {
      const errorMsg = err.message || 'Sign in failed';
      setState(prev => ({ ...prev, error: errorMsg, isLoading: false }));
      return { error: errorMsg };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message, isLoading: false }));
        return { error: error.message };
      }
      
      return { error: null };
    } catch (err: any) {
      const errorMsg = err.message || 'Sign up failed';
      setState(prev => ({ ...prev, error: errorMsg, isLoading: false }));
      return { error: errorMsg };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    if (!state.user) return;
    
    try {
      const profileData = await fetchUserProfile(state.user.id);
      const unifiedUser = createUnifiedUser(state.user, profileData);
      
      setState(prev => ({
        ...prev,
        unifiedUser,
        error: null
      }));
    } catch (err: any) {
      console.error('Refresh user data error:', err);
      setState(prev => ({ ...prev, error: err.message }));
    }
  }, [state.user, fetchUserProfile, createUnifiedUser]);

  // Role checking methods
  const hasRole = useCallback((role: UserRole): boolean => {
    if (!state.unifiedUser) return false;
    
    // Admins have access to all roles
    if (state.unifiedUser.role === 'admin') return true;
    if (state.unifiedUser.role === 'dhl_admin' && (role === 'dhl_employee' || role === 'premium')) return true;
    
    return state.unifiedUser.role === role;
  }, [state.unifiedUser]);

  const canAccess = useCallback((feature: string): boolean => {
    if (!state.unifiedUser) return false;
    
    // Define feature access rules
    const accessRules: Record<string, UserRole[]> = {
      'premium_features': ['premium', 'dhl_employee', 'dhl_admin', 'admin'],
      'dhl_features': ['dhl_employee', 'dhl_admin', 'admin'],
      'admin_panel': ['admin', 'dhl_admin'],
      'dhl_admin': ['dhl_admin', 'admin']
    };
    
    const allowedRoles = accessRules[feature];
    if (!allowedRoles) return true; // If no rules defined, allow access
    
    return allowedRoles.includes(state.unifiedUser.role);
  }, [state.unifiedUser]);

  const contextValue: UnifiedAuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshUserData,
    hasRole,
    canAccess
  };

  return (
    <UnifiedAuthContext.Provider value={contextValue}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};
