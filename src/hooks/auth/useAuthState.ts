
import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error?: Error | null;
}

/**
 * Hook for managing the core authentication state
 */
export const useAuthState = () => {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });
  
  React.useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      try {
        // Set up the auth state listener first
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session);
            
            if (isMounted) {
              setState(prevState => ({
                ...prevState,
                session,
                user: session?.user ?? null,
                isLoading: false,
                error: null,
              }));
            }
          }
        );
        
        // Then check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setState(prevState => ({
              ...prevState,
              error,
              isLoading: false,
            }));
          }
          return;
        }
        
        if (isMounted) {
          setState({
            session,
            user: session?.user ?? null,
            isLoading: false,
            error: null,
          });
        }
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setState(prevState => ({
            ...prevState,
            error: error as Error,
            isLoading: false,
          }));
        }
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return state;
};
