
import * as React from 'react';
import { User } from '@supabase/supabase-js';

interface PremiumStatus {
  isPremium: boolean;
  isVerified: boolean;
  isLoading: boolean;
}

// In-memory cache for premium status
const premiumCache = new Map<string, { status: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const usePremiumManager = (user: User | null) => {
  const [status, setStatus] = React.useState<PremiumStatus>({
    isPremium: false,
    isVerified: false,
    isLoading: true,
  });

  const checkPremiumStatus = React.useCallback(async (userId: string, email: string) => {
    // Check cache first
    const cached = premiumCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.status;
    }

    // Special users get instant premium
    const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com'];
    if (specialEmails.includes(email)) {
      const premiumStatus = true;
      premiumCache.set(userId, { status: premiumStatus, timestamp: Date.now() });
      return premiumStatus;
    }

    // Check localStorage for fallback
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const userData = JSON.parse(userStr);
        if (userData.isPremium && userData.premiumUntil) {
          const premiumExpiry = new Date(userData.premiumUntil);
          const isPremiumActive = premiumExpiry > new Date();
          premiumCache.set(userId, { status: isPremiumActive, timestamp: Date.now() });
          return isPremiumActive;
        }
      }
    } catch (error) {
      console.warn('Error checking localStorage premium status:', error);
    }

    // Default to false for regular users
    const defaultStatus = false;
    premiumCache.set(userId, { status: defaultStatus, timestamp: Date.now() });
    return defaultStatus;
  }, []);

  React.useEffect(() => {
    let mounted = true;

    const updatePremiumStatus = async () => {
      if (!user) {
        if (mounted) {
          setStatus({ isPremium: false, isVerified: true, isLoading: false });
        }
        return;
      }

      try {
        const isPremium = await checkPremiumStatus(user.id, user.email || '');
        
        if (mounted) {
          setStatus({
            isPremium,
            isVerified: true,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        if (mounted) {
          setStatus({
            isPremium: false,
            isVerified: true,
            isLoading: false,
          });
        }
      }
    };

    // Instant update for better UX
    updatePremiumStatus();

    return () => {
      mounted = false;
    };
  }, [user, checkPremiumStatus]);

  return status;
};
