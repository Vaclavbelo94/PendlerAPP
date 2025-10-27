import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';
import { revenueCatService } from '@/services/revenueCat';
import { useAuth } from '@/hooks/auth';

const PREMIUM_CACHE_KEY = 'premium_status_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface PremiumCache {
  isPremium: boolean;
  timestamp: number;
}

export const usePremiumCheck = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const platform = Capacitor.getPlatform();

  useEffect(() => {
    if (!user) {
      setIsPremium(false);
      setIsLoading(false);
      return;
    }

    checkPremiumStatus();
  }, [user]);

  const getCachedPremiumStatus = (): PremiumCache | null => {
    try {
      const cached = localStorage.getItem(PREMIUM_CACHE_KEY);
      if (!cached) return null;

      const data: PremiumCache = JSON.parse(cached);
      const isExpired = Date.now() - data.timestamp > CACHE_TTL;

      return isExpired ? null : data;
    } catch {
      return null;
    }
  };

  const setCachedPremiumStatus = (isPremium: boolean) => {
    const cache: PremiumCache = {
      isPremium,
      timestamp: Date.now()
    };
    localStorage.setItem(PREMIUM_CACHE_KEY, JSON.stringify(cache));
  };

  const checkPremiumStatus = async () => {
    if (!user) return;

    // Try cache first
    const cached = getCachedPremiumStatus();
    if (cached !== null) {
      setIsPremium(cached.isPremium);
      setIsLoading(false);
      
      // Still check in background
      checkPremiumInBackground();
      return;
    }

    setIsLoading(true);

    try {
      // Check from database (single source of truth)
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium, premium_expiry')
        .eq('id', user.id)
        .single();

      let hasPremium = profile?.is_premium || false;

      // If on native platform, also sync with RevenueCat
      if (platform === 'android' || platform === 'ios') {
        try {
          const revenueCatPremium = await revenueCatService.checkPremiumEntitlement();
          
          // If RevenueCat says premium but DB doesn't, update DB
          if (revenueCatPremium && !hasPremium) {
            await supabase
              .from('profiles')
              .update({
                is_premium: true,
                subscription_source: platform === 'android' ? 'google_play' : 'app_store'
              })
              .eq('id', user.id);
            
            hasPremium = true;
          }
        } catch (error) {
          console.error('RevenueCat check failed:', error);
        }
      }

      setIsPremium(hasPremium);
      setCachedPremiumStatus(hasPremium);
    } catch (error) {
      console.error('Premium check failed:', error);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPremiumInBackground = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single();

      const hasPremium = profile?.is_premium || false;
      
      if (hasPremium !== isPremium) {
        setIsPremium(hasPremium);
        setCachedPremiumStatus(hasPremium);
      }
    } catch (error) {
      console.error('Background premium check failed:', error);
    }
  };

  const invalidateCache = () => {
    localStorage.removeItem(PREMIUM_CACHE_KEY);
    checkPremiumStatus();
  };

  return {
    isPremium,
    isLoading,
    refreshPremiumStatus: checkPremiumStatus,
    invalidateCache
  };
};
