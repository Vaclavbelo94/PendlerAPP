
import { supabase } from '@/integrations/supabase/client';

export const fixPromoCodeIssues = async () => {
  console.log('=== FIXING PROMO CODE ISSUES ===');
  
  try {
    // Kontrola a aktualizace DHL2026
    const { data: existingPromo, error: fetchError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', 'DHL2026')
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching DHL2026 promo code:', fetchError);
      return { success: false, message: 'Could not fetch promo code' };
    }
    
    if (existingPromo) {
      console.log('Found existing DHL2026 promo code:', existingPromo);
      
      // Aktualizace expiry date na 2025-12-31
      const { data: updatedPromo, error: updateError } = await supabase
        .from('promo_codes')
        .update({ 
          valid_until: '2025-12-31T23:59:59.999Z',
          used_count: 0 // Reset usage count
        })
        .eq('id', existingPromo.id)
        .select();
      
      if (updateError) {
        console.error('Error updating DHL2026 promo code:', updateError);
        return { success: false, message: 'Could not update promo code expiry' };
      }
      
      console.log('✅ Updated DHL2026 promo code:', updatedPromo);
    } else {
      // Vytvoření DHL2026 promo kódu pokud neexistuje
      console.log('Creating DHL2026 promo code...');
      
      const { data: newPromo, error: createError } = await supabase
        .from('promo_codes')
        .insert({
          code: 'DHL2026',
          discount: 100,
          duration: 3,
          valid_until: '2025-12-31T23:59:59.999Z',
          used_count: 0,
          max_uses: 100
        })
        .select();
      
      if (createError) {
        console.error('Error creating DHL2026 promo code:', createError);
        return { success: false, message: 'Could not create promo code' };
      }
      
      console.log('✅ Created DHL2026 promo code:', newPromo);
    }
    
    return { success: true, message: 'Promo code issues fixed' };
  } catch (error) {
    console.error('❌ Error fixing promo code issues:', error);
    return { success: false, message: 'Unexpected error' };
  }
};

// Expose function globally but disable auto-execution
if (typeof window !== 'undefined') {
  (window as any).fixPromoCodeIssues = fixPromoCodeIssues;
  
  // DEACTIVATED: Automatic execution commented out
  // setTimeout(() => {
  //   fixPromoCodeIssues().then(result => {
  //     console.log('Auto promo code fix result:', result);
  //   }).catch(error => {
  //     console.error('Error in auto promo code fix:', error);
  //   });
  // }, 1000);
}
