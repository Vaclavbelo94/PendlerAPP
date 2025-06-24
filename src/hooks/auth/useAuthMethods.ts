
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cleanupAuthState } from '@/utils/authUtils';

/**
 * Hook for authentication methods (login, register, logout)
 */
export const useAuthMethods = () => {
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting sign in process for:', email);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      console.log('Sign in successful for:', data.user?.email);
      return { error: null };
    } catch (err: any) {
      console.error('Sign in exception:', err);
      return { error: err };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google OAuth sign in');
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Use the current origin for redirect
      const redirectUrl = `${window.location.origin}/register`;
      console.log('Google OAuth redirect URL:', redirectUrl);
      
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
        return { error };
      }
      
      console.log('Google OAuth initiated successfully');
      
      return { error: null, url: data?.url };
    } catch (err: any) {
      console.error('Google OAuth exception:', err);
      toast.error('Nepodařilo se přihlásit přes Google');
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      console.log('Starting sign up process for:', email);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username: username || email.split('@')[0]
          },
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return { error, user: null };
      }
      
      console.log('Sign up successful for:', data.user?.email);
      return { error: null, user: data.user };
    } catch (err: any) {
      console.error('Sign up exception:', err);
      return { error: err, user: null };
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting sign out process');
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      toast.success("Byli jste odhlášeni");
      console.log('Sign out successful');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error("Odhlášení selhalo");
      
      // Force cleanup even if sign out fails
      cleanupAuthState();
    }
  };

  return {
    signIn,
    signInWithGoogle,
    signUp,
    signOut
  };
};
