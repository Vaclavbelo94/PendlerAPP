
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';

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
      // Get user data to check if they are DHL employee
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();
        
      if (userError) throw userError;
      
      // Check if user is DHL employee
      const userObj = { email: userData?.email } as any;
      const isDHL = isDHLEmployee(userObj);
      
      console.log('Premium status check:', {
        email: userData?.email,
        isDHL,
        userId
      });
      
      // Special users get premium automatically
      const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com'];
      const isSpecialUser = userData?.email && specialEmails.includes(userData.email);
      
      if (isSpecialUser) {
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
      
      // DHL employees get premium automatically
      if (isDHL) {
        console.log('Activating premium for DHL employee:', userData?.email);
        
        // Set premium status and calculate expiry date (1 year from now for DHL)
        const oneYearLater = new Date();
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
        
        setIsPremium(true);
        
        // Update their premium status in the database
        await supabase
          .from('profiles')
          .update({ 
            is_premium: true,
            premium_expiry: oneYearLater.toISOString()
          })
          .eq('id', userId);
          
        return {
          isPremium: true,
          premiumExpiry: oneYearLater.toISOString()
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
