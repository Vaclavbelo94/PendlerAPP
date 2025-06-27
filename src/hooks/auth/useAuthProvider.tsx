
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStatus } from './useAuthStatus';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { toast } from 'sonner';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  refreshAdminStatus: () => Promise<void>;
  refreshPremiumStatus: () => Promise<{ isPremium: boolean; premiumExpiry?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    isAdmin,
    isPremium: authStatusPremium,
    setIsAdmin,
    setIsPremium: setAuthStatusPremium,
    refreshAdminStatus,
    refreshPremiumStatus: refreshAuthPremiumStatus
  } = useAuthStatus(user?.id);

  const {
    isPremium: premiumStatusPremium,
    setIsPremium: setPremiumStatusPremium,
  } = usePremiumStatus(user, refreshAuthPremiumStatus, isAdmin);

  // Use the premium status from usePremiumStatus as it's more comprehensive
  const isPremium = premiumStatusPremium || authStatusPremium;

  const activatePremiumForDHLUser = useCallback(async (currentUser: User) => {
    if (!isDHLEmployee(currentUser)) return;

    console.log('Activating premium for DHL user:', currentUser.email);
    
    try {
      // Get current user data
      const { data: currentData, error: fetchError } = await supabase
        .from('profiles')
        .select('is_premium, premium_expiry')
        .eq('id', currentUser.id)
        .single();

      if (fetchError) {
        console.error('Error fetching current premium status:', fetchError);
        return;
      }

      // Check if already premium and not expired
      const isCurrentlyPremium = currentData?.is_premium && 
        (!currentData?.premium_expiry || new Date(currentData.premium_expiry) > new Date());

      if (isCurrentlyPremium) {
        console.log('User already has active premium');
        setAuthStatusPremium(true);
        setPremiumStatusPremium(true);
        return;
      }

      // Set premium status for 1 year for DHL employees
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_premium: true,
          premium_expiry: oneYearLater.toISOString()
        })
        .eq('id', currentUser.id);

      if (updateError) {
        console.error('Error updating premium status:', updateError);
        return;
      }

      // Update local state
      setAuthStatusPremium(true);
      setPremiumStatusPremium(true);
      
      console.log('Premium activated for DHL user until:', oneYearLater.toISOString());
      toast.success('Premium aktivní pro DHL zaměstnance');

    } catch (error) {
      console.error('Error in activatePremiumForDHLUser:', error);
    }
  }, [setAuthStatusPremium, setPremiumStatusPremium]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // Auto-activate premium for DHL users
      if (session?.user) {
        activatePremiumForDHLUser(session.user);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in:', session.user.email);
        
        // Defer status loading to prevent conflicts
        setTimeout(async () => {
          try {
            await refreshAdminStatus();
            await activatePremiumForDHLUser(session.user);
          } catch (error) {
            console.error('Error loading user status:', error);
          }
        }, 100);
      }

      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setIsAdmin(false);
        setAuthStatusPremium(false);
        setPremiumStatusPremium(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshAdminStatus, setIsAdmin, setAuthStatusPremium, setPremiumStatusPremium, activatePremiumForDHLUser]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshPremiumStatus = async () => {
    const result = await refreshAuthPremiumStatus();
    return result;
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    isPremium,
    refreshAdminStatus,
    refreshPremiumStatus,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
