import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';

interface UserAnalytics {
  userId: string | undefined;
  isAdmin: boolean;
  isPremium: boolean;
}

export const useUserAnalytics = () => {
  const { user, isAdmin, isPremium } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics>({
    userId: user?.id,
    isAdmin: isAdmin,
    isPremium: isPremium,
  });

  useEffect(() => {
    setAnalytics({
      userId: user?.id,
      isAdmin: isAdmin,
      isPremium: isPremium,
    });
  }, [user, isAdmin, isPremium]);

  return analytics;
};

