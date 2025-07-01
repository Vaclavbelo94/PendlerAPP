
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthStatus = (userId?: string) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAdminStatus = useCallback(async () => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_current_user_admin_status');
      if (!error) {
        setIsAdmin(data || false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  }, [userId]);

  const refreshPremiumStatus = useCallback(async () => {
    if (!userId) {
      setIsPremium(false);
      return { isPremium: false };
    }

    try {
      // Check for special users first
      const { data: { user } } = await supabase.auth.getUser();
      const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com', 'zkouska@gmail.com'];
      
      if (user?.email && specialEmails.includes(user.email)) {
        console.log('Special user detected, setting premium to true:', user.email);
        setIsPremium(true);
        const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        return { isPremium: true, premiumExpiry: expiry };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium, premium_expiry')
        .eq('id', userId)
        .single();

      const premiumStatus = profile?.is_premium || false;
      setIsPremium(premiumStatus);
      
      return { 
        isPremium: premiumStatus, 
        premiumExpiry: profile?.premium_expiry || undefined 
      };
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
      return { isPremium: false };
    }
  }, [userId]);

  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);
      await Promise.all([refreshAdminStatus(), refreshPremiumStatus()]);
      setIsLoading(false);
    };

    if (userId) {
      checkStatus();
    } else {
      setIsAdmin(false);
      setIsPremium(false);
      setIsLoading(false);
    }
  }, [userId, refreshAdminStatus, refreshPremiumStatus]);

  return {
    isAdmin,
    isPremium,
    isLoading,
    refreshAdminStatus,
    refreshPremiumStatus,
  };
};
