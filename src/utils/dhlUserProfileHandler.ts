
import { supabase } from '@/integrations/supabase/client';

/**
 * Utility for handling DHL user profile setup after registration
 */
export const setupDHLUserProfile = async (userId: string, userMetadata: any) => {
  try {
    console.log('Setting up DHL user profile for:', userId);
    console.log('User metadata:', userMetadata);
    
    if (userMetadata?.isDHLUser || userMetadata?.isDHLEmployee) {
      // Update the user's profile to mark them as DHL user
      const { error } = await supabase
        .from('profiles')
        .update({
          // We could add a is_dhl_user column in the future
          // For now, we rely on user_metadata
        })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating DHL user profile:', error);
        return false;
      }
      
      console.log('DHL user profile setup completed');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Exception in DHL profile setup:', error);
    return false;
  }
};

/**
 * Check if user should be redirected to DHL setup
 */
export const shouldRedirectToDHLSetup = (user: any, userAssignment: any) => {
  if (!user) return false;
  
  // Check if user is DHL user from metadata
  const isDHLUser = user.user_metadata?.isDHLUser || user.user_metadata?.isDHLEmployee;
  
  if (isDHLUser && !userAssignment) {
    return true;
  }
  
  return false;
};
