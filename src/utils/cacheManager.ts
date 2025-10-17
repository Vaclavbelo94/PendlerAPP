/**
 * Advanced caching strategies for mobile optimization
 */

interface CacheConfig {
  maxAge?: number; // milliseconds
  maxSize?: number; // number of items
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  hits: number;
}

class CacheManager<T = any> {
  private cache = new Map<string, CacheItem<T>>();
  private config: Required<CacheConfig>;

  constructor(config: CacheConfig = {}) {
    this.config = {
      maxAge: config.maxAge ?? 5 * 60 * 1000, // 5 minutes default
      maxSize: config.maxSize ?? 100,
      storage: config.storage ?? 'memory',
    };

    if (this.config.storage !== 'memory') {
      this.loadFromStorage();
    }
  }

  /**
   * Set cache item
   */
  set(key: string, data: T): void {
    // Check if we need to evict old items
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      hits: 0,
    };

    this.cache.set(key, item);
    
    if (this.config.storage !== 'memory') {
      this.saveToStorage(key, item);
    }
  }

  /**
   * Get cache item
   */
  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() - item.timestamp > this.config.maxAge) {
      this.delete(key);
      return null;
    }

    // Update hits
    item.hits++;
    
    return item.data;
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete cache item
   */
  delete(key: string): void {
    this.cache.delete(key);
    
    if (this.config.storage !== 'memory') {
      this.removeFromStorage(key);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    
    if (this.config.storage !== 'memory') {
      this.clearStorage();
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      maxAge: this.config.maxAge,
      storage: this.config.storage,
    };
  }

  /**
   * Evict least recently used item
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruHits = Infinity;
    let oldestTime = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.hits < lruHits || (item.hits === lruHits && item.timestamp < oldestTime)) {
        lruKey = key;
        lruHits = item.hits;
        oldestTime = item.timestamp;
      }
    }

    if (lruKey) {
      this.delete(lruKey);
    }
  }

  /**
   * Load cache from storage
   */
  private loadFromStorage(): void {
    try {
      const storage = this.getStorage();
      const keys = Object.keys(storage);
      
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          const item = JSON.parse(storage.getItem(key) || '');
          this.cache.set(key.replace('cache_', ''), item);
        }
      });
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  /**
   * Save item to storage
   */
  private saveToStorage(key: string, item: CacheItem<T>): void {
    try {
      const storage = this.getStorage();
      storage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to save to storage:', error);
    }
  }

  /**
   * Remove item from storage
   */
  private removeFromStorage(key: string): void {
    try {
      const storage = this.getStorage();
      storage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn('Failed to remove from storage:', error);
    }
  }

  /**
   * Clear storage
   */
  private clearStorage(): void {
    try {
      const storage = this.getStorage();
      const keys = Object.keys(storage);
      
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          storage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }

  /**
   * Get storage instance
   */
  private getStorage(): Storage {
    return this.config.storage === 'localStorage' ? localStorage : sessionStorage;
  }
}

// Create default cache instances
export const apiCache = new CacheManager({
  maxAge: 5 * 60 * 1000, // 5 minutes
  maxSize: 50,
  storage: 'sessionStorage',
});

export const imageCache = new CacheManager({
  maxAge: 30 * 60 * 1000, // 30 minutes
  maxSize: 100,
  storage: 'memory',
});

export const dataCache = new CacheManager({
  maxAge: 10 * 60 * 1000, // 10 minutes
  maxSize: 200,
  storage: 'localStorage',
});

export { CacheManager };
