
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
      // Načtení statistik z databáze
      const [usersResult, vehiclesResult, shiftsResult] = await Promise.all([
        supabase.from('profiles').select('id, is_premium, created_at'),
        supabase.from('vehicles').select('id'),
        supabase.from('shifts').select('id')
      ]);

      const users = usersResult.data || [];
      const totalUsers = users.length;
      const premiumUsers = users.filter(u => u.is_premium).length;
      
      // Aktivní uživatelé (registrovaní za posledních 30 dní)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsers = users.filter(u => 
        new Date(u.created_at) > thirtyDaysAgo
      ).length;

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      refreshStats();
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
