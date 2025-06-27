import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface UserAnalytics {
  totalLogins: number;
  lastLogin: string | null;
  accountAgeDays: number;
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics>({
    totalLogins: 0,
    lastLogin: null,
    accountAgeDays: 0,
  });

  useEffect(() => {
    if (user?.id) {
      loadUserAnalytics();
    }
  }, [user?.id]);

  const loadUserAnalytics = async () => {
    try {
      // Mock data - replace with actual data fetching from Supabase
      const totalLogins = Math.floor(Math.random() * 100);
      const lastLogin = new Date().toLocaleDateString();
      const accountAgeDays = Math.floor(Math.random() * 365);

      setAnalytics({
        totalLogins,
        lastLogin,
        accountAgeDays,
      });
    } catch (error) {
      console.error('Error loading user analytics:', error);
    }
  };

  return {
    analytics,
  };
};

