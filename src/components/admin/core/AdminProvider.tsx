
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
  const { isAdmin } = useAuth();
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
    if (!isAdmin) return;
    
    setIsLoading(true);
    try {
      // Parallel queries for better performance
      const [
        usersResult,
        vehiclesResult,
        shiftsResult,
        userStatsResult
      ] = await Promise.all([
        supabase.from('profiles').select('id, is_premium, created_at'),
        supabase.from('vehicles').select('id'),
        supabase.from('shifts').select('id'),
        supabase.from('user_statistics').select('user_id, last_login')
      ]);

      const users = usersResult.data || [];
      const totalUsers = users.length;
      const premiumUsers = users.filter(u => u.is_premium).length;
      
      // Active users (logged in within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const userStatsMap = new Map(
        (userStatsResult.data || []).map(stat => [stat.user_id, stat.last_login])
      );
      
      const activeUsers = users.filter(user => {
        const lastLogin = userStatsMap.get(user.id);
        return lastLogin && new Date(lastLogin) > thirtyDaysAgo;
      }).length;

      setStats({
        totalUsers,
        premiumUsers,
        activeUsers,
        systemHealth: 99.8,
        totalVehicles: vehiclesResult.data?.length || 0,
        totalShifts: shiftsResult.data?.length || 0
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
    if (isAdmin) {
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
  }, [isAdmin]);

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
