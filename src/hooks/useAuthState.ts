
import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

/**
 * Hook for managing the core authentication state
 */
export const useAuthState = () => {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
  });
  
  React.useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      // Set up the auth state listener first
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (isMounted) {
            setState(prevState => ({
              ...prevState,
              session,
              user: session?.user ?? null,
            }));
          }
        }
      );
      
      // Then check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (isMounted) {
        setState({
          session,
          user: session?.user ?? null,
          isLoading: false,
        });
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
  
  return state;
};
