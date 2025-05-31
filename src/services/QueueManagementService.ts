
interface QueueItem {
  id: string;
  type: string;
  entity: string;
  data: any;
  priority: 'high' | 'medium' | 'low';
  timestamp: number;
  retries: number;
  maxRetries: number;
}

export class QueueManagementService {
  private queue: QueueItem[] = [];
  private processing = false;
  private maxConcurrent = 3;

  // Add item to queue
  addToQueue(item: Omit<QueueItem, 'id' | 'timestamp' | 'retries'>) {
    const queueItem: QueueItem = {
      ...item,
      id: this.generateId(),
      timestamp: Date.now(),
      retries: 0
    };

    this.queue.push(queueItem);
    this.sortQueue();
    
    if (!this.processing) {
      this.processQueue();
    }
  }

  // Process queue with concurrency control
  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    try {
      const batch = this.queue.splice(0, this.maxConcurrent);
      
      await Promise.allSettled(
        batch.map(item => this.processItem(item))
      );

      // Continue processing if more items exist
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    } catch (error) {
      console.error('Queue processing error:', error);
    } finally {
      this.processing = false;
    }
  }

  // Process single queue item
  private async processItem(item: QueueItem) {
    try {
      // Simulate processing based on item type
      await this.executeQueueItem(item);
    } catch (error) {
      console.error(`Failed to process queue item ${item.id}:`, error);
      
      if (item.retries < item.maxRetries) {
        // Retry with exponential backoff
        const delay = Math.pow(2, item.retries) * 1000;
        setTimeout(() => {
          item.retries++;
          this.queue.unshift(item); // Add back to front
          this.sortQueue();
        }, delay);
      }
    }
  }

  // Execute queue item based on type
  private async executeQueueItem(item: QueueItem) {
    // This would be implemented based on specific queue item types
    console.log(`Processing ${item.type} for ${item.entity}:`, item.data);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Sort queue by priority and timestamp
  private sortQueue() {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    
    this.queue.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return a.timestamp - b.timestamp; // FIFO for same priority
    });
  }

  // Get queue statistics
  getQueueStats() {
    return {
      total: this.queue.length,
      processing: this.processing,
      byPriority: this.queue.reduce((acc, item) => {
        acc[item.priority] = (acc[item.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // Clear queue
  clearQueue() {
    this.queue = [];
  }

  // Generate unique ID
  private generateId(): string {
    return `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
