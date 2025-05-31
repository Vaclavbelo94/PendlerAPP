
import { getAllData, saveData, deleteItemById, STORES } from '@/utils/offlineStorage';

interface QueueItem {
  id: string;
  type: 'api-call' | 'data-sync' | 'file-upload';
  priority: 'high' | 'medium' | 'low';
  retryCount: number;
  maxRetries: number;
  data: any;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  timestamp: number;
  lastAttempt?: number;
  backoffDelay: number;
}

interface QueueConfig {
  maxRetries: number;
  baseBackoffDelay: number;
  maxBackoffDelay: number;
  concurrentJobs: number;
  retryMultiplier: number;
}

class OfflineQueueService {
  private config: QueueConfig;
  private processingJobs = new Set<string>();
  private isProcessing = false;
  private processInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = {
      maxRetries: 3,
      baseBackoffDelay: 1000, // 1 second
      maxBackoffDelay: 60000, // 1 minute
      concurrentJobs: 3,
      retryMultiplier: 2,
      ...config
    };
  }

  // Add item to queue
  async addToQueue(item: Omit<QueueItem, 'id' | 'retryCount' | 'timestamp' | 'backoffDelay'>): Promise<string> {
    const queueItem: QueueItem = {
      ...item,
      id: this.generateId(),
      retryCount: 0,
      timestamp: Date.now(),
      backoffDelay: this.config.baseBackoffDelay
    };

    try {
      await saveData(STORES.syncQueue, queueItem);
      
      // Start processing if not already running
      if (!this.isProcessing) {
        this.startProcessing();
      }

      return queueItem.id;
    } catch (error) {
      console.error('Failed to add item to queue:', error);
      throw error;
    }
  }

  // Process queue items
  async processQueue(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      const queueItems = await this.getQueueItems();
      const prioritizedItems = this.prioritizeItems(queueItems);
      
      // Process items with concurrency limit
      const batches = this.createBatches(prioritizedItems, this.config.concurrentJobs);
      
      for (const batch of batches) {
        await Promise.allSettled(
          batch.map(item => this.processItem(item))
        );
      }
    } catch (error) {
      console.error('Queue processing failed:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Get all queue items
  private async getQueueItems(): Promise<QueueItem[]> {
    try {
      const items = await getAllData<QueueItem>(STORES.syncQueue);
      return items.filter(item => 
        item.retryCount < item.maxRetries &&
        !this.processingJobs.has(item.id) &&
        this.isReadyForRetry(item)
      );
    } catch (error) {
      console.error('Failed to get queue items:', error);
      return [];
    }
  }

  // Check if item is ready for retry
  private isReadyForRetry(item: QueueItem): boolean {
    if (!item.lastAttempt) return true;
    
    const timeSinceLastAttempt = Date.now() - item.lastAttempt;
    return timeSinceLastAttempt >= item.backoffDelay;
  }

  // Prioritize items by priority and timestamp
  private prioritizeItems(items: QueueItem[]): QueueItem[] {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    
    return items.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return a.timestamp - b.timestamp; // FIFO for same priority
    });
  }

  // Create batches for concurrent processing
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    
    return batches;
  }

  // Process single queue item
  private async processItem(item: QueueItem): Promise<void> {
    this.processingJobs.add(item.id);

    try {
      let success = false;

      switch (item.type) {
        case 'api-call':
          success = await this.processApiCall(item);
          break;
        case 'data-sync':
          success = await this.processDataSync(item);
          break;
        case 'file-upload':
          success = await this.processFileUpload(item);
          break;
      }

      if (success) {
        await this.removeFromQueue(item.id);
      } else {
        await this.handleFailure(item);
      }
    } catch (error) {
      console.error(`Failed to process queue item ${item.id}:`, error);
      await this.handleFailure(item);
    } finally {
      this.processingJobs.delete(item.id);
    }
  }

  // Process API call
  private async processApiCall(item: QueueItem): Promise<boolean> {
    if (!item.endpoint || !item.method) return false;

    try {
      const response = await fetch(item.endpoint, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: item.method !== 'GET' ? JSON.stringify(item.data) : undefined
      });

      return response.ok;
    } catch (error) {
      console.error('API call failed:', error);
      return false;
    }
  }

  // Process data synchronization
  private async processDataSync(item: QueueItem): Promise<boolean> {
    try {
      // This would integrate with your sync service
      console.log('Processing data sync:', item.data);
      
      // Simulate sync operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error('Data sync failed:', error);
      return false;
    }
  }

  // Process file upload
  private async processFileUpload(item: QueueItem): Promise<boolean> {
    try {
      const { file, uploadUrl } = item.data;
      
      if (!uploadUrl || !file) return false;

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      return response.ok;
    } catch (error) {
      console.error('File upload failed:', error);
      return false;
    }
  }

  // Handle processing failure
  private async handleFailure(item: QueueItem): Promise<void> {
    const updatedItem: QueueItem = {
      ...item,
      retryCount: item.retryCount + 1,
      lastAttempt: Date.now(),
      backoffDelay: Math.min(
        item.backoffDelay * this.config.retryMultiplier,
        this.config.maxBackoffDelay
      )
    };

    if (updatedItem.retryCount >= updatedItem.maxRetries) {
      // Max retries reached - remove from queue
      await this.removeFromQueue(item.id);
      console.warn(`Queue item ${item.id} failed permanently after ${item.retryCount} retries`);
    } else {
      // Update with new retry info
      await saveData(STORES.syncQueue, updatedItem);
    }
  }

  // Remove item from queue
  private async removeFromQueue(itemId: string): Promise<void> {
    try {
      await deleteItemById(STORES.syncQueue, itemId);
    } catch (error) {
      console.error('Failed to remove item from queue:', error);
    }
  }

  // Start periodic processing
  startProcessing(intervalMs: number = 5000): void {
    if (this.processInterval) return;

    this.processInterval = setInterval(() => {
      this.processQueue();
    }, intervalMs);

    // Process immediately
    this.processQueue();
  }

  // Stop periodic processing
  stopProcessing(): void {
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = null;
    }
    this.isProcessing = false;
  }

  // Get queue statistics
  async getQueueStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
  }> {
    try {
      const items = await getAllData<QueueItem>(STORES.syncQueue);
      
      const byPriority = items.reduce((acc, item) => {
        acc[item.priority] = (acc[item.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byType = items.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: items.length,
        pending: items.filter(item => 
          item.retryCount < item.maxRetries && 
          !this.processingJobs.has(item.id)
        ).length,
        processing: this.processingJobs.size,
        byPriority,
        byType
      };
    } catch (error) {
      console.error('Failed to get queue stats:', error);
      return {
        total: 0,
        pending: 0,
        processing: 0,
        byPriority: {},
        byType: {}
      };
    }
  }

  // Clear entire queue
  async clearQueue(): Promise<void> {
    try {
      const items = await getAllData<QueueItem>(STORES.syncQueue);
      
      await Promise.all(
        items.map(item => deleteItemById(STORES.syncQueue, item.id))
      );
    } catch (error) {
      console.error('Failed to clear queue:', error);
    }
  }

  // Generate unique ID
  private generateId(): string {
    return `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup
  destroy(): void {
    this.stopProcessing();
    this.processingJobs.clear();
  }
}

export default OfflineQueueService;
