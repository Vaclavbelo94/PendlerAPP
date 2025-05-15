
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/sonner';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      // Set up the auth state listener first
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
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
      
      // Také aktualizujeme v localStorage pro přímý přístup v komponentách
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error("Přihlášení selhalo: " + error.message);
        return { error };
      }
      
      toast.success("Úspěšně přihlášeno!");
      return { error: null };
    } catch (err: any) {
      toast.error("Přihlášení selhalo: " + err.message);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
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
        toast.error("Registrace selhala: " + error.message);
        return { error };
      }
      
      toast.success("Účet byl vytvořen! Zkontrolujte svůj email pro potvrzení.");
      return { error: null };
    } catch (err: any) {
      toast.error("Registrace selhala: " + err.message);
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      // Vyčistíme lokální storage
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
      toast.info("Byli jste odhlášeni");
    } catch (error: any) {
      toast.error("Odhlášení selhalo: " + error.message);
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
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
