
import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Helper function to clean up auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Clean up our custom keys too
  localStorage.removeItem('adminLoggedIn');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  signIn: (email: string, password: string) => Promise<{error: any}>;
  signUp: (email: string, password: string, username?: string) => Promise<{error: any}>;
  signOut: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
  refreshPremiumStatus: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isPremium, setIsPremium] = React.useState(false);

  React.useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      // Set up the auth state listener first
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Use setTimeout to prevent potential deadlocks
            setTimeout(() => {
              refreshAdminStatus();
              refreshPremiumStatus();
            }, 0);
          } else {
            setIsAdmin(false);
            setIsPremium(false);
          }
        }
      );
      
      // Then check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await refreshAdminStatus();
        await refreshPremiumStatus();
      }
      
      setIsLoading(false);
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    initialize();
  }, []);
  
  const refreshAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      setIsAdmin(data.is_admin || false);
      
      // Uložíme do localStorage pro přímý přístup v komponentách
      localStorage.setItem('adminLoggedIn', data.is_admin ? 'true' : 'false');
    } catch (error) {
      console.error('Chyba při získávání admin statusu:', error);
      setIsAdmin(false);
    }
  };
  
  const refreshPremiumStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium, premium_expiry')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      const isPremiumActive = data.is_premium && 
        (!data.premium_expiry || new Date(data.premium_expiry) > new Date());
        
      setIsPremium(isPremiumActive);
      
      // Uložíme informaci o premium statusu do localStorage
      if (isPremiumActive) {
        const currentUser = {
          id: user.id,
          name: user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel',
          email: user.email,
          isPremium: true,
          premiumUntil: data.premium_expiry
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('isLoggedIn', 'true');
      }
    } catch (error) {
      console.error('Chyba při získávání premium statusu:', error);
      setIsPremium(false);
    }
  };

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
          }
        }
      });
      
      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force reset state
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsPremium(false);
      
      toast({
        title: "Byli jste odhlášeni",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Odhlášení selhalo",
        description: error.message,
        variant: "destructive",
      });
      
      // Force cleanup even if sign out fails
      cleanupAuthState();
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    isPremium,
    signIn,
    signUp,
    signOut,
    refreshAdminStatus,
    refreshPremiumStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
