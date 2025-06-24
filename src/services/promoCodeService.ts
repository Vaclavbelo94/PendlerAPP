
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

    // KROK 1: Nejdříve nastavíme premium status v profiles
    const premiumExpiry = new Date();
    premiumExpiry.setMonth(premiumExpiry.getMonth() + promoCodeData.duration);
    
    console.log('Nastavuji premium do:', premiumExpiry.toISOString());

    const { data: profileUpdate, error: profileError } = await supabase
      .from('profiles')
      .update({ 
        is_premium: true,
        premium_expiry: premiumExpiry.toISOString()
      })
      .eq('id', userId)
      .select();

    if (profileError) {
      console.error('Chyba při aktivaci premium v profiles:', profileError);
      return { success: false, message: "Chyba při aktivaci premium statusu" };
    }

    console.log('Premium status nastaven v profiles:', profileUpdate);

    // KROK 2: Teprve pak vytvoříme redemption záznam
    const { data: redemptionData, error: redemptionError } = await supabase
      .from('promo_code_redemptions')
      .insert({
        user_id: userId,
        promo_code_id: promoCodeData.id
      })
      .select();

    if (redemptionError) {
      console.error('Chyba při vytváření redemption záznamu:', redemptionError);
      // Pokud se nepodaří vytvořit redemption, vrátíme premium zpět
      await supabase
        .from('profiles')
        .update({ 
          is_premium: false,
          premium_expiry: null
        })
        .eq('id', userId);
      return { success: false, message: "Chyba při zaznamenání aktivace promo kódu" };
    }

    console.log('Redemption záznam vytvořen:', redemptionData);

    // KROK 3: Aktualizujeme počet použití promo kódu
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

    // KROK 4: Ověříme, že se premium skutečně nastavil
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('is_premium, premium_expiry')
      .eq('id', userId)
      .single();

    if (verifyError || !verifyProfile?.is_premium) {
      console.error('Ověření premium statusu selhalo:', verifyError, verifyProfile);
      return { success: false, message: "Premium se nepodařilo aktivovat správně" };
    }

    console.log('Premium status ověřen:', verifyProfile);
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

// Přidáme funkci pro manuální opravu existujících uživatelů
export const fixExistingPromoCodeUsers = async (userId: string) => {
  try {
    console.log('Opravuji premium status pro uživatele s existujícím redemption:', userId);
    
    // Najdeme všechny redemption záznamy uživatele
    const { data: redemptions, error: redemptionError } = await supabase
      .from('promo_code_redemptions')
      .select(`
        *,
        promo_codes (*)
      `)
      .eq('user_id', userId);

    if (redemptionError || !redemptions || redemptions.length === 0) {
      console.log('Žádné redemption záznamy nenalezeny');
      return { success: false, message: "Žádné promo kódy k opravě" };
    }

    // Vezměme nejnovější redemption s největším duration
    const latestRedemption = redemptions.reduce((latest, current) => {
      const currentDate = new Date(current.redeemed_at);
      const latestDate = new Date(latest.redeemed_at);
      return currentDate > latestDate ? current : latest;
    });

    if (!latestRedemption.promo_codes) {
      return { success: false, message: "Promo kód data nenalezena" };
    }

    // Aktivujeme premium na základě nejnovějšího promo kódu
    const premiumExpiry = new Date(latestRedemption.redeemed_at);
    premiumExpiry.setMonth(premiumExpiry.getMonth() + latestRedemption.promo_codes.duration);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        is_premium: true,
        premium_expiry: premiumExpiry.toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Chyba při opravě premium statusu:', updateError);
      return { success: false, message: "Chyba při opravě premium statusu" };
    }

    console.log('Premium status opraven, platný do:', premiumExpiry.toISOString());
    return { success: true };
  } catch (error) {
    console.error('Chyba při opravě existujících uživatelů:', error);
    return { success: false, message: "Chyba při opravě premium statusu" };
  }
};
