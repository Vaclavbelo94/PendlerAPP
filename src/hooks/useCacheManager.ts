import { useCallback, useRef, useEffect } from 'react';

interface CacheManagerOptions {
  enablePeriodicCleanup?: boolean;
  cleanupInterval?: number;
  maxCacheSize?: number;
}

interface CacheStats {
  hitRate: number;
  missRate: number;
  totalRequests: number;
  cacheSize: number;
}

export const useCacheManager = (options: CacheManagerOptions = {}) => {
  const {
    enablePeriodicCleanup = true,
    cleanupInterval = 30 * 60 * 1000, // 30 minut
    maxCacheSize = 50 * 1024 * 1024   // 50MB
  } = options;

  const cacheRef = useRef(new Map<string, any>());
  const statsRef = useRef<CacheStats>({
    hitRate: 0,
    missRate: 0,
    totalRequests: 0,
    cacheSize: 0
  });

  // Cache operations
  const set = useCallback((key: string, value: any, ttl?: number) => {
    const entry = {
      value,
      timestamp: Date.now(),
      ttl: ttl || 5 * 60 * 1000, // 5 minut default
      size: JSON.stringify(value).length
    };

    cacheRef.current.set(key, entry);
    statsRef.current.cacheSize += entry.size;
  }, []);

  const get = useCallback((key: string) => {
    statsRef.current.totalRequests++;
    
    const entry = cacheRef.current.get(key);
    if (!entry) {
      statsRef.current.missRate++;
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      cacheRef.current.delete(key);
      statsRef.current.cacheSize -= entry.size;
      statsRef.current.missRate++;
      return null;
    }

    statsRef.current.hitRate++;
    return entry.value;
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
    statsRef.current = {
      hitRate: 0,
      missRate: 0,
      totalRequests: 0,
      cacheSize: 0
    };
  }, []);

  // Cleanup expired entries
  const cleanup = useCallback(() => {
    const now = Date.now();
    const toDelete: string[] = [];

    cacheRef.current.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        toDelete.push(key);
        statsRef.current.cacheSize -= entry.size;
      }
    });

    toDelete.forEach(key => cacheRef.current.delete(key));
    
    // Check cache size limit
    if (statsRef.current.cacheSize > maxCacheSize) {
      const entries = Array.from(cacheRef.current.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest entries
      const toRemove = entries.slice(0, Math.floor(entries.length * 0.3));
      toRemove.forEach(([key, entry]) => {
        cacheRef.current.delete(key);
        statsRef.current.cacheSize -= entry.size;
      });
    }
  }, [maxCacheSize]);

  // Periodic cleanup
  useEffect(() => {
    if (!enablePeriodicCleanup) return;

    const intervalId = setInterval(cleanup, cleanupInterval);
    return () => clearInterval(intervalId);
  }, [cleanup, cleanupInterval, enablePeriodicCleanup]);

  const getCacheStats = useCallback((): CacheStats => {
    const total = statsRef.current.totalRequests;
    return {
      ...statsRef.current,
      hitRate: total > 0 ? (statsRef.current.hitRate / total) * 100 : 0,
      missRate: total > 0 ? (statsRef.current.missRate / total) * 100 : 0
    };
  }, []);

  const getCacheSize = useCallback(() => {
    return statsRef.current.cacheSize;
  }, []);

  const preloadCriticalData = useCallback(async (userId: string) => {
    const criticalKeys = [
      `user_profile_${userId}`,
      `user_shifts_${userId}`,
      `user_vocabulary_${userId}`
    ];

    // Simulate preloading critical data
    criticalKeys.forEach(key => {
      if (!get(key)) {
        // Placeholder - would fetch from API in real implementation
        set(key, { preloaded: true }, 10 * 60 * 1000); // 10 minut
      }
    });
  }, [get, set]);

  return {
    set,
    get,
    clear,
    cleanup,
    getCacheStats,
    getCacheSize,
    preloadCriticalData
  };
};
