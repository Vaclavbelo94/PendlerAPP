
import { supabase } from '@/integrations/supabase/client';

/**
 * Fix premium status for users who redeemed PREMIUM2025 but didn't get premium
 */
export const fixPremiumStatusForUser = async (email: string) => {
  try {
    console.log('Fixing premium status for user:', email);

    // Get user by email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, is_premium, premium_expiry')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      console.error('User not found:', profileError);
      return { success: false, message: 'User not found' };
    }

    console.log('Current user status:', profile);

    // Check if user has PREMIUM2025 redemption
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
      .eq('user_id', profile.id);

    if (redemptionError) {
      console.error('Error checking redemptions:', redemptionError);
      return { success: false, message: 'Error checking redemptions' };
    }

    console.log('User redemptions:', redemptions);

    const premium2025Redemption = redemptions?.find(r => 
      r.promo_codes && r.promo_codes.code === 'PREMIUM2025'
    );

    if (!premium2025Redemption) {
      console.log('No PREMIUM2025 redemption found for user');
      return { success: false, message: 'No PREMIUM2025 redemption found' };
    }

    console.log('Found PREMIUM2025 redemption:', premium2025Redemption);

    // Calculate premium expiry (6 months from redemption date)
    const redemptionDate = new Date(premium2025Redemption.redeemed_at);
    const expiryDate = new Date(redemptionDate);
    expiryDate.setMonth(expiryDate.getMonth() + 6);

    console.log('Setting premium expiry to:', expiryDate.toISOString());

    // Update user profile with premium status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_premium: true,
        premium_expiry: expiryDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id);

    if (updateError) {
      console.error('Error updating premium status:', updateError);
      return { success: false, message: 'Error updating premium status' };
    }

    console.log('Premium status fixed successfully');

    return {
      success: true,
      message: 'Premium status activated',
      data: {
        user: email,
        premiumUntil: expiryDate.toLocaleDateString('cs-CZ'),
        redemptionDate: redemptionDate.toLocaleDateString('cs-CZ')
      }
    };

  } catch (error) {
    console.error('Error in fixPremiumStatusForUser:', error);
    return { success: false, message: 'Unexpected error occurred' };
  }
};

// Make function available globally for testing
if (typeof window !== 'undefined') {
  (window as any).fixPremiumStatusForUser = fixPremiumStatusForUser;
}
