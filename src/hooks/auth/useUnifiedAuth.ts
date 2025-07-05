
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { isDHLEmployee as checkIsDHLEmployee, isDHLEmployeeSync } from '@/utils/dhlAuthUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContextType, UnifiedUser } from '@/types/auth';
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
  
  // DHL-specific state
  const [isDHLEmployee, setIsDHLEmployee] = useState<boolean>(false);
  const [isDHLCheckComplete, setIsDHLCheckComplete] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  
  // Navigation
  const navigate = useNavigate();
  const location = useLocation();
  
  // External hooks
  const { userAssignment, isLoading: isDHLDataLoading } = useDHLData(user?.id);
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
  
  // Load profile data and check DHL status
  useEffect(() => {
    const loadProfileAndCheckDHL = async () => {
      if (!user?.id) {
        setIsProfileLoading(false);
        setIsDHLCheckComplete(true);
        setProfileData(null);
        setIsDHLEmployee(false);
        return;
      }

      try {
        console.log('Unified Auth: Loading profile and checking DHL status for user:', user.email);
        
        // Load profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('is_dhl_employee, is_premium, is_admin')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Unified Auth: Error loading profile data:', error);
        } else if (data) {
          setProfileData(data);
          
          // Update user metadata with profile data for sync functions
          if (data.is_dhl_employee && user.user_metadata) {
            user.user_metadata.is_dhl_employee = data.is_dhl_employee;
          }
        }

        // Perform comprehensive DHL check (async)
        const dhlStatus = await checkIsDHLEmployee(user);
        setIsDHLEmployee(dhlStatus);
        
        console.log('Unified Auth: DHL check complete', {
          userId: user.id,
          email: user.email,
          profileFlag: data?.is_dhl_employee,
          finalDHLStatus: dhlStatus
        });

      } catch (error) {
        console.error('Unified Auth: Error in loadProfileAndCheckDHL:', error);
      } finally {
        setIsProfileLoading(false);
        setIsDHLCheckComplete(true);
      }
    };

    loadProfileAndCheckDHL();
  }, [user?.id]);

  // Handle DHL user redirection
  useEffect(() => {
    if (isLoading || isDHLDataLoading || isProfileLoading || !isDHLCheckComplete) {
      console.log('Unified Auth: Waiting for data to load...');
      return;
    }
    
    if (!user) return;

    // Skip redirection if already on DHL setup page
    if (location.pathname === '/dhl-setup') return;

    console.log('Unified Auth Check:', {
      isDHLEmployee,
      hasAssignment: !!userAssignment,
      currentPath: location.pathname,
      profileData
    });

    // If DHL user without assignment, redirect to setup
    if (isDHLEmployee && !userAssignment) {
      console.log('Unified Auth: Redirecting DHL user to setup page');
      navigate('/dhl-setup');
    }
  }, [
    user, 
    userAssignment, 
    isLoading, 
    isDHLDataLoading, 
    isProfileLoading,
    isDHLCheckComplete,
    isDHLEmployee,
    location.pathname, 
    navigate,
    profileData
  ]);

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
      
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      return { error: errorMessage };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
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

  const signUp = useCallback(async (email: string, password: string, username?: string, promoCode?: string) => {
    try {
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
      return { error: errorMessage, user: null };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfileData(null);
      setIsDHLEmployee(false);
    } catch (err) {
      console.error('Unified Auth: Sign out error:', err);
    }
  }, []);

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

  // Create unified user object
  const unifiedUser: UnifiedUser | null = user ? createUnifiedUser(
    user,
    isPremium || isDHLEmployee, // DHL employees get premium
    isAdmin,
    undefined, // premiumExpiry - could be enhanced later
    !!userAssignment
  ) : null;

  // Computed loading state
  const totalIsLoading = isLoading || isDHLDataLoading || isProfileLoading || !isDHLCheckComplete;

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
