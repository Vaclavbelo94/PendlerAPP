import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, UnifiedUser, UserRole } from '@/types/auth';
import { roleManager, AuthData } from '@/services/RoleManager';
import { useIsMobile } from '@/hooks/use-mobile';
import { revenueCatService } from '@/services/revenueCat';

interface OptimizedAuthState {
  user: User | null;
  session: Session | null;
  unifiedUser: UnifiedUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  authData: AuthData | null;
}

/**
 * Optimized authentication hook that centralizes all auth logic
 * Features:
 * - Fast sync role detection for immediate UI updates
 * - Background async loading for precise data
 * - Intelligent caching to minimize API calls
 * - Batch loading of all user data
 * - Optimistic UI updates
 */
export const useOptimizedAuth = (): AuthContextType => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [state, setState] = useState<OptimizedAuthState>({
    user: null,
    session: null,
    unifiedUser: null,
    isLoading: true,
    isInitialized: false,
    authData: null
  });

  // Memoized quick roles for immediate UI feedback
  const quickRoles = useMemo(() => {
    return roleManager.getQuickRoles(state.user);
  }, [state.user?.id, state.user?.email]);

  // Initialize auth state and listeners
  useEffect(() => {
    let isMounted = true;
    let authListenerUnsubscribe: (() => void) | null = null;

    const initialize = async () => {
      try {
        console.log('OptimizedAuth: Starting initialization');

        // Set up auth state listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('OptimizedAuth: Auth state change:', event, session?.user?.email || 'no user');
            
            if (!isMounted) return;

            const user = session?.user ?? null;
            
            // Immediate state update for fast UI response
            setState(prev => ({
              ...prev,
              user,
              session,
              isLoading: false,
              isInitialized: true
            }));

            // Background data loading for logged-in users
            if (user && event === 'SIGNED_IN') {
              setTimeout(async () => {
                if (!isMounted) return;
                await loadUserData(user);
                
                // Sync RevenueCat on native platforms
                const platform = Capacitor.getPlatform();
                if (platform === 'android' || platform === 'ios') {
                  try {
                    await revenueCatService.loginUser(user.id);
                  } catch (error) {
                    console.error('RevenueCat login failed:', error);
                  }
                }
                
                // Handle admin redirect to mobile version
                handleAdminRedirect(user);
              }, 0);
            }

            // Clear data for logged-out users
            if (!user) {
              setState(prev => ({
                ...prev,
                unifiedUser: null,
                authData: null
              }));
              roleManager.clearCache();
            }
          }
        );

        authListenerUnsubscribe = () => authListener.subscription.unsubscribe();

        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('OptimizedAuth: Error getting session:', error);
        }

        if (isMounted) {
          const user = session?.user ?? null;
          
          setState(prev => ({
            ...prev,
            user,
            session,
            isLoading: false,
            isInitialized: true
          }));

          // Load user data if already logged in
          if (user) {
            await loadUserData(user);
            handleAdminRedirect(user);
          }
        }
      } catch (error) {
        console.error('OptimizedAuth: Initialization error:', error);
        if (isMounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            isInitialized: true
          }));
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
      if (authListenerUnsubscribe) {
        authListenerUnsubscribe();
      }
    };
  }, []);

  // Handle admin redirect to mobile version
  const handleAdminRedirect = useCallback((user: User) => {
    if (!isMobile) return;
    
    const currentPath = window.location.pathname;
    const isAdminPath = currentPath.includes('/admin');
    const isMobileAdminPath = currentPath.includes('/admin/mobile');
    
    // If on desktop admin path and user is on mobile, redirect to mobile admin
    if (isAdminPath && !isMobileAdminPath) {
      // Check if user has admin permissions
      const quickRoles = roleManager.getQuickRoles(user);
      if (quickRoles.isAdmin) {
        navigate('/admin/mobile', { replace: true });
      }
    }
  }, [isMobile, navigate]);

  const loadUserData = useCallback(async (user: User) => {
    try {
      console.log('OptimizedAuth: Loading user data for:', user.email);
      
      const authData = await roleManager.loadUserData(user.id);
      const quickRolesForUser = roleManager.getQuickRoles(user);
      const unifiedUser = roleManager.createUnifiedUser(user, authData, quickRolesForUser);

      setState(prev => ({
        ...prev,
        unifiedUser,
        authData
      }));

      console.log('OptimizedAuth: User data loaded:', {
        userId: user.id,
        email: user.email,
        role: unifiedUser.role,
        isPremium: unifiedUser.isPremium,
        isAdmin: unifiedUser.isAdmin,
        isDHLEmployee: unifiedUser.isDHLEmployee
      });
    } catch (error) {
      console.error('OptimizedAuth: Failed to load user data:', error);
    }
  }, []);

  // Authentication methods
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // Clear any existing state first
      roleManager.clearCache();
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error: error.message };
      }
      
      // Set fresh login flag for post-login loading animation
      sessionStorage.setItem('freshLogin', 'true');
      
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      return { error: errorMessage };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      roleManager.clearCache();
      
      // Set fresh login flag for post-login loading animation
      sessionStorage.setItem('freshLogin', 'true');
      
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
      return { error: errorMessage };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, username?: string, promoCode?: string, company?: string) => {
    try {
      roleManager.clearCache();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: username || email.split('@')[0],
            promo_code: promoCode,
            company: company
          }
        }
      });
      
      if (error) {
        return { error: error.message, user: null };
      }
      
      return { error: null, user: data.user };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      return { error: errorMessage, user: null };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      roleManager.clearCache();
      
      // Logout from RevenueCat on native platforms
      const platform = Capacitor.getPlatform();
      if (platform === 'android' || platform === 'ios') {
        try {
          await revenueCatService.logoutUser();
        } catch (error) {
          console.error('RevenueCat logout failed:', error);
        }
      }
      
      await supabase.auth.signOut();
      
      // Clear local state
      setState(prev => ({
        ...prev,
        user: null,
        session: null,
        unifiedUser: null,
        authData: null
      }));
      
      navigate('/');
    } catch (err) {
      console.error('OptimizedAuth: Sign out error:', err);
    }
  }, [navigate]);

  // Status refresh methods
  const refreshUserStatus = useCallback(async () => {
    if (!state.user?.id) return;
    
    console.log('OptimizedAuth: Refreshing user status');
    roleManager.clearUserCache(state.user.id);
    await loadUserData(state.user);
  }, [state.user, loadUserData]);

  const refreshAdminStatus = useCallback(async () => {
    if (!state.user?.id) return;
    roleManager.clearUserCache(state.user.id);
    await loadUserData(state.user);
  }, [state.user, loadUserData]);

  const refreshPremiumStatus = useCallback(async () => {
    if (!state.user?.id) return { isPremium: false };
    
    roleManager.clearUserCache(state.user.id);
    await loadUserData(state.user);
    
    return {
      isPremium: state.unifiedUser?.isPremium || false,
      premiumExpiry: state.unifiedUser?.premiumExpiry
    };
  }, [state.user, state.unifiedUser, loadUserData]);

  // Role checking methods
  const hasRole = useCallback((role: UserRole): boolean => {
    return roleManager.hasRole(state.unifiedUser, role);
  }, [state.unifiedUser]);

  const canAccess = useCallback((requiredRole: UserRole): boolean => {
    return roleManager.canAccess(state.unifiedUser, requiredRole);
  }, [state.unifiedUser]);

  // Return unified auth interface with optimized data
  return {
    // Core auth state
    user: state.user,
    session: state.session,
    unifiedUser: state.unifiedUser,
    isLoading: state.isLoading,
    
    // Quick access flags (from quick roles for immediate UI)
    isPremium: state.unifiedUser?.isPremium ?? quickRoles.isPremium,
    isAdmin: state.unifiedUser?.isAdmin ?? quickRoles.isAdmin,
    
    // Authentication methods
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    
    // Status refresh methods
    refreshUserStatus,
    refreshAdminStatus,
    refreshPremiumStatus,
    
    // Role checking methods
    hasRole,
    canAccess,
    
    // Error state (can be enhanced)
    error: null
  };
};