
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  activeUsers: number;
  systemHealth: number;
  totalVehicles: number;
  totalShifts: number;
}

interface AdminContextType {
  stats: AdminStats;
  isLoading: boolean;
  refreshStats: () => Promise<void>;
  currentSection: string | null;
  setCurrentSection: (section: string | null) => void;
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
  const { unifiedUser } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    premiumUsers: 0,
    activeUsers: 0,
    systemHealth: 99.8,
    totalVehicles: 0,
    totalShifts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<string | null>(null);

  const refreshStats = async () => {
    if (!unifiedUser?.isAdmin) return;
    
    setIsLoading(true);
    try {
      // Use security definer function to avoid RLS recursion
      const { data: adminStats, error } = await supabase.rpc('get_admin_statistics');
      
      if (error) {
        throw error;
      }

      const stats = (adminStats || {}) as Record<string, any>;
      
      // Calculate active users from user_statistics if available
      let activeUsers = 0;
      try {
        const { data: userStatsResult } = await supabase
          .from('user_statistics')
          .select('user_id, last_login');
          
        if (userStatsResult) {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          activeUsers = userStatsResult.filter(stat => 
            stat.last_login && new Date(stat.last_login) > thirtyDaysAgo
          ).length;
        }
      } catch (userStatsError) {
        console.warn('Could not load user statistics:', userStatsError);
      }

      // Get vehicle count separately (not in security definer function yet)
      let totalVehicles = 0;
      try {
        const { count } = await supabase
          .from('vehicles')
          .select('*', { count: 'exact', head: true });
        totalVehicles = count || 0;
      } catch (vehicleError) {
        console.warn('Could not load vehicle count:', vehicleError);
      }

      setStats({
        totalUsers: Number(stats.total_users) || 0,
        premiumUsers: Number(stats.premium_users) || 0,
        activeUsers,
        systemHealth: 99.8,
        totalVehicles,
        totalShifts: Number(stats.active_shifts) || 0
      });
    } catch (error) {
      console.error('Chyba při načítání admin statistik:', error);
      // Set fallback values in case of error
      setStats(prev => ({
        ...prev,
        systemHealth: 85.0 // Lower health to indicate issues
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (unifiedUser?.isAdmin) {
      refreshStats();
      
      // Set up real-time subscriptions for live updates
      const channel = supabase
        .channel('admin-dashboard-updates')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'profiles' }, 
          () => refreshStats()
        )
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'vehicles' }, 
          () => refreshStats()
        )
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'shifts' }, 
          () => refreshStats()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [unifiedUser?.isAdmin]);

  const value = {
    stats,
    isLoading,
    refreshStats,
    currentSection,
    setCurrentSection
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
