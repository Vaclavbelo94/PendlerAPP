
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  adminUsers: number;
  activeUsers: number;
  systemHealth: number;
  todaySignups: number;
  monthlyRevenue: number;
}

interface AdminContextType {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  stats: AdminStats;
  refreshStats: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    premiumUsers: 0,
    adminUsers: 0,
    activeUsers: 0,
    systemHealth: 98,
    todaySignups: 0,
    monthlyRevenue: 0
  });

  const fetchStats = async () => {
    try {
      setIsLoading(true);

      // Fetch user statistics
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('is_premium, is_admin, created_at');

      if (profilesError) throw profilesError;

      // Fetch user activity statistics  
      const { data: userStats, error: statsError } = await supabase
        .from('user_statistics')
        .select('last_login');

      if (statsError) console.warn('Could not fetch user activity:', statsError);

      // Calculate statistics
      const totalUsers = profiles.length;
      const premiumUsers = profiles.filter(p => p.is_premium).length;
      const adminUsers = profiles.filter(p => p.is_admin).length;

      // Active users in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsers = userStats?.filter(s => 
        s.last_login && new Date(s.last_login) > thirtyDaysAgo
      ).length || 0;

      // Today's signups
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySignups = profiles.filter(p => 
        new Date(p.created_at) >= today
      ).length;

      // Monthly revenue calculation (simplified)
      const monthlyRevenue = premiumUsers * 15; // Assuming 15 EUR per premium user

      setStats({
        totalUsers,
        premiumUsers,
        adminUsers,
        activeUsers,
        systemHealth: Math.min(98 + Math.random() * 2, 100), // Simulated system health
        todaySignups,
        monthlyRevenue
      });

    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStats = () => {
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminContext.Provider value={{
      currentSection,
      setCurrentSection,
      stats,
      refreshStats,
      isLoading
    }}>
      {children}
    </AdminContext.Provider>
  );
};
