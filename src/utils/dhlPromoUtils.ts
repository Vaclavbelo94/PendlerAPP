
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if user has redeemed DHL promo code (like DHL2026)
 */
export const hasDHLPromoCode = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('promo_code_redemptions')
      .select(`
        promo_codes (
          code
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error checking DHL promo codes:', error);
      return false;
    }

    const dhlPromoCodes = ['DHL2026', 'DHL2025', 'DHLSPECIAL'];
    return data?.some(redemption => 
      redemption.promo_codes && 
      dhlPromoCodes.includes(redemption.promo_codes.code.toUpperCase())
    ) || false;
  } catch (error) {
    console.error('Error in hasDHLPromoCode:', error);
    return false;
  }
};

/**
 * Set DHL status in user profile based on promo code redemption
 */
export const updateDHLStatus = async (userId: string, isDHL: boolean): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId,
        is_dhl_employee: isDHL,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('Error updating DHL status:', error);
    } else {
      console.log('DHL status updated for user:', userId, 'isDHL:', isDHL);
    }
  } catch (error) {
    console.error('Error in updateDHLStatus:', error);
  }
};
