
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface UserStats {
  totalUsers: number;
  premiumUsers: number;
  adminUsers: number;
  activeUsers: number;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    premiumUsers: 0,
    adminUsers: 0,
    activeUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

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

      const totalUsers = enrichedUsers.length;
      const premiumUsers = enrichedUsers.filter(u => u.is_premium).length;
      const adminUsers = enrichedUsers.filter(u => u.is_admin).length;
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsers = enrichedUsers.filter(u => 
        u.last_login && new Date(u.last_login) > thirtyDaysAgo
      ).length;

      setStats({
        totalUsers,
        premiumUsers,
        adminUsers,
        activeUsers
      });

      console.log(`Loaded ${totalUsers} users`);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Nepodařilo se načíst uživatele');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePremium = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const newPremiumStatus = !user.is_premium;
      const premiumExpiry = newPremiumStatus 
        ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: newPremiumStatus,
          premium_expiry: premiumExpiry
        })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, is_premium: newPremiumStatus, premium_expiry: premiumExpiry }
          : u
      ));

      toast.success(`Premium status ${newPremiumStatus ? 'aktivován' : 'deaktivován'}`);
    } catch (error) {
      console.error('Error toggling premium:', error);
      toast.error('Nepodařilo se změnit premium status');
    }
  };

  const toggleAdmin = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const newAdminStatus = !user.is_admin;

      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: newAdminStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, is_admin: newAdminStatus }
          : u
      ));

      toast.success(`Admin práva ${newAdminStatus ? 'udělena' : 'odebrána'}`);
    } catch (error) {
      console.error('Error toggling admin:', error);
      toast.error('Nepodařilo se změnit admin práva');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      if (!confirm(`Opravdu chcete smazat uživatele ${user.email}? Tato akce je nevratná.`)) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Nejste přihlášeni');
        return;
      }

      const response = await fetch('/functions/v1/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ userId })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Nepodařilo se smazat uživatele');
      }

      setUsers(prev => prev.filter(u => u.id !== userId));
      setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      
      toast.success('Uživatel byl úspěšně smazán');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error instanceof Error ? error.message : 'Nepodařilo se smazat uživatele');
    }
  };

  const exportUsers = async () => {
    try {
      const csvContent = [
        ['Email', 'Username', 'Premium', 'Admin', 'Registrace', 'Poslední přihlášení'].join(','),
        ...users.map(user => [
          user.email,
          user.username || '',
          user.is_premium ? 'Ano' : 'Ne',
          user.is_admin ? 'Ano' : 'Ne',
          new Date(user.created_at).toLocaleDateString('cs-CZ'),
          user.last_login ? new Date(user.last_login).toLocaleDateString('cs-CZ') : 'Nikdy'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `uzivatele_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast.success('Export dokončen');
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('Nepodařilo se exportovat uživatele');
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
    togglePremium,
    toggleAdmin,
    deleteUser,
    exportUsers,
    refetch
  };
};
