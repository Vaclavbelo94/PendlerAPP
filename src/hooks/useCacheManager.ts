
import { useCallback, useRef, useEffect } from 'react';

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

interface CacheManagerOptions {
  enablePeriodicCleanup?: boolean;
  cleanupInterval?: number;
  maxCacheSize?: number;
}

export const useCacheManager = (options: CacheManagerOptions = {}) => {
  const {
    enablePeriodicCleanup = true,
    cleanupInterval = 30 * 60 * 1000, // 30 minut
    maxCacheSize = 50 * 1024 * 1024    // 50MB
  } = options;

  const cache = useRef<Map<string, CacheEntry>>(new Map());
  const stats = useRef({
    hits: 0,
    misses: 0,
    evictions: 0
  });

  const set = useCallback((key: string, data: any, ttl: number = 15 * 60 * 1000) => {
    try {
      cache.current.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      });
      
      // Check cache size and cleanup if needed
      if (getCacheSize() > maxCacheSize) {
        cleanup();
      }
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  }, [maxCacheSize]);

  const get = useCallback((key: string) => {
    try {
      const entry = cache.current.get(key);
      
      if (!entry) {
        stats.current.misses++;
        return null;
      }
      
      // Check if expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        cache.current.delete(key);
        stats.current.misses++;
        return null;
      }
      
      stats.current.hits++;
      return entry.data;
    } catch (error) {
      console.warn('Cache get failed:', error);
      return null;
    }
  }, []);

  const cleanup = useCallback(() => {
    try {
      const now = Date.now();
      let evicted = 0;
      
      for (const [key, entry] of cache.current.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          cache.current.delete(key);
          evicted++;
        }
      }
      
      // If still too large, remove oldest entries
      if (getCacheSize() > maxCacheSize) {
        const entries = Array.from(cache.current.entries())
          .sort(([,a], [,b]) => a.timestamp - b.timestamp);
        
        while (getCacheSize() > maxCacheSize * 0.8 && entries.length > 0) {
          const [key] = entries.shift()!;
          cache.current.delete(key);
          evicted++;
        }
      }
      
      stats.current.evictions += evicted;
      console.log(`Cache cleanup: ${evicted} entries evicted`);
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }, [maxCacheSize]);

  const getCacheSize = useCallback(() => {
    try {
      const serialized = JSON.stringify(Array.from(cache.current.entries()));
      return new Blob([serialized]).size;
    } catch (error) {
      return 0;
    }
  }, []);

  const getCacheStats = useCallback(() => {
    const totalRequests = stats.current.hits + stats.current.misses;
    return {
      ...stats.current,
      hitRate: totalRequests > 0 ? (stats.current.hits / totalRequests * 100).toFixed(2) : '0',
      size: cache.current.size
    };
  }, []);

  const preloadCriticalData = useCallback(async (userId: string) => {
    try {
      // Preload pouze kritická data
      const criticalKeys = [
        `user-${userId}`,
        `premiumFeatures-${userId}`,
        `dashboardStats-${userId}`
      ];
      
      console.log('Preloading critical data for user:', userId);
      // Implementation by měla načíst kritická data do cache
    } catch (error) {
      console.warn('Critical data preload failed:', error);
    }
  }, []);

  // Periodic cleanup
  useEffect(() => {
    if (!enablePeriodicCleanup) return;

    const interval = setInterval(cleanup, cleanupInterval);
    return () => clearInterval(interval);
  }, [enablePeriodicCleanup, cleanupInterval, cleanup]);

  return {
    set,
    get,
    cleanup,
    getCacheSize,
    getCacheStats,
    preloadCriticalData
  };
};
