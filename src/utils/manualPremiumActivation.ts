
import { supabase } from '@/integrations/supabase/client';
import { activatePromoCode } from '@/services/promoCodeService';

export const manuallyActivatePremiumForTestUser = async () => {
  console.log('=== MANUAL PREMIUM ACTIVATION START ===');
  
  try {
    // Optimalizované hledání testovacího uživatele
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', 'test@gmail.com')
      .maybeSingle();
    
    if (userError) {
      console.error('Error fetching user profile:', userError);
      return { success: false, message: 'Database error' };
    }
    
    if (!userData) {
      console.error('User test@gmail.com not found');
      return { success: false, message: 'User not found' };
    }
    
    console.log('Found test user via profiles:', userData);
    
    // Aktivace premium s DHL2026 promo kódem
    const result = await activatePromoCode(userData.id, 'DHL2026');
    
    console.log('Manual activation result:', result);
    
    if (result.success) {
      console.log('✅ Premium successfully activated for test@gmail.com');
      return { success: true, message: 'Premium activated successfully' };
    } else {
      console.error('❌ Failed to activate premium:', result.message);
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error('❌ Error in manual premium activation:', error);
    return { success: false, message: 'Unexpected error' };
  }
};

// Expose function globally but disable auto-execution
if (typeof window !== 'undefined') {
  (window as any).manuallyActivatePremiumForTestUser = manuallyActivatePremiumForTestUser;
  
  // DEACTIVATED: Automatic execution commented out
  // setTimeout(() => {
  //   manuallyActivatePremiumForTestUser().then(result => {
  //     console.log('Auto premium activation result:', result);
  //   }).catch(error => {
  //     console.error('Error in auto premium activation:', error);
  //   });
  // }, 1500);
}
