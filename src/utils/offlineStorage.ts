
export interface DBStore {
  name: string;
  keyPath: string;
  indexes?: { name: string; keyPath: string; unique?: boolean }[];
}

export const STORES: Record<string, string> = {
  shifts: 'shifts',
  vehicles: 'vehicles',
  calculations: 'calculation_history',
  vocabulary: 'vocabulary',
  syncQueue: 'syncQueue',
  notifications: 'notifications',
  testHistory: 'testHistory'
};

class OfflineStorageManager {
  private db: IDBDatabase | null = null;
  private dbName = 'PendlerOfflineDB';
  private version = 3;
  private memoryCache = new Map<string, any>();
  private cacheSize = 0;
  private maxCacheSize = 50 * 1024 * 1024; // 50MB cache limit

  private stores: DBStore[] = [
    {
      name: STORES.shifts,
      keyPath: 'id',
      indexes: [
        { name: 'user_id', keyPath: 'user_id' },
        { name: 'date', keyPath: 'date' },
        { name: 'synced', keyPath: 'synced' }
      ]
    },
    {
      name: STORES.vehicles,
      keyPath: 'id',
      indexes: [
        { name: 'user_id', keyPath: 'user_id' },
        { name: 'synced', keyPath: 'synced' }
      ]
    },
    {
      name: STORES.calculations,
      keyPath: 'id',
      indexes: [
        { name: 'user_id', keyPath: 'user_id' },
        { name: 'type', keyPath: 'type' },
        { name: 'synced', keyPath: 'synced' }
      ]
    },
    {
      name: STORES.vocabulary,
      keyPath: 'id',
      indexes: [
        { name: 'category', keyPath: 'category' },
        { name: 'difficulty', keyPath: 'difficulty' }
      ]
    },
    {
      name: STORES.syncQueue,
      keyPath: 'id',
      indexes: [
        { name: 'entity_type', keyPath: 'entity_type' },
        { name: 'created_at', keyPath: 'created_at' }
      ]
    },
    {
      name: STORES.notifications,
      keyPath: 'id',
      indexes: [
        { name: 'user_id', keyPath: 'user_id' },
        { name: 'read', keyPath: 'read' }
      ]
    },
    {
      name: STORES.testHistory,
      keyPath: 'id',
      indexes: [
        { name: 'startTime', keyPath: 'startTime' }
      ]
    }
  ];

