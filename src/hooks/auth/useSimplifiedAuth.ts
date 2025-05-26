
import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SimplifiedAuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
}

export const useSimplifiedAuth = () => {
  const [state, setState] = React.useState<SimplifiedAuthState>({
    user: null,
    session: null,
    isLoading: true,
    isInitialized: false,
  });

  React.useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        // Set up auth listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (mounted) {
            setState(prev => ({
              ...prev,
              session,
              user: session?.user ?? null,
              isLoading: false,
              isInitialized: true,
            }));
          }
        });

        // Quick session check with timeout
        const sessionCheck = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 2000)
        );

        try {
          const { data: { session } } = await Promise.race([sessionCheck, timeoutPromise]) as any;
          
          if (mounted) {
            setState({
              session,
              user: session?.user ?? null,
              isLoading: false,
              isInitialized: true,
            });
          }
        } catch (error) {
          // Fallback to no session on timeout
          if (mounted) {
            setState({
              session: null,
              user: null,
              isLoading: false,
              isInitialized: true,
            });
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        if (mounted) {
          setState({
            session: null,
            user: null,
            isLoading: false,
            isInitialized: true,
          });
        }
      }
    };

    // Add small delay to prevent race conditions but ensure quick loading
    timeoutId = setTimeout(initializeAuth, 50);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return state;
};
