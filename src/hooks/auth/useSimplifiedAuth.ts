import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SimplifiedAuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
}

export const useSimplifiedAuth = () => {
  const [state, setState] = useState<SimplifiedAuthState>({
    user: null,
    session: null,
    isLoading: true,
    isInitialized: false,
  });

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      // Setup auth state listener first
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          if (isMounted) {
            setState(prevState => ({
              ...prevState,
              session,
              user: session?.user ?? null,
              isLoading: false,
              isInitialized: true,
            }));
          }
        }
      );

      // Then check for existing session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (isMounted) {
          setState({
            session,
            user: session?.user ?? null,
            isLoading: false,
            isInitialized: true,
          });
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (isMounted) {
          setState(prevState => ({
            ...prevState,
            isLoading: false,
            isInitialized: true,
          }));
        }
      }

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  // Simplified sign up with auto-login
  const signUp = async (email: string, password: string, username?: string, promoCode?: string) => {
    try {
      console.log('Starting simplified sign up for:', email);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: username || email.split('@')[0],
            promo_code: promoCode || null,
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error: error.message, user: null };
      }

      if (data.user) {
        console.log('Sign up successful, user:', data.user.email);
        
        // If user is immediately confirmed, they'll be auto-logged in via onAuthStateChange
        // If not confirmed, they need to check email first - using fallback translation
        if (!data.user.email_confirmed_at) {
          toast.info('Zkontrolujte svůj email pro potvrzení účtu');
        }
        
        return { error: null, user: data.user };
      }

      return { error: 'Registrace se nezdařila', user: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'Registrace se nezdařila', user: null };
    }
  };

  // Simplified sign in
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error: error.message };
      }

      if (data.user) {
        console.log('Sign in successful:', data.user.email);
        return { error: null };
      }

      return { error: 'Přihlášení se nezdařilo' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'Přihlášení se nezdařilo' };
    }
  };

  // Simplified sign out
  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Chyba při odhlašování');
      } else {
        toast.success('Úspěšně odhlášen');
        // Force page reload for clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Chyba při odhlašování');
    }
  };

  // Google sign in
  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign in...');
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });

      if (error) {
        console.error('Google sign in error:', error);
        return { error: error.message, url: null };
      }

      return { error: null, url: data.url };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { error: 'Google přihlášení se nezdařilo', url: null };
    }
  };

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
  };
};