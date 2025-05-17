
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for managing admin and premium status
 */
export const useAuthStatus = (userId: string | undefined) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const refreshAdminStatus = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
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
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium, premium_expiry')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      const isPremiumActive = data.is_premium && 
        (!data.premium_expiry || new Date(data.premium_expiry) > new Date());
        
      setIsPremium(isPremiumActive);
      
      return {
        isPremium: isPremiumActive,
        premiumExpiry: data.premium_expiry
      };
    } catch (error) {
      console.error('Chyba při získávání premium statusu:', error);
      setIsPremium(false);
      return { isPremium: false };
    }
  };

  return {
    isAdmin,
    isPremium,
    setIsAdmin,
    setIsPremium,
    refreshAdminStatus,
    refreshPremiumStatus
  };
};
