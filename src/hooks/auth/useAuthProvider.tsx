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
  
  const [isCheckingStatus, setIsCheckingStatus] = React.useState(false);
  const [adminStatusLoaded, setAdminStatusLoaded] = React.useState(false);
  
  const premiumStatus = usePremiumStatus(user, refreshPremiumStatus, isAdmin);

  // Stabilní načítání admin statusu
  React.useEffect(() => {
    let isMounted = true;
    
    const loadAdminStatus = async () => {
      if (!user || adminStatusLoaded) return;
      
      try {
        // Pro admin@pendlerapp.com nastavíme admin status okamžitě
        if (user.email === 'admin@pendlerapp.com') {
          if (isMounted) {
            setIsAdmin(true);
            localStorage.setItem('adminLoggedIn', 'true');
            setAdminStatusLoaded(true);
          }
          return;
        }
        
        // Pro ostatní uživatele načteme z databáze
        await refreshAdminStatus();
        if (isMounted) {
          setAdminStatusLoaded(true);
        }
      } catch (error) {
        console.error('Error loading admin status:', error);
        if (isMounted) {
          setAdminStatusLoaded(true);
        }
      }
    };
    
    if (user && !isLoading) {
      loadAdminStatus();
    }
    
    return () => {
      isMounted = false;
    };
  }, [user, isLoading, adminStatusLoaded, refreshAdminStatus, setIsAdmin]);

  // Enhanced premium status check with loading optimization
  React.useEffect(() => {
    let isMounted = true;
    
    const checkPremiumStatus = async () => {
      if (!user || isCheckingStatus) return;
      
      setIsCheckingStatus(true);
      try {
        // Check localStorage first for immediate response
        const cachedUser = localStorage.getItem('currentUser');
        if (cachedUser) {
          const userData = JSON.parse(cachedUser);
          if (userData.isPremium && isMounted) {
            setIsPremium(true);
          }
        }

        // Then verify with database
        const { isPremium: dbPremium, premiumExpiry } = await refreshPremiumStatus();
        
        if (isMounted) {
          saveUserToLocalStorage(user, dbPremium, premiumExpiry);
          
          // Special user handling
          if (!dbPremium && (user.email === 'uzivatel@pendlerapp.com' || user.email === 'admin@pendlerapp.com' || user.email === 'vbelo@pendlerapp.com')) {
            setIsPremium(true);
            const threeMonthsLater = new Date();
            threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
            saveUserToLocalStorage(user, true, threeMonthsLater.toISOString());
          } else {
            setIsPremium(dbPremium);
          }
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      } finally {
        if (isMounted) {
          setIsCheckingStatus(false);
        }
      }
    };
    
    if (user && adminStatusLoaded) {
      checkPremiumStatus();
    }
    
    return () => {
      isMounted = false;
    };
  }, [user, adminStatusLoaded, refreshPremiumStatus, setIsPremium]);

  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    
    if (!result.error && email === 'admin@pendlerapp.com') {
      // Okamžitě nastavíme admin status pro admin uživatele
      setIsAdmin(true);
      localStorage.setItem('adminLoggedIn', 'true');
      setAdminStatusLoaded(true);
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
      // Load profile after a small delay
      setTimeout(() => {
        refreshAdminStatus().then(() => setAdminStatusLoaded(true));
        refreshPremiumStatus().then(({ isPremium, premiumExpiry }) => {
          if (isPremium && newUser) {
            saveUserToLocalStorage(newUser, isPremium, premiumExpiry);
          } else if (newUser) {
            saveUserToLocalStorage(newUser, false);
          }
        });
      }, 0);
    }
    
    return { error };
  };

  const signOut = async () => {
    await authSignOut();
    // Force reset state
    setIsAdmin(false);
    setIsPremium(false);
    setAdminStatusLoaded(false);
    localStorage.removeItem('adminLoggedIn');
  };

  const enhancedRefreshAdminStatus = async () => {
    if (user?.email === 'admin@pendlerapp.com') {
      setIsAdmin(true);
      localStorage.setItem('adminLoggedIn', 'true');
      setAdminStatusLoaded(true);
      return;
    }
    
    await refreshAdminStatus();
    setAdminStatusLoaded(true);
  };

  // Enhanced refresh premium status that updates localStorage
  const enhancedRefreshPremiumStatus = async () => {
    if (!user) return { isPremium: false };
    
    const result = await refreshPremiumStatus();
    
    // Vždy aktualizujeme localStorage s novými daty z databáze
    saveUserToLocalStorage(user, result.isPremium, result.premiumExpiry);
    
    return result;
  };

  // Combine premium status with database priority
  const combinedIsPremium = statusIsPremium;

  // Show loading spinner while initializing
  if (isLoading || !adminStatusLoaded || isCheckingStatus) {
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
    isPremium: combinedIsPremium,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    refreshAdminStatus: enhancedRefreshAdminStatus,
    refreshPremiumStatus: enhancedRefreshPremiumStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
