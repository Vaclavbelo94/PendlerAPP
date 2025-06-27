
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Simplified auth status hook without circular dependencies
 */
export const useSimpleAuthStatus = (userId: string | undefined) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refreshAdminStatus = async () => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
        
      if (!error && data) {
        setIsAdmin(data.is_admin || false);
        localStorage.setItem('adminLoggedIn', data.is_admin ? 'true' : 'false');
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error fetching admin status:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshPremiumStatus = async () => {
    if (!userId) {
      setIsPremium(false);
      return { isPremium: false };
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium, premium_expiry')
        .eq('id', userId)
        .single();
        
      if (!error && data) {
        const isPremiumActive = data.is_premium && 
          (!data.premium_expiry || new Date(data.premium_expiry) > new Date());
          
        setIsPremium(isPremiumActive);
        
        return {
          isPremium: isPremiumActive,
          premiumExpiry: data.premium_expiry
        };
      } else {
        setIsPremium(false);
        return { isPremium: false };
      }
    } catch (error) {
      console.error('Error fetching premium status:', error);
      setIsPremium(false);
      return { isPremium: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAdmin,
    isPremium,
    isLoading,
    setIsAdmin,
    setIsPremium,
    refreshAdminStatus,
    refreshPremiumStatus
  };
};
