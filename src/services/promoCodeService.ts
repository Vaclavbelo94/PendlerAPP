
import { supabase } from '@/integrations/supabase/client';

export const activatePromoCode = async (userId: string, promoCodeValue: string) => {
  try {
    console.log('Aktivuji promo kód:', promoCodeValue, 'pro uživatele:', userId);
    
    // Získáme promo kód z databáze
    const { data: promoCodeData, error: fetchError } = await supabase
      .from('promo_codes')
      .select('*')
      .ilike('code', promoCodeValue.trim())
      .single();

    if (fetchError || !promoCodeData) {
      console.error('Promo kód nenalezen:', fetchError);
      return { success: false, message: "Neplatný promo kód" };
    }

    console.log('Nalezen promo kód:', promoCodeData);

    // Zkontrolujeme platnost
    if (new Date(promoCodeData.valid_until) < new Date()) {
      return { success: false, message: "Tento promo kód již vypršel" };
    }

    if (promoCodeData.max_uses !== null && promoCodeData.used_count >= promoCodeData.max_uses) {
      return { success: false, message: "Tento promo kód byl již vyčerpán" };
    }

    // Zkontrolujeme, zda uživatel už tento kód nepoužil
    const { data: existingRedemption } = await supabase
      .from('promo_code_redemptions')
      .select('id')
      .eq('user_id', userId)
      .eq('promo_code_id', promoCodeData.id);

    if (existingRedemption && existingRedemption.length > 0) {
      return { success: false, message: "Tento promo kód jste již použili" };
    }

    console.log('Promo kód je platný, aktivuji premium...');

    // Nastavíme premium status v profiles
    const premiumExpiry = new Date();
    premiumExpiry.setMonth(premiumExpiry.getMonth() + promoCodeData.duration);
    
    console.log('Nastavuji premium do:', premiumExpiry.toISOString());

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        is_premium: true,
        premium_expiry: premiumExpiry.toISOString()
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Chyba při aktivaci premium v profiles:', profileError);
      return { success: false, message: "Chyba při aktivaci premium statusu" };
    }

    console.log('Premium status nastaven, vytvářím redemption záznam...');

    // Vytvoříme redemption záznam
    const { error: redemptionError } = await supabase
      .from('promo_code_redemptions')
      .insert({
        user_id: userId,
        promo_code_id: promoCodeData.id
      });

    if (redemptionError) {
      console.error('Chyba při vytváření redemption záznamu:', redemptionError);
      // Nevrátíme chybu, protože premium už je aktivován
    }

    // Aktualizujeme počet použití promo kódu
    const { error: incrementError } = await supabase
      .from('promo_codes')
      .update({ 
        used_count: promoCodeData.used_count + 1 
      })
      .eq('id', promoCodeData.id);

    if (incrementError) {
      console.error('Chyba při aktualizaci počtu použití:', incrementError);
      // Nevrátíme chybu, protože premium už je aktivován
    }

    console.log('Promo kód úspěšně aktivován, premium do:', premiumExpiry.toISOString());
    
    return { 
      success: true, 
      promoCode: {
        id: promoCodeData.id,
        code: promoCodeData.code,
        discount: promoCodeData.discount,
        duration: promoCodeData.duration,
        usedCount: promoCodeData.used_count + 1
      }
    };
  } catch (error) {
    console.error('Výjimka při aktivaci promo kódu:', error);
    return { success: false, message: "Nastala chyba při aktivaci promo kódu" };
  }
};
