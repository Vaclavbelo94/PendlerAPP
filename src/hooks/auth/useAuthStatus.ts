
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';

/**
 * Simplified hook for managing admin and premium status
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
      
      localStorage.setItem('adminLoggedIn', data.is_admin ? 'true' : 'false');
    } catch (error) {
      console.error('Error fetching admin status:', error);
      setIsAdmin(false);
    }
  };
  
  const refreshPremiumStatus = async () => {
    if (!userId) return { isPremium: false };
    
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();
        
      if (userError) throw userError;
      
      const userObj = { email: userData?.email } as any;
      const isDHL = isDHLEmployee(userObj);
      
      const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com'];
      const isSpecialUser = userData?.email && specialEmails.includes(userData.email);
      
      if (isSpecialUser || isDHL) {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        
        setIsPremium(true);
        
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
      console.error('Error fetching premium status:', error);
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
