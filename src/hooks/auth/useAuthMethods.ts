
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cleanupAuthState, aggressiveCleanup } from '@/utils/authUtils';
import { User } from '@supabase/supabase-js';

/**
 * Hook for authentication methods (login, register, logout)
 */
export const useAuthMethods = () => {
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting sign in process for:', email);
      
      // AGGRESSIVE cleanup to prevent cross-user contamination
      aggressiveCleanup();
      
      // Force sign out any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (e) {
        console.log('No existing session to sign out');
      }
      
      // Wait a moment for cleanup to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        // Return specific error keys for translation in components
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'auth:invalidCredentials' };
        } else if (error.message.includes('Email not confirmed')) {
          return { error: 'auth:emailNotConfirmed' };
        } else if (error.message.includes('Too many requests')) {
          return { error: 'auth:tooManyRequests' };
        } else if (error.message.includes('User not found')) {
          return { error: 'auth:userNotFound' };
        } else {
          return { error: 'auth:loginError' };
        }
      }
      
      // Don't redirect immediately - let the component handle success state
      console.log('Sign in successful for:', data.user?.email);
      
      // Set fresh login flag for post-login loading animation
      sessionStorage.setItem('freshLogin', 'true');
      
      return { error: null };
    } catch (err: any) {
      console.error('Sign in exception:', err);
      return { error: err.message || 'Unknown error occurred' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google OAuth sign in');
      
      // AGGRESSIVE cleanup to prevent cross-user contamination
      aggressiveCleanup();
      
      // Force sign out any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (e) {
        console.log('No existing session to sign out');
      }
      
      const currentOrigin = window.location.origin;
      const currentPath = window.location.pathname;
      const redirectUrl = `${currentOrigin}${currentPath}`;
      
      console.log('Google OAuth redirect URL:', redirectUrl);
      
      // Set fresh login flag for post-login loading animation
      sessionStorage.setItem('freshLogin', 'true');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('Google OAuth error:', error);
        toast.error('Nepodařilo se přihlásit přes Google');
        return { error: error.message, url: null };
      }
      
      console.log('Google OAuth initiated successfully');
      
      return { error: null, url: data?.url };
    } catch (err: any) {
      console.error('Google OAuth exception:', err);
      toast.error('Nepodařilo se přihlásit přes Google');
      return { error: err.message || 'Unknown error occurred', url: null };
    }
  };

  const signUp = async (email: string, password: string, username?: string, promoCode?: string, company?: string): Promise<{ error: string | null; user: User | null }> => {
    try {
      console.log('Starting sign up process for:', email);
      
      // AGGRESSIVE cleanup to prevent cross-user contamination
      aggressiveCleanup();
      
      // Force sign out any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (e) {
        console.log('No existing session to sign out');
      }
      
      // Wait a moment for cleanup to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
            company: company,
            promo_code: promoCode
          },
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return { error: error.message, user: null };
      }
      
      console.log('Sign up successful for:', data.user?.email);
      
      // Verify the user data matches what we expect
      if (data.user && data.user.email !== email) {
        console.error('CRITICAL: User email mismatch!', {
          expected: email,
          received: data.user.email
        });
        aggressiveCleanup();
        return { error: 'Authentication error - please try again', user: null };
      }
      
      return { error: null, user: data.user };
    } catch (err: any) {
      console.error('Sign up exception:', err);
      return { error: err.message || 'Unknown error occurred', user: null };
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting sign out process');
      
      // Clean up auth state first
      aggressiveCleanup();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      toast.success("Byli jste odhlášeni");
      console.log('Sign out successful');
      
      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error("Odhlášení selhalo");
      
      // Force cleanup even if sign out fails
      aggressiveCleanup();
      
      // Force page reload anyway
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
  };

  return {
    signIn,
    signInWithGoogle,
    signUp,
    signOut
  };
};
