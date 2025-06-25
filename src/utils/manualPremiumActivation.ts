
import { supabase } from '@/integrations/supabase/client';
import { activatePromoCode } from '@/services/promoCodeService';

export const manuallyActivatePremiumForTestUser = async () => {
  console.log('=== MANUAL PREMIUM ACTIVATION START ===');
  
  try {
    // Find the test user using a different approach to avoid 406 error
    const { data: { users }, error: listUsersError } = await supabase.auth.admin.listUsers();
    
    if (listUsersError) {
      console.error('Error listing users:', listUsersError);
      // Fallback: try direct profile query
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
      
      // Activate premium with DHL2025 promo code
      const result = await activatePromoCode(userData.id, 'DHL2025');
      
      console.log('Manual activation result:', result);
      
      if (result.success) {
        console.log('Premium successfully activated for test@gmail.com');
        return { success: true, message: 'Premium activated successfully' };
      } else {
        console.error('Failed to activate premium:', result.message);
        return { success: false, message: result.message };
      }
    }

    const testUser = users?.find(user => user.email === 'test@gmail.com');
    
    if (!testUser) {
      console.error('User test@gmail.com not found in user list');
      return { success: false, message: 'User not found' };
    }
    
    console.log('Found test user:', testUser);
    
    // Activate premium with DHL2025 promo code
    const result = await activatePromoCode(testUser.id, 'DHL2025');
    
    console.log('Manual activation result:', result);
    
    if (result.success) {
      console.log('Premium successfully activated for test@gmail.com');
      return { success: true, message: 'Premium activated successfully' };
    } else {
      console.error('Failed to activate premium:', result.message);
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error('Error in manual premium activation:', error);
    return { success: false, message: 'Unexpected error' };
  }
};

// Auto-execute the function when this file is imported
if (typeof window !== 'undefined') {
  // Add to window for manual execution from console
  (window as any).manuallyActivatePremiumForTestUser = manuallyActivatePremiumForTestUser;
  
  // Automatically try to activate premium for test user on page load
  setTimeout(() => {
    manuallyActivatePremiumForTestUser().then(result => {
      console.log('Auto premium activation result:', result);
    });
  }, 2000);
}
