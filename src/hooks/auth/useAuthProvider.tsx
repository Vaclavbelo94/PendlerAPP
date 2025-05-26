
import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthContext } from './useAuthContext';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { useAuthStatus } from './useAuthStatus';
import { usePremiumStatus } from '../usePremiumStatus';
import { saveUserToLocalStorage } from '@/utils/authUtils';
import LoadingSpinner from '@/components/LoadingSpinner';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, isLoading } = useAuthState();
  const { isAdmin, isPremium: statusIsPremium, setIsAdmin, setIsPremium, refreshAdminStatus, refreshPremiumStatus } = 
    useAuthStatus(user?.id);
  const { signIn: authSignIn, signInWithGoogle: authSignInWithGoogle, signUp: authSignUp, signOut: authSignOut } = useAuthMethods();
  
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  const premiumStatus = usePremiumStatus(user, refreshPremiumStatus, isAdmin);

  // Simplified initialization effect
  React.useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      if (!user || isInitialized) return;
      
      try {
        // Handle admin status for special email
        if (user.email === 'admin@pendlerapp.com') {
          setIsAdmin(true);
          localStorage.setItem('adminLoggedIn', 'true');
        } else {
          await refreshAdminStatus();
        }
        
        // Handle premium status
        const { isPremium, premiumExpiry } = await refreshPremiumStatus();
        
        // Special users handling
        if (user.email === 'uzivatel@pendlerapp.com' || user.email === 'admin@pendlerapp.com' || user.email === 'vbelo@pendlerapp.com') {
          setIsPremium(true);
          const threeMonthsLater = new Date();
          threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
          saveUserToLocalStorage(user, true, threeMonthsLater.toISOString());
        } else {
          setIsPremium(isPremium);
          saveUserToLocalStorage(user, isPremium, premiumExpiry);
        }
        
        if (isMounted) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };
    
    if (user && !isLoading) {
      initializeAuth();
    } else if (!user && !isLoading) {
      setIsInitialized(true);
    }
    
    return () => {
      isMounted = false;
    };
  }, [user, isLoading]);

  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    
    if (!result.error && email === 'admin@pendlerapp.com') {
      setIsAdmin(true);
      localStorage.setItem('adminLoggedIn', 'true');
    }
    
    return result;
  };

  const signInWithGoogle = async () => {
    const result = await authSignInWithGoogle();
    return result;
  };

  const signUp = async (email: string, password: string, username?: string) => {
    const { error, user: newUser } = await authSignUp(email, password, username);
    
    if (!error && newUser) {
      // Initialize user data after signup
      setTimeout(() => {
        setIsInitialized(false); // Trigger re-initialization
      }, 100);
    }
    
    return { error };
  };

  const signOut = async () => {
    await authSignOut();
    setIsAdmin(false);
    setIsPremium(false);
    setIsInitialized(false);
    localStorage.removeItem('adminLoggedIn');
  };

  const enhancedRefreshAdminStatus = async () => {
    if (user?.email === 'admin@pendlerapp.com') {
      setIsAdmin(true);
      localStorage.setItem('adminLoggedIn', 'true');
      return;
    }
    
    await refreshAdminStatus();
  };

  const enhancedRefreshPremiumStatus = async () => {
    if (!user) return { isPremium: false };
    
    const result = await refreshPremiumStatus();
    saveUserToLocalStorage(user, result.isPremium, result.premiumExpiry);
    
    return result;
  };

  // Show loading only if auth is still loading or we haven't initialized
  if (isLoading || (!isInitialized && user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const value = {
    user,
    session,
    isLoading: false,
    isAdmin,
    isPremium: statusIsPremium,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    refreshAdminStatus: enhancedRefreshAdminStatus,
    refreshPremiumStatus: enhancedRefreshPremiumStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
