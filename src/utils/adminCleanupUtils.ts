import { supabase } from '@/integrations/supabase/client';

export const KEEP_ACCOUNTS = [
  'admin@pendlerapp.com',
  'admin_dhl@pendlerapp.com', 
  'vaclavbelo94@gmail.com'
];

export const identifyUnwantedAccounts = async () => {
  try {
    // Get all profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, username, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filter out accounts to keep
    const unwantedAccounts = profiles.filter(profile => 
      profile.email && !KEEP_ACCOUNTS.includes(profile.email.toLowerCase())
    );

    return {
      unwantedAccounts,
      totalAccounts: profiles.length,
      keepAccounts: profiles.filter(profile => 
        profile.email && KEEP_ACCOUNTS.includes(profile.email.toLowerCase())
      )
    };
  } catch (error) {
    console.error('Error identifying unwanted accounts:', error);
    throw error;
  }
};

export const cleanupUnwantedAccounts = async (userIds: string[]) => {
  try {
    console.log('Starting cleanup for users:', userIds);

    // Call the edge function to handle auth.users deletion
    const { data, error } = await supabase.functions.invoke('admin-cleanup-users', {
      body: { userIds }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }

    console.log('Cleanup completed:', data);
    return data;
  } catch (error) {
    console.error('Error in cleanup process:', error);
    throw error;
  }
};
