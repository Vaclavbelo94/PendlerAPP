import * as React from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from './useAuthContext';
import { AuthError, UserRole, UnifiedUser, AuthProviderProps } from '@/types/auth';
import { createUnifiedUser, getRedirectPath, hasRole, canAccess } from '@/utils/authRoleUtils';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';
import { activatePromoCode } from '@/services/promoCodeService';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [unifiedUser, setUnifiedUser] = React.useState<UnifiedUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isPremium, setIsPremium] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [error, setError] = React.useState<AuthError | null>(null);

  // Memoized DHL check with enhanced caching
  const isDHLUser = React.useMemo(() => {
    if (!user?.email) return false;
    
    // Cache the result to prevent repeated calculations
    const cacheKey = `dhl_check_${user.email}`;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached !== null) {
      return cached === 'true';
    }
    
    const result = isDHLEmployee(user);
    sessionStorage.setItem(cacheKey, result.toString());
    return result;
  }, [user?.email]);

  // Enhanced premium status check with aggressive debouncing
  const checkPremiumStatus = React.useCallback(async (userId: string, email: string) => {
    // Prevent duplicate calls with a lock mechanism
    const lockKey = `premium_check_${userId}`;
    if (sessionStorage.getItem(lockKey)) return { isPremium: false };
    
    sessionStorage.setItem(lockKey, 'true');
    
    try {
      console.log('Premium status check:', { email, isDHL: isDHLUser, userId });
      
      // Special users get premium automatically
      const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com'];
      const isSpecialUser = specialEmails.includes(email);
      
      if (isSpecialUser) {
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
        
        setIsPremium(true);
        
        await supabase
          .from('profiles')
          .update({ 
            is_premium: true,
            premium_expiry: threeMonthsLater.toISOString()
          })
          .eq('id', userId);
          
        return { isPremium: true, premiumExpiry: threeMonthsLater.toISOString() };
      }
      
      // DHL employees get premium automatically
      if (isDHLUser) {
        console.log('Activating premium for DHL employee:', email);
        
        const oneYearLater = new Date();
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
        
        setIsPremium(true);
        
        await supabase
          .from('profiles')
          .update({ 
            is_premium: true,
            premium_expiry: oneYearLater.toISOString()
          })
          .eq('id', userId);
          
        return { isPremium: true, premiumExpiry: oneYearLater.toISOString() };
      }
      
      // For all other users, check their premium status
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium, premium_expiry')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      const isPremiumActive = data.is_premium && 
        (!data.premium_expiry || new Date(data.premium_expiry) > new Date());
        
      setIsPremium(isPremiumActive);
      
      return {
        isPremium: isPremiumActive,
        premiumExpiry: data.premium_expiry
      };
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
      return { isPremium: false };
    } finally {
      // Remove lock after a delay
      setTimeout(() => {
        sessionStorage.removeItem(lockKey);
      }, 2000);
    }
  }, [isDHLUser]);

  // Enhanced admin status check with caching
  const checkAdminStatus = React.useCallback(async (userId: string) => {
    const lockKey = `admin_check_${userId}`;
    if (sessionStorage.getItem(lockKey)) return false;
    
    sessionStorage.setItem(lockKey, 'true');
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      const adminStatus = data.is_admin || false;
      setIsAdmin(adminStatus);
      localStorage.setItem('adminLoggedIn', adminStatus ? 'true' : 'false');
      
      return adminStatus;
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    } finally {
      setTimeout(() => {
        sessionStorage.removeItem(lockKey);
      }, 2000);
    }
  }, []);

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
    let statusCheckTimeout: NodeJS.Timeout;
    let subscription: any;

    const initialize = async () => {
      try {
        // Set up auth state listener first
        const { data } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth state change:', event, session?.user?.email);
            
            if (isMounted) {
              setSession(session);
              setUser(session?.user ?? null);
              setIsLoading(false);
              setError(null);

              if (event === 'SIGNED_IN' && session?.user) {
                // Clear any existing timeout
                if (statusCheckTimeout) {
                  clearTimeout(statusCheckTimeout);
                }
                
                // Aggressive debouncing - only check once every 3 seconds
                statusCheckTimeout = setTimeout(() => {
                  if (isMounted && !sessionStorage.getItem(`status_check_${session.user.id}`)) {
                    sessionStorage.setItem(`status_check_${session.user.id}`, 'true');
                    Promise.all([
                      checkAdminStatus(session.user.id),
                      checkPremiumStatus(session.user.id, session.user.email || '')
                    ]).catch(console.error).finally(() => {
                      // Clear the lock after 5 seconds
                      setTimeout(() => {
                        sessionStorage.removeItem(`status_check_${session.user.id}`);
                      }, 5000);
                    });
                  }
                }, 3000);
              }

              if (event === 'SIGNED_OUT') {
                setIsAdmin(false);
                setIsPremium(false);
                setUnifiedUser(null);
                localStorage.removeItem('adminLoggedIn');
                // Clear all session locks
                Object.keys(sessionStorage).forEach(key => {
                  if (key.includes('_check_') || key.includes('dhl_check_')) {
                    sessionStorage.removeItem(key);
                  }
                });
              }
            }
          }
        );

        subscription = data.subscription;

        // Then check for existing session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (isMounted) {
            setError({ message: sessionError.message, code: sessionError.name });
          }
        }
        
        if (isMounted) {
          setSession(sessionData.session);
          setUser(sessionData.session?.user ?? null);
          setIsLoading(false);
          
          // Check status for existing session with enhanced debouncing
          if (sessionData.session?.user && !sessionStorage.getItem(`status_check_${sessionData.session.user.id}`)) {
            sessionStorage.setItem(`status_check_${sessionData.session.user.id}`, 'true');
            statusCheckTimeout = setTimeout(() => {
              if (isMounted) {
                Promise.all([
                  checkAdminStatus(sessionData.session.user.id),
                  checkPremiumStatus(sessionData.session.user.id, sessionData.session.user.email || '')
                ]).catch(console.error).finally(() => {
                  setTimeout(() => {
                    sessionStorage.removeItem(`status_check_${sessionData.session.user.id}`);
                  }, 5000);
                });
              }
            }, 3000);
          }
        }
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
      if (statusCheckTimeout) {
        clearTimeout(statusCheckTimeout);
      }
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [checkAdminStatus, checkPremiumStatus]);

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
      localStorage.removeItem('adminLoggedIn');
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      setError({ message: 'Chyba při odhlášení' });
    }
  };

  const refreshUserStatus = async () => {
    if (user) {
      await Promise.all([
        checkAdminStatus(user.id),
        checkPremiumStatus(user.id, user.email || '')
      ]);
    }
  };

  const refreshAdminStatus = async () => {
    if (user) {
      await checkAdminStatus(user.id);
    }
  };

  const refreshPremiumStatus = async () => {
    if (user) {
      return await checkPremiumStatus(user.id, user.email || '');
    }
    return { isPremium: false };
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
    isPremium,
    isAdmin,
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