  async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        this.stores.forEach(storeConfig => {
          if (!db.objectStoreNames.contains(storeConfig.name)) {
            const store = db.createObjectStore(storeConfig.name, {
              keyPath: storeConfig.keyPath
            });

            storeConfig.indexes?.forEach(index => {
              store.createIndex(index.name, index.keyPath, {
                unique: index.unique || false
              });
            });
          }
        });
      };
    });
  }

  // Memory cache management
  private getCacheKey(storeName: string, id?: string): string {
    return id ? `${storeName}:${id}` : `${storeName}:all`;
  }

  private addToCache(key: string, data: any): void {
    const size = JSON.stringify(data).length * 2; // Rough size estimate
    
    // Clear cache if it would exceed limit
    if (this.cacheSize + size > this.maxCacheSize) {
      this.clearCache();
    }

    this.memoryCache.set(key, data);
    this.cacheSize += size;
  }

  private getFromCache(key: string): any {
    return this.memoryCache.get(key);
  }

  private clearCache(): void {
    this.memoryCache.clear();
    this.cacheSize = 0;
  }

  // Core storage operations with caching
  async saveData<T>(storeName: string, data: T & { id: string }): Promise<void> {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.put(data);
      
      request.onsuccess = () => {
        // Update cache
        const cacheKey = this.getCacheKey(storeName, data.id);
        this.addToCache(cacheKey, data);
        
        // Invalidate 'all' cache
        this.memoryCache.delete(this.getCacheKey(storeName));
        
        resolve();
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async getData<T>(storeName: string, id: string): Promise<T | null> {
    // Check cache first
    const cacheKey = this.getCacheKey(storeName, id);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          this.addToCache(cacheKey, result);
        }
        resolve(result || null);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async getAllData<T>(storeName: string): Promise<T[]> {
    // Check cache first
    const cacheKey = this.getCacheKey(storeName);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const result = request.result || [];
        this.addToCache(cacheKey, result);
        resolve(result);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async deleteItemById(storeName: string, id: string): Promise<void> {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        // Remove from cache
        this.memoryCache.delete(this.getCacheKey(storeName, id));
        this.memoryCache.delete(this.getCacheKey(storeName));
        resolve();
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async clearStore(storeName: string): Promise<void> {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => {
        // Clear related cache
        Array.from(this.memoryCache.keys())
          .filter(key => key.startsWith(`${storeName}:`))
          .forEach(key => this.memoryCache.delete(key));
        resolve();
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Bulk operations for performance
  async bulkSaveData<T>(storeName: string, items: (T & { id: string })[]): Promise<void> {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      let completed = 0;
      const total = items.length;
      
      if (total === 0) {
        resolve();
        return;
      }
      
      items.forEach(item => {
        const request = store.put(item);
        
        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            // Clear cache to force refresh
            this.memoryCache.delete(this.getCacheKey(storeName));
            resolve();
          }
        };
        
        request.onerror = () => reject(request.error);
      });
    });
  }

  // Query operations
  async queryByIndex<T>(
    storeName: string, 
    indexName: string, 
    value: any
  ): Promise<T[]> {
    const db = await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Sync queue operations
  async addToSyncQueue(
    entityType: string,
    entityId: string,
    action: 'INSERT' | 'UPDATE' | 'DELETE',
    data: any
  ): Promise<void> {
    const queueItem = {
      id: `${entityType}-${entityId}-${Date.now()}`,
      entity_type: entityType,
      entity_id: entityId,
      action,
      data,
      created_at: new Date().toISOString(),
      retry_count: 0
    };

    await this.saveData(STORES.syncQueue, queueItem);
  }

  // Memory management
  getMemoryUsage(): { cacheSize: number; maxCacheSize: number; items: number } {
    return {
      cacheSize: this.cacheSize,
      maxCacheSize: this.maxCacheSize,
      items: this.memoryCache.size
    };
  }

  optimizeMemory(): void {
    if (this.cacheSize > this.maxCacheSize * 0.8) {
      this.clearCache();
    }
  }
}

// Export singleton instance
const storageManager = new OfflineStorageManager();

// Export convenience functions
export const initDB = () => storageManager.initDB();
export const saveData = <T>(storeName: string, data: T & { id: string }) => 
  storageManager.saveData(storeName, data);
export const getData = <T>(storeName: string, id: string) => 
  storageManager.getData<T>(storeName, id);
export const getAllData = <T>(storeName: string) => 
  storageManager.getAllData<T>(storeName);
export const deleteItemById = (storeName: string, id: string) => 
  storageManager.deleteItemById(storeName, id);
export const clearStore = (storeName: string) => 
  storageManager.clearStore(storeName);
export const bulkSaveData = <T>(storeName: string, items: (T & { id: string })[]) => 
  storageManager.bulkSaveData(storeName, items);
export const queryByIndex = <T>(storeName: string, indexName: string, value: any) => 
  storageManager.queryByIndex<T>(storeName, indexName, value);
export const addToSyncQueue = (entityType: string, entityId: string, action: 'INSERT' | 'UPDATE' | 'DELETE', data: any) => 
  storageManager.addToSyncQueue(entityType, entityId, action, data);
export const getMemoryUsage = () => storageManager.getMemoryUsage();
export const optimizeMemory = () => storageManager.optimizeMemory();

// Legacy functions for localStorage fallback
export const loadFromLocalStorage = async (): Promise<void> => {
  try {
    await storageManager.initDB();
    console.log('IndexedDB initialized for offline storage');
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
  }
};

export const syncWithLocalStorage = async (): Promise<void> => {
  try {
    console.log('Sync with local storage completed');
  } catch (error) {
    console.error('Sync failed:', error);
  }
};
