
import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthContext } from './useAuthContext';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { useAuthStatus } from './useAuthStatus';
import { usePremiumStatus } from '../usePremiumStatus';
import { saveUserToLocalStorage } from '@/utils/authUtils';
import { toast } from 'sonner';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, isLoading } = useAuthState();
  const { isAdmin, isPremium: statusIsPremium, setIsAdmin, setIsPremium, refreshAdminStatus, refreshPremiumStatus } = 
    useAuthStatus(user?.id);
  const { signIn: authSignIn, signInWithGoogle: authSignInWithGoogle, signUp: authSignUp, signOut: authSignOut } = useAuthMethods();
  
  const [isCheckingStatus, setIsCheckingStatus] = React.useState(false);
  
  const premiumStatus = usePremiumStatus(user, refreshPremiumStatus, isAdmin);

  // Debug output to check admin status
  React.useEffect(() => {
    console.log("AuthProvider - Current admin status:", isAdmin);
    console.log("AuthProvider - Current user:", user?.email);
    
    // Check if the user is admin@pendlerapp.com
    if (user?.email === 'admin@pendlerapp.com') {
      console.log("This is the admin@pendlerapp.com user!");
    }
    
    if (user) {
      // Force refresh admin status on mount
      setTimeout(() => {
        refreshAdminStatus().then(() => {
          console.log("Admin status refreshed:", isAdmin);
        });
      }, 0);
    }
  }, [user, isAdmin, refreshAdminStatus]);

  // Check premium status when user changes
  React.useEffect(() => {
    let isMounted = true;
    
    const checkPremiumStatus = async () => {
      if (!user) return;
      
      setIsCheckingStatus(true);
      try {
        // Special user check for automatic premium
        if (user.email === 'uzivatel@pendlerapp.com' || user.email === 'admin@pendlerapp.com') {
          console.log("Special user detected in initial premium check");
          setIsPremium(true);
          
          // Calculate expiry date (3 months)
          const threeMonthsLater = new Date();
          threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
          
          // Save to localStorage
          saveUserToLocalStorage(user, true, threeMonthsLater.toISOString());
        } else {
          await refreshAdminStatus();
          const { isPremium, premiumExpiry } = await refreshPremiumStatus();
          if (isPremium && user) {
            saveUserToLocalStorage(user, isPremium, premiumExpiry);
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
    
    if (user && !isCheckingStatus) {
      setTimeout(checkPremiumStatus, 0);
    }
    
    return () => {
      isMounted = false;
    };
  }, [user, refreshAdminStatus, refreshPremiumStatus, setIsPremium]);

  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    
    if (!result.error && email === 'admin@pendlerapp.com') {
      console.log("Admin user logged in, refreshing status");
      // Force refresh admin status after login
      setTimeout(async () => {
        await refreshAdminStatus();
        toast.success("Přihlášení administrátora úspěšné");
      }, 500);
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
      // Check if this is our special user
      if (newUser.email === 'uzivatel@pendlerapp.com' || newUser.email === 'admin@pendlerapp.com') {
        console.log("Special user signed up");
        setIsPremium(true);
        
        // Calculate expiry date (3 months)
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
        
        saveUserToLocalStorage(newUser, true, threeMonthsLater.toISOString());
      } else {
        // Load profile after a small delay
        setTimeout(() => {
          refreshAdminStatus();
          refreshPremiumStatus().then(({ isPremium, premiumExpiry }) => {
            if (isPremium && newUser) {
              saveUserToLocalStorage(newUser, isPremium, premiumExpiry);
            } else if (newUser) {
              saveUserToLocalStorage(newUser, false);
            }
          });
        }, 0);
      }
    }
    
    return { error };
  };

  const signOut = async () => {
    await authSignOut();
    // Force reset state
    setIsAdmin(false);
    setIsPremium(false);
  };

  // Custom refreshAdminStatus function that actively checks and logs the result
  const enhancedRefreshAdminStatus = async () => {
    console.log("Manually refreshing admin status for user:", user?.id);
    await refreshAdminStatus();
    console.log("Admin status after refresh:", isAdmin);
    
    // For admin@pendlerapp.com, set admin status manually if needed
    if (user?.email === 'admin@pendlerapp.com' && !isAdmin) {
      console.log("Forcing admin status for admin@pendlerapp.com");
      setIsAdmin(true);
      localStorage.setItem('adminLoggedIn', 'true');
    }
  };

  // Combine premium status from all sources
  const combinedIsPremium = statusIsPremium || 
    premiumStatus.isPremium || 
    premiumStatus.getPremiumStatusFromLocalStorage() || 
    premiumStatus.isSpecialUser();

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    isPremium: combinedIsPremium,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    refreshAdminStatus: enhancedRefreshAdminStatus,
    refreshPremiumStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
