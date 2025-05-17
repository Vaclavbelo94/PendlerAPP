
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
  refreshPremiumStatus: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const { isAdmin, isPremium, setIsAdmin, setIsPremium, refreshAdminStatus, refreshPremiumStatus } = 
    useAuthStatus(user?.id);
  const { signIn: authSignIn, signUp: authSignUp, signOut: authSignOut } = useAuthMethods();

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
        const { isPremium, premiumExpiry } = await refreshPremiumStatus();
        if (isPremium) {
          saveUserToLocalStorage(session.user, isPremium, premiumExpiry);
        }
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
    isPremium,
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
