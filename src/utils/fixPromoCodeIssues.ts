
import { supabase } from '@/integrations/supabase/client';

export const fixPromoCodeIssues = async () => {
  console.log('=== FIXING PROMO CODE ISSUES ===');
  
  try {
    // First, check if DHL2025 exists and update its expiry date
    const { data: existingPromo, error: fetchError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', 'DHL2025')
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching DHL2025 promo code:', fetchError);
      return { success: false, message: 'Could not fetch promo code' };
    }
    
    if (existingPromo) {
      console.log('Found existing DHL2025 promo code:', existingPromo);
      
      // Update expiry date to 2025-12-31
      const { data: updatedPromo, error: updateError } = await supabase
        .from('promo_codes')
        .update({ 
          valid_until: '2025-12-31T23:59:59.999Z',
          used_count: 0 // Reset usage count
        })
        .eq('id', existingPromo.id)
        .select();
      
      if (updateError) {
        console.error('Error updating DHL2025 promo code:', updateError);
        return { success: false, message: 'Could not update promo code expiry' };
      }
      
      console.log('Updated DHL2025 promo code:', updatedPromo);
    } else {
      // Create DHL2025 promo code if it doesn't exist
      console.log('Creating DHL2025 promo code...');
      
      const { data: newPromo, error: createError } = await supabase
        .from('promo_codes')
        .insert({
          code: 'DHL2025',
          discount: 100,
          duration: 3,
          valid_until: '2025-12-31T23:59:59.999Z',
          used_count: 0,
          max_uses: 100
        })
        .select();
      
      if (createError) {
        console.error('Error creating DHL2025 promo code:', createError);
        return { success: false, message: 'Could not create promo code' };
      }
      
      console.log('Created DHL2025 promo code:', newPromo);
    }
    
    return { success: true, message: 'Promo code issues fixed' };
  } catch (error) {
    console.error('Error fixing promo code issues:', error);
    return { success: false, message: 'Unexpected error' };
  }
};

// Auto-execute the function when this file is imported
if (typeof window !== 'undefined') {
  // Add to window for manual execution from console
  (window as any).fixPromoCodeIssues = fixPromoCodeIssues;
  
  // Automatically try to fix promo code issues on page load
  setTimeout(() => {
    fixPromoCodeIssues().then(result => {
      console.log('Auto promo code fix result:', result);
    });
  }, 1000);
}
