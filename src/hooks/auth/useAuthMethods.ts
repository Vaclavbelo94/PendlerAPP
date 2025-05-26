import { supabase } from '@/integrations/supabase/client';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { cleanupAuthState } from '@/utils/authUtils';

/**
 * Hook for authentication methods (login, register, logout)
 */
export const useAuthMethods = () => {
  const { success: showSuccess, error: showError } = useStandardizedToast();

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Sign out before sign in failed, continuing anyway');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Sign out before sign in failed, continuing anyway');
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        return { error };
      }
      
      return { error: null, url: data?.url };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username: username || email.split('@')[0]
          },
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        return { error, user: null };
      }
      
      return { error: null, user: data.user };
    } catch (err: any) {
      return { error: err, user: null };
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      showSuccess("Byli jste odhlášeni");
    } catch (error: any) {
      console.error('Sign out error:', error);
      showError("Odhlášení selhalo", error.message);
      
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
