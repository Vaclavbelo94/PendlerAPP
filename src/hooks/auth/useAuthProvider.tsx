
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './useAuthContext';
import { useAuthState } from './useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cleanupAuthState, saveUserToLocalStorage, checkLocalStorageSpace } from '@/utils/authUtils';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authState = useAuthState();
  const { user, session, isLoading, error } = authState;
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const refreshPremiumStatus = useCallback(async (): Promise<{ isPremium: boolean; premiumExpiry?: string }> => {
    if (!user) {
      console.log("No user for premium status refresh");
      return { isPremium: false };
    }

    try {
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
          if (user && checkLocalStorageSpace()) {
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
      
      if (user && isActive && checkLocalStorageSpace()) {
        saveUserToLocalStorage(user, true, profileExpiry);
      }

      return { isPremium: isActive, premiumExpiry: profileExpiry };
    } catch (error) {
      console.error('Error refreshing premium status:', error);
      return { isPremium: false };
    }
  }, [user]);

  const { isPremium, setIsPremium, isSpecialUser } = usePremiumStatus(user, refreshPremiumStatus, isAdmin);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching admin status:', error);
            return;
          }

          setIsAdmin(data?.is_admin || false);
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      // Check storage space first
      if (!checkLocalStorageSpace()) {
        cleanupAuthState();
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Přihlášení proběhlo úspěšně');
      return { error: null };
    } catch (error: any) {
      console.error('Error signing in:', error);
      
      let errorMessage = 'Nepodařilo se přihlásit';
      if (error.message?.includes('quota') || error.message?.includes('storage')) {
        errorMessage = 'Problém s úložištěm prohlížeče. Zkuste vyčistit cache.';
        cleanupAuthState();
      }
      
      toast.error(errorMessage);
      return { error: error.message || error.error_description };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Check storage space first
      if (!checkLocalStorageSpace()) {
        cleanupAuthState();
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error("Error signing in with Google:", error);
        toast.error("Nepodařilo se přihlásit přes Google");
        return { error: error.message, url: undefined };
      }

      toast.success("Přihlášení přes Google proběhlo úspěšně");
      return { error: null, url: data.url };
    } catch (error: any) {
      console.error("Unexpected error signing in with Google:", error);
      toast.error("Neočekávaná chyba při přihlašování přes Google");
      return { error: error.message, url: undefined };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      // Check storage space first
      if (!checkLocalStorageSpace()) {
        cleanupAuthState();
      }

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error("Error signing up:", error);
        toast.error("Registrace se nezdařila");
        return { error: error.message };
      }

      if (data.user && checkLocalStorageSpace()) {
        saveUserToLocalStorage(data.user, false);
      }

      toast.success("Registrace proběhla úspěšně! Potvrďte prosím svůj email.");
      return { error: null };
    } catch (error: any) {
      console.error("Unexpected error signing up:", error);
      toast.error("Neočekávaná chyba při registraci");
      return { error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setIsAdmin(false);
      setIsPremium(false);
      cleanupAuthState();
      navigate('/login');
      toast.success('Odhlášení proběhlo úspěšně');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('Nepodařilo se odhlásit');
    }
  };

  const refreshAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching admin status:', error);
        return;
      }

      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
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
