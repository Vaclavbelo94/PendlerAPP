
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
    if (!userId) return { isPremium: false };
    
    try {
      // Get user data to check if they are DHL employee or special user
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email, is_premium, premium_expiry')
        .eq('id', userId)
        .single();
        
      if (userError) throw userError;
      
      console.log('Checking premium status for user:', userData);
      
      // Check if user is DHL employee
      const userObj = { email: userData?.email } as any;
      const isDHL = isDHLEmployee(userObj);
      
      // Special users get premium automatically - including zkouska@gmail.com
      const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com', 'zkouska@gmail.com'];
      const isSpecialUser = userData?.email && specialEmails.includes(userData.email);
      
      console.log('Premium check details:', {
        email: userData?.email,
        isDHL,
        isSpecialUser,
        currentPremium: userData?.is_premium,
        premiumExpiry: userData?.premium_expiry
      });
      
      if (isSpecialUser || isDHL) {
        console.log('Activating premium for special/DHL user:', userData?.email);
        
        // Set premium status and calculate expiry date
        const expiryDate = isSpecialUser 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year for special users
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year for DHL too
        
        setIsPremium(true);
        
        // Update their premium status in the database
        await supabase
          .from('profiles')
          .update({ 
            is_premium: true,
            premium_expiry: expiryDate.toISOString()
          })
          .eq('id', userId);
          
        return {
          isPremium: true,
          premiumExpiry: expiryDate.toISOString()
        };
      }
      
      // For all other users, check their premium status as usual
      const isPremiumActive = userData.is_premium && 
        (!userData.premium_expiry || new Date(userData.premium_expiry) > new Date());
        
      setIsPremium(isPremiumActive);
      
      return {
        isPremium: isPremiumActive,
        premiumExpiry: userData.premium_expiry
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
