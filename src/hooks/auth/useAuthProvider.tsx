
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
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

  // Simplified premium activation for DHL users
  const activatePremiumForDHLUser = useCallback(async (currentUser: User) => {
    if (!isDHLEmployee(currentUser)) return;

    console.log('Activating premium for DHL user:', currentUser.email);
    
    try {
      const { data: currentData, error: fetchError } = await supabase
        .from('profiles')
        .select('is_premium, premium_expiry')
        .eq('id', currentUser.id)
        .single();

      if (fetchError) {
        console.error('Error fetching current premium status:', fetchError);
        return;
      }

      const isCurrentlyPremium = currentData?.is_premium && 
        (!currentData?.premium_expiry || new Date(currentData.premium_expiry) > new Date());

      if (isCurrentlyPremium) {
        console.log('User already has active premium');
        setAuthStatusPremium(true);
        setPremiumStatusPremium(true);
        return;
      }

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

      setAuthStatusPremium(true);
      setPremiumStatusPremium(true);
      
      console.log('Premium activated for DHL user until:', oneYearLater.toISOString());
      toast.success('Premium aktivní pro DHL zaměstnance');

    } catch (error) {
      console.error('Error in activatePremiumForDHLUser:', error);
    }
  }, [setAuthStatusPremium, setPremiumStatusPremium]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setAuthError(error.message);
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
          
          if (session?.user) {
            console.log('User found in session:', session.user.email);
            // Activate premium for DHL users without blocking
            setTimeout(() => {
              activatePremiumForDHLUser(session.user);
            }, 100);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setAuthError('Failed to initialize authentication');
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        setAuthError(null);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user.email);
          
          // Load user status with delay to prevent conflicts
          setTimeout(async () => {
            try {
              await refreshAdminStatus();
              await activatePremiumForDHLUser(session.user);
            } catch (error) {
              console.error('Error loading user status:', error);
            }
          }, 200);
        }

        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setIsAdmin(false);
          setAuthStatusPremium(false);
          setPremiumStatusPremium(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshAdminStatus, setIsAdmin, setAuthStatusPremium, setPremiumStatusPremium, activatePremiumForDHLUser]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshPremiumStatus = async () => {
    try {
      const result = await refreshAuthPremiumStatus();
      return result;
    } catch (error) {
      console.error('Error refreshing premium status:', error);
      return { isPremium: false };
    }
  };

  // Show error state if there's a critical auth error
  if (authError && !user) {
    console.error('Critical auth error:', authError);
  }

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
