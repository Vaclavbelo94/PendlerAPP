
import { useState } from 'react';
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

export const useUserActions = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
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

      if (!confirm(`Opravdu chcete smazat uživatele ${user.email}?`)) return;

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.filter(u => u.id !== userId));
      
      toast.success('Uživatel byl smazán');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Nepodařilo se smazat uživatele');
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

  return {
    togglePremium,
    toggleAdmin,
    deleteUser,
    exportUsers
  };
};
