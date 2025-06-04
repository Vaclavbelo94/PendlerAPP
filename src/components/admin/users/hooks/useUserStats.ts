
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  totalUsers: number;
  premiumUsers: number;
  adminUsers: number;
  activeUsers: number;
}

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

export const useUserStats = (users: User[]) => {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    premiumUsers: 0,
    adminUsers: 0,
    activeUsers: 0
  });

  useEffect(() => {
    const totalUsers = users.length;
    const premiumUsers = users.filter(u => u.is_premium).length;
    const adminUsers = users.filter(u => u.is_admin).length;
    
    // Active users = users who logged in within last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = users.filter(u => 
      u.last_login && new Date(u.last_login) > thirtyDaysAgo
    ).length;

    setStats({
      totalUsers,
      premiumUsers,
      adminUsers,
      activeUsers
    });
  }, [users]);

  return stats;
};
