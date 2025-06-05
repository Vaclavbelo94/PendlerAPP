
interface QueueItem {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  priority: 'high' | 'medium' | 'low';
}

export class QueueManagementService {
  private queue: QueueItem[] = [];
  private processing = false;
  private workers = new Map<string, boolean>();

  constructor(private maxConcurrentJobs = 3) {}

  // Add item to queue with priority
  addToQueue(item: Omit<QueueItem, 'id' | 'timestamp' | 'retryCount'>) {
    const queueItem: QueueItem = {
      ...item,
      id: `${item.type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0
    };

    // Insert based on priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const insertIndex = this.queue.findIndex(
      existing => priorityOrder[queueItem.priority] > priorityOrder[existing.priority]
    );

    if (insertIndex === -1) {
      this.queue.push(queueItem);
    } else {
      this.queue.splice(insertIndex, 0, queueItem);
    }

    this.processQueue();
  }

  // Process queue with concurrency control
  async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const activeWorkers: Promise<void>[] = [];

    while (this.queue.length > 0 && activeWorkers.length < this.maxConcurrentJobs) {
      const item = this.queue.shift();
      if (!item) break;

      const workerPromise = this.processItem(item).finally(() => {
        this.workers.delete(item.id);
      });

      this.workers.set(item.id, true);
      activeWorkers.push(workerPromise);
    }

    await Promise.allSettled(activeWorkers);
    this.processing = false;

    // Continue processing if more items were added
    if (this.queue.length > 0) {
      this.processQueue();
    }
  }

  // Process individual item with retry logic
  private async processItem(item: QueueItem): Promise<void> {
    try {
      await this.executeItem(item);
      console.log(`Successfully processed ${item.type} item ${item.id}`);
    } catch (error) {
      console.error(`Failed to process ${item.type} item ${item.id}:`, error);
      
      if (item.retryCount < item.maxRetries) {
        item.retryCount++;
        
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, item.retryCount), 30000);
        
        setTimeout(() => {
          this.queue.unshift(item); // Add back to front of queue
          this.processQueue();
        }, delay);
      } else {
        console.error(`Max retries exceeded for ${item.type} item ${item.id}`);
      }
    }
  }

  // Execute specific item type
  private async executeItem(item: QueueItem): Promise<void> {
    switch (item.type) {
      case 'sync-shifts':
        await this.syncShifts(item.data);
        break;
      case 'sync-vehicles':
        await this.syncVehicles(item.data);
        break;
      case 'sync-calculations':
        await this.syncCalculations(item.data);
        break;
      default:
        throw new Error(`Unknown queue item type: ${item.type}`);
    }
  }

  // Sync methods
  private async syncShifts(data: any): Promise<void> {
    // Implementation would call Supabase API
    console.log('Syncing shifts:', data);
  }

  private async syncVehicles(data: any): Promise<void> {
    // Implementation would call Supabase API
    console.log('Syncing vehicles:', data);
  }

  private async syncCalculations(data: any): Promise<void> {
    // Implementation would call Supabase API
    console.log('Syncing calculations:', data);
  }

  // Get queue statistics
  getQueueStats() {
    return {
      total: this.queue.length,
      processing: this.workers.size,
      byPriority: {
        high: this.queue.filter(item => item.priority === 'high').length,
        medium: this.queue.filter(item => item.priority === 'medium').length,
        low: this.queue.filter(item => item.priority === 'low').length
      }
    };
  }

  // Clear queue
  clearQueue() {
    this.queue = [];
    this.workers.clear();
  }
}
