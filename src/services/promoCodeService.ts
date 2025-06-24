
import { supabase } from '@/integrations/supabase/client';

export const activatePromoCode = async (userId: string, promoCodeValue: string) => {
  try {
    console.log('=== PROMO CODE ACTIVATION START ===');
    console.log('Aktivuji promo kód:', promoCodeValue, 'pro uživatele:', userId);
    
    // Nejdříve zkontrolujeme současný stav uživatele
    console.log('Kontroluji současný stav uživatele...');
    const { data: currentProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    console.log('Současný profil uživatele:', currentProfile, 'error:', profileCheckError);
    
    // Získáme promo kód z databáze
    console.log('Hledám promo kód v databázi...');
    const { data: promoCodeData, error: fetchError } = await supabase
      .from('promo_codes')
      .select('*')
      .ilike('code', promoCodeValue.trim())
      .single();

    console.log('Nalezený promo kód:', promoCodeData, 'error:', fetchError);

    if (fetchError || !promoCodeData) {
      console.error('Promo kód nenalezen:', fetchError);
      return { success: false, message: "Neplatný promo kód" };
    }

    // Zkontrolujeme platnost
    console.log('Kontroluji platnost promo kódu...');
    if (new Date(promoCodeData.valid_until) < new Date()) {
      console.log('Promo kód vypršel:', promoCodeData.valid_until);
      return { success: false, message: "Tento promo kód již vypršel" };
    }

    if (promoCodeData.max_uses !== null && promoCodeData.used_count >= promoCodeData.max_uses) {
      console.log('Promo kód vyčerpán. Použití:', promoCodeData.used_count, 'Maximum:', promoCodeData.max_uses);
      return { success: false, message: "Tento promo kód byl již vyčerpán" };
    }

    // Zkontrolujeme, zda uživatel už tento kód nepoužil
    console.log('Kontroluji, zda uživatel už kód nepoužil...');
    const { data: existingRedemption, error: redemptionCheckError } = await supabase
      .from('promo_code_redemptions')
      .select('id')
      .eq('user_id', userId)
      .eq('promo_code_id', promoCodeData.id);

    console.log('Existující redemption:', existingRedemption, 'error:', redemptionCheckError);

    if (existingRedemption && existingRedemption.length > 0) {
      console.log('Uživatel už tento kód použil');
      return { success: false, message: "Tento promo kód jste již použili" };
    }

    console.log('=== ZAČÍNÁM AKTIVACI PREMIUM ===');

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

    console.log('Premium status nastaven v profiles:', profileUpdate, 'error:', profileError);

    if (profileError) {
      console.error('Chyba při aktivaci premium v profiles:', profileError);
      return { success: false, message: "Chyba při aktivaci premium statusu" };
    }

    // KROK 2: Vytvoříme redemption záznam
    console.log('Vytvářím redemption záznam...');
    const { data: redemptionData, error: redemptionError } = await supabase
      .from('promo_code_redemptions')
      .insert({
        user_id: userId,
        promo_code_id: promoCodeData.id
      })
      .select();

    console.log('Redemption záznam vytvořen:', redemptionData, 'error:', redemptionError);

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

    // KROK 3: Aktualizujeme počet použití promo kódu
    console.log('Aktualizuji počet použití promo kódu...');
    const { data: incrementData, error: incrementError } = await supabase
      .from('promo_codes')
      .update({ 
        used_count: promoCodeData.used_count + 1 
      })
      .eq('id', promoCodeData.id)
      .select();

    console.log('Počet použití aktualizován:', incrementData, 'error:', incrementError);

    if (incrementError) {
      console.error('Chyba při aktualizaci počtu použití:', incrementError);
      // Nevrátíme chybu, protože premium už je aktivován
    }

    // KROK 4: Ověříme, že se premium skutečně nastavil
    console.log('Ověřuji nastavení premium...');
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('is_premium, premium_expiry')
      .eq('id', userId)
      .single();

    console.log('Premium status ověřen:', verifyProfile, 'error:', verifyError);

    if (verifyError || !verifyProfile?.is_premium) {
      console.error('Ověření premium statusu selhalo:', verifyError, verifyProfile);
      return { success: false, message: "Premium se nepodařilo aktivovat správně" };
    }

    console.log('=== PROMO CODE ACTIVATION SUCCESS ===');
    console.log('Premium aktivován do:', premiumExpiry.toISOString());
    
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
    console.error('=== PROMO CODE ACTIVATION ERROR ===');
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
