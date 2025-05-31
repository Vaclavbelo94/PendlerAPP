import { useCallback, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface CacheManagerOptions {
  enablePeriodicCleanup?: boolean;
  cleanupInterval?: number;
  maxCacheSize?: number;
  enablePredictivePreloading?: boolean;
  enableIntelligentPrefetch?: boolean;
}

export const useCacheManager = (options: CacheManagerOptions = {}) => {
  const queryClient = useQueryClient();
  const {
    enablePeriodicCleanup = true,
    cleanupInterval = 30 * 60 * 1000, // 30 minut
    maxCacheSize = 50 * 1024 * 1024,    // 50MB
    enablePredictivePreloading = true,
    enableIntelligentPrefetch = true
  } = options;

  // Enhanced cache cleanup with memory pressure detection
  const cleanupOldCache = useCallback(() => {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hodina
    
    const queries = queryClient.getQueryCache().getAll();
    const staleQueries = queries.filter(query => {
      const lastUpdated = query.state.dataUpdatedAt;
      const isStale = now - lastUpdated > maxAge;
      const hasObservers = query.getObserversCount() > 0;
      
      return isStale && !hasObservers;
    });

    // Remove stale queries
    staleQueries.forEach(query => {
      queryClient.removeQueries({ queryKey: query.queryKey });
    });

    return staleQueries.length;
  }, [queryClient]);

  // Intelligent cache size management
  const cleanupBySize = useCallback(() => {
    const queries = queryClient.getQueryCache().getAll();
    let totalSize = 0;
    
    // Calculate cache size with better estimation
    const queryData = queries.map(query => {
      let size = 0;
      if (query.state.data) {
        try {
          size = new Blob([JSON.stringify(query.state.data)]).size;
        } catch {
          size = JSON.stringify(query.state.data).length * 2; // Fallback estimation
        }
      }
      
      return {
        query,
        size,
        lastAccess: query.state.dataUpdatedAt,
        observers: query.getObserversCount(),
        priority: query.options.meta?.priority || 'normal'
      };
    });

    totalSize = queryData.reduce((sum, item) => sum + item.size, 0);
    
    if (totalSize > maxCacheSize) {
      // Sort by priority, observers, and access time
      const sortedData = queryData.sort((a, b) => {
        // Keep high priority and active queries
        if (a.priority === 'high' && b.priority !== 'high') return 1;
        if (b.priority === 'high' && a.priority !== 'high') return -1;
        if (a.observers > 0 && b.observers === 0) return 1;
        if (b.observers > 0 && a.observers === 0) return -1;
        
        // Sort by last access time (oldest first)
        return a.lastAccess - b.lastAccess;
      });
      
      // Remove queries until we're under the size limit
      let removedSize = 0;
      const toRemove = [];
      
      for (const item of sortedData) {
        if (totalSize - removedSize <= maxCacheSize * 0.8) break; // Leave 20% buffer
        if (item.observers === 0 && item.priority !== 'high') {
          toRemove.push(item.query);
          removedSize += item.size;
        }
      }
      
      toRemove.forEach(query => {
        queryClient.removeQueries({ queryKey: query.queryKey });
      });
      
      return toRemove.length;
    }
    
    return 0;
  }, [queryClient, maxCacheSize]);

  // Predictive preloading based on user patterns
  const preloadCriticalData = useCallback(async (userId?: string, context?: Record<string, any>) => {
    if (!userId || !enablePredictivePreloading) return;
    
    const predictions = getPredictiveQueries(context);
    
    const preloadPromises = predictions.map(async ({ queryKey, queryFn, priority }) => {
      try {
        await queryClient.prefetchQuery({
          queryKey,
          queryFn,
          staleTime: priority === 'high' ? 10 * 60 * 1000 : 5 * 60 * 1000,
          meta: { priority }
        });
      } catch (error) {
        console.warn('Predictive preload failed:', queryKey, error);
      }
    });
    
    await Promise.allSettled(preloadPromises);
  }, [queryClient, enablePredictivePreloading]);

  // Get predictive queries based on context
  const getPredictiveQueries = (context?: Record<string, any>) => {
    const currentPath = context?.currentPath || window.location.pathname;
    const timeOfDay = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    
    const predictions: Array<{
      queryKey: any[];
      queryFn: () => Promise<any>;
      priority: 'high' | 'normal' | 'low';
    }> = [];

    // Time-based predictions
    if (timeOfDay >= 7 && timeOfDay <= 9) {
      // Morning - likely to check shifts and dashboard
      predictions.push(
        { queryKey: ['shifts', 'today'], queryFn: () => Promise.resolve([]), priority: 'high' },
        { queryKey: ['dashboard', 'summary'], queryFn: () => Promise.resolve({}), priority: 'high' }
      );
    }

    // Route-based predictions with enhanced context
    switch (currentPath) {
      case '/dashboard':
        predictions.push(
          { queryKey: ['notifications', 'recent'], queryFn: () => Promise.resolve([]), priority: 'high' },
          { queryKey: ['vocabulary', 'progress'], queryFn: () => Promise.resolve({}), priority: 'normal' },
          { queryKey: ['shifts', 'upcoming'], queryFn: () => Promise.resolve([]), priority: 'normal' }
        );
        break;
      
      case '/vocabulary':
        predictions.push(
          { queryKey: ['vocabulary', 'statistics'], queryFn: () => Promise.resolve({}), priority: 'high' },
          { queryKey: ['vocabulary', 'recent-mistakes'], queryFn: () => Promise.resolve([]), priority: 'normal' }
        );
        break;
      
      case '/shifts':
        predictions.push(
          { queryKey: ['vehicles'], queryFn: () => Promise.resolve([]), priority: 'normal' },
          { queryKey: ['shifts', 'calendar', new Date().getMonth()], queryFn: () => Promise.resolve([]), priority: 'high' }
        );
        break;
    }

    // Day-of-week patterns
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Weekdays - work-related data
      predictions.push(
        { queryKey: ['commute', 'routes'], queryFn: () => Promise.resolve([]), priority: 'normal' }
      );
    }

    return predictions;
  };

  // Invalidate with intelligent cascading
  const smartInvalidate = useCallback((changedEntity: string, userId?: string, action?: 'create' | 'update' | 'delete') => {
    const invalidationMap: Record<string, Array<{
      queryKey: string;
      condition?: (action?: string) => boolean;
      priority: 'immediate' | 'deferred';
    }>> = {
      'profile': [
        { queryKey: 'profile', priority: 'immediate' },
        { queryKey: 'user-stats', priority: 'immediate' },
        { queryKey: 'dashboard', priority: 'deferred' }
      ],
      'shifts': [
        { queryKey: 'shifts', priority: 'immediate' },
        { queryKey: 'calendar', priority: 'immediate' },
        { queryKey: 'user-stats', priority: 'deferred' },
        { queryKey: 'reports', condition: (action) => action === 'create' || action === 'delete', priority: 'deferred' }
      ],
      'vehicles': [
        { queryKey: 'vehicles', priority: 'immediate' },
        { queryKey: 'fuel-records', priority: 'deferred' },
        { queryKey: 'service-records', priority: 'deferred' }
      ],
      'vocabulary': [
        { queryKey: 'vocabulary', priority: 'immediate' },
        { queryKey: 'progress', priority: 'immediate' },
        { queryKey: 'statistics', priority: 'deferred' }
      ]
    };
    
    const toInvalidate = invalidationMap[changedEntity] || [{ queryKey: changedEntity, priority: 'immediate' }];
    
    // Process immediate invalidations
    const immediate = toInvalidate.filter(item => 
      item.priority === 'immediate' && 
      (!item.condition || item.condition(action))
    );
    
    immediate.forEach(({ queryKey }) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [queryKey, userId] });
      } else {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
    });
    
    // Defer non-critical invalidations
    const deferred = toInvalidate.filter(item => 
      item.priority === 'deferred' && 
      (!item.condition || item.condition(action))
    );
    
    if (deferred.length > 0) {
      setTimeout(() => {
        deferred.forEach(({ queryKey }) => {
          if (userId) {
            queryClient.invalidateQueries({ queryKey: [queryKey, userId] });
          } else {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          }
        });
      }, 1000); // 1 second delay for deferred invalidations
    }
  }, [queryClient]);

  // Enhanced cache warming for critical paths
  const warmCache = useCallback(async (scenario: 'app-start' | 'user-login' | 'route-change', context?: any) => {
    if (!enableIntelligentPrefetch) return;

    const warmingStrategies = {
      'app-start': [
        { queryKey: ['app-config'], priority: 'high' },
        { queryKey: ['feature-flags'], priority: 'high' }
      ],
      'user-login': [
        { queryKey: ['profile'], priority: 'high' },
        { queryKey: ['notifications'], priority: 'normal' },
        { queryKey: ['dashboard', 'summary'], priority: 'normal' }
      ],
      'route-change': [] // Handled by predictive preloading
    };

    const queries = warmingStrategies[scenario] || [];
    
    await Promise.allSettled(
      queries.map(({ queryKey, priority }) =>
        queryClient.prefetchQuery({
          queryKey,
          queryFn: () => Promise.resolve({}),
          staleTime: priority === 'high' ? 15 * 60 * 1000 : 5 * 60 * 1000,
          meta: { priority }
        })
      )
    );
  }, [queryClient, enableIntelligentPrefetch]);

  // Periodic cleanup with memory pressure detection
  useEffect(() => {
    if (!enablePeriodicCleanup) return;
    
    const performCleanup = () => {
      // Check memory pressure if available
      const memoryInfo = (performance as any).memory;
      let isMemoryPressure = false;
      
      if (memoryInfo) {
        const usedRatio = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
        isMemoryPressure = usedRatio > 0.85; // 85% memory usage
      }
      
      const removedStale = cleanupOldCache();
      const removedBySize = isMemoryPressure ? cleanupBySize() : 0;
      
      if (removedStale > 0 || removedBySize > 0) {
        console.log(`Cache cleanup: ${removedStale} stale, ${removedBySize} by size`);
      }
    };
    
    // More frequent cleanup under memory pressure
    const interval = setInterval(performCleanup, cleanupInterval);
    
    return () => clearInterval(interval);
  }, [enablePeriodicCleanup, cleanupInterval, cleanupOldCache, cleanupBySize]);

  // Enhanced cache statistics
  const getCacheStats = useCallback(() => {
    const queries = queryClient.getQueryCache().getAll();
    const now = Date.now();
    
    let totalSize = 0;
    const stats = {
      totalQueries: queries.length,
      activeQueries: 0,
      staleQueries: 0,
      errorQueries: 0,
      sizeByEntity: {} as Record<string, number>,
      ageDistribution: { fresh: 0, stale: 0, old: 0 }
    };
    
    queries.forEach(query => {
      // Size calculation
      if (query.state.data) {
        try {
          const size = new Blob([JSON.stringify(query.state.data)]).size;
          totalSize += size;
          
          const entity = Array.isArray(query.queryKey) ? query.queryKey[0] : 'unknown';
          stats.sizeByEntity[entity as string] = (stats.sizeByEntity[entity as string] || 0) + size;
        } catch {
          // Fallback size estimation
          const size = JSON.stringify(query.state.data).length * 2;
          totalSize += size;
        }
      }
      
      // Status counts
      if (query.getObserversCount() > 0) stats.activeQueries++;
      if (query.isStale()) stats.staleQueries++;
      if (query.state.error) stats.errorQueries++;
      
      // Age distribution
      const age = now - query.state.dataUpdatedAt;
      if (age < 5 * 60 * 1000) stats.ageDistribution.fresh++;
      else if (age < 30 * 60 * 1000) stats.ageDistribution.stale++;
      else stats.ageDistribution.old++;
    });
    
    return {
      ...stats,
      totalSize,
      sizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      hitRatio: queries.length > 0 ? ((queries.length - stats.errorQueries) / queries.length * 100).toFixed(1) : '0'
    };
  }, [queryClient]);

  return {
    cleanupOldCache,
    cleanupBySize,
    preloadCriticalData,
    smartInvalidate,
    warmCache,
    getCacheSize: () => {
      const queries = queryClient.getQueryCache().getAll();
      return queries.reduce((size, query) => {
        if (query.state.data) {
          try {
            return size + new Blob([JSON.stringify(query.state.data)]).size;
          } catch {
            return size + JSON.stringify(query.state.data).length * 2;
          }
        }
        return size;
      }, 0);
    },
    getCacheStats
  };
};
