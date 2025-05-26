
import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for managing the core authentication state with error handling
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
    let authSubscription: any = null;
    
    const initialize = async () => {
      try {
        console.log('Initializing auth state...');
        
        // Set up the auth state listener first
        authSubscription = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            if (isMounted) {
              setState(prevState => ({
                ...prevState,
                session,
                user: session?.user ?? null,
                error: null,
              }));
            }
          }
        );
        
        // Then check for existing session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        );
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('Session check error:', error);
          throw error;
        }
        
        console.log('Initial session:', session?.user?.email || 'No session');
        
        if (isMounted) {
          setState({
            session,
            user: session?.user ?? null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setState({
            session: null,
            user: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Authentication failed',
          });
        }
      }
    };
    
    // Add a small delay to prevent race conditions
    const initTimer = setTimeout(initialize, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, []);
  
  return state;
};
