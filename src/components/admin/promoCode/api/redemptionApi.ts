
import { supabase } from "@/integrations/supabase/client";
import { PromoCode, PromoCodeDB } from "../types";
import { mapDbToPromoCode } from "../utils/promoCodeMappers";

/**
 * Redeems a promo code for a user
 */
export const redeemPromoCode = async (userId: string, code: string): Promise<{
  success: boolean;
  promoCode?: PromoCode;
  message?: string;
}> => {
  try {
    // First, find the promo code
    const { data: promoCodeData, error: promoCodeError } = await supabase
      .from('promo_codes')
      .select('*')
      .ilike('code', code)
      .single() as { data: PromoCodeDB | null, error: any };
    
    if (promoCodeError || !promoCodeData) {
      return { success: false, message: "Neplatný promo kód" };
    }
    
    const promoCode = mapDbToPromoCode(promoCodeData);
    
    // Check if code is expired
    if (new Date(promoCode.validUntil) < new Date()) {
      return { success: false, message: "Tento promo kód již vypršel" };
    }
    
    // Check if code has reached max uses
    if (promoCode.maxUses !== null && promoCode.usedCount >= promoCode.maxUses) {
      return { success: false, message: "Tento promo kód byl již vyčerpán" };
    }
    
    // Check if user has already redeemed this code
    const { data: existingRedemption, error: redemptionCheckError } = await supabase
      .from('promo_code_redemptions')
      .select('id')
      .eq('user_id', userId)
      .eq('promo_code_id', promoCode.id);
    
    if (existingRedemption && existingRedemption.length > 0) {
      return { success: false, message: "Tento promo kód jste již použili" };
    }
    
    // Begin transaction - actually in Supabase JS we can't do proper transactions, so we'll do this in sequence
    // 1. Record the redemption
    const { error: redemptionError } = await supabase
      .from('promo_code_redemptions')
      .insert({
        user_id: userId,
        promo_code_id: promoCode.id
      });
    
    if (redemptionError) {
      throw redemptionError;
    }
    
    // 2. Update the used count
    const { error: updateError } = await supabase
      .from('promo_codes')
      .update({ used_count: promoCode.usedCount + 1 })
      .eq('id', promoCode.id);
    
    if (updateError) {
      throw updateError;
    }
    
    // Return success with the redeemed promo code
    return { 
      success: true, 
      promoCode: { ...promoCode, usedCount: promoCode.usedCount + 1 }
    };
  } catch (error) {
    console.error("Chyba při uplatňování promo kódu:", error);
    return { success: false, message: "Nastala chyba při aktivaci promo kódu" };
  }
};
