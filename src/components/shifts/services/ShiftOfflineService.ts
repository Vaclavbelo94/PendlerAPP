import { errorHandler } from '@/utils/errorHandler';

export interface OfflineQueueItem {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  data: any;
  timestamp: number;
  retries: number;
  lastError?: string;
}

export class ShiftOfflineService {
  private static instance: ShiftOfflineService;

  static getInstance(): ShiftOfflineService {
    if (!ShiftOfflineService.instance) {
      ShiftOfflineService.instance = new ShiftOfflineService();
    }
    return ShiftOfflineService.instance;
  }

  protected async addToOfflineQueue(action: string, data: any): Promise<void> {
    try {
      const queueItem: OfflineQueueItem = {
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        action: action as 'CREATE' | 'UPDATE' | 'DELETE',
        data,
        timestamp: Date.now(),
        retries: 0
      };

      const existingQueue = this.getOfflineQueue();
      existingQueue.push(queueItem);
      localStorage.setItem('offline_shifts_queue', JSON.stringify(existingQueue));
    } catch (error) {
      errorHandler.handleError(error, { 
        operation: 'addToOfflineQueue',
        action,
        data 
      });
    }
  }

  protected getOfflineQueue(): OfflineQueueItem[] {
    try {
      const queue = localStorage.getItem('offline_shifts_queue');
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      errorHandler.handleError(error, { operation: 'getOfflineQueue' });
      return [];
    }
  }

  protected async processOfflineQueue(): Promise<{ processed: number; errors: number }> {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return { processed: 0, errors: 0 };

    let processed = 0;
    let errors = 0;
    const updatedQueue: OfflineQueueItem[] = [];

    for (const item of queue) {
      try {
        // Process item based on action type
        await this.processQueueItem(item);
        processed++;
      } catch (error) {
        item.retries++;
        item.lastError = error instanceof Error ? error.message : 'Unknown error';
        
        // Keep items with less than 3 retries
        if (item.retries < 3) {
          updatedQueue.push(item);
        } else {
          errors++;
          errorHandler.handleError(error, { 
            operation: 'processOfflineQueue',
            item,
            maxRetriesReached: true 
          });
        }
      }
    }

    // Update queue with remaining items
    localStorage.setItem('offline_shifts_queue', JSON.stringify(updatedQueue));
    
    return { processed, errors };
  }

  protected async processQueueItem(item: OfflineQueueItem): Promise<void> {
    // Override in subclasses
    throw new Error('processQueueItem must be implemented by subclass');
  }

  cleanup(): void {
    // Base cleanup - can be overridden
  }
}
