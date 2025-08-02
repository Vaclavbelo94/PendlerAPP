
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';

/**
 * Hook for managing admin and premium status
 */
export const useAuthStatus = (userId: string | undefined) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Auto-load status when userId changes
  useEffect(() => {
    if (userId) {
      refreshAdminStatus();
      refreshPremiumStatus();
    } else {
      setIsAdmin(false);
      setIsPremium(false);
      localStorage.removeItem('adminLoggedIn');
    }
  }, [userId]);

  const refreshAdminStatus = async () => {
    if (!userId) return;
    
    try {
      console.log('useAuthStatus: Refreshing admin status for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      const adminStatus = data.is_admin || false;
      setIsAdmin(adminStatus);
      
      console.log('useAuthStatus: Admin status result:', { userId, isAdmin: adminStatus });
      
      // Uložíme do localStorage pro přímý přístup v komponentách
      localStorage.setItem('adminLoggedIn', adminStatus ? 'true' : 'false');
    } catch (error) {
      console.error('useAuthStatus: Chyba při získávání admin statusu:', error);
      setIsAdmin(false);
    }
  };
  
  const refreshPremiumStatus = async () => {
    if (!userId) return { isPremium: false };
    
    try {
      console.log('useAuthStatus: Refreshing premium status for user:', userId);
      
      // Get user data to check if they are DHL employee or special user
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email, is_premium, premium_expiry')
        .eq('id', userId)
        .single();
        
      if (userError) throw userError;
      
      console.log('useAuthStatus: User data retrieved:', userData);
      
      // Check if user is DHL employee
      const userObj = { email: userData?.email } as any;
      const isDHL = isDHLEmployee(userObj);
      
      // Special users get premium automatically - explicitly include zkouska@gmail.com
      const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com', 'zkouska@gmail.com'];
      const isSpecialUser = userData?.email && specialEmails.includes(userData.email);
      
      console.log('useAuthStatus: Premium check details:', {
        email: userData?.email,
        isDHL,
        isSpecialUser,
        currentPremium: userData?.is_premium,
        premiumExpiry: userData?.premium_expiry
      });
      
      if (isSpecialUser) {
        console.log('useAuthStatus: Special user detected, activating premium immediately:', userData?.email);
        
        // Set premium status and calculate expiry date for special users
        const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
        
        setIsPremium(true);
        
        // Update their premium status in the database
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            is_premium: true,
            premium_expiry: expiryDate.toISOString()
          })
          .eq('id', userId);
          
        if (updateError) {
          console.error('useAuthStatus: Failed to update premium in database:', updateError);
        } else {
          console.log('useAuthStatus: Premium status updated in database for special user');
        }
          
        return {
          isPremium: true,
          premiumExpiry: expiryDate.toISOString()
        };
      }
      
      if (isDHL) {
        console.log('useAuthStatus: DHL employee detected, activating premium:', userData?.email);
        
        // Set premium status and calculate expiry date for DHL employees
        const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
        
        setIsPremium(true);
        
        // Update their premium status in the database
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            is_premium: true,
            premium_expiry: expiryDate.toISOString()
          })
          .eq('id', userId);
          
        if (updateError) {
          console.error('useAuthStatus: Failed to update premium in database for DHL user:', updateError);
        }
          
        return {
          isPremium: true,
          premiumExpiry: expiryDate.toISOString()
        };
      }
      
      // For all other users, check their premium status as usual
      const isPremiumActive = userData.is_premium && 
        (!userData.premium_expiry || new Date(userData.premium_expiry) > new Date());
        
      console.log('useAuthStatus: Regular user premium check:', {
        email: userData?.email,
        is_premium: userData.is_premium,
        premium_expiry: userData.premium_expiry,
        isPremiumActive
      });
        
      setIsPremium(isPremiumActive);
      
      return {
        isPremium: isPremiumActive,
        premiumExpiry: userData.premium_expiry
      };
    } catch (error) {
      console.error('useAuthStatus: Chyba při získávání premium statusu:', error);
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
