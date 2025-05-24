
import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface CacheManagerOptions {
  enablePeriodicCleanup?: boolean;
  cleanupInterval?: number;
  maxCacheSize?: number;
}

export const useCacheManager = (options: CacheManagerOptions = {}) => {
  const queryClient = useQueryClient();
  const {
    enablePeriodicCleanup = true,
    cleanupInterval = 30 * 60 * 1000, // 30 minut
    maxCacheSize = 50 * 1024 * 1024    // 50MB
  } = options;

  // Vyčištění cache podle stáří
  const cleanupOldCache = useCallback(() => {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hodina
    
    queryClient.getQueryCache().getAll().forEach(query => {
      const lastUpdated = query.state.dataUpdatedAt;
      if (now - lastUpdated > maxAge) {
        queryClient.removeQueries({ queryKey: query.queryKey });
      }
    });
  }, [queryClient]);

  // Vyčištění cache podle velikosti
  const cleanupBySize = useCallback(() => {
    const queries = queryClient.getQueryCache().getAll();
    let totalSize = 0;
    
    // Odhadujeme velikost cache
    queries.forEach(query => {
      if (query.state.data) {
        totalSize += JSON.stringify(query.state.data).length;
      }
    });
    
    // Pokud překračujeme limit, odstraníme nejstarší queries
    if (totalSize > maxCacheSize) {
      const sortedQueries = queries.sort((a, b) => 
        a.state.dataUpdatedAt - b.state.dataUpdatedAt
      );
      
      const toRemove = sortedQueries.slice(0, Math.floor(queries.length * 0.3));
      toRemove.forEach(query => {
        queryClient.removeQueries({ queryKey: query.queryKey });
      });
    }
  }, [queryClient, maxCacheSize]);

  // Preload kritických dat
  const preloadCriticalData = useCallback(async (userId?: string) => {
    if (!userId) return;
    
    const criticalQueries = [
      ['profile', userId],
      ['user-stats', userId],
      ['premium-status', userId]
    ];
    
    criticalQueries.forEach(queryKey => {
      queryClient.prefetchQuery({
        queryKey,
        staleTime: 10 * 60 * 1000 // 10 minut
      });
    });
  }, [queryClient]);

  // Invalidace souvisejících cache při změnách
  const smartInvalidate = useCallback((changedEntity: string, userId?: string) => {
    const invalidationMap: Record<string, string[]> = {
      'profile': ['profile', 'user-stats'],
      'shifts': ['shifts', 'user-stats', 'reports'],
      'vehicles': ['vehicles', 'fuel-records', 'service-records'],
      'promo-codes': ['promo-codes', 'premium-status']
    };
    
    const toInvalidate = invalidationMap[changedEntity] || [changedEntity];
    
    toInvalidate.forEach(key => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [key, userId] });
      } else {
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    });
  }, [queryClient]);

  // Periodické čištění cache
  useEffect(() => {
    if (!enablePeriodicCleanup) return;
    
    const interval = setInterval(() => {
      cleanupOldCache();
      cleanupBySize();
    }, cleanupInterval);
    
    return () => clearInterval(interval);
  }, [enablePeriodicCleanup, cleanupInterval, cleanupOldCache, cleanupBySize]);

  return {
    cleanupOldCache,
    cleanupBySize,
    preloadCriticalData,
    smartInvalidate,
    getCacheSize: () => {
      const queries = queryClient.getQueryCache().getAll();
      return queries.reduce((size, query) => {
        if (query.state.data) {
          return size + JSON.stringify(query.state.data).length;
        }
        return size;
      }, 0);
    },
    getCacheStats: () => ({
      totalQueries: queryClient.getQueryCache().getAll().length,
      activeQueries: queryClient.getQueryCache().getAll().filter(q => q.getObserversCount() > 0).length,
      staleQueries: queryClient.getQueryCache().getAll().filter(q => q.isStale()).length
    })
  };
};
