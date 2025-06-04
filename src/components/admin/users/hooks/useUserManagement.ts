
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserStats } from './useUserStats';
import { useUserActions } from './useUserActions';

interface User {
  id: string;
  email: string;
  username: string | null;
  is_premium: boolean;
  is_admin: boolean;
  created_at: string;
  last_login: string | null;
  premium_expiry: string | null;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const stats = useUserStats(users);
  const userActions = useUserActions(users, setUsers);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          username,
          is_premium,
          is_admin,
          created_at,
          premium_expiry
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: userStats, error: statsError } = await supabase
        .from('user_statistics')
        .select('user_id, last_login');

      if (statsError) console.warn('Could not fetch user statistics:', statsError);

      const enrichedUsers: User[] = profiles.map(profile => {
        const userStat = userStats?.find(stat => stat.user_id === profile.id);
        return {
          ...profile,
          last_login: userStat?.last_login || null
        };
      });

      setUsers(enrichedUsers);
      console.log(`Loaded ${enrichedUsers.length} users`);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    stats,
    isLoading,
    ...userActions,
    refetch
  };
};
