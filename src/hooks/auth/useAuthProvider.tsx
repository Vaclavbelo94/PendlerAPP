
import * as React from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext, AuthError } from './useAuthContext';
import { useAuthStatus } from './useAuthStatus';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const { 
    isAdmin, 
    isPremium: premiumStatus, 
    setIsAdmin, 
    setIsPremium, 
    refreshAdminStatus, 
    refreshPremiumStatus 
  } = useAuthStatus(user?.id);

  const { 
    isPremium: premiumFromHook,
    setIsPremium: setPremiumFromHook 
  } = usePremiumStatus(user, refreshPremiumStatus, isAdmin);

  // Use the premium status from the hook as the primary source
  const isPremium = premiumFromHook || premiumStatus;

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          // Defer heavy operations to prevent deadlocks
          setTimeout(() => {
            refreshAdminStatus();
            refreshPremiumStatus();
          }, 0);
        }

        if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
          setIsPremium(false);
          setPremiumFromHook(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [refreshAdminStatus, refreshPremiumStatus, setIsAdmin, setIsPremium, setPremiumFromHook]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return { error: null };
    } catch (error) {
      return { error: 'Neočekávaná chyba při přihlášení' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return { error: null, url: data.url };
    } catch (error) {
      return { error: 'Neočekávaná chyba při přihlášení přes Google' };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
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
        return { error: error.message };
      }
      
      return { error: null };
    } catch (error) {
      return { error: 'Neočekávaná chyba při registraci' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      // Clear all auth state immediately
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsPremium(false);
      setPremiumFromHook(false);
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    isPremium,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    refreshAdminStatus,
    refreshPremiumStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
