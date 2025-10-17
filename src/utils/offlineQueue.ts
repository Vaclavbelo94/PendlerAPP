interface QueuedAction {
  id: string;
  type: string;
  timestamp: number;
  data: any;
  retries: number;
  priority: 'low' | 'medium' | 'high';
  maxRetries: number;
  retryDelay: number;
  expiresAt?: number;
}

interface QueueConfig {
  maxRetries?: number;
  retryDelay?: number;
  batchSize?: number;
  enablePersistence?: boolean;
}

class OfflineQueueManager {
  private queue: QueuedAction[] = [];
  private isProcessing = false;
  private config: Required<QueueConfig> = {
    maxRetries: 3,
    retryDelay: 1000,
    batchSize: 10,
    enablePersistence: true,
  };

  constructor(config?: QueueConfig) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.loadQueue();
    this.setupListeners();
  }

  private loadQueue() {
    if (!this.config.enablePersistence) return;

    try {
      const stored = localStorage.getItem('offline-queue');
      if (stored) {
        this.queue = JSON.parse(stored);
        // Remove expired items
        this.queue = this.queue.filter(
          action => !action.expiresAt || action.expiresAt > Date.now()
        );
        this.saveQueue();
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.queue = [];
    }
  }

  private saveQueue() {
    if (!this.config.enablePersistence) return;

    try {
      localStorage.setItem('offline-queue', JSON.stringify(this.queue));
      window.dispatchEvent(new CustomEvent('offline-queue-updated'));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  private setupListeners() {
    // Listen for online event
    window.addEventListener('online', () => this.processQueue());
    
    // Listen for manual sync requests
    window.addEventListener('offline-sync-requested', () => this.processQueue());
    
    // Listen for connection restored
    window.addEventListener('connection-restored', () => this.processQueue());
  }

  /**
   * Add action to queue
   */
  add(
    type: string,
    data: any,
    options: {
      priority?: 'low' | 'medium' | 'high';
      maxRetries?: number;
      retryDelay?: number;
      expiresIn?: number;
    } = {}
  ): string {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const action: QueuedAction = {
      id,
      type,
      data,
      timestamp: Date.now(),
      retries: 0,
      priority: options.priority || 'medium',
      maxRetries: options.maxRetries ?? this.config.maxRetries,
      retryDelay: options.retryDelay ?? this.config.retryDelay,
      expiresAt: options.expiresIn ? Date.now() + options.expiresIn : undefined,
    };

    this.queue.push(action);
    this.sortByPriority();
    this.saveQueue();

    // Try to process immediately if online
    if (navigator.onLine) {
      this.processQueue();
    }

    return id;
  }

  /**
   * Remove action from queue
   */
  remove(id: string) {
    this.queue = this.queue.filter(action => action.id !== id);
    this.saveQueue();
  }

  /**
   * Clear all actions
   */
  clear() {
    this.queue = [];
    this.saveQueue();
  }

  /**
   * Get all queued actions
   */
  getAll(): QueuedAction[] {
    return [...this.queue];
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Sort queue by priority
   */
  private sortByPriority() {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    this.queue.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.timestamp - b.timestamp;
    });
  }

  /**
   * Process queue with batching and retry logic
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing || !navigator.onLine || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Process in batches
      const batch = this.queue.slice(0, this.config.batchSize);

      for (const action of batch) {
        try {
          await this.processAction(action);
          this.remove(action.id);
        } catch (error) {
          console.error(`Failed to process action ${action.id}:`, error);
          
          // Increment retry count
          action.retries++;

          if (action.retries >= action.maxRetries) {
            // Max retries reached, remove from queue
            console.warn(`Action ${action.id} exceeded max retries, removing`);
            this.remove(action.id);
            
            // Dispatch failed event
            window.dispatchEvent(new CustomEvent('offline-action-failed', {
              detail: { action, error }
            }));
          } else {
            // Schedule retry with exponential backoff
            const delay = action.retryDelay * Math.pow(2, action.retries - 1);
            setTimeout(() => {
              this.saveQueue();
              this.processQueue();
            }, delay);
          }
        }
      }

      this.saveQueue();

      // Continue processing if more items exist
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process individual action
   */
  private async processAction(action: QueuedAction): Promise<void> {
    // Dispatch custom event for action processing
    const event = new CustomEvent('offline-action-process', {
      detail: { action },
      cancelable: true
    });

    window.dispatchEvent(event);

    // If event was cancelled, throw error to retry later
    if (event.defaultPrevented) {
      throw new Error('Action processing cancelled');
    }

    // Default processing - can be overridden by event listeners
    // This is a placeholder - actual implementation should be handled
    // by the application through event listeners
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate processing
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Processing failed'));
        }
      }, 100);
    });
  }

  /**
   * Retry specific action
   */
  async retry(id: string): Promise<void> {
    const action = this.queue.find(a => a.id === id);
    if (!action) return;

    try {
      await this.processAction(action);
      this.remove(id);
    } catch (error) {
      console.error(`Failed to retry action ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      total: this.queue.length,
      byPriority: {
        high: this.queue.filter(a => a.priority === 'high').length,
        medium: this.queue.filter(a => a.priority === 'medium').length,
        low: this.queue.filter(a => a.priority === 'low').length,
      },
      avgRetries: this.queue.reduce((sum, a) => sum + a.retries, 0) / (this.queue.length || 1),
      oldestTimestamp: this.queue.length > 0 ? Math.min(...this.queue.map(a => a.timestamp)) : null,
    };
  }
}

// Export singleton instance
export const offlineQueue = new OfflineQueueManager();

// Export class for custom instances
export { OfflineQueueManager, type QueuedAction, type QueueConfig };
