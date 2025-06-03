import * as React from 'react';
import { useState, useCallback } from 'react';
import { AuthContext } from './useAuthContext';
import { useAuthState } from './useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  cleanupAuthState, 
  saveUserToLocalStorage, 
  checkLocalStorageSpace, 
  aggressiveCleanup,
  initializeLocalStorageCleanup,
  safeLocalStorageSet
} from '@/utils/authUtils';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authState = useAuthState();
  const { user, session, isLoading, error } = authState;
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize localStorage cleanup on mount
  React.useEffect(() => {
    initializeLocalStorageCleanup();
  }, []);

  const refreshAdminStatus = useCallback(async () => {
    if (!user) {
      console.log("No user for admin status refresh");
      setIsAdmin(false);
      return;
    }

    try {
      console.log("Refreshing admin status for user:", user.id, user.email);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching admin status:', error);
        setIsAdmin(false);
        return;
      }

      const adminStatus = data?.is_admin || false;
      console.log("Admin status from database:", adminStatus);
      setIsAdmin(adminStatus);

      // Store admin status with safe localStorage
      safeLocalStorageSet('adminLoggedIn', adminStatus ? 'true' : 'false');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  }, [user]);

  const refreshPremiumStatus = useCallback(async (): Promise<{ isPremium: boolean; premiumExpiry?: string }> => {
    if (!user) {
      console.log("No user for premium status refresh");
      return { isPremium: false };
    }

    try {
      console.log("Refreshing premium status for user:", user.id);
      
      // First check from subscribers table
      const { data: subscriberData, error: subscriberError } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_end')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!subscriberError && subscriberData?.subscribed) {
        const premiumExpiry = subscriberData.subscription_end;
        const isActive = premiumExpiry ? new Date(premiumExpiry) > new Date() : true;
        
        if (isActive) {
          console.log("User has active Stripe subscription");
          setIsPremium(true);
          if (user && checkLocalStorageSpace() > 1024) {
            saveUserToLocalStorage(user, true, premiumExpiry);
          }
          return { isPremium: true, premiumExpiry };
        }
      }

      // Fallback to profiles table check
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_premium, premium_expiry')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile premium status:', profileError);
        return { isPremium: false };
      }

      const profilePremium = profileData?.is_premium || false;
      const profileExpiry = profileData?.premium_expiry;
      
      let isActive = profilePremium;
      if (profileExpiry) {
        isActive = profilePremium && new Date(profileExpiry) > new Date();
      }

      // Check for special users
      if (!isActive && isSpecialUser()) {
        console.log("Setting premium for special user");
        isActive = true;
      }

      console.log("Premium status from profile:", { profilePremium, profileExpiry, isActive });
      setIsPremium(isActive);
      
      if (user && isActive && checkLocalStorageSpace() > 1024) {
        saveUserToLocalStorage(user, true, profileExpiry);
      }

      return { isPremium: isActive, premiumExpiry: profileExpiry };
    } catch (error) {
      console.error('Error refreshing premium status:', error);
      return { isPremium: false };
    }
  }, [user]);

  const { isPremium, setIsPremium, isSpecialUser } = usePremiumStatus(user, refreshPremiumStatus, isAdmin);

  // Check admin status when user changes
  React.useEffect(() => {
    if (user) {
      refreshAdminStatus();
    } else {
      setIsAdmin(false);
      try {
        localStorage.removeItem('adminLoggedIn');
      } catch (e) {
        console.warn('Could not remove adminLoggedIn from localStorage');
      }
    }
  }, [user, refreshAdminStatus]);

  const signIn = async (email: string, password: string) => {
    try {
      // Check storage space first and clean if necessary
      if (checkLocalStorageSpace() < 1024) {
        console.log('Low storage space detected, cleaning up before sign in...');
        cleanupAuthState();
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message || error };
      toast.success('Přihlášení proběhlo úspěšně');
      return { error: null };
    } catch (error: any) {
      console.error('Error signing in:', error);
      
      let errorMessage = 'Nepodařilo se přihlásit';
      if (error.message?.includes('quota') || error.message?.includes('storage')) {
        errorMessage = 'Problém s úložištěm prohlížeče. Vyčišťuji data...';
        aggressiveCleanup();
      }
      
      toast.error(errorMessage);
      return { error: error.message || errorMessage };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Check storage space first
      if (checkLocalStorageSpace() < 1024) {
        cleanupAuthState();
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error("Error signing in with Google:", error);
        toast.error("Nepodařilo se přihlásit přes Google");
        return { error: error.message || error, url: undefined };
      }

      console.log("Google OAuth initiation successful, redirecting...");
      return { error: null, url: data.url };
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast.error("Nepodařilo se přihlásit přes Google");
      return { error: error.message || error, url: undefined };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      // Check storage space first
      if (checkLocalStorageSpace() < 1024) {
        cleanupAuthState();
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: username ? { username } : {}
        }
      });

      if (error) return { error: error.message || error };
      
      toast.success('Registrace proběhla úspěšně. Zkontrolujte svůj email.');
      return { error: null };
    } catch (error: any) {
      console.error('Error signing up:', error);
      
      let errorMessage = 'Nepodařilo se registrovat';
      if (error.message?.includes('quota') || error.message?.includes('storage')) {
        errorMessage = 'Problém s úložištěm prohlížeče. Vyčišťuji data...';
        aggressiveCleanup();
      }
      
      toast.error(errorMessage);
      return { error: error.message || errorMessage };
    }
  };

  const signOut = async () => {
    try {
      // Clean up state first
      aggressiveCleanup();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log("Global sign out failed, continuing...");
      }
      
      toast.success('Odhlášení proběhlo úspěšně');
      
      // Force page reload for clean state
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('Problém při odhlašování');
    }
  };

  const contextValue = React.useMemo(() => ({
    user,
    session,
    isLoading,
    error,
    isAdmin,
    isPremium,
    refreshAdminStatus,
    refreshPremiumStatus,
    signIn,
    signInWithGoogle,
    signUp,
    signOut
  }), [
    user,
    session,
    isLoading,
    error,
    isAdmin,
    isPremium,
    refreshAdminStatus,
    refreshPremiumStatus
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
