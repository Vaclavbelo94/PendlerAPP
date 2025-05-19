
import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { useAuthStatus } from './useAuthStatus';
import { usePremiumStatus } from './usePremiumStatus';
import { saveUserToLocalStorage } from '@/utils/authUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  signIn: (email: string, password: string) => Promise<{error: any}>;
  signInWithGoogle: () => Promise<{error: any, url?: string}>;
  signUp: (email: string, password: string, username?: string) => Promise<{error: any}>;
  signOut: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
  refreshPremiumStatus: () => Promise<{ isPremium: boolean; premiumExpiry?: string }>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, isLoading } = useAuthState();
  const { isAdmin, isPremium: statusIsPremium, setIsAdmin, setIsPremium, refreshAdminStatus, refreshPremiumStatus } = 
    useAuthStatus(user?.id);
  const { signIn: authSignIn, signInWithGoogle: authSignInWithGoogle, signUp: authSignUp, signOut: authSignOut } = useAuthMethods();
  
  const [isCheckingStatus, setIsCheckingStatus] = React.useState(false);
  
  const premiumStatus = usePremiumStatus(user, refreshPremiumStatus, isAdmin);

  // Check premium status when user changes
  React.useEffect(() => {
    let isMounted = true;
    
    const checkPremiumStatus = async () => {
      if (!user) return;
      
      setIsCheckingStatus(true);
      try {
        // Special user check
        if (user.email === 'uzivatel@pendlerapp.com') {
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
      if (newUser.email === 'uzivatel@pendlerapp.com') {
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
    refreshAdminStatus,
    refreshPremiumStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
