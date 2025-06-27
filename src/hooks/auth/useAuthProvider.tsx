
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuthStatus } from './useSimpleAuthStatus';
import { useDHLStatus } from './useDHLStatus';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  isDHL: boolean;
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
  const [initError, setInitError] = useState<string | null>(null);
  
  console.log('AuthProvider initializing...');
  
  // Use simplified hooks
  const {
    isAdmin,
    isPremium,
    setIsAdmin,
    setIsPremium,
    refreshAdminStatus,
    refreshPremiumStatus
  } = useSimpleAuthStatus(user?.id);

  const { isDHL } = useDHLStatus(user);

  // Simplified initialization with proper error handling
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Getting initial session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setInitError(error.message);
        }
        
        if (mounted) {
          console.log('Setting initial auth state:', session?.user?.email || 'no user');
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
          setInitError(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setInitError(error instanceof Error ? error.message : 'Unknown auth error');
          setIsLoading(false);
          // Set fallback values to prevent app crash
          setSession(null);
          setUser(null);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener with error handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email || 'no user');
      
      if (mounted) {
        try {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
          setInitError(null);

          // Lazy load user status after successful auth
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('User signed in, loading status...');
            setTimeout(async () => {
              try {
                await refreshAdminStatus();
              } catch (error) {
                console.error('Error loading user status:', error);
                // Don't crash the app, just log the error
              }
            }, 500);
          }

          if (event === 'SIGNED_OUT') {
            console.log('User signed out, clearing status...');
            setIsAdmin(false);
            setIsPremium(false);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          // Don't crash the app
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshAdminStatus, setIsAdmin, setIsPremium]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error?.message || null };
    } catch (error) {
      console.error('Sign in error:', error);
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
      console.error('Google sign in error:', error);
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
      console.error('Sign up error:', error);
      return { error: 'Neočekávaná chyba při registraci', user: null };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      // Don't throw, just log
    }
  };

  // If there's an init error but we can still provide basic functionality, do so
  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    isPremium,
    isDHL,
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
    isPremium,
    isDHL,
    initError 
  });

  // Show error boundary fallback if there's a critical init error
  if (initError && !user && !isLoading) {
    console.error('Critical auth initialization error:', initError);
    // Still provide the context to prevent crashes
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
