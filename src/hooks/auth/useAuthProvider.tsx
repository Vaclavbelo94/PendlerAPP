import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthContext } from './useAuthContext';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { useAuthStatus } from './useAuthStatus';
import { usePremiumStatus } from '../usePremiumStatus';
import { saveUserToLocalStorage } from '@/utils/authUtils';
import LoadingSpinner from '@/components/LoadingSpinner';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, isLoading, error: authError } = useAuthState();
  const { isAdmin, isPremium: statusIsPremium, setIsAdmin, setIsPremium, refreshAdminStatus, refreshPremiumStatus } = 
    useAuthStatus(user?.id);
  const { signIn: authSignIn, signInWithGoogle: authSignInWithGoogle, signUp: authSignUp, signOut: authSignOut } = useAuthMethods();
  
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [initError, setInitError] = React.useState<string | null>(null);
  
  const premiumStatus = usePremiumStatus(user, refreshPremiumStatus, isAdmin);

  // Simplified initialization effect with error handling
  React.useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      if (!user || isInitialized) return;
      
      try {
        console.log('Starting auth initialization for user:', user.email);
        
        // Handle admin status for special email
        if (user.email === 'admin@pendlerapp.com') {
          setIsAdmin(true);
          localStorage.setItem('adminLoggedIn', 'true');
        } else {
          await refreshAdminStatus();
        }
        
        // Handle premium status with timeout
        const premiumPromise = refreshPremiumStatus();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Premium status check timeout')), 3000)
        );
        
        const { isPremium, premiumExpiry } = await Promise.race([
          premiumPromise,
          timeoutPromise
        ]) as any;
        
        // Special users handling
        if (user.email === 'uzivatel@pendlerapp.com' || user.email === 'admin@pendlerapp.com') {
          setIsPremium(true);
          const threeMonthsLater = new Date();
          threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
          saveUserToLocalStorage(user, true, threeMonthsLater.toISOString());
        } else {
          setIsPremium(isPremium);
          saveUserToLocalStorage(user, isPremium, premiumExpiry);
        }
        
        if (isMounted) {
          setIsInitialized(true);
          setInitError(null);
          console.log('Auth initialization completed successfully');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setInitError(error instanceof Error ? error.message : 'Initialization failed');
          setIsInitialized(true); // Still mark as initialized to prevent infinite loading
        }
      }
    };
    
    if (user && !isLoading && !authError) {
      initializeAuth();
    } else if (!user && !isLoading) {
      setIsInitialized(true);
      setInitError(null);
    } else if (authError) {
      setIsInitialized(true);
      setInitError(authError);
    }
    
    return () => {
      isMounted = false;
    };
  }, [user, isLoading, authError]);

  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    
    if (!result.error && email === 'admin@pendlerapp.com') {
      setIsAdmin(true);
      localStorage.setItem('adminLoggedIn', 'true');
    }
    
    return result;
  };

  const signInWithGoogle = async () => {
    const result = await authSignInWithGoogle();
    return result;
  };

  const signUp = async (email: string, password: string, username?: string) => {
    const { error, user: newUser } = await authSignUp(email, password, username);
    
    if (!error && newUser) {
      // Initialize user data after signup
      setTimeout(() => {
        setIsInitialized(false); // Trigger re-initialization
      }, 100);
    }
    
    return { error };
  };

  const signOut = async () => {
    await authSignOut();
    setIsAdmin(false);
    setIsPremium(false);
    setIsInitialized(false);
    localStorage.removeItem('adminLoggedIn');
  };

  // Show loading with timeout fallback
  if ((isLoading || (!isInitialized && user)) && !authError && !initError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-muted-foreground">Načítání...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (authError || initError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-destructive mb-4">
            <h2 className="text-lg font-semibold">Chyba při načítání</h2>
            <p className="text-sm mt-2">{authError || initError}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          >
            Obnovit stránku
          </button>
        </div>
      </div>
    );
  }

  const value = {
    user,
    session,
    isLoading: false,
    isAdmin,
    isPremium: statusIsPremium,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    refreshAdminStatus,
    refreshPremiumStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
