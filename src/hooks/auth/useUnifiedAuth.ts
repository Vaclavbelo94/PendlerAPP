
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedDHLAuth } from './useOptimizedDHLAuth';
import { isDHLEmployeeSync } from '@/utils/dhlAuthUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContextType, UnifiedUser, UserRole, UserStatus } from '@/types/auth';
import { createUnifiedUser } from '@/utils/authRoleUtils';
import { useAuthStatus } from '@/hooks/useAuthStatus';

/**
 * Unified authentication hook that combines all auth functionality
 * Includes DHL detection, profile management, and navigation logic
 */
export const useUnifiedAuth = () => {
  // Core auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Navigation
  const navigate = useNavigate();
  const location = useLocation();
  
  // External hooks - optimized versions
  const { 
    isDHLEmployee, 
    profileData, 
    userAssignment, 
    isLoading: isDHLAuthLoading,
    isInitialized: isDHLAuthInitialized
  } = useOptimizedDHLAuth(user);
  const { isAdmin, isPremium, refreshAdminStatus, refreshPremiumStatus } = useAuthStatus(user?.id);
  
  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    let authListenerUnsubscribe: (() => void) | null = null;
    
    const initialize = async () => {
      try {
        console.log('Unified Auth: Starting initialization');
        
        // Set up auth state listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Unified Auth: Auth state change:', event, session?.user?.email || 'no user');
            
            if (isMounted) {
              setSession(session);
              setUser(session?.user ?? null);
              setIsLoading(false);
              setIsInitialized(true);
            }
          }
        );
        
        // Store the unsubscribe function
        authListenerUnsubscribe = () => authListener.subscription.unsubscribe();
        
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Unified Auth: Error getting session:', error);
        }
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Unified Auth: Initialization error:', error);
        if (isMounted) {
          setIsLoading(false);
          setIsInitialized(true);
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
  
  // DHL auth is now handled by useOptimizedDHLAuth hook - no separate effect needed

  // Handle DHL user redirection - DISABLED - používáme dashboard notification místo
  useEffect(() => {
    // DHL setup je nyní řešen přes dashboard notification
    // Žádné automatické přesměrování
    console.log('Unified Auth: DHL redirection disabled, using dashboard notification');
  }, []);

  // Auth methods
  const signIn = useCallback(async (email: string, password: string) => {
    try {
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
      // Get current language from i18n
      const currentLanguage = document.documentElement.lang || 'cs';
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: username || email.split('@')[0],
            promo_code: promoCode,
            company: company,
            language: currentLanguage
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
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      
      // Přesměrovat na úvodní stránku
      navigate('/');
    } catch (err) {
      console.error('Unified Auth: Sign out error:', err);
    }
  }, [navigate]);

  const refreshUserStatus = useCallback(async () => {
    if (!user?.id) return;
    
    console.log('Unified Auth: Manual refresh user status called');
    
    try {
      const [premiumResult] = await Promise.all([
        refreshPremiumStatus(),
        refreshAdminStatus()
      ]);
      
      console.log('Unified Auth: User status refreshed');
      return premiumResult;
    } catch (err) {
      console.error('Unified Auth: Error refreshing user status:', err);
    }
  }, [user, refreshPremiumStatus, refreshAdminStatus]);

  // Create unified user object with company information
  const unifiedUser: UnifiedUser | null = user ? {
    id: user.id,
    email: user.email || '',
    role: UserRole.STANDARD,
    status: UserStatus.ACTIVE,
    isPremium: isPremium || isDHLEmployee,
    isAdmin,
    isDHLEmployee,
    isAdeccoEmployee: profileData?.company === 'adecco',
    isRandstadEmployee: profileData?.company === 'randstad',
    isDHLAdmin: false,
    company: profileData?.company,
    setupRequired: false
  } : null;

  // Computed loading state - základní auth loading, DHL auth je optional pro rychlejší loading
  const totalIsLoading = isLoading || !isInitialized;

  return {
    // Core auth state
    user,
    session,
    unifiedUser,
    isLoading: totalIsLoading,
    isInitialized,
    
    // Status flags
    isPremium: isPremium || isDHLEmployee, // DHL employees get premium
    isAdmin,
    isDHLEmployee,
    
    // DHL-specific data
    userAssignment,
    profileData,
    isDHLEmployeeSync: user ? isDHLEmployeeSync(user) : false,
    
    // Auth methods
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    refreshUserStatus,
    refreshAdminStatus,
    refreshPremiumStatus,
    
    // Role checking methods (for compatibility)
    hasRole: (role: any) => {
      // Simple role checking logic
      return false; // Can be enhanced based on needs
    },
    canAccess: (requiredRole: any) => {
      // Simple access checking logic
      return true; // Can be enhanced based on needs
    },
  };
};
