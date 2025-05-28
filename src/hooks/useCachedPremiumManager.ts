
import * as React from 'react';
import { User } from '@supabase/supabase-js';

interface CachedPremiumStatus {
  isPremium: boolean;
  isVerified: boolean;
  isLoading: boolean;
  lastChecked: number;
}

// Global cache for premium status across all components
const globalPremiumCache = new Map<string, CachedPremiumStatus>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CHECK_TIMEOUT = 1000; // 1 second timeout for checks

export const useCachedPremiumManager = (user: User | null) => {
  const [status, setStatus] = React.useState<Omit<CachedPremiumStatus, 'lastChecked'>>({
    isPremium: false,
    isVerified: false,
    isLoading: true,
  });

  const checkPremiumStatus = React.useCallback(async (userId: string, email: string): Promise<boolean> => {
    // Check global cache first
    const cached = globalPremiumCache.get(userId);
    if (cached && Date.now() - cached.lastChecked < CACHE_DURATION) {
      return cached.isPremium;
    }

    // Special users get instant premium
    const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com'];
    if (specialEmails.includes(email)) {
      const premiumStatus = true;
      globalPremiumCache.set(userId, { 
        isPremium: premiumStatus, 
        isVerified: true, 
        isLoading: false,
        lastChecked: Date.now() 
      });
      return premiumStatus;
    }

    // Quick localStorage check with timeout
    try {
      const timeoutPromise = new Promise<boolean>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), CHECK_TIMEOUT)
      );
      
      const checkPromise = new Promise<boolean>((resolve) => {
        try {
          const userStr = localStorage.getItem('currentUser');
          if (userStr) {
            const userData = JSON.parse(userStr);
            if (userData.isPremium && userData.premiumUntil) {
              const premiumExpiry = new Date(userData.premiumUntil);
              const isPremiumActive = premiumExpiry > new Date();
              resolve(isPremiumActive);
              return;
            }
          }
          resolve(false);
        } catch (error) {
          resolve(false);
        }
      });

      const isPremium = await Promise.race([checkPromise, timeoutPromise]);
      
      globalPremiumCache.set(userId, { 
        isPremium, 
        isVerified: true, 
        isLoading: false,
        lastChecked: Date.now() 
      });
      return isPremium;

    } catch (error) {
      // Timeout or error - default to false
      const defaultStatus = false;
      globalPremiumCache.set(userId, { 
        isPremium: defaultStatus, 
        isVerified: true, 
        isLoading: false,
        lastChecked: Date.now() 
      });
      return defaultStatus;
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const updatePremiumStatus = async () => {
      if (!user) {
        if (mounted) {
          setStatus({ isPremium: false, isVerified: true, isLoading: false });
        }
        return;
      }

      // Check cache immediately
      const cached = globalPremiumCache.get(user.id);
      if (cached && Date.now() - cached.lastChecked < CACHE_DURATION) {
        if (mounted) {
          setStatus({
            isPremium: cached.isPremium,
            isVerified: cached.isVerified,
            isLoading: false,
          });
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

    // Immediate check without delay for better UX
    updatePremiumStatus();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [user, checkPremiumStatus]);

  return status;
};
