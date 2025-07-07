
import { supabase } from '@/integrations/supabase/client';

/**
 * Force refresh premium status after registration with promo code
 * This ensures the premium status is properly loaded in the UI
 */
export const refreshPremiumAfterRegistration = async (userId: string, email: string) => {
  console.log('Registration Premium Fix: Starting for user:', email);
  
  // Wait a bit for the database trigger to complete
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // Check current premium status in database
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('is_premium, premium_expiry, email')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error('Registration Premium Fix: Error loading profile:', profileError);
      return;
    }
    
    console.log('Registration Premium Fix: Current profile data:', profileData);
    
    // Check if user has any promo code redemptions
    const { data: redemptions, error: redemptionError } = await supabase
      .from('promo_code_redemptions')
      .select(`
        id,
        redeemed_at,
        promo_codes (
          code,
          discount,
          duration
        )
      `)
      .eq('user_id', userId);
      
    if (redemptionError) {
      console.error('Registration Premium Fix: Error loading redemptions:', redemptionError);
      return;
    }
    
    console.log('Registration Premium Fix: User redemptions:', redemptions);
    
    // If user has premium redemptions but no premium status, something went wrong
    const premiumRedemption = redemptions?.find(r => 
      r.promo_codes && r.promo_codes.discount === 100
    );
    
    if (premiumRedemption && !profileData.is_premium) {
      console.log('Registration Premium Fix: Found premium redemption but no premium status, fixing...');
      
      // Calculate expiry date
      const redemptionDate = new Date(premiumRedemption.redeemed_at);
      const expiryDate = new Date(redemptionDate);
      expiryDate.setMonth(expiryDate.getMonth() + (premiumRedemption.promo_codes?.duration || 6));
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_premium: true,
          premium_expiry: expiryDate.toISOString()
        })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Registration Premium Fix: Error updating premium status:', updateError);
      } else {
        console.log('Registration Premium Fix: Premium status activated successfully');
      }
    }
    
    // Force refresh auth state to pick up changes
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log('Registration Premium Fix: Triggering auth refresh');
      // Trigger a state change to refresh hooks
      await supabase.auth.refreshSession();
    }
    
  } catch (error) {
    console.error('Registration Premium Fix: Unexpected error:', error);
  }
};

// Make function available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).refreshPremiumAfterRegistration = refreshPremiumAfterRegistration;
}
