
import * as React from 'react';
import { useState, useCallback } from 'react';
import { AuthContext } from './useAuthContext';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { 
  cleanupAuthState, 
  saveUserToLocalStorage, 
  checkLocalStorageSpace, 
  aggressiveCleanup,
  initializeLocalStorageCleanup,
  safeLocalStorageSet
} from '@/utils/authUtils';
import { supabase } from '@/integrations/supabase/client';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authState = useAuthState();
  const { user, session, isLoading, error } = authState;
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStatusLoaded, setAdminStatusLoaded] = useState(false);
  const authMethods = useAuthMethods();

  // Initialize localStorage cleanup on mount
  React.useEffect(() => {
    initializeLocalStorageCleanup();
  }, []);

  // Critical: Verify user identity when session changes
  React.useEffect(() => {
    if (user && session) {
      console.log('Verifying user identity:', {
        userId: user.id,
        userEmail: user.email,
        sessionUserId: session.user?.id,
        sessionUserEmail: session.user?.email
      });
      
      // Critical check: ensure session user matches the user object
      if (session.user.id !== user.id || session.user.email !== user.email) {
        console.error('CRITICAL: User/Session mismatch detected!', {
          user: { id: user.id, email: user.email },
          session: { id: session.user.id, email: session.user.email }
        });
        
        // Force cleanup and redirect to login
        aggressiveCleanup();
        window.location.href = '/login?error=session_mismatch';
        return;
      }
      
      console.log('User identity verified successfully');
    }
  }, [user, session]);

  const refreshAdminStatus = useCallback(async () => {
    if (!user || adminStatusLoaded) {
      console.log("No user or admin status already loaded");
      if (!user) {
        setIsAdmin(false);
        setAdminStatusLoaded(true);
      }
      return;
    }

    try {
      console.log("Refreshing admin status for user:", user.id, user.email);
      
      // Double-check user identity before making database calls
      if (user.email !== session?.user?.email) {
        console.error('User identity mismatch in admin check');
        aggressiveCleanup();
        return;
      }
      
      // Check admin status based on email and database
      const adminEmails = ['admin@pendlerapp.com', 'admin_dhl@pendlerapp.com'];
      const isAdminByEmail = user.email ? adminEmails.includes(user.email) : false;
      
      if (isAdminByEmail) {
        console.log("User is admin by email");
        setIsAdmin(true);
        setAdminStatusLoaded(true);
        safeLocalStorageSet('adminLoggedIn', 'true');
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching admin status:', error);
        setIsAdmin(false);
        setAdminStatusLoaded(true);
        return;
      }

      const adminStatus = data?.is_admin || false;
      console.log("Admin status from database:", adminStatus);
      setIsAdmin(adminStatus);
      setAdminStatusLoaded(true);

      // Store admin status with safe localStorage
      safeLocalStorageSet('adminLoggedIn', adminStatus ? 'true' : 'false');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setAdminStatusLoaded(true);
    }
  }, [user, adminStatusLoaded, session]);

  const refreshPremiumStatus = useCallback(async (): Promise<{ isPremium: boolean; premiumExpiry?: string }> => {
    if (!user) {
      console.log("No user for premium status refresh");
      return { isPremium: false };
    }

    try {
      console.log("=== PREMIUM STATUS REFRESH START ===");
      console.log("Refreshing premium status for user:", user.id, user.email);
      
      // Double-check user identity before making database calls
      if (user.email !== session?.user?.email) {
        console.error('User identity mismatch in premium check');
        aggressiveCleanup();
        return { isPremium: false };
      }
      
      // Check if user is admin by email (auto premium)
      const adminEmails = ['admin@pendlerapp.com', 'admin_dhl@pendlerapp.com'];
      const isAdminByEmail = user.email ? adminEmails.includes(user.email) : false;
      
      if (isAdminByEmail) {
        console.log("User has premium by admin email");
        setIsPremium(true);
        return { isPremium: true };
      }
      
      // First check from subscribers table
      const { data: subscriberData, error: subscriberError } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_end')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log("Subscriber data:", subscriberData, "error:", subscriberError);

      if (!subscriberError && subscriberData?.subscribed) {
        const premiumExpiry = subscriberData.subscription_end;
        const isActive = premiumExpiry ? new Date(premiumExpiry) > new Date() : true;
        
        if (isActive) {
          console.log("User has active Stripe subscription");
          setIsPremium(true);
          if (user && checkLocalStorageSpace() > 1024) {
            saveUserToLocalStorage(user, true, premiumExpiry);
          }
          return { isPremium: true, premiumExpiry };
        }
      }

      // Fallback to profiles table check - NEJDŮLEŽITĚJŠÍ ČÁST PRO PROMO KÓDY
      console.log("Checking profiles table for premium status...");
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_premium, premium_expiry')
        .eq('id', user.id)
        .maybeSingle();

      console.log("Profile data:", profileData, "error:", profileError);

      if (profileError) {
        console.error('Error fetching profile premium status:', profileError);
        return { isPremium: false };
      }

      const profilePremium = profileData?.is_premium || false;
      const profileExpiry = profileData?.premium_expiry;
      
      let isActive = profilePremium;
      if (profileExpiry) {
        const expiryDate = new Date(profileExpiry);
        const now = new Date();
        isActive = profilePremium && expiryDate > now;
        console.log("Premium expiry check:", {
          profilePremium,
          profileExpiry,
          expiryDate: expiryDate.toISOString(),
          now: now.toISOString(),
          isActive
        });
      }

      // Check for special users
      if (!isActive && isSpecialUser()) {
        console.log("Setting premium for special user");
        isActive = true;
      }

      console.log("=== FINAL PREMIUM STATUS ===");
      console.log("Premium status from profile:", { profilePremium, profileExpiry, isActive });
      console.log("=== PREMIUM STATUS REFRESH END ===");
      
      setIsPremium(isActive);
      
      if (user && isActive && checkLocalStorageSpace() > 1024) {
        saveUserToLocalStorage(user, true, profileExpiry);
      }

      return { isPremium: isActive, premiumExpiry: profileExpiry };
    } catch (error) {
      console.error('Error refreshing premium status:', error);
      return { isPremium: false };
    }
  }, [user, session]);

  const { isPremium, setIsPremium, isSpecialUser } = usePremiumStatus(user, refreshPremiumStatus, isAdmin);

  // Check admin status when user changes - only once
  React.useEffect(() => {
    if (user && !adminStatusLoaded) {
      refreshAdminStatus();
    } else if (!user) {
      setIsAdmin(false);
      setAdminStatusLoaded(false);
      try {
        localStorage.removeItem('adminLoggedIn');
      } catch (e) {
        console.warn('Could not remove adminLoggedIn from localStorage');
      }
    }
  }, [user, refreshAdminStatus, adminStatusLoaded]);

  const contextValue = React.useMemo(() => ({
    user,
    session,
    isLoading,
    error,
    isAdmin,
    isPremium,
    refreshAdminStatus,
    refreshPremiumStatus,
    ...authMethods
  }), [
    user,
    session,
    isLoading,
    error,
    isAdmin,
    isPremium,
    refreshAdminStatus,
    refreshPremiumStatus,
    authMethods
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
