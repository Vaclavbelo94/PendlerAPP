
import React, { useEffect } from 'react';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { memoryManager } from '@/utils/memoryManager';

export const DatabaseOptimizer: React.FC = () => {
  usePerformanceMonitoring('DatabaseOptimizer');

  useEffect(() => {
    // Database query optimization
    const optimizeQueries = () => {
      // Implement query batching
      const originalFetch = window.fetch;
      const pendingRequests = new Map();

      window.fetch = async function(input, init) {
        // Extract URL properly from both string and Request objects
        const key = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
        
        // Batch similar requests
        if (pendingRequests.has(key)) {
          return pendingRequests.get(key);
        }

        const promise = originalFetch.call(this, input, init);
        pendingRequests.set(key, promise);

        try {
          const response = await promise;
          pendingRequests.delete(key);
          return response;
        } catch (error) {
          pendingRequests.delete(key);
          throw error;
        }
      };
    };

    // Memory cleanup
    const cleanupMemory = () => {
      // Clear old cache entries
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('old-') || name.includes('temp-')) {
              caches.delete(name);
            }
          });
        });
      }

      // Cleanup old localStorage entries
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('temp_') || key.startsWith('cache_')) {
            const item = localStorage.getItem(key);
            if (item) {
              try {
                const parsed = JSON.parse(item);
                if (parsed.timestamp && Date.now() - parsed.timestamp > 86400000) { // 24 hours
                  localStorage.removeItem(key);
                }
              } catch (e) {
                // Remove invalid entries
                localStorage.removeItem(key);
              }
            }
          }
        });
      } catch (error) {
        console.warn('Could not cleanup localStorage:', error);
      }
    };

    optimizeQueries();
    
    // Run cleanup every 5 minutes
    const cleanupInterval = setInterval(() => {
      memoryManager.cleanup();
      cleanupMemory();
    }, 300000);
    
    // Initial cleanup after 10 seconds
    const initialCleanup = setTimeout(cleanupMemory, 10000);

    return () => {
      clearInterval(cleanupInterval);
      clearTimeout(initialCleanup);
    };
  }, []);

  // Performance monitoring component (invisible)
  return null;
};
