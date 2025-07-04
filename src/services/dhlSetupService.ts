
import { supabase } from '@/integrations/supabase/client';
import { isDHLPromoCode } from '@/utils/dhlAuthUtils';

/**
 * Service to ensure DHL employee has proper setup
 */
export class DHLSetupService {
  /**
   * Ensure user has DHL promo code redemption record
   */
  static async ensureDHLPromoRedemption(userId: string): Promise<boolean> {
    try {
      console.log('Ensuring DHL promo redemption for user:', userId);

      // Check if user already has DHL promo redemption
      const { data: existingRedemption } = await supabase
        .from('promo_code_redemptions')
        .select(`
          id,
          promo_codes (code)
        `)
        .eq('user_id', userId);

      const hasDHLRedemption = existingRedemption?.some(redemption => 
        redemption.promo_codes && 
        isDHLPromoCode(redemption.promo_codes.code)
      );

      if (hasDHLRedemption) {
        console.log('User already has DHL promo redemption');
        return true;
      }

      // Get DHL2026 promo code
      const { data: promoCode } = await supabase
        .from('promo_codes')
        .select('id')
        .eq('code', 'DHL2026')
        .single();

      if (!promoCode) {
        console.error('DHL2026 promo code not found');
        return false;
      }

      // Create redemption record
      const { error: redemptionError } = await supabase
        .from('promo_code_redemptions')
        .insert({
          user_id: userId,
          promo_code_id: promoCode.id
        });

      if (redemptionError) {
        console.error('Error creating DHL promo redemption:', redemptionError);
        return false;
      }

      // Update profile to mark as DHL employee
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          is_dhl_employee: true,
          is_premium: true,
          premium_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating profile for DHL employee:', profileError);
        return false;
      }

      console.log('Successfully created DHL promo redemption for user');
      return true;

    } catch (error) {
      console.error('Error in ensureDHLPromoRedemption:', error);
      return false;
    }
  }

  /**
   * Check if user needs DHL setup
   */
  static async checkDHLSetupNeeded(userId: string): Promise<boolean> {
    try {
      const { data: assignment } = await supabase
        .from('user_dhl_assignments')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      return !assignment; // Return true if no assignment exists
    } catch (error) {
      console.error('Error checking DHL setup status:', error);
      return false;
    }
  }
}
