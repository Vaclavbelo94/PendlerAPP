
import { useCallback, useRef } from 'react';
import { useCacheManager } from './useCacheManager';

interface OptimizedSupabaseOptions {
  enableCaching?: boolean;
  cacheTime?: number;
  staleTime?: number;
}

export const useOptimizedSupabase = (options: OptimizedSupabaseOptions = {}) => {
  const {
    enableCaching = true,
    cacheTime = 10 * 60 * 1000, // 10 minut
    staleTime = 5 * 60 * 1000   // 5 minut
  } = options;

  const cacheManager = useCacheManager({
    enablePeriodicCleanup: true,
    cleanupInterval: 15 * 60 * 1000, // 15 minut
    maxCacheSize: 20 * 1024 * 1024   // 20MB
  });

  const pendingRequests = useRef<Map<string, Promise<any>>>(new Map());

  const query = useCallback(async (key: string, queryFn: () => Promise<any>) => {
    try {
      // Check cache first
      if (enableCaching) {
        const cached = cacheManager.get(key);
        if (cached) {
          return cached;
        }
      }

      // Check for pending request to avoid duplicate calls
      if (pendingRequests.current.has(key)) {
        return await pendingRequests.current.get(key);
      }

      // Execute query
      const promise = queryFn();
      pendingRequests.current.set(key, promise);

      try {
        const result = await promise;
        
        // Cache result
        if (enableCaching && result) {
          cacheManager.set(key, result, cacheTime);
        }
        
        return result;
      } finally {
        pendingRequests.current.delete(key);
      }
    } catch (error) {
      console.error('Optimized Supabase query failed:', error);
      throw error;
    }
  }, [enableCaching, cacheManager, cacheTime]);

  const invalidateCache = useCallback((pattern?: string) => {
    if (pattern) {
      // Implementation by měla invalidovat cache podle patternu
      console.log('Invalidating cache for pattern:', pattern);
    } else {
      cacheManager.cleanup();
    }
  }, [cacheManager]);

  return {
    query,
    invalidateCache,
    getCacheStats: cacheManager.getCacheStats
  };
};
