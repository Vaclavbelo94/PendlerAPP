/**
 * Memory management utilities for mobile optimization
 */

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

class MemoryManager {
  private cleanupCallbacks: Set<() => void> = new Set();
  private memoryCheckInterval?: NodeJS.Timeout;
  private readonly MEMORY_WARNING_THRESHOLD = 0.9; // 90% of limit
  private readonly CHECK_INTERVAL = 60000; // Check every minute

  constructor() {
    if (typeof window !== 'undefined') {
      this.startMonitoring();
    }
  }

  /**
   * Register cleanup callback
   */
  registerCleanup(callback: () => void): () => void {
    this.cleanupCallbacks.add(callback);
    return () => this.cleanupCallbacks.delete(callback);
  }

  /**
   * Force cleanup
   */
  cleanup() {
    console.log('Running memory cleanup...');
    this.cleanupCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Cleanup callback failed:', error);
      }
    });
  }

  /**
   * Get current memory usage
   */
  getMemoryUsage(): MemoryInfo | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  /**
   * Check if memory usage is high
   */
  isMemoryHigh(): boolean {
    const memory = this.getMemoryUsage();
    if (!memory) return false;
    
    const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    return usageRatio > this.MEMORY_WARNING_THRESHOLD;
  }

  /**
   * Start memory monitoring
   */
  private startMonitoring() {
    this.memoryCheckInterval = setInterval(() => {
      if (this.isMemoryHigh()) {
        console.warn('High memory usage detected, running cleanup...');
        this.cleanup();
      }
    }, this.CHECK_INTERVAL);
  }

  /**
   * Stop memory monitoring
   */
  stopMonitoring() {
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }
  }

  /**
   * Log current memory status
   */
  logMemoryStatus() {
    const memory = this.getMemoryUsage();
    if (!memory) {
      console.log('Memory API not available');
      return;
    }

    const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2);
    const totalMB = (memory.totalJSHeapSize / 1048576).toFixed(2);
    const limitMB = (memory.jsHeapSizeLimit / 1048576).toFixed(2);
    const usagePercent = ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(1);

    console.log(`Memory: ${usedMB}MB / ${totalMB}MB (Limit: ${limitMB}MB) - ${usagePercent}%`);
  }
}

export const memoryManager = new MemoryManager();

/**
 * Hook for component cleanup
 */
export const useMemoryCleanup = (cleanup: () => void) => {
  if (typeof window !== 'undefined') {
    return memoryManager.registerCleanup(cleanup);
  }
  return () => {};
};

/**
 * Clear image cache
 */
export const clearImageCache = () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img.src && !img.src.startsWith('data:')) {
      img.src = '';
    }
  });
};

/**
 * Clear unused localStorage items
 */
export const clearOldLocalStorage = (maxAge: number = 7 * 24 * 60 * 60 * 1000) => {
  const now = Date.now();
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    try {
      const value = localStorage.getItem(key);
      if (value) {
        const data = JSON.parse(value);
        if (data.timestamp && now - data.timestamp > maxAge) {
          keysToRemove.push(key);
        }
      }
    } catch {
      // Not JSON or invalid
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log(`Cleared ${keysToRemove.length} old localStorage items`);
};
