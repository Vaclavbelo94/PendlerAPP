
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

export const usePremiumStatus = (
  user: User | null,
  refreshAuthPremiumStatus: () => Promise<{ isPremium: boolean; premiumExpiry?: string }>,
  isAdmin: boolean
) => {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (user && !isAdmin) {
      refreshAuthPremiumStatus().then(result => {
        setIsPremium(result.isPremium);
      });
    }
  }, [user, isAdmin, refreshAuthPremiumStatus]);

  return {
    isPremium,
    setIsPremium
  };
};
