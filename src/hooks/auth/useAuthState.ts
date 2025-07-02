
import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean; // New flag to track if auth is fully initialized
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
    isInitialized: false,
    error: null,
  });
  
  React.useEffect(() => {
    let isMounted = true;
    let initializationTimeout: NodeJS.Timeout;
    
    const initialize = async () => {
      try {
        console.log('Auth State: Starting initialization');
        
        // Set up the auth state listener first
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session?.user?.email || 'no user');
            
            if (isMounted) {
              setState(prevState => ({
                ...prevState,
                session,
                user: session?.user ?? null,
                isLoading: false,
                isInitialized: true,
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
              isInitialized: true,
            }));
          }
          return;
        }
        
        console.log('Auth State: Initial session check:', session?.user?.email || 'no user');
        
        if (isMounted) {
          setState({
            session,
            user: session?.user ?? null,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
        }
        
        // Safety timeout to ensure initialization completes
        initializationTimeout = setTimeout(() => {
          if (isMounted) {
            setState(prevState => ({
              ...prevState,
              isLoading: false,
              isInitialized: true,
            }));
          }
        }, 2000);
        
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
            isInitialized: true,
          }));
        }
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
      }
    };
  }, []);
  
  return state;
};
