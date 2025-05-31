
import { QueryClient } from '@tanstack/react-query';
import { RealtimeSyncService } from './RealtimeSyncService';
import { ConflictResolutionService } from './ConflictResolutionService';
import { QueueManagementService } from './QueueManagementService';

interface SyncEvent {
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
  source: 'local' | 'remote';
  userId?: string;
}

export class RefactoredStateSyncService {
  private realtimeSync: RealtimeSyncService;
  private conflictResolver: ConflictResolutionService;
  private queueManager: QueueManagementService;

  constructor(queryClient: QueryClient) {
    this.realtimeSync = new RealtimeSyncService(queryClient);
    this.conflictResolver = new ConflictResolutionService();
    this.queueManager = new QueueManagementService();
  }

  // Add event to sync - delegates to appropriate service
  addEvent(event: Omit<SyncEvent, 'timestamp'>) {
    this.realtimeSync.addEvent(event);
  }

  // Handle conflicts using conflict resolution service
  async resolveConflict(entity: string, local: any, remote: any): Promise<any> {
    return this.conflictResolver.resolveConflict(entity, local, remote);
  }

  // Add to processing queue
  addToQueue(item: any) {
    this.queueManager.addToQueue({
      ...item,
      maxRetries: 3
    });
  }

  // Start periodic sync
  startPeriodicSync(intervalMs: number = 30000) {
    this.realtimeSync.startPeriodicSync(intervalMs);
  }

  // Stop periodic sync
  stopPeriodicSync() {
    this.realtimeSync.stopPeriodicSync();
  }

  // Get sync status
  getSyncStatus() {
    const realtimeStatus = this.realtimeSync.getSyncStatus();
    const queueStats = this.queueManager.getQueueStats();
    
    return {
      ...realtimeStatus,
      queueLength: queueStats.total,
      queueProcessing: queueStats.processing
    };
  }

  // Set custom conflict resolution
  setConflictResolution(entity: string, resolution: any) {
    this.conflictResolver.setConflictResolution(entity, resolution);
  }

  // Clear sync queue
  clearQueue() {
    this.realtimeSync.clearQueue();
    this.queueManager.clearQueue();
  }

  // Cleanup all services
  destroy() {
    this.realtimeSync.destroy();
    this.queueManager.clearQueue();
  }
}

export default RefactoredStateSyncService;
