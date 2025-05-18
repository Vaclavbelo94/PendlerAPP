
import { supabase } from '@/integrations/supabase/client';

export const fetchUserProfileData = async (userId: string) => {
  try {
    // Fetch basic profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('username, email')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Fetch extended profile data
    const { data: extendedProfile, error: extendedError } = await supabase
      .from('user_extended_profiles')
      .select('display_name, location')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (extendedError && extendedError.code !== 'PGRST116') throw extendedError;
    
    // Fetch work preferences
    const { data: workPreferences, error: workError } = await supabase
      .from('user_work_preferences')
      .select('willing_to_travel_km, notes')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (workError && workError.code !== 'PGRST116') throw workError;
    
    return {
      name: extendedProfile?.display_name || profileData.username || '',
      email: profileData.email || '',
      address: extendedProfile?.location || '',
      commuteDistance: workPreferences?.willing_to_travel_km?.toString() || '',
      additionalNotes: workPreferences?.notes || ''
    };
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
  }
};
