
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { useCacheManager } from '@/hooks/useCacheManager';
import { useOptimizedSupabase } from '@/hooks/useOptimizedSupabase';

export const DatabaseOptimizer: React.FC = () => {
  const { user } = useAuth();
  const cacheManager = useCacheManager({
    enablePeriodicCleanup: true,
    cleanupInterval: 20 * 60 * 1000, // 20 minut
    maxCacheSize: 30 * 1024 * 1024   // 30MB
  });
  
  const supabaseOptimizer = useOptimizedSupabase({
    enableCaching: true,
    cacheTime: 15 * 60 * 1000,
    staleTime: 5 * 60 * 1000
  });

  // Preload kritických dat po přihlášení
  useEffect(() => {
    if (user?.id) {
      cacheManager.preloadCriticalData(user.id);
    }
  }, [user?.id, cacheManager]);

  // Monitoring cache výkonu
  useEffect(() => {
    const logCacheStats = () => {
      const stats = cacheManager.getCacheStats();
      const size = cacheManager.getCacheSize();
      
      console.log('Cache Statistics:', {
        ...stats,
        sizeMB: (size / (1024 * 1024)).toFixed(2)
      });
    };

    // Log stats každých 5 minut v development
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(logCacheStats, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [cacheManager]);

  return null; // Tento komponent nerender nic
};
