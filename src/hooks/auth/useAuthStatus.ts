
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
      // Specific check for the target user email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();
        
      if (userError) throw userError;
      
      // If this is the specific user we want to give premium to
      if (userData?.email === 'uzivatel@pendlerapp.com') {
        // Set premium status and calculate expiry date (3 months from now)
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
        
        setIsPremium(true);
        
        // Update their premium status in the database
        await supabase
          .from('profiles')
          .update({ 
            is_premium: true,
            premium_expiry: threeMonthsLater.toISOString()
          })
          .eq('id', userId);
          
        return {
          isPremium: true,
          premiumExpiry: threeMonthsLater.toISOString()
        };
      }
      
      // For all other users, check their premium status as usual
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
