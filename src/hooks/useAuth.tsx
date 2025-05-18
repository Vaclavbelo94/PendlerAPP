
import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useAuthMethods } from './useAuthMethods';
import { useAuthStatus } from './useAuthStatus';
import { saveUserToLocalStorage } from '@/utils/authUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  signIn: (email: string, password: string) => Promise<{error: any}>;
  signUp: (email: string, password: string, username?: string) => Promise<{error: any}>;
  signOut: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
  refreshPremiumStatus: () => Promise<{ isPremium: boolean; premiumExpiry?: string }>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const { isAdmin, isPremium, setIsAdmin, setIsPremium, refreshAdminStatus, refreshPremiumStatus } = 
    useAuthStatus(user?.id);
  const { signIn: authSignIn, signUp: authSignUp, signOut: authSignOut } = useAuthMethods();

  // Check for premium status in localStorage as a fallback
  const getPremiumStatusFromLocalStorage = React.useCallback(() => {
    try {
      const userStr = localStorage.getItem("currentUser");
      if (!userStr) return false;
      const user = JSON.parse(userStr);
      return user.isPremium === true;
    } catch (e) {
      console.error('Error checking premium status from localStorage:', e);
      return false;
    }
  }, []);

  // Special check for our target user
  const isSpecialUser = React.useCallback(() => {
    return user?.email === 'uzivatel@pendlerapp.com';
  }, [user?.email]);

  // Update premium status with localStorage as fallback
  React.useEffect(() => {
    if (!isPremium) {
      const localPremium = getPremiumStatusFromLocalStorage();
      const specialUser = isSpecialUser();
      if (localPremium || specialUser) {
        setIsPremium(true);
      }
    }
  }, [isPremium, getPremiumStatusFromLocalStorage, setIsPremium, isSpecialUser]);

  // Update premium status when user changes
  React.useEffect(() => {
    if (isSpecialUser()) {
      setIsPremium(true);
    }
  }, [user, isSpecialUser, setIsPremium]);

  React.useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      // Set up the auth state listener first
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Use setTimeout to prevent potential deadlocks
            setTimeout(() => {
              refreshAdminStatus();
              refreshPremiumStatus().then(({ isPremium, premiumExpiry }) => {
                if (isPremium && session?.user) {
                  saveUserToLocalStorage(session.user, isPremium, premiumExpiry);
                } else if (session?.user?.email === 'uzivatel@pendlerapp.com') {
                  // Handle special user
                  setIsPremium(true);
                  saveUserToLocalStorage(session.user, true);
                }
              });
            }, 0);
          } else {
            setIsAdmin(false);
            setIsPremium(false);
          }
        }
      );
      
      // Then check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await refreshAdminStatus();
        
        // Check if this is our special user
        if (session.user.email === 'uzivatel@pendlerapp.com') {
          setIsPremium(true);
          saveUserToLocalStorage(session.user, true);
        } else {
          const { isPremium, premiumExpiry } = await refreshPremiumStatus();
          if (isPremium) {
            saveUserToLocalStorage(session.user, isPremium, premiumExpiry);
          }
        }
      }
      
      // Check localStorage as a fallback even if no session is found
      const localPremium = getPremiumStatusFromLocalStorage();
      if (localPremium) {
        setIsPremium(true);
      }
      
      setIsLoading(false);
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    initialize();
  }, []);
  
  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    return result;
  };

  const signUp = async (email: string, password: string, username?: string) => {
    const { error, user: newUser } = await authSignUp(email, password, username);
    
    if (!error && newUser) {
      setUser(newUser);
      
      // Check if this is our special user
      if (newUser.email === 'uzivatel@pendlerapp.com') {
        setIsPremium(true);
        saveUserToLocalStorage(newUser, true);
      } else {
        // Pokusíme se načíst profil
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
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsPremium(false);
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    isPremium: isPremium || getPremiumStatusFromLocalStorage() || isSpecialUser(), // Always provide a value
    signIn,
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
