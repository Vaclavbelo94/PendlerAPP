
import { errorHandler } from "@/utils/errorHandler";

export class ShiftOfflineService {
  private static instance: ShiftOfflineService;

  static getInstance(): ShiftOfflineService {
    if (!ShiftOfflineService.instance) {
      ShiftOfflineService.instance = new ShiftOfflineService();
    }
    return ShiftOfflineService.instance;
  }

  async saveToOfflineQueue(action: string, data: any) {
    try {
      const queueItem = {
        id: `shift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        action,
        data,
        timestamp: new Date().toISOString(),
        retries: 0
      };

      const existingQueue = JSON.parse(localStorage.getItem('offline_shifts_queue') || '[]');
      existingQueue.push(queueItem);
      localStorage.setItem('offline_shifts_queue', JSON.stringify(existingQueue));
    } catch (error) {
      errorHandler.handleError(error, { 
        operation: 'saveToOfflineQueue',
        action,
        data 
      });
    }
  }

  async processOfflineQueue() {
    const queue = JSON.parse(localStorage.getItem('offline_shifts_queue') || '[]');
    if (queue.length === 0) return 0;

    const processedItems = [];
    
    for (const item of queue) {
      try {
        if (item.action === 'UPSERT') {
          // This would integrate with the main shift service
          processedItems.push(item.id);
        }
      } catch (error) {
        item.retries = (item.retries || 0) + 1;
        if (item.retries >= 3) {
          processedItems.push(item.id);
          errorHandler.handleError(error, { 
            operation: 'processOfflineQueue',
            item,
            maxRetriesReached: true 
          });
        }
      }
    }

    const updatedQueue = queue.filter((item: any) => !processedItems.includes(item.id));
    localStorage.setItem('offline_shifts_queue', JSON.stringify(updatedQueue));

    return processedItems.length;
  }
}
