
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStatus } from './useAuthStatus';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  refreshAdminStatus: () => Promise<void>;
  refreshPremiumStatus: () => Promise<{ isPremium: boolean; premiumExpiry?: string }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null; url?: string }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: string | null; user: User | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('AuthProvider initializing...');
  
  const {
    isAdmin,
    isPremium: authStatusPremium,
    setIsAdmin,
    setIsPremium: setAuthStatusPremium,
    refreshAdminStatus,
    refreshPremiumStatus: refreshAuthPremiumStatus
  } = useAuthStatus(user?.id);

  const {
    isPremium: premiumStatusPremium,
    setIsPremium: setPremiumStatusPremium,
  } = usePremiumStatus(user, refreshAuthPremiumStatus, isAdmin);

  const isPremium = premiumStatusPremium || authStatusPremium;

  // Initialize auth state - simplified version
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Getting initial session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          console.log('Setting initial auth state:', session?.user?.email || 'no user');
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email || 'no user');
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, loading status...');
          setTimeout(async () => {
            try {
              await refreshAdminStatus();
            } catch (error) {
              console.error('Error loading user status:', error);
            }
          }, 500);
        }

        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing status...');
          setIsAdmin(false);
          setAuthStatusPremium(false);
          setPremiumStatusPremium(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshAdminStatus, setIsAdmin, setAuthStatusPremium, setPremiumStatusPremium]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error?.message || null };
    } catch (error) {
      return { error: 'Neočekávaná chyba při přihlašování' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      return { error: error?.message || null, url: data.url };
    } catch (error) {
      return { error: 'Chyba při přihlašování přes Google' };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0]
          }
        }
      });
      return { error: error?.message || null, user: data.user };
    } catch (error) {
      return { error: 'Neočekávaná chyba při registraci', user: null };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshPremiumStatus = async () => {
    try {
      const result = await refreshAuthPremiumStatus();
      return result;
    } catch (error) {
      console.error('Error refreshing premium status:', error);
      return { isPremium: false };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    isPremium,
    refreshAdminStatus,
    refreshPremiumStatus,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
  };

  console.log('AuthProvider value:', { 
    hasUser: !!user, 
    isLoading, 
    isAdmin, 
    isPremium 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
