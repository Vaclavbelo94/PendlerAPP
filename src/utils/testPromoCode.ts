
import { supabase } from '@/integrations/supabase/client';
import { activatePromoCode } from '@/services/promoCodeService';

export const testDHL2026PromoCode = async () => {
  console.log('=== TESTING DHL2026 PROMO CODE ===');
  
  try {
    // Nejdříve zkontrolujeme, zda promo kód existuje v databázi
    console.log('1. Kontroluji existenci DHL2026 v databázi...');
    const { data: promoCode, error: fetchError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', 'DHL2026')
      .single();
    
    if (fetchError || !promoCode) {
      console.error('❌ DHL2026 promo kód nenalezen v databázi:', fetchError);
      return { success: false, message: 'Promo kód nenalezen' };
    }
    
    console.log('✅ DHL2026 nalezen:', promoCode);
    
    // Zkontrolujeme platnost
    const validUntil = new Date(promoCode.valid_until);
    const now = new Date();
    console.log('2. Kontroluji platnost:', {
      validUntil: validUntil.toISOString(),
      now: now.toISOString(),
      isValid: validUntil > now
    });
    
    if (validUntil <= now) {
      console.error('❌ Promo kód vypršel');
      return { success: false, message: 'Promo kód vypršel' };
    }
    
    // Zkontrolujeme počet použití
    console.log('3. Kontroluji limity použití:', {
      usedCount: promoCode.used_count,
      maxUses: promoCode.max_uses,
      canBeUsed: promoCode.max_uses === null || promoCode.used_count < promoCode.max_uses
    });
    
    if (promoCode.max_uses !== null && promoCode.used_count >= promoCode.max_uses) {
      console.error('❌ Promo kód dosáhl maximálního počtu použití');
      return { success: false, message: 'Promo kód vyčerpán' };
    }
    
    console.log('✅ DHL2026 je platný a připravený k použití');
    console.log('✅ Detaily:', {
      sleva: `${promoCode.discount}%`,
      délka: `${promoCode.duration} měsíců`,
      použití: `${promoCode.used_count}/${promoCode.max_uses || '∞'}`,
      platný_do: validUntil.toLocaleDateString('cs-CZ')
    });
    
    return { 
      success: true, 
      promoCode,
      summary: {
        code: promoCode.code,
        discount: promoCode.discount,
        duration: promoCode.duration,
        validUntil: validUntil.toLocaleDateString('cs-CZ'),
        usageInfo: `${promoCode.used_count}/${promoCode.max_uses || '∞'}`
      }
    };
    
  } catch (error) {
    console.error('❌ Chyba při testování DHL2026:', error);
    return { success: false, message: 'Chyba při testování' };
  }
};

export const testPromoCodeActivation = async (userId: string) => {
  console.log('=== TESTING PROMO CODE ACTIVATION ===');
  console.log('User ID:', userId);
  
  try {
    const result = await activatePromoCode(userId, 'DHL2026');
    
    if (result.success) {
      console.log('✅ Aktivace úspěšná:', result);
    } else {
      console.log('❌ Aktivace neúspěšná:', result.message);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Chyba při aktivaci:', error);
    return { success: false, message: 'Chyba při aktivaci' };
  }
};

// Auto-spuštění testů při importu v prohlížeči
if (typeof window !== 'undefined') {
  (window as any).testDHL2026PromoCode = testDHL2026PromoCode;
  (window as any).testPromoCodeActivation = testPromoCodeActivation;
  
  // Automatický test při načtení
  setTimeout(() => {
    testDHL2026PromoCode().then(result => {
      console.log('=== VÝSLEDEK AUTOMATICKÉHO TESTU DHL2026 ===');
      if (result.success) {
        console.log('✅ Test proběhl úspěšně');
        console.log('📊 Shrnutí:', result.summary);
      } else {
        console.log('❌ Test selhal:', result.message);
      }
    });
  }, 3000);
}
